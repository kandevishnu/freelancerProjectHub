import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from './routes/projectRoutes.js';
import projectProposalRoutes from './routes/projectProposalRoutes.js';
import proposalRoutes from './routes/proposalRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import deliverableRoutes from './routes/deliverableRoutes.js';
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// Make the 'uploads' folder publicly accessible
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/auth", authRoutes); 
app.use('/api/projects', projectRoutes);
app.use('/api/projects/:projectId/proposals', projectProposalRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/projects/:projectId/tasks', taskRoutes);
app.use('/api/projects/:projectId/deliverables', deliverableRoutes);


app.get("/", (req, res) => res.send("API is running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
