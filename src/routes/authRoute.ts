import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();
const controller = new AuthController();

/**
 * POST /auth/login
 * Body: { email, password }
 */
router.post("/auth/login", controller.login);

/**
 * GET /auth/me
 * Header: Authorization: Bearer <token>
 */
router.get("/auth/me", authenticate, controller.whoami);

export default router;
