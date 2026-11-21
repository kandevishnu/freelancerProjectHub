import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";
import http from 'http';
import { initSocket } from './socket.js';

import { handleStripeWebhook } from './controllers/stripeController.js';
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from './routes/projectRoutes.js';
import projectProposalRoutes from './routes/projectProposalRoutes.js';
import proposalRoutes from './routes/proposalRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import deliverableRoutes from './routes/deliverableRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import postRoutes from './routes/postRoutes.js';
import userRoutes from './routes/userRoutes.js';
import connectionRoutes from './routes/connectionRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import projectMessageRoutes from './routes/projectMessageRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';
import projectReviewRoutes from './routes/projectReviewRoutes.js'; 
import userReviewRoutes from './routes/userReviewRoutes.js'; 
import { invoiceRouter, projectInvoiceRouter } from './routes/invoiceRoutes.js'; 
import stripeRoutes from './routes/stripeRoutes.js';
import experienceRoutes from './routes/experienceRoutes.js';
import educationRoutes from './routes/educationRoutes.js';
import upload from './config/cloudinary.js';

dotenv.config();

const requiredEnv = [
  "JWT_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
];

if (!process.env.MONGODB_URI && !process.env.MONGO_URI) {
  throw new Error("Missing required environment variable: MONGODB_URI");
}

const missingEnv = requiredEnv.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnv.join(", ")}`);
}

if (
  process.env.NODE_ENV === "production" &&
  !process.env.CLIENT_URL &&
  !process.env.FRONTEND_URL
) {
  throw new Error("Missing required production environment variable: CLIENT_URL");
}

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://freelancerprojecthub.vercel.app",
  ...(process.env.CLIENT_URL || process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Origin not allowed by CORS"));
  },
  credentials: true,
}));
app.post(
  '/api/payments/stripe-webhook', 
  express.raw({ type: 'application/json' }), 
  handleStripeWebhook
);
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "awake",
    message: "Backend is running successfully",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes); 
app.use('/api/projects', projectRoutes);
app.use('/api/projects/:projectId/proposals', projectProposalRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/projects/:projectId/tasks', taskRoutes);
app.use('/api/projects/:projectId/deliverables', deliverableRoutes);
app.use('/api/projects/:projectId/messages', messageRoutes);
app.use('/api/projects/:projectId/project-messages', projectMessageRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/projects/:projectId/reviews', projectReviewRoutes); 
app.use('/api/users/:userId/reviews', userReviewRoutes); 
app.use('/api/projects/:projectId/invoices', projectInvoiceRouter);
app.use('/api/invoices', invoiceRouter);
app.use('/api/payments', stripeRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/education', educationRoutes);

app.get("/", (req, res) => res.send("API is running..."));

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  initSocket(server);

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  process.exit(1);
});

