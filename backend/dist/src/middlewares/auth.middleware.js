import jwt from 'jsonwebtoken';
import logger from '../config/logger.js';
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_123';
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token)
        return res.status(401).json({ error: 'Access token required' });
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err)
            return res.status(403).json({ error: 'Invalid or expired token' });
        req.user = user;
        next();
    });
};
export const optionalAuthenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    logger.debug({ authHeader }, 'Auth header check');
    const token = authHeader && authHeader.split(' ')[1];
    if (!token)
        return next();
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (!err)
            req.user = user;
        next();
    });
};
export const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
        }
        next();
    };
};
//# sourceMappingURL=auth.middleware.js.map