const jwt = require('jsonwebtoken');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'complaint-secret', { expiresIn: '7d' });

module.exports = generateToken;
