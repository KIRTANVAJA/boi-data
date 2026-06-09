import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { runMigration } from './scripts/migrate.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import requestRoutes from './routes/requestRoutes.js';

// Load environment variables
dotenv.config();

// Connect to SQLite & Run Migrations
runMigration().then(() => {
  console.log('SQLite Database initialized and ready.');
}).catch((err) => {
  console.error('Database migration failed:', err.message);
  process.exit(1);
});

const app = express();

// ES module folder path utility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: false, // Allows cross-origin image loading (needed for local uploads)
}));
app.use(cors({
  origin: '*', // Allow all origins for dev simplicity, can be restricted later
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('dev'));

// Serve local static uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes API Mapping
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/request', requestRoutes);

// Fallback Route for API
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, error: 'API endpoint not found' });
});

// Serve frontend if in production (optional, CMS is separated)
app.get('/', (req, res) => {
  res.send('Digital Biodata & Portfolio CMS API is running...');
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
