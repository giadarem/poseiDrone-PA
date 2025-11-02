import { StatusCodes } from "http-status-codes";

/**
 * Classe base per tutti gli errori HTTP personalizzati.
 * Fornisce un messaggio e un codice di stato numerico.
 */
export class HttpError extends Error {
  public statusCode: number;

  constructor(
    message: string,
    statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR
  ) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
