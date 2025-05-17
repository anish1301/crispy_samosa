const rateLimit = require('express-rate-limit');

// Create a limiter for general API requests
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Create a stricter limiter for download requests
const downloadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 downloads per hour
    message: 'Download limit reached. Please try again after an hour'
});

module.exports = {
    apiLimiter,
    downloadLimiter
};
