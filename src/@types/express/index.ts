import "express";
import { UserPayload } from "../../utils/userPayload";

declare module "express-serve-static-core" {
  interface Request {
    user?: UserPayload;
  }
}
