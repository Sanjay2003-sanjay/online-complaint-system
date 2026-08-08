const Message = require('../models/Message');
const Complaint = require('../models/Complaint');

const sendMessage = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.body.complaint);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    if (req.user.role !== 'admin' && complaint.submittedBy.toString() !== req.user._id.toString() && complaint.assignedTo?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const message = await Message.create({ complaint: complaint._id, sender: req.user._id, text: req.body.text });
    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.complaintId);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    if (req.user.role !== 'admin' && complaint.submittedBy.toString() !== req.user._id.toString() && complaint.assignedTo?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const messages = await Message.find({ complaint: complaint._id }).populate('sender', 'name role');
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

module.exports = { sendMessage, getMessages };