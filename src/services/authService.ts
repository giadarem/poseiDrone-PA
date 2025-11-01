import bcrypt from "bcryptjs";
import { UserRepository } from "../repositories/userRepository";
import { signJwt } from "../utils/jwt";
import { UserPayload } from "../utils/userPayload";

export class AuthService {
  constructor(private users = new UserRepository()) {}

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new Error("Credenziali non valide");

    const ok = await user.confrontaPassword(password);
    if (!ok) throw new Error("Credenziali non valide");

    const payload: UserPayload = {
      sub: user.id,
      email: user.email,
      ruolo: user.ruolo as any,
      token_residui: user.token_residui,
    };

    const token = await signJwt(payload);
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        ruolo: user.ruolo,
        token_residui: user.token_residui
      }
    };
  }
}
