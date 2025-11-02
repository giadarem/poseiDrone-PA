import { Request, Response, NextFunction } from "express";
import { HttpError } from "../factories/errorFactory";

/**
 * Middleware globale di gestione errori.
 * Gestisce gli errori personalizzati (HttpError) e quelli generici.
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(`[ERROR] ${req.method} ${req.url} → ${err.message}`);

  // Se l'errore è un HttpError, restituisce il codice corretto
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
    return;
  }

  // Errori non gestiti (500)
  res.status(500).json({
    status: "error",
    message: "Errore interno del server",
  });
}
