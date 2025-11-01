/**
 * ============================================================
 *  DatabaseConnection (Pattern Singleton)
 * ------------------------------------------------------------
 *  - Gestisce una singola istanza di Sequelize.
 *  - Esegue migrazioni e seeding da file SQL puri.
 *  - Utilizza variabili d'ambiente definite in .env.
 * ============================================================
 */

import { Sequelize, Dialect } from "sequelize";
import fs from "fs";
import path from "path";

// Importa il modello per la registrazione in Sequelize (solo per tipizzazione/uso ORM)
import { UserModel } from "../models/userModel";

// Percorsi assoluti ai file SQL (relativi al progetto)
const MIGRATION_PATH = path.join(process.cwd(), "src", "db", "init", "migration.sql");
const SEED_PATH = path.join(process.cwd(), "src", "db", "init", "seed.sql");


/**
 * Classe Singleton per la connessione al database tramite Sequelize.
 */
class DatabaseConnection {
  /** Istanza unica condivisa di Sequelize */
  private static instance: Sequelize;

  /** Costruttore privato per evitare instanziazioni multiple */
  private constructor() {}

  /**
   * Restituisce (o crea) la singola istanza di Sequelize.
   * @returns L'istanza di Sequelize
   * @throws Se mancano variabili d'ambiente obbligatorie
   */
  public static getInstance(): Sequelize {
    if (!DatabaseConnection.instance) {
      const DB_NAME = process.env.DB_NAME;
      const DB_USER = process.env.DB_USER;
      const DB_PASSWORD = process.env.DB_PASSWORD;
      const DB_HOST = process.env.DB_HOST;
      const DB_DIALECT: Dialect = (process.env.DB_DIALECT as Dialect) || "postgres";

      if (!DB_NAME || !DB_USER || !DB_PASSWORD || !DB_HOST) {
        throw new Error(" Errore: Mancano variabili d'ambiente essenziali per la connessione al DB.");
      }

      const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
        host: DB_HOST,
        dialect: DB_DIALECT,
        logging: false,
        define: {
          freezeTableName: true, // evita pluralizzazione automatica (User -> Users)
        },
      });

      // Inizializza i modelli per l'uso ORM
      UserModel.initModel(sequelize);

      DatabaseConnection.instance = sequelize;
    }

    return DatabaseConnection.instance;
  }
}

/**
 * ============================================================
 *  Funzione: runSqlMigrations()
 * ------------------------------------------------------------
 *  Esegue in sequenza:
 *   1. migration.sql → creazione schema DB
 *   2. seed.sql → inserimento dati iniziali
 * ============================================================
 */
export async function runSqlMigrations(): Promise<void> {
  const sequelize = DatabaseConnection.getInstance();

  try {
    await sequelize.authenticate();
    console.log("STATUS: Connessione al database stabilita con successo.");

    // 1️⃣ MIGRAZIONE SQL
    if (fs.existsSync(MIGRATION_PATH)) {
      const migrationSQL = fs.readFileSync(MIGRATION_PATH, "utf8");
      await sequelize.query(migrationSQL, { raw: true, multipleStatements: true } as any);
      console.log("STATUS: Migrazione SQL eseguita con successo.");
    } else {
      console.warn("WARNING: File di migrazione SQL non trovato:", MIGRATION_PATH);
    }

    // 2️⃣ SEED SQL
    if (fs.existsSync(SEED_PATH)) {
      const seedSQL = fs.readFileSync(SEED_PATH, "utf8");
      await sequelize.query(seedSQL, { raw: true, multipleStatements: true } as any);
      console.log("STATUS: Dati iniziali inseriti tramite SQL seed.");
    } else {
      console.warn("WARNING: File di seed SQL non trovato:", SEED_PATH);
    }

  } catch (error: any) {
    // Gestione errori noti (tabelle già esistenti o duplicati)
    if (error.message && (error.message.includes("already exists") || error.message.includes("duplicate key"))) {
      console.log("ℹSTATUS: Schema o dati già presenti, migrazione/seed saltati (idempotenza).");
    } else {
      console.error("FATAL ERROR: Impossibile eseguire migrazioni SQL:", error.message);
      throw error;
    }
  }
}

export default DatabaseConnection;
