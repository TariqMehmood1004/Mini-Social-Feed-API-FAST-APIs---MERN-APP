import jwt from 'jsonwebtoken';
import APIResponseHandler from '../Helpers/ApiResponseHandler.js';


const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return APIResponseHandler.HTTP_401_UNAUTHORIZED(res, 'No token provided');
    if (token === 'null') return APIResponseHandler.HTTP_401_UNAUTHORIZED(res, 'Token is null');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        return APIResponseHandler.HTTP_403_FORBIDDEN(res, 'Invalid token');
    }
};

export default verifyToken;
