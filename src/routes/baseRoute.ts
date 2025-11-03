import { Router, Request, Response, NextFunction } from "express";
import { forbiddenAreaService } from "../services/forbiddenAreaService";

const router = Router();

router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const aree = await forbiddenAreaService.getAreeVietateAttive();

    if (!aree || aree.length === 0) {
      return res.status(204).send("Nessuna area vietata attiva");
    }

    res.status(200).json(aree);
  } catch (error) {
    next(error);
  }
});

export default router;
