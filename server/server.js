import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from './routes/projectRoutes.js';
import projectProposalRoutes from './routes/projectProposalRoutes.js';
import proposalRoutes from './routes/proposalRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes); 
app.use('/api/projects', projectRoutes);
app.use('/api/projects/:projectId/proposals', projectProposalRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/projects/:projectId/tasks', taskRoutes);

app.get("/", (req, res) => res.send("API is running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
