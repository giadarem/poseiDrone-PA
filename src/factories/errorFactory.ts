// src/factories/errorFactory.ts
/**
 * Implementazione del Design Pattern Factory per la creazione centralizzata degli errori.
 * Questo strato fornisce metodi statici puliti per sollevare eccezioni HTTP specifiche 
 * (come 404, 401, 403) che il middleware catturerà.
 */

import { StatusCodes, ReasonPhrases } from 'http-status-codes';
// Importiamo tutte le classi di errore da specificErrors.ts (Named Exports)
import { 
    HttpError, 
    UnauthorizedError, 
    ForbiddenError, 
    NotFoundError, 
    ValidationError,
    ConflictError
} from './specificErrors';

export class ErrorFactory {

    /**
     * Metodo generico per creare un errore HTTP con codice di stato personalizzato.
     */
    public static createError(message: string, status: StatusCodes = StatusCodes.INTERNAL_SERVER_ERROR): HttpError {
        // Chiama il costruttore della classe base HttpError
        return new HttpError(message, status);
    }
    
    /**
     * Crea un errore 401 Unauthorized (accesso negato, token non valido, o credito insufficiente).
     */
    public static unauthorized(message?: string): UnauthorizedError {
        return new UnauthorizedError(message);
    }

    /**
     * Crea un errore 403 Forbidden (mancanza di privilegi o restrizione logica).
     */
    public static forbidden(message?: string): ForbiddenError {
        return new ForbiddenError(message);
    }

    /**
     * Crea un errore 404 Not Found (risorsa o rotta inesistente).
     */
    public static notFound(message?: string): NotFoundError {
        return new NotFoundError(message);
    }
    
    /**
     * Crea un errore 400 Bad Request (input non valido).
     */
    public static validationError(message: string): ValidationError {
        return new ValidationError(message);
    }

    /**
     * Crea un errore 409 Conflict (risorsa duplicata, stato invalido).
     */
    public static conflict(message: string): ConflictError {
        return new ConflictError(message);
    }
}

// Riesporta la classe HttpError base per la tipizzazione nel Middleware.
export { HttpError };