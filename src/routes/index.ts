import { Router } from 'express';
import { BabyController } from '../controllers';

const router = Router();
const babyController = new BabyController();

// Get the active baby profile (or by slug)
router.get('/baby', (req, res) => babyController.getBaby(req, res));

// Create or update the baby profile used by the landing page
router.put('/baby', (req, res) => babyController.upsertBaby(req, res));
router.post('/baby', (req, res) => babyController.upsertBaby(req, res));

export default router;