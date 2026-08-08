const Feedback = require('../models/Feedback');
const Complaint = require('../models/Complaint');

const submitFeedback = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.body.complaint);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    if (complaint.submittedBy.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Access denied' });
    if (complaint.status !== 'Resolved' && complaint.status !== 'Closed') return res.status(400).json({ message: 'Only resolved complaints can receive feedback' });

    const existing = await Feedback.findOne({ complaint: complaint._id });
    if (existing) return res.status(400).json({ message: 'Feedback already submitted' });

    const feedback = await Feedback.create({ ...req.body, user: req.user._id });
    res.status(201).json(feedback);
  } catch (error) {
    next(error);
  }
};

const getFeedback = async (req, res, next) => {
  try {
    const query = {};
    if (req.user.role === 'user') query.user = req.user._id;
    const feedback = await Feedback.find(query).populate('complaint').populate('user', 'name email');
    res.json(feedback);
  } catch (error) {
    next(error);
  }
};

module.exports = { submitFeedback, getFeedback };