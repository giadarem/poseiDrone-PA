/**
 * errorHandler
 * -------------
 * Middleware globale di gestione errori.
 * Intercetta tutte le eccezioni sollevate e restituisce
 * una risposta JSON con messaggio e codice HTTP.
 */

import { Request, Response, NextFunction } from "express";
import { HttpError  } from "./httpError";

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  // Se l'errore è di tipo AppError, è un errore previsto
  if (err instanceof HttpError ) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  // Altrimenti è un errore sconosciuto (500)
  console.error( "Errore inatteso:", err);
  return res.status(500).json({
    status: "error",
    message: "Errore interno del server",
  });
}
