import { Router, Request, Response } from "express";

const router = Router();

/**
 * @route GET /
 * @desc rotta di base 
 */
router.get("/", (_req: Request, res: Response) => {
  res.status(200).send("Server running on PoseiDrone API");
});

export default router;
