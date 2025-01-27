const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, process.env.SECRET_KEY_ACCESS_TOKEN, {
        expiresIn: '1d',
    });
};

module.exports = { generateAccessToken };
