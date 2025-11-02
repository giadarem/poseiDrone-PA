/**
 * Controller per le aree vietate.
 * Fornisce endpoint pubblici e (in futuro) protetti per operatori.
 */

import { Request, Response, NextFunction } from "express";
import { forbiddenAreaService } from "../services/forbiddenAreaService";

export class ForbiddenAreaController {
  /**
   *  Restituisce tutte le aree vietate attive.
   * Accesso libero, senza autenticazione.
   */
  async getAreePubbliche(_req: Request, res: Response, next: NextFunction) {
    try {
      const aree = await forbiddenAreaService.getAreeVietateAttive();
      res.json(aree);
    } catch (err) {
      next(err);
    }
  }
}

export const forbiddenAreaController = new ForbiddenAreaController();
