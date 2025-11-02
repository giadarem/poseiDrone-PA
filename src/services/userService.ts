import { userDAO } from '../dao/userDao';
import { UserModel } from '../models/userModel';

export class UserService {
  async getUserById(id: string): Promise<UserModel | null> {
    return await userDAO.findById(id);
  }

  async getAllUsers(): Promise<UserModel[]> {
    return await userDAO.getAllUsers();
  }

}

export const userService = new UserService();
