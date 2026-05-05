const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { verifyFirebaseToken } = require('../middleware/authMiddleware');

// Public or semi-public
router.get('/', eventController.getEvents);

// Protected routes (Specific routes must go before parameter routes)
router.get('/user/my-events', verifyFirebaseToken, eventController.getMyEvents);
router.post('/', verifyFirebaseToken, eventController.createEvent);
router.post('/:id/apply', verifyFirebaseToken, eventController.applyToEvent);
router.get('/:id/applicants', verifyFirebaseToken, eventController.getEventApplicants);
router.patch('/:id/applicants/:applicantId', verifyFirebaseToken, eventController.updateApplicantStatus);

// Parameterized public route goes last
router.get('/:id', eventController.getEventById);

module.exports = router;
