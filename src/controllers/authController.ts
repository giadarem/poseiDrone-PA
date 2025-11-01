import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/authService";

export class AuthController {
  constructor(private service = new AuthService()) {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) throw new Error("email e password sono obbligatori");
      const result = await this.service.login(email, password);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  whoami = (req: Request, res: Response) => {
    res.status(200).json({ user: req.user });
  };
}
