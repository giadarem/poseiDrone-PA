import express from "express";
import dotenv from "dotenv";
import DatabaseConnection, { runSqlMigrations } from "./db/connection";
import baseRoute from "./routes/baseRoute";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(baseRoute);

const startServer = async () => {
  try {
    // 🔹 Inizializza la connessione al DB
    DatabaseConnection.getInstance();

    // 🔹 Esegui le migrazioni e il seeding SQL
    await runSqlMigrations();

    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (error) {
    console.error("Errore di avvio:", error);
    process.exit(1);
  }
};

startServer();
