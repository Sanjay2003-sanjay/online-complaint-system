const { body } = require('express-validator');

const complaintValidator = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').notEmpty().withMessage('Category is required')
];

const statusValidator = [
  body('status').isIn(['Pending', 'In Progress', 'Resolved', 'Closed']).withMessage('Invalid status'),
  body('resolution').optional().isString()
];

module.exports = { complaintValidator, statusValidator };
