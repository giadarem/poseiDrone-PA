import { Request, Response, NextFunction } from "express";

export function validateNavigationPlan(req: Request, res: Response, next: NextFunction) {
  // Accetta sia snake_case che camelCase e normalizza
  const boatCode = req.body.boatCode ?? req.body.boat_id ?? req.body.boatId;
  const waypoints = req.body.routeWaypoints ?? req.body.waypoints;
  const startDate = req.body.startDate ?? req.body.start_date;
  const expectedEndDate = req.body.expectedEndDate ?? req.body.end_date;

  if (!boatCode || typeof boatCode !== "string" || boatCode.length !== 10) {
    return res.status(400).json({ error: "boatCode deve avere esattamente 10 caratteri" });
  }
  if (!Array.isArray(waypoints) || waypoints.length < 2) {
    return res.status(400).json({ error: "routeWaypoints/waypoints deve essere un array di coordinate" });
  }
  if (!startDate) return res.status(400).json({ error: "startDate / start_date è obbligatorio" });
  // expectedEndDate opzionale se la tua logica lo consente (la migration lo rende opzionale)

  // Salva la versione normalizzata per i passi successivi
  (req as any).normalizedPlan = { boatCode, waypoints, startDate, expectedEndDate };
  next();
}
