const { body } = require('express-validator');

const feedbackValidator = [
  body('complaint').notEmpty().withMessage('Complaint is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
];

module.exports = { feedbackValidator };