const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Auth Middleware - Decoded User ID:', decoded.id);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Auth Middleware Error:', err);
        res.status(401).json({ message: 'Token is not valid' });
    }
};
