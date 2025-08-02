import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

// Verify admin token middleware
async function verifyAdminToken(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }

  const token = authHeader.substring(7);
  const decoded = Buffer.from(token, 'base64').toString('utf-8');
  const [email, timestamp, secretKey] = decoded.split(':');

  if (email !== process.env.ADMIN_EMAIL || secretKey !== process.env.ADMIN_SECRET_KEY) {
    throw new Error('Invalid token');
  }

  if (Date.now() - parseInt(timestamp) > 24 * 60 * 60 * 1000) {
    throw new Error('Token expired');
  }

  return true;
}

// GET - Fetch all users with analytics
export async function GET(request) {
  try {
    await verifyAdminToken(request);

    const client = await clientPromise;
    const db = client.db();

    // Get all students
    const students = await db.collection('students').find({}).toArray();
    
    // Get all members
    const members = await db.collection('members').find({}).toArray();

    // Calculate analytics
    const analytics = {
      totalUsers: students.length + members.length,
      totalStudents: students.length,
      totalMembers: members.length,
      activeUsers: students.filter(s => s.status !== 'disabled').length + 
                   members.filter(m => m.status !== 'disabled').length,
      recentRegistrations: {
        today: 0,
        thisWeek: 0,
        thisMonth: 0
      }
    };

    // Calculate recent registrations
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    [...students, ...members].forEach(user => {
      const createdAt = user.createdAt ? new Date(user.createdAt) : new Date(user._id.getTimestamp());
      
      if (createdAt >= today) analytics.recentRegistrations.today++;
      if (createdAt >= weekAgo) analytics.recentRegistrations.thisWeek++;
      if (createdAt >= monthAgo) analytics.recentRegistrations.thisMonth++;
    });

    // Format users data
    const allUsers = [
      ...students.map(user => ({
        ...user,
        userType: 'student',
        joinDate: user.createdAt || user._id.getTimestamp(),
        status: user.status || 'active'
      })),
      ...members.map(user => ({
        ...user,
        userType: 'member',
        joinDate: user.createdAt || user._id.getTimestamp(),
        status: user.status || 'active'
      }))
    ].sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate));

    return new Response(JSON.stringify({
      success: true,
      data: {
        users: allUsers,
        analytics
      }
    }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), { status: error.message.includes('token') ? 401 : 500 });
  }
}

// PUT - Update user status (disable/enable/delete)
export async function PUT(request) {
  try {
    await verifyAdminToken(request);

    const body = await request.json();
    const { userId, userType, action, reason } = body;

    if (!userId || !userType || !action) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required fields'
      }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const collection = userType === 'student' ? 'students' : 'members';

    let updateResult;

    switch (action) {
      case 'disable':
        updateResult = await db.collection(collection).updateOne(
          { _id: new ObjectId(userId) },
          { 
            $set: { 
              status: 'disabled',
              disabledAt: new Date(),
              disabledReason: reason || 'Disabled by admin'
            }
          }
        );
        break;

      case 'enable':
        updateResult = await db.collection(collection).updateOne(
          { _id: new ObjectId(userId) },
          { 
            $set: { 
              status: 'active'
            },
            $unset: {
              disabledAt: "",
              disabledReason: ""
            }
          }
        );
        break;

      case 'delete':
        // Move to deleted collection for backup
        const userToDelete = await db.collection(collection).findOne({ _id: new ObjectId(userId) });
        if (userToDelete) {
          await db.collection('deleted_users').insertOne({
            ...userToDelete,
            originalCollection: collection,
            deletedAt: new Date(),
            deletedReason: reason || 'Deleted by admin'
          });
        }
        
        updateResult = await db.collection(collection).deleteOne({ _id: new ObjectId(userId) });
        break;

      default:
        return new Response(JSON.stringify({
          success: false,
          error: 'Invalid action'
        }), { status: 400 });
    }

    if (updateResult.modifiedCount === 0 && updateResult.deletedCount === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'User not found or no changes made'
      }), { status: 404 });
    }

    return new Response(JSON.stringify({
      success: true,
      message: `User ${action}d successfully`
    }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), { status: error.message.includes('token') ? 401 : 500 });
  }
}