/**
 * Middleware di autenticazione e autorizzazione JWT
 * -------------------------------------------------
 * - `authenticate`: verifica il token JWT e popola `req.user` con i dati decodificati.
 * - `requireRole`: controlla che l’utente autenticato abbia un ruolo tra quelli ammessi.
 */

import { Request, Response, NextFunction } from "express";
import { extractBearer, verifyJwt } from "../utils/jwt";
import { UserPayload, validateUserPayload } from "../utils/userPayload";

/**
 * Verifica la presenza e validità del token JWT.
 * Se valido, aggiunge l'oggetto utente (`req.user`) alla richiesta.
 */
export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    const token = extractBearer(req.header("Authorization")); // Estrae il token "Bearer ..."
    const payload = await verifyJwt<UserPayload>(token);      // Verifica la firma e decodifica
    req.user = validateUserPayload(payload);                  // Valida e assegna l’utente alla request
    next();
  } catch (err) {
    next(err); // Passa eventuali errori al middleware di gestione
  }
}

/**
 * Verifica che l'utente autenticato abbia uno dei ruoli ammessi.
 * Esempio: `requireRole("Amministratore", "Operatore")`
 */
export function requireRole(...allowed: Array<UserPayload["ruolo"]>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new Error("Utente non autenticato");
      if (!allowed.includes(req.user.ruolo))
        throw new Error("Accesso negato: ruolo insufficiente");
      next();
    } catch (err) {
      next(err);
    }
  };
}
