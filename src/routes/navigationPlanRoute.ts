import { Router } from "express";
// import { authenticate, requireRole } from "../middlewares/authMiddleware"; // 🔒 disabilitato per test
import { validateNavigationPlan } from "../middlewares/navigationPlanMiddleware";
import { navigationPlanController } from "../controllers/navigationPlanController";

const router = Router();

/**
 * Rotta per creare un piano di navigazione
 * AUTENTICAZIONE DISABILITATA TEMPORANEAMENTE
 */
router.post(
  "/",
  // authenticate,           // (disabilitato per test)
  // requireRole("utente"),  // (disabilitato per test)
  validateNavigationPlan,
  navigationPlanController.createPlan
);

/**
 * Rotta per ottenere tutti i piani (senza auth, solo per test)
 */
router.get("/", navigationPlanController.getAll);

/**
 * Rotta per cancellare un piano (senza auth, solo per test)
 */
router.delete("/plans/remuve/:id", navigationPlanController.cancelPlan);

export default router;
