/**
 * 
 * Gestisce l'autenticazione degli utenti:
 * - Login e generazione del token JWT
 * - Recupero delle informazioni dell'utente autenticato (/auth/me)
 */

import { Request, Response, NextFunction } from "express";
import { authService } from "../services/authService";

export class AuthController {
  /**
   * Esegue il login di un utente.
   * Se email e password sono corretti, genera e restituisce un token JWT.
   */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const token = await authService.login(email, password);
      res.json({ token }); // Il token sarà usato per autenticare le richieste future
    } catch (err) {
      next(err); // Passa l'errore al middleware di gestione errori
    }
  }

  /**
   * Restituisce le informazioni dell’utente autenticato.
   * Richiede un token JWT valido nell’header Authorization.
   */
  async whoami(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user; // Inserito dal middleware di autenticazione
      if (!user) return res.status(401).json({ message: "Token non valido" });
      res.json(user);
    } catch (err) {
      next(err);
    }
  }
}

// Esporta un’istanza del controller da utilizzare nel router
export const authController = new AuthController();
