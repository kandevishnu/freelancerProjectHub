import express from "express";
import auth from "../middleware/authMiddleware.js"; 
import { updateMe } from "../controllers/userController.js";

const router = express.Router();

router.patch("/me", auth, updateMe);

export default router;
