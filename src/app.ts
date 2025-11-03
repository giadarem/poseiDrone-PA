import express from "express";
import dotenv from "dotenv";
import DatabaseConnection from "./db/connection";
import  baseRoute  from './routes/baseRoute';
import authRoute from "./routes/authRoute";
import { errorHandler } from "./middlewares/errorMiddleware";
import { ErrorFactory, HttpError } from "./factories/errorFactory";

/**
 * App principale PoseiDrone
 * --------------------------
 * Inizializza Express, la connessione al database e registra le rotte definite per il progetto.
 * Gestisce centralmente gli errori e le rotte non trovate.
 */

const app = express();
const PORT: string = process.env.APP_PORT || "3000";

// Carica variabili d'ambiente
dotenv.config();

/**
 * Middleware per parsing JSON
 */
app.use(express.json());

/**
 * Inizializza connessione al database (Singleton)
 */
DatabaseConnection.getInstance();

/**
 * Avvio del server Express
 */
app.listen(PORT, () => {
  console.log(`Server PoseiDrone avviato su http://localhost:${PORT}`);
});


app.use("/", baseRoute);
app.use(authRoute);

/**
 * Rotta di base (test disponibilità API)
 */
app.get("/", (_req, res) => {
  res.send("API PoseiDrone attiva");
});

/**
 * Middleware per gestire rotte non trovate (404)
 * Usa ErrorFactory per creare un errore HttpError tipizzato.
 */
app.use((req, _res, next) => {
  const msg: string = `Rotta ${req.originalUrl} non trovata`;
  const error: HttpError = ErrorFactory.notFound(msg);
  next(error);
});

/**
 * Middleware globale di gestione errori
 * Deve essere registrato dopo tutte le rotte
 */
app.use(errorHandler);

export default app;
