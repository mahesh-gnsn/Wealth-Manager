const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { Logger } = require('./logger');

module.exports = async function (req) {
    const logger = new Logger(process.env.logLevel);
    const authHeader = req.header('authorization');
    if (authHeader) {
        try {
            // check if this token is part of some user
            const user = await User.findOne({ token: authHeader, isActive: true }).exec();
            if (user) {
                const verifiedToken = jwt.verify(authHeader, process.env.TOKEN_SECRET);
                return verifiedToken.user;
            } else {
                logger.error("User requested with invalidated token");
                return false;
            }
        } catch (exception) {
            logger.error(exception.message);
            return false;
        }
    } else {
        return false;
    }
}