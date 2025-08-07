import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

// GET - Fetch public events/hackathons for students and members
export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db();

    // Get URL parameters for filtering
    const url = new URL(request.url);
    const status = url.searchParams.get('status'); // active, upcoming, completed
    const eventType = url.searchParams.get('type'); // hackathon, competition, workshop
    const category = url.searchParams.get('category');

    // Build query
    let query = { status: 'active' }; // Only show active events by default
    
    if (status) {
      if (status === 'upcoming') {
        query = { 
          status: 'active',
          startDate: { $gt: new Date() }
        };
      } else if (status === 'ongoing') {
        query = { 
          status: 'active',
          startDate: { $lte: new Date() },
          endDate: { $gte: new Date() }
        };
      } else if (status === 'completed') {
        query = { 
          status: 'active',
          endDate: { $lt: new Date() }
        };
      } else if (status === 'all') {
        query = { status: 'active' };
      }
    }

    if (eventType) {
      query.eventType = eventType;
    }

    if (category) {
      query.category = category;
    }

    const events = await db.collection('events')
      .find(query)
      .sort({ startDate: 1 }) // Sort by start date
      .toArray();

    // Transform events for frontend consumption
    const transformedEvents = events.map(event => {
      const now = new Date();
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);
      
      let eventStatus = 'upcoming';
      if (now >= startDate && now <= endDate) {
        eventStatus = 'ongoing';
      } else if (now > endDate) {
        eventStatus = 'completed';
      }

      return {
        id: event._id.toString(),
        name: event.title,
        title: event.title,
        description: event.description,
        imageUrl: event.imageUrl,
        status: eventStatus,
        eventType: event.eventType || 'hackathon',
        category: event.category || 'general',
        difficulty: event.difficulty || 'intermediate',
        startDate: event.startDate,
        endDate: event.endDate,
        registrationDeadline: event.registrationDeadline,
        originalPrice: event.originalPrice,
        discountPercentage: event.discountPercentage,
        finalPrice: event.finalPrice,
        technologies: event.technologies || [],
        requirements: event.requirements || [],
        prizes: event.prizes || [],
        maxParticipants: event.maxParticipants,
        currentParticipants: event.registrations ? event.registrations.length : 0,
        registrations: event.registrations || [],
        createdAt: event.createdAt,
        updatedAt: event.updatedAt
      };
    });

    return new Response(JSON.stringify({
      success: true,
      data: transformedEvents,
      count: transformedEvents.length
    }), { status: 200 });

  } catch (error) {
    console.error('Error fetching events:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), { status: 500 });
  }
}

// POST - Register for an event (for students/members)
export async function POST(request) {
  try {
    const body = await request.json();
    const { eventId, userId, userType } = body;

    if (!eventId || !userId || !userType) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Event ID, User ID, and User Type are required'
      }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Check if event exists and is active
    const event = await db.collection('events').findOne({ 
      _id: new ObjectId(eventId),
      status: 'active'
    });

    if (!event) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Event not found or not active'
      }), { status: 404 });
    }

    // Check if registration deadline has passed
    const now = new Date();
    if (event.registrationDeadline && now > new Date(event.registrationDeadline)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Registration deadline has passed'
      }), { status: 400 });
    }

    // Check if event is full
    if (event.maxParticipants && event.registrations && event.registrations.length >= event.maxParticipants) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Event is full'
      }), { status: 400 });
    }

    // Check if user is already registered
    const isAlreadyRegistered = event.registrations && event.registrations.some(
      reg => reg.userId === userId
    );

    if (isAlreadyRegistered) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Already registered for this event'
      }), { status: 400 });
    }

    // Get user details
    const userCollection = userType === 'student' ? 'students' : 'members';
    const user = await db.collection(userCollection).findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        error: 'User not found'
      }), { status: 404 });
    }

    // Add registration to event
    const registration = {
      userId: userId,
      userType: userType,
      userName: user.name || user.fullName,
      userEmail: user.email,
      registeredAt: new Date(),
      status: 'registered'
    };

    await db.collection('events').updateOne(
      { _id: new ObjectId(eventId) },
      { 
        $push: { registrations: registration },
        $set: { updatedAt: new Date() }
      }
    );

    // Add event to user's profile
    await db.collection(userCollection).updateOne(
      { _id: new ObjectId(userId) },
      { 
        $push: { 
          eventsParticipated: {
            eventId: eventId,
            eventTitle: event.title,
            eventType: event.eventType,
            registeredAt: new Date(),
            status: 'registered'
          }
        },
        $set: { updatedAt: new Date() }
      }
    );

    return new Response(JSON.stringify({
      success: true,
      message: 'Successfully registered for the event',
      data: registration
    }), { status: 200 });

  } catch (error) {
    console.error('Error registering for event:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), { status: 500 });
  }
}