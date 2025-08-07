import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return new Response(JSON.stringify({ success: false, error: 'User ID required' }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    // First check in students collection
    let user = await db.collection('students').findOne({ _id: new ObjectId(userId) });
    let userType = 'student';
    
    // If not found in students, check in members
    if (!user) {
      user = await db.collection('members').findOne({ _id: new ObjectId(userId) });
      userType = 'member';
    }
    
    if (!user) {
      return new Response(JSON.stringify({ success: false, error: 'User not found' }), { status: 404 });
    }

    // Remove sensitive data
    const { password, otp, ...userData } = user;
    
    return new Response(JSON.stringify({ 
      success: true, 
      user: {
        ...userData,
        userType,
        role: userType === 'student' ? 'Student' : 'Member'
      }
    }), { status: 200 });
    
  } catch (error) {
    console.error('Error fetching user data:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { userId, ...updateData } = body;
    
    if (!userId) {
      return new Response(JSON.stringify({ success: false, error: 'User ID required' }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    // First check in students collection
    let user = await db.collection('students').findOne({ _id: new ObjectId(userId) });
    let collection = 'students';
    
    // If not found in students, check in members
    if (!user) {
      user = await db.collection('members').findOne({ _id: new ObjectId(userId) });
      collection = 'members';
    }
    
    if (!user) {
      return new Response(JSON.stringify({ success: false, error: 'User not found' }), { status: 404 });
    }

    // Remove sensitive fields from update data
    const { password, otp, _id, ...safeUpdateData } = updateData;
    
    // Update user data
    const result = await db.collection(collection).updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: {
          ...safeUpdateData,
          updatedAt: new Date()
        }
      }
    );

    if (result.modifiedCount === 0) {
      return new Response(JSON.stringify({ success: false, error: 'No changes made' }), { status: 400 });
    }

    // Fetch updated user data
    const updatedUser = await db.collection(collection).findOne({ _id: new ObjectId(userId) });
    const { password: pwd, otp: userOtp, ...userData } = updatedUser;
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Profile updated successfully',
      user: {
        ...userData,
        userType: collection === 'students' ? 'student' : 'member',
        role: collection === 'students' ? 'Student' : 'Member'
      }
    }), { status: 200 });
    
  } catch (error) {
    console.error('Error updating user data:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}