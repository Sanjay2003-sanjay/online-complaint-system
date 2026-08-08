const express = require('express');
const router = express.Router();
const { validateToken } = require('../middleware/authMiddleware');
const { messageValidator } = require('../validators/messageValidator');
const validateRequest = require('../utils/validateRequest');
const { sendMessage, getMessages } = require('../controllers/messageController');

router.post('/', validateToken, messageValidator, validateRequest, sendMessage);
router.get('/:complaintId', validateToken, getMessages);

module.exports = router;
