/**
 * UserDAO
 * --------
 * Data Access Object per la gestione dei dati utente.
 * Non implementa un CRUD completo, ma solo le operazioni
 * necessarie al progetto PoseiDrone:
 *  - ricerca utente per ID o email
 *  - aggiornamento specifico (es. ricarica token)
 */

import { UserModel } from '../models/userModel';

export class UserDAO {
  /**
   * Trova un utente tramite il suo ID.
   */
  async findById(id: string): Promise<UserModel | null> {
    return await UserModel.findByPk(id);
  }

  /**
   * Trova un utente tramite email.
   */
  async findByEmail(email: string): Promise<UserModel | null> {
    return await UserModel.findOne({ where: { email } });
  }

  /**
   * Aggiorna i token di un utente.
   * Utilizzato esclusivamente dagli amministratori.
   */
  async updateUserTokens(email: string, nuoviToken: number): Promise<UserModel | null> {
    const user = await this.findByEmail(email);
    if (!user) return null;

    user.token_residui = nuoviToken;
    await user.save();
    return user;
  }

  /**
   * Restituisce la lista di tutti gli utenti (solo per uso admin o debug).
   */
  async getAllUsers(): Promise<UserModel[]> {
    return await UserModel.findAll();
  }
}

/**
 * Esporta un'unica istanza del DAO da riutilizzare nei service.
 */
export const userDAO = new UserDAO();
