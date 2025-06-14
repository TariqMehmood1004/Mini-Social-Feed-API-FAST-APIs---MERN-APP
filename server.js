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
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(console.error);

const API_VERSION = process.env.API_VERSION || 'api/v1';

app.use(`/${API_VERSION}/auth`, authRoutes);
app.use(`/${API_VERSION}/posts`, postRoutes);

// Add after routes
swaggerDocs(app);

const HOST = process.env.HOST || 'http://127.0.0.1';
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on ${HOST}:${PORT}`));
