import clientPromise from '../../../../lib/mongodb';
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

    // Get user's event participations with full event details
    let userEvents = [];
    if (user.eventsParticipated && user.eventsParticipated.length > 0) {
      const eventIds = user.eventsParticipated.map(event => new ObjectId(event.eventId));
      const events = await db.collection('events').find({ _id: { $in: eventIds } }).toArray();
      
      userEvents = user.eventsParticipated.map(userEvent => {
        const fullEvent = events.find(e => e._id.toString() === userEvent.eventId);
        if (fullEvent) {
          return {
            ...userEvent,
            eventDetails: {
              title: fullEvent.title,
              description: fullEvent.description,
              startDate: fullEvent.startDate,
              endDate: fullEvent.endDate,
              technologies: fullEvent.technologies || [],
              category: fullEvent.category,
              difficulty: fullEvent.difficulty,
              prizes: fullEvent.prizes || [],
              eventType: fullEvent.eventType
            }
          };
        }
        return userEvent;
      });
    }

    // Get user's submissions/projects
    let userSubmissions = [];
    try {
      userSubmissions = await db.collection('submissions').find({ userId: userId }).toArray();
    } catch (error) {
      console.log('No submissions collection found');
    }

    // Remove sensitive data
    const { password, otp, ...userData } = user;
    
    return new Response(JSON.stringify({ 
      success: true, 
      user: {
        ...userData,
        userType,
        role: userType === 'student' ? 'Student' : 'Member',
        eventsParticipated: userEvents,
        submissions: userSubmissions,
        stats: {
          totalEvents: userEvents.length,
          completedEvents: userEvents.filter(e => {
            const endDate = new Date(e.eventDetails?.endDate);
            return endDate < new Date();
          }).length,
          ongoingEvents: userEvents.filter(e => {
            const startDate = new Date(e.eventDetails?.startDate);
            const endDate = new Date(e.eventDetails?.endDate);
            const now = new Date();
            return startDate <= now && endDate >= now;
          }).length,
          upcomingEvents: userEvents.filter(e => {
            const startDate = new Date(e.eventDetails?.startDate);
            return startDate > new Date();
          }).length,
          totalSubmissions: userSubmissions.length
        }
      }
    }), { status: 200 });
    
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}