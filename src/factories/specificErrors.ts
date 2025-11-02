// src/factories/specificErrors.ts

import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { HttpError } from './httpError';

/**
 * Raccolta di classi di errore specifiche che estendono HttpError.
 * Ogni classe rappresenta un tipo di errore HTTP comune.
 */

// ----------------------------------------------------
// 400 - Bad Request
// ----------------------------------------------------
export class ValidationError extends HttpError {
    constructor(message: string = 'Richiesta non valida.') {
        super(message, StatusCodes.BAD_REQUEST);
        this.name = ReasonPhrases.BAD_REQUEST;
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

// ----------------------------------------------------
// 401 - Unauthorized
// ----------------------------------------------------
export class UnauthorizedError extends HttpError {
    constructor(message: string = 'Accesso non autorizzato. Token non valido o scaduto.') {
        super(message, StatusCodes.UNAUTHORIZED);
        this.name = ReasonPhrases.UNAUTHORIZED;
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
}

// ----------------------------------------------------
// 403 - Forbidden
// ----------------------------------------------------
export class ForbiddenError extends HttpError {
    constructor(message: string = 'Non si dispone dei permessi necessari per questa operazione.') {
        super(message, StatusCodes.FORBIDDEN);
        this.name = ReasonPhrases.FORBIDDEN;
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }
}

// ----------------------------------------------------
// 404 - Not Found
// ----------------------------------------------------
export class NotFoundError extends HttpError {
    constructor(message: string = 'Risorsa non trovata.') {
        super(message, StatusCodes.NOT_FOUND);
        this.name = ReasonPhrases.NOT_FOUND;
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}

// ----------------------------------------------------
// 409 - Conflict
// ----------------------------------------------------
export class ConflictError extends HttpError {
    constructor(message: string = 'Conflitto: la risorsa esiste già o lo stato è invalido.') {
        super(message, StatusCodes.CONFLICT);
        this.name = ReasonPhrases.CONFLICT;
        Object.setPrototypeOf(this, ConflictError.prototype);
    }
}

// ----------------------------------------------------
// Riesporta la classe base per la Factory e il middleware
// ----------------------------------------------------
export { HttpError };
