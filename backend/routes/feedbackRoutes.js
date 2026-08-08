const express = require('express');
const router = express.Router();
const { validateToken } = require('../middleware/authMiddleware');
const { feedbackValidator } = require('../validators/feedbackValidator');
const validateRequest = require('../utils/validateRequest');
const { submitFeedback, getFeedback } = require('../controllers/feedbackController');

router.post('/', validateToken, feedbackValidator, validateRequest, submitFeedback);
router.get('/', validateToken, getFeedback);

module.exports = router;
