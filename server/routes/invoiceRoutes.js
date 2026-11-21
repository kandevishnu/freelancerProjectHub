import express from 'express';
import auth from '../middleware/authMiddleware.js';
import { createInvoice, getInvoiceForProject, getMyEarnings } from '../controllers/invoiceController.js';

const router = express.Router();

router.get('/my-earnings', auth, getMyEarnings);

const projectRouter = express.Router({ mergeParams: true });
projectRouter.post('/', auth, createInvoice);
projectRouter.get('/', auth, getInvoiceForProject);

export { router as invoiceRouter, projectRouter as projectInvoiceRouter };
