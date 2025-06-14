import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerDocs from './swagger.js';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';

dotenv.config();

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();


// Middlewares
app.use(express.json());
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*', // allow frontend domain
    credentials: true
}));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// MongoDB connection (Atlas-friendly)
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('✅ MongoDB Connected'))
    .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err.message);
        process.exit(1);
    });


// API Versioning
const API_VERSION = process.env.API_VERSION || 'api/v1';


// Routes
app.use(`/${API_VERSION}/auth`, authRoutes);
app.use(`/${API_VERSION}/posts`, postRoutes);


// Swagger after routes
swaggerDocs(app);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    const serverUrl = `${process.env.HOST || 'http://localhost'}:${PORT}`;
    console.log(`🚀 Server running at: ${serverUrl}`);
});
