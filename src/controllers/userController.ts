import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/userService';

export class UserController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.getUserById(req.params.id);
      if (!user) return res.status(404).json({ message: 'Utente non trovato' });
      res.json(user);
    } catch (err) {
      next(err);
    }
  }
}

export const userController = new UserController();
