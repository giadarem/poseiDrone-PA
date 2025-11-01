import { Request, Response, NextFunction } from "express";
import { extractBearer, verifyJwt } from "../utils/jwt";
import { UserPayload, validateUserPayload } from "../utils/userPayload";

export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    const token = extractBearer(req.header("Authorization"));
    const payload = await verifyJwt<UserPayload>(token);
    req.user = validateUserPayload(payload);
    next();
  } catch (err) {
    next(err);
  }
}

export function requireRole(...allowed: Array<UserPayload["ruolo"]>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new Error("Utente non autenticato");
      if (!allowed.includes(req.user.ruolo)) throw new Error("Accesso negato: ruolo insufficiente");
      next();
    } catch (err) {
      next(err);
    }
  };
}
