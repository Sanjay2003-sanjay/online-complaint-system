const express = require('express');
const router = express.Router();
const { validateToken, authorizeRoles } = require('../middleware/authMiddleware');
const { getUsers, getUserById, createAgent, updateUser, deleteUser, getAnalytics } = require('../controllers/adminController');

router.get('/users', validateToken, authorizeRoles('admin'), getUsers);
router.get('/users/:id', validateToken, authorizeRoles('admin'), getUserById);
router.post('/agents', validateToken, authorizeRoles('admin'), createAgent);
router.put('/users/:id', validateToken, authorizeRoles('admin'), updateUser);
router.delete('/users/:id', validateToken, authorizeRoles('admin'), deleteUser);
router.get('/analytics', validateToken, authorizeRoles('admin'), getAnalytics);

module.exports = router;
