import { UserModel } from "../models/userModel";

export class UserRepository {
  async findByEmail(email: string) {
    return UserModel.findOne({ where: { email } });
  }
  async findById(id: string) {
    return UserModel.findByPk(id);
  }
}
