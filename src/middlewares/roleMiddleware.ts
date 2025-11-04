import { Request, Response, NextFunction } from "express";

export const requireRole = (...allowedRoles: ("USER" | "OPERATOR" | "ADMIN" | "Utente")[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ error: "Utente non autenticato" });
    }

    if (!allowedRoles.includes(user.role || user.ruolo)) {
      return res.status(403).json({ error: "Accesso negato: ruolo insufficiente" });
    }

    next();
  };
};
