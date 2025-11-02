/**
 * Estensione dell'interfaccia Request di Express
 * Aggiunge la proprietà `user` tipizzata come UserPayload,
 * utilizzata dopo la verifica del token JWT.
 */

import "express";
import { UserPayload } from "../../utils/userPayload";

declare module "express-serve-static-core" {
  interface Request {
    user?: UserPayload;
  }
}
