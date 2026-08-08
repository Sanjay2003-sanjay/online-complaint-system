const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { validateToken, authorizeRoles } = require('../middleware/authMiddleware');
const { complaintValidator, statusValidator } = require('../validators/complaintValidator');
const validateRequest = require('../utils/validateRequest');
const { createComplaint, getComplaints, getComplaintById, updateComplaint, deleteComplaint, updateComplaintStatus, assignComplaint } = require('../controllers/complaintController');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedExt = /\.(jpg|jpeg|png|gif|pdf|doc|docx)$/i;
    cb(null, allowedExt.test(path.extname(file.originalname)));
  }
});

router.post('/', validateToken, upload.single('attachment'), complaintValidator, validateRequest, createComplaint);
router.get('/', validateToken, getComplaints);
router.get('/:id', validateToken, getComplaintById);
router.put('/:id', validateToken, upload.single('attachment'), updateComplaint);
router.delete('/:id', validateToken, deleteComplaint);
router.put('/:id/status', validateToken, authorizeRoles('agent', 'admin'), statusValidator, validateRequest, updateComplaintStatus);
router.put('/:id/assign', validateToken, authorizeRoles('admin'), assignComplaint);

module.exports = router;
