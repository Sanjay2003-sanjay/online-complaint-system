const Complaint = require('../models/Complaint');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const createComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.create({
      ...req.body,
      submittedBy: req.user._id,
      attachment: req.file ? req.file.filename : undefined,
    });

    const user = await User.findById(req.user._id);
    await sendEmail({
      to: user.email,
      subject: 'Complaint Submitted',
      text: `Your complaint "${complaint.title}" has been submitted successfully.`
    });

    res.status(201).json(complaint);
  } catch (error) {
    next(error);
  }
};

const getComplaints = async (req, res, next) => {
  try {
    const query = {};
    if (req.user.role === 'user') query.submittedBy = req.user._id;
    if (req.user.role === 'agent') query.assignedTo = req.user._id;
    if (req.query.status) query.status = req.query.status;
    if (req.query.category) query.category = req.query.category;
    if (req.query.priority) query.priority = req.query.priority;
    if (req.query.search) query.title = { $regex: req.query.search, $options: 'i' };

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const complaints = await Complaint.find(query).populate('submittedBy', 'name email').populate('assignedTo', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Complaint.countDocuments(query);

    res.json({ complaints, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate('submittedBy', 'name email').populate('assignedTo', 'name email');
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (req.user.role !== 'admin' && complaint.submittedBy._id.toString() !== req.user._id.toString() && complaint.assignedTo?._id?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(complaint);
  } catch (error) {
    next(error);
  }
};

const updateComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    if (req.user.role !== 'admin' && complaint.submittedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (complaint.status !== 'Pending' && req.user.role !== 'admin') {
      return res.status(400).json({ message: 'Only pending complaints can be edited' });
    }

    const updated = await Complaint.findByIdAndUpdate(req.params.id, { ...req.body, attachment: req.file ? req.file.filename : complaint.attachment }, { new: true });
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

const deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    if (req.user.role !== 'admin' && complaint.submittedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (complaint.status !== 'Pending' && req.user.role !== 'admin') {
      return res.status(400).json({ message: 'Only pending complaints can be deleted' });
    }

    await complaint.remove();
    res.json({ message: 'Complaint deleted' });
  } catch (error) {
    next(error);
  }
};

const updateComplaintStatus = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    if (req.user.role !== 'admin' && complaint.assignedTo?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    complaint.status = req.body.status;
    complaint.resolution = req.body.resolution || complaint.resolution;
    complaint.updatedAt = new Date();
    await complaint.save();

    await sendEmail({
      to: req.user.email,
      subject: 'Complaint Status Updated',
      text: `Complaint "${complaint.title}" status updated to ${complaint.status}.`
    });

    res.json(complaint);
  } catch (error) {
    next(error);
  }
};

const assignComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    complaint.assignedTo = req.body.agentId;
    complaint.status = 'In Progress';
    await complaint.save();

    const agent = await User.findById(req.body.agentId);
    await sendEmail({
      to: agent?.email || req.user.email,
      subject: 'Complaint Assigned',
      text: `Complaint "${complaint.title}" has been assigned to you.`
    });

    res.json(complaint);
  } catch (error) {
    next(error);
  }
};

module.exports = { createComplaint, getComplaints, getComplaintById, updateComplaint, deleteComplaint, updateComplaintStatus, assignComplaint };
