/**
 * DatabaseConnection (Pattern Singleton)
 * --------------------------------------
 * Gestisce una singola connessione Sequelize al database.
 * - Implementa il pattern Singleton per garantire un'unica istanza condivisa.
 * - Inizializza i modelli ORM (UserModel, NavigationPlanModel).
 * - Esegue migrazioni e seed da file SQL esterni.
 */

import { Sequelize, Dialect } from "sequelize";
import fs from "fs";
import path from "path";
import { UserModel } from "../models/userModel";
import { NavigationPlanModel } from "../models/navigationPlanModel";


// Percorsi ai file SQL per migrazioni e seed
const MIGRATION_PATH = path.join(process.cwd(), "src", "db", "init", "migration.sql");
const SEED_PATH = path.join(process.cwd(), "src", "db", "init", "seed.sql");

class DatabaseConnection {
  /** Istanza unica di Sequelize */
  private static instance: Sequelize;

  /** Costruttore privato (pattern Singleton) */
  private constructor() {}

  /**
   * Restituisce l’unica istanza di Sequelize.
   * Se non esiste, viene creata e configurata.
   */
  public static getInstance(): Sequelize {
    if (!DatabaseConnection.instance) {
      const DB_NAME = process.env.DB_NAME;
      const DB_USER = process.env.DB_USER;
      const DB_PASSWORD = process.env.DB_PASSWORD;
      const DB_HOST = process.env.DB_HOST;
      const DB_DIALECT: Dialect = (process.env.DB_DIALECT as Dialect) || "postgres";

      if (!DB_NAME || !DB_USER || !DB_PASSWORD || !DB_HOST) {
        throw new Error("Errore: variabili d'ambiente per il DB mancanti.");
      }

      const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
        host: DB_HOST,
        dialect: DB_DIALECT,
        logging: false,
        define: { freezeTableName: true }, // Evita pluralizzazione automatica
      });

      // Inizializzazione dei modelli ORM
      UserModel.initModel(sequelize);
      NavigationPlanModel.initModel(sequelize);

      DatabaseConnection.instance = sequelize;
    }

    return DatabaseConnection.instance;
  }
}

/**
 * Esegue migrazioni e seed SQL.
 * Utilizzata all'avvio dell'app per creare schema e dati iniziali.
 */
export async function runSqlMigrations(): Promise<void> {
  const sequelize = DatabaseConnection.getInstance();

  try {
    await sequelize.authenticate();
    console.log("STATUS: Connessione al database stabilita.");

    // Esegue il file di migrazione, se presente
    if (fs.existsSync(MIGRATION_PATH)) {
      const migrationSQL = fs.readFileSync(MIGRATION_PATH, "utf8");
      await sequelize.query(migrationSQL, { raw: true, multipleStatements: true } as any);
      console.log("STATUS: Migrazione SQL completata.");
    } else {
      console.warn("WARNING: File di migrazione non trovato:", MIGRATION_PATH);
    }

    // Esegue il file di seed, se presente
    if (fs.existsSync(SEED_PATH)) {
      const seedSQL = fs.readFileSync(SEED_PATH, "utf8");
      await sequelize.query(seedSQL, { raw: true, multipleStatements: true } as any);
      console.log("STATUS: Seed SQL eseguito correttamente.");
    } else {
      console.warn("WARNING: File di seed non trovato:", SEED_PATH);
    }

  } catch (error: any) {
    // Ignora errori di duplicati o tabelle già create
    if (error.message?.includes("already exists") || error.message?.includes("duplicate key")) {
      console.log("INFO: Schema o dati già presenti, operazione saltata.");
    } else {
      console.error("FATAL ERROR: Impossibile completare migrazione/seed:", error.message);
      throw error;
    }
  }
}

export default DatabaseConnection;