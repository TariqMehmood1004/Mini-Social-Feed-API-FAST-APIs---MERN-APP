import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import APIResponseHandler from '../Helpers/ApiResponseHandler.js';

import User from '../models/User.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/profiles/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });


/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User registered
 *       500:
 *         description: Server error
 */

router.post('/register', upload.single('profileImage'), async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashed = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashed,
            profileImage: req.file?.path || '',
        });
        await newUser.save();
        return APIResponseHandler.HTTP_201_CREATED(res, newUser, 'User registered successfully');
    } catch (err) {
        return APIResponseHandler.HTTP_500_INTERNAL_SERVER_ERROR(res, 'Error registering user', { error: err.message });
    }
});


/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       400:
 *         description: Invalid credentials
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return APIResponseHandler.HTTP_400_BAD_REQUEST(res, 'Invalid credentials');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return APIResponseHandler.HTTP_400_BAD_REQUEST(res, 'Invalid credentials');

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        return APIResponseHandler.HTTP_200_OK(res, { token });
    } catch (err) {
        return APIResponseHandler.HTTP_500_INTERNAL_SERVER_ERROR(res, 'Login failed', { error: err.message });
    }
});


/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/me', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return APIResponseHandler.HTTP_401_UNAUTHORIZED(res, 'No token provided');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) return APIResponseHandler.HTTP_401_UNAUTHORIZED(res, 'User not found');

        return APIResponseHandler.HTTP_200_OK(res, user, 'User profile retrieved successfully');
    } catch (err) {
        return APIResponseHandler.HTTP_500_INTERNAL_SERVER_ERROR(res, 'Error retrieving user profile', { error: err.message });
    }
});

export default router;
