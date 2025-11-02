/**
 * Modello UserModel
 * -----------------
 * Rappresenta gli utenti del sistema PoseiDrone.
 * Questa versione utilizza un metodo statico `initModel` per essere inizializzata
 * direttamente da `DatabaseConnection`.
 */

import {
  CreationOptional,
  DataTypes,
  Model,
  Sequelize
} from "sequelize";
import bcrypt from "bcryptjs";
import { UserRole } from "../enum/userRole";

/**
 * Interfaccia che definisce le colonne della tabella "users".
 */
export interface UserAttributes {
  id: string;             // UUID primario
  email: string;          // Email univoca
  password_hash: string;  // Hash della password
  ruolo: UserRole;        // Ruolo dell’utente
  token_residui: number;  // Numero di token residui
}

/**
 * Interfaccia per la creazione di un nuovo utente.
 */
export interface UserCreationAttributes extends Partial<UserAttributes> {
  email: string;
  password_hash: string;
}

/**
 * Classe del modello Sequelize.
 * Definisce il comportamento e la struttura del modello User.
 */
export class UserModel extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  
  declare id: CreationOptional<string>;
  declare email: string;
  declare password_hash: string;
  declare ruolo: CreationOptional<UserRole>;
  declare token_residui: CreationOptional<number>;

  /**
   * Metodo di istanza per confrontare una password in chiaro con l'hash memorizzato.
   */
  public async confrontaPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password_hash);
  }

  /**
   * Metodo statico per inizializzare il modello all’interno di Sequelize.
   * Questo metodo è chiamato da DatabaseConnection.
   */
  static initModel(sequelize: Sequelize): void {
    UserModel.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
          comment: "Identificativo univoco dell’utente (UUID)",
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: { isEmail: true },
          comment: "Email univoca dell’utente",
        },
        password_hash: {
          type: DataTypes.STRING,
          allowNull: false,
          comment: "Hash della password (mai in chiaro)",
        },
        ruolo: {
          type: DataTypes.ENUM(...Object.values(UserRole)),
          allowNull: false,
          defaultValue: UserRole.UtenteStd,
          comment: "Ruolo dell’utente (utente, operatore, amministratore)",
        },
        token_residui: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 100,
          comment: "Saldo token residui (solo per utenti standard)",
        },
      },
      {
        sequelize,
        modelName: "UserModel",
        tableName: "users",
        timestamps: false,
        hooks: {
          /**
           * Prima della creazione:
           * Se il ruolo ≠ 'utente', i token vengono azzerati.
           * Se il ruolo = 'utente' e i token non sono specificati, assegna 100.
           */
          beforeCreate: (user) => {
            if (user.ruolo === UserRole.UtenteStd) {
              user.token_residui = user.token_residui ?? 0;
            } else {
              user.token_residui = 0;
            }
          },
          /**
           * Prima dell'aggiornamento:
           * Garantisce che ruoli non standard non abbiano token residui.
           */
          beforeUpdate: (user) => {
            if (user.ruolo !== UserRole.UtenteStd) {
              user.token_residui = 0;
            }
          },
        },
      }
    );
  }
}
