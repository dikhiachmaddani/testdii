import { verifyAccessToken } from '../utils/jwt.util.js';
export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ message: 'Authorization header missing' });
        return; // functions returning void
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Token missing' });
        return;
    }
    const payload = verifyAccessToken(token);
    if (!payload) {
        res.status(403).json({ message: 'Invalid or expired token' });
        return;
    }
    req.user = payload; // Cast to expected type
    next();
};
