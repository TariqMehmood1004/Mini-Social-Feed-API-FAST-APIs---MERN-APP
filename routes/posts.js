import express from 'express';
import multer from 'multer';
import APIResponseHandler from '../Helpers/ApiResponseHandler.js';
import fs from 'fs';
import Post from '../models/Post.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Posts APIs
 */

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/posts/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });


/**
 * @swagger
 * /api/v1/posts/:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Post created successfully
 *       500:
 *         description: Server error
 */
router.post('/', verifyToken, upload.single('image'), async (req, res) => {
    const { title, description } = req.body;
    try {
        const post = new Post({
            user: req.user.id,
            title,
            description,
            image: req.file?.path || '',
        });
        await post.save();
        return APIResponseHandler.HTTP_201_CREATED(res, post, 'Post created successfully');
    } catch (err) {
        return APIResponseHandler.HTTP_500_INTERNAL_SERVER_ERROR(res, 'Post creation failed', { error: err.message });
    }
});


/**
 * @swagger
 * /api/v1/posts/:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     description: Retrieve a list of all posts with pagination
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Posts fetched successfully
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('user', 'name email password profileImage createdAt updatedAt')
            .sort({ createdAt: -1 });
        
        // add pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        
        const startIndex = (page - 1) * limit;
        const totalPosts = await Post.countDocuments();
        
        const pagination = {
            currentPage: page,
            totalPages: Math.ceil(totalPosts / limit),
            totalPosts,
            limit,
        };
        
        if (startIndex >= totalPosts) {
            return APIResponseHandler.HTTP_404_NOT_FOUND(res, 'No posts found for this page');
        }

        posts.splice(0, startIndex);
        posts.splice(limit, posts.length - limit);

        return APIResponseHandler.HTTP_200_OK(res, { posts, pagination }, 'Posts fetched successfully');
    } catch (err) {
        return APIResponseHandler.HTTP_500_INTERNAL_SERVER_ERROR(res, 'Failed to fetch posts', { error: err.message });
    }
});


/**
 * @swagger
 * /api/v1/posts/{id}:
 *   get:
 *     summary: Get a specific post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post fetched successfully
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
*/
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findById(id)
            .populate('user', 'name email password profileImage createdAt updatedAt');
        
        if (!post) {
            return APIResponseHandler.HTTP_404_NOT_FOUND(res, 'Post not found');
        }

        return APIResponseHandler.HTTP_200_OK(res, post, 'Post fetched successfully');
    } catch (err) {
        return APIResponseHandler.HTTP_500_INTERNAL_SERVER_ERROR(res, 'Failed to fetch post', { error: err.message });
    }
});


/**
 * @swagger
 * /api/v1/posts/{id}:
 *   put:
 *     summary: Update a specific post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           description: Update the title, description, and image of the post
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
*/
router.put('/:id', verifyToken, upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    try {
        const post = await Post.findById(id);
        if (!post) {
            return APIResponseHandler.HTTP_404_NOT_FOUND(res, 'Post not found');
        }

        if (post.user.toString() !== req.user.id) {
            return APIResponseHandler.HTTP_403_FORBIDDEN(res, 'You do not have permission to update this post');
        }

        // Delete the old image file if it exists
        if (post.image) {
            fs.unlinkSync(post.image);
        }

        post.title = title || post.title;
        post.description = description || post.description;
        post.image = req.file?.path || post.image;

        await post.save();        

        return APIResponseHandler.HTTP_200_OK(res, post, 'Post updated successfully');
    } catch (err) {
        return APIResponseHandler.HTTP_500_INTERNAL_SERVER_ERROR(res, 'Failed to update post', { error: err.message });
    }
});


/**
 * @swagger
 * /api/v1/posts/{id}:
 *   delete:
 *     summary: Delete a specific post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
*/
router.delete('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Post.findById(id);
        if (!post) {
            return APIResponseHandler.HTTP_404_NOT_FOUND(res, 'Post not found');
        }

        if (post.user.toString() !== req.user.id) {
            return APIResponseHandler.HTTP_403_FORBIDDEN(res, 'You do not have permission to delete this post');
        }

        await post.deleteOne();
        return APIResponseHandler.HTTP_200_OK(res, post, 'Post deleted successfully');
    } catch (err) {
        return APIResponseHandler.HTTP_500_INTERNAL_SERVER_ERROR(res, 'Failed to delete post', { error: err.message });
    }
});


export default router;
