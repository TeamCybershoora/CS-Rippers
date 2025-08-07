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

// GET - Fetch leaderboard data with analytics
export async function GET(request) {
  try {
    await verifyAdminToken(request);

    const client = await clientPromise;
    const db = client.db();

    // Get all users with their scores
    const students = await db.collection('students').find({}).toArray();
    const members = await db.collection('members').find({}).toArray();

    // Combine and calculate leaderboard
    const allUsers = [
      ...students.map(user => ({
        ...user,
        userType: 'student',
        score: user.score || 0,
        achievements: user.achievements || [],
        eventsParticipated: user.eventsParticipated || [],
        lastActive: user.lastActive || user._id.getTimestamp()
      })),
      ...members.map(user => ({
        ...user,
        userType: 'member',
        score: user.score || 0,
        achievements: user.achievements || [],
        eventsParticipated: user.eventsParticipated || [],
        lastActive: user.lastActive || user._id.getTimestamp()
      }))
    ];

    // Sort by score (descending)
    const leaderboard = allUsers
      .sort((a, b) => b.score - a.score)
      .map((user, index) => ({
        ...user,
        rank: index + 1,
        previousRank: user.previousRank || index + 1,
        rankChange: (user.previousRank || index + 1) - (index + 1)
      }));

    // Calculate analytics
    const analytics = {
      totalParticipants: leaderboard.length,
      averageScore: leaderboard.reduce((sum, user) => sum + user.score, 0) / leaderboard.length || 0,
      highestScore: leaderboard[0]?.score || 0,
      activeParticipants: leaderboard.filter(user => {
        const lastActive = new Date(user.lastActive);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return lastActive > weekAgo;
      }).length,
      topPerformers: leaderboard.slice(0, 10),
      scoreDistribution: {
        '0-100': leaderboard.filter(u => u.score >= 0 && u.score <= 100).length,
        '101-500': leaderboard.filter(u => u.score > 100 && u.score <= 500).length,
        '501-1000': leaderboard.filter(u => u.score > 500 && u.score <= 1000).length,
        '1000+': leaderboard.filter(u => u.score > 1000).length
      }
    };

    return new Response(JSON.stringify({
      success: true,
      data: {
        leaderboard,
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

// PUT - Update user score or achievements
export async function PUT(request) {
  try {
    await verifyAdminToken(request);

    const body = await request.json();
    const { userId, userType, action, value, reason } = body;

    if (!userId || !userType || !action) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required fields'
      }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const collection = userType === 'student' ? 'students' : 'members';

    let updateData = {};

    switch (action) {
      case 'updateScore':
        if (typeof value !== 'number') {
          return new Response(JSON.stringify({
            success: false,
            error: 'Score must be a number'
          }), { status: 400 });
        }
        updateData = { 
          score: value,
          scoreUpdatedAt: new Date(),
          scoreUpdatedBy: 'admin',
          scoreUpdateReason: reason || 'Updated by admin'
        };
        break;

      case 'addScore':
        if (typeof value !== 'number') {
          return new Response(JSON.stringify({
            success: false,
            error: 'Score increment must be a number'
          }), { status: 400 });
        }
        const currentUser = await db.collection(collection).findOne({ _id: new ObjectId(userId) });
        updateData = { 
          score: (currentUser.score || 0) + value,
          scoreUpdatedAt: new Date(),
          scoreUpdatedBy: 'admin',
          scoreUpdateReason: reason || 'Score added by admin'
        };
        break;

      case 'addAchievement':
        if (!value || typeof value !== 'object') {
          return new Response(JSON.stringify({
            success: false,
            error: 'Achievement data is required'
          }), { status: 400 });
        }
        const achievement = {
          ...value,
          awardedAt: new Date(),
          awardedBy: 'admin'
        };
        updateData = { 
          $push: { achievements: achievement },
          $set: { lastAchievementAt: new Date() }
        };
        break;

      case 'removeAchievement':
        if (!value) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Achievement ID is required'
          }), { status: 400 });
        }
        updateData = { 
          $pull: { achievements: { id: value } }
        };
        break;

      case 'resetScore':
        updateData = { 
          score: 0,
          previousScore: value || 0,
          scoreResetAt: new Date(),
          scoreResetBy: 'admin',
          scoreResetReason: reason || 'Score reset by admin'
        };
        break;

      default:
        return new Response(JSON.stringify({
          success: false,
          error: 'Invalid action'
        }), { status: 400 });
    }

    const result = await db.collection(collection).updateOne(
      { _id: new ObjectId(userId) },
      action === 'addAchievement' || action === 'removeAchievement' ? updateData : { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'User not found'
      }), { status: 404 });
    }

    // Get updated user data
    const updatedUser = await db.collection(collection).findOne({ _id: new ObjectId(userId) });

    return new Response(JSON.stringify({
      success: true,
      message: `User ${action} completed successfully`,
      data: updatedUser
    }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), { status: error.message.includes('token') ? 401 : 500 });
  }
}

// POST - Bulk update leaderboard
export async function POST(request) {
  try {
    await verifyAdminToken(request);

    const body = await request.json();
    const { action } = body;

    const client = await clientPromise;
    const db = client.db();

    switch (action) {
      case 'recalculateRanks':
        // Get all users and recalculate ranks
        const students = await db.collection('students').find({}).toArray();
        const members = await db.collection('members').find({}).toArray();
        
        const allUsers = [...students, ...members].sort((a, b) => (b.score || 0) - (a.score || 0));
        
        // Update ranks
        const bulkOps = allUsers.map((user, index) => {
          return {
            updateOne: {
              filter: { _id: user._id },
              update: { 
                $set: { 
                  previousRank: user.rank || index + 1,
                  rank: index + 1,
                  rankUpdatedAt: new Date()
                }
              }
            }
          };
        });

        // Execute bulk operations
        if (bulkOps.length > 0) {
          await db.collection('students').bulkWrite(
            bulkOps.filter(op => students.find(s => s._id.equals(op.updateOne.filter._id)))
          );
          await db.collection('members').bulkWrite(
            bulkOps.filter(op => members.find(m => m._id.equals(op.updateOne.filter._id)))
          );
        }

        return new Response(JSON.stringify({
          success: true,
          message: 'Ranks recalculated successfully',
          data: { updatedUsers: allUsers.length }
        }), { status: 200 });

      case 'resetAllScores':
        await db.collection('students').updateMany({}, { 
          $set: { 
            previousScore: { $ifNull: ['$score', 0] },
            score: 0,
            scoreResetAt: new Date(),
            scoreResetBy: 'admin'
          }
        });
        await db.collection('members').updateMany({}, { 
          $set: { 
            previousScore: { $ifNull: ['$score', 0] },
            score: 0,
            scoreResetAt: new Date(),
            scoreResetBy: 'admin'
          }
        });

        return new Response(JSON.stringify({
          success: true,
          message: 'All scores reset successfully'
        }), { status: 200 });

      default:
        return new Response(JSON.stringify({
          success: false,
          error: 'Invalid action'
        }), { status: 400 });
    }

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), { status: error.message.includes('token') ? 401 : 500 });
  }
}