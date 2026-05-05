const Event = require('../models/Event');

// 1. POST /api/events -> Create event
exports.createEvent = async (req, res) => {
  try {
    const userId = req.user.firebaseUid || req.user.uid;
    const role = req.user.role || req.body.role || 'brand'; // fallback

    const newEvent = new Event({
      ...req.body,
      createdBy: userId,
      role: role
    });

    await newEvent.save();
    return res.status(201).json({ success: true, data: newEvent });
  } catch (error) {
    console.error('Create Event Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 2. GET /api/events -> Get all public events (with filtering)
exports.getEvents = async (req, res) => {
  try {
    const { category, eventType, role } = req.query;
    let query = { visibility: 'public' };

    if (category) query.category = category;
    if (eventType) query.eventType = eventType;
    if (role) query.role = role;

    const events = await Event.find(query).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: events });
  } catch (error) {
    console.error('Get Events Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 3. GET /api/events/:id -> Get single event details
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    return res.status(200).json({ success: true, data: event });
  } catch (error) {
    console.error('Get Event By ID Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 4. POST /api/events/:id/apply -> Apply to event
exports.applyToEvent = async (req, res) => {
  try {
    const userId = req.user.firebaseUid || req.user.uid;
    const { message } = req.body;

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    // Prevent creator from applying
    if (event.createdBy === userId) {
      return res.status(400).json({ success: false, message: 'You cannot apply to your own event' });
    }

    // Check if already applied
    const alreadyApplied = event.applicants.find(app => app.userId === userId);
    if (alreadyApplied) {
      return res.status(400).json({ success: false, message: 'You have already applied to this event' });
    }

    event.applicants.push({ userId, message, status: 'pending' });
    await event.save();

    return res.status(200).json({ success: true, message: 'Application submitted successfully', data: event });
  } catch (error) {
    console.error('Apply Event Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 5. GET /api/events/my-events -> Get events created by logged-in user
exports.getMyEvents = async (req, res) => {
  try {
    const userId = req.user.firebaseUid || req.user.uid;
    const events = await Event.find({ createdBy: userId }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: events });
  } catch (error) {
    console.error('Get My Events Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 6. GET /api/events/:id/applicants -> Get applicants (only event owner)
exports.getEventApplicants = async (req, res) => {
  try {
    const userId = req.user.firebaseUid || req.user.uid;
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    if (event.createdBy !== userId) return res.status(403).json({ success: false, message: 'Unauthorized access' });

    return res.status(200).json({ success: true, data: event.applicants });
  } catch (error) {
    console.error('Get Applicants Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 7. PATCH /api/events/:id/applicants/:applicantId -> Accept / Reject applicant
exports.updateApplicantStatus = async (req, res) => {
  try {
    const userId = req.user.firebaseUid || req.user.uid;
    const { status } = req.body;

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    if (event.createdBy !== userId) return res.status(403).json({ success: false, message: 'Unauthorized access' });

    const applicant = event.applicants.id(req.params.applicantId);
    if (!applicant) return res.status(404).json({ success: false, message: 'Applicant not found' });

    applicant.status = status;
    await event.save();

    return res.status(200).json({ success: true, message: `Applicant ${status}`, data: event });
  } catch (error) {
    console.error('Update Applicant Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
