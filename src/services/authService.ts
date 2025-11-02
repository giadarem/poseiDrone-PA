/**
 * AuthService
 * ------------
 * Gestisce la logica di autenticazione degli utenti.
 * In questo progetto non è prevista la registrazione:
 * gli utenti sono caricati tramite seed nel database.
 * L’unico metodo esposto è il login, che verifica le credenziali
 * e genera un token JWT contenente le informazioni essenziali dell’utente.
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authDAO } from '../dao/authDao';
import { UserModel } from '../models/userModel';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

export class AuthService {
  /**
   * Esegue il login verificando le credenziali dell'utente.
   * Se corrette, genera e restituisce un token JWT valido per 2 ore.
   */
  async login(email: string, password: string): Promise<string> {
    const user = await authDAO.findUserByEmail(email);
    if (!user) throw new Error('Utente non trovato');

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) throw new Error('Password non valida');

    const token = jwt.sign(
      { id: user.id, email: user.email, ruolo: user.ruolo },
      JWT_SECRET,
      { expiresIn: '2h', algorithm: 'HS256' }
    );

    return token;
  }
}

/** Istanza unica del service per uso nei controller */
export const authService = new AuthService();
