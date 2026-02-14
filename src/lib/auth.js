import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'yigitteknik-secret-key-2024';

export function signToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch {
        return null;
    }
}

export function getTokenFromHeaders(request) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    return authHeader.split(' ')[1];
}

export function requireAuth(request) {
    const token = getTokenFromHeaders(request);
    if (!token) return null;
    return verifyToken(token);
}
