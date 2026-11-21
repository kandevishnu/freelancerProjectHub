import express from 'express';
import auth from '../middleware/authMiddleware.js';
import { createInvoice, getInvoiceForProject, payInvoice, getMyEarnings } from '../controllers/invoiceController.js';

const router = express.Router();

router.get('/my-earnings', auth, getMyEarnings);
router.patch('/:invoiceId/pay', auth, payInvoice);

const projectRouter = express.Router({ mergeParams: true });
projectRouter.post('/', auth, createInvoice);
projectRouter.get('/', auth, getInvoiceForProject);

export { router as invoiceRouter, projectRouter as projectInvoiceRouter };
