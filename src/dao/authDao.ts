/**
 * AuthDAO
 * --------
 * Data Access Object dedicato all'autenticazione.
 * In questo progetto non gestisce la creazione di utenti,
 * ma solo la loro ricerca nel database per le operazioni di login.
 */

import { UserModel } from '../models/userModel';

export class AuthDAO {
  /**
   * Cerca un utente in base all'email.
   * Utilizzato dal service di autenticazione per la fase di login.
   * 
   * @param email Email dell'utente da cercare.
   * @returns Istanza di UserModel o null se non trovato.
   */
  async findUserByEmail(email: string): Promise<UserModel | null> {
    return await UserModel.findOne({ where: { email } });
  }
}

/**
 * Esporta un'istanza unica del DAO per uso condiviso nel progetto.
 */
export const authDAO = new AuthDAO();
