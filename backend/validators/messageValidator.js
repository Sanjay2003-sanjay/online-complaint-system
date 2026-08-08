const { body } = require('express-validator');

const messageValidator = [body('text').notEmpty().withMessage('Message text is required')];

module.exports = { messageValidator };