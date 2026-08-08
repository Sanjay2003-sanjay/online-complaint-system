const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile, updateProfile } = require('../controllers/authController');
const { registerValidator, loginValidator } = require('../validators/authValidator');
const validateRequest = require('../utils/validateRequest');
const { validateToken } = require('../middleware/authMiddleware');

router.post('/register', registerValidator, validateRequest, registerUser);
router.post('/login', loginValidator, validateRequest, loginUser);
router.get('/profile', validateToken, getProfile);
router.put('/profile', validateToken, updateProfile);

module.exports = router;
