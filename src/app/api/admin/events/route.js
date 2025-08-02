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

// GET - Fetch all events/hackathons
export async function GET(request) {
  try {
    await verifyAdminToken(request);

    const client = await clientPromise;
    const db = client.db();

    const events = await db.collection('events').find({}).sort({ createdAt: -1 }).toArray();
    
    // Calculate analytics
    const analytics = {
      totalEvents: events.length,
      activeEvents: events.filter(e => e.status === 'active').length,
      upcomingEvents: events.filter(e => new Date(e.startDate) > new Date()).length,
      completedEvents: events.filter(e => new Date(e.endDate) < new Date()).length,
      totalRevenue: events.reduce((sum, e) => sum + (e.finalPrice * (e.registrations?.length || 0)), 0),
      totalRegistrations: events.reduce((sum, e) => sum + (e.registrations?.length || 0), 0)
    };

    return new Response(JSON.stringify({
      success: true,
      data: {
        events,
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

// POST - Create new event/hackathon
export async function POST(request) {
  try {
    await verifyAdminToken(request);

    const body = await request.json();
    const {
      title,
      description,
      imageUrl,
      originalPrice,
      discountPercentage,
      startDate,
      endDate,
      registrationDeadline,
      technologies,
      requirements,
      prizes,
      maxParticipants,
      eventType,
      difficulty,
      category
    } = body;

    // Validation
    if (!title || !description || !originalPrice || !startDate || !endDate) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required fields'
      }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Calculate final price
    const finalPrice = discountPercentage ? 
      originalPrice - (originalPrice * discountPercentage / 100) : 
      originalPrice;

    const newEvent = {
      title,
      description,
      imageUrl: imageUrl || null,
      originalPrice: parseFloat(originalPrice),
      discountPercentage: discountPercentage || 0,
      finalPrice: parseFloat(finalPrice),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : new Date(startDate),
      technologies: technologies || [],
      requirements: requirements || [],
      prizes: prizes || [],
      maxParticipants: maxParticipants || null,
      eventType: eventType || 'hackathon',
      difficulty: difficulty || 'intermediate',
      category: category || 'general',
      status: 'active',
      registrations: [],
      createdAt: new Date(),
      createdBy: 'admin',
      updatedAt: new Date()
    };

    const result = await db.collection('events').insertOne(newEvent);

    return new Response(JSON.stringify({
      success: true,
      message: 'Event created successfully',
      data: { ...newEvent, _id: result.insertedId }
    }), { status: 201 });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), { status: error.message.includes('token') ? 401 : 500 });
  }
}

// PUT - Update event
export async function PUT(request) {
  try {
    await verifyAdminToken(request);

    const body = await request.json();
    const { eventId, ...updateData } = body;

    if (!eventId) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Event ID is required'
      }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Recalculate final price if pricing data is updated
    if (updateData.originalPrice || updateData.discountPercentage) {
      const event = await db.collection('events').findOne({ _id: new ObjectId(eventId) });
      const originalPrice = updateData.originalPrice || event.originalPrice;
      const discountPercentage = updateData.discountPercentage !== undefined ? 
        updateData.discountPercentage : event.discountPercentage;
      
      updateData.finalPrice = discountPercentage ? 
        originalPrice - (originalPrice * discountPercentage / 100) : 
        originalPrice;
    }

    // Convert date strings to Date objects
    if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
    if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);
    if (updateData.registrationDeadline) updateData.registrationDeadline = new Date(updateData.registrationDeadline);

    updateData.updatedAt = new Date();
    updateData.updatedBy = 'admin';

    const result = await db.collection('events').updateOne(
      { _id: new ObjectId(eventId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Event not found'
      }), { status: 404 });
    }

    const updatedEvent = await db.collection('events').findOne({ _id: new ObjectId(eventId) });

    return new Response(JSON.stringify({
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent
    }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), { status: error.message.includes('token') ? 401 : 500 });
  }
}

// DELETE - Delete event
export async function DELETE(request) {
  try {
    await verifyAdminToken(request);

    const url = new URL(request.url);
    const eventId = url.searchParams.get('eventId');

    if (!eventId) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Event ID is required'
      }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Move to deleted collection for backup
    const eventToDelete = await db.collection('events').findOne({ _id: new ObjectId(eventId) });
    if (eventToDelete) {
      await db.collection('deleted_events').insertOne({
        ...eventToDelete,
        deletedAt: new Date(),
        deletedBy: 'admin'
      });
    }

    const result = await db.collection('events').deleteOne({ _id: new ObjectId(eventId) });

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Event not found'
      }), { status: 404 });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Event deleted successfully'
    }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), { status: error.message.includes('token') ? 401 : 500 });
  }
}