
import { verifyToken } from '../utils/auth.js';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied, token missing' });
    }

    const user = verifyToken(token);
    if (!user) {
        return res.status(403).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
};

export const authorizeProvider = (req, res, next) => {
    if (req.user.role !== 'PROVIDER') {
        return res.status(403).json({ error: 'Access denied, provider role required' });
    }
    next();
};
