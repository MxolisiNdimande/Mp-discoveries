// server/routes/destinations.js
import express from 'express';
import {
  getDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination
} from '../controllers/destinationsController.js';

import { authenticate } from '../middleware/auth.js';
import { validateDestination } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', getDestinations);
router.get('/:id', getDestinationById);

// Protected routes (admin only)
router.post('/', authenticate, validateDestination, createDestination);
router.put('/:id', authenticate, validateDestination, updateDestination);
router.delete('/:id', authenticate, deleteDestination);

export default router;