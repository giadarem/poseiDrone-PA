import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";

import DatabaseConnection, { runSqlMigrations } from "./db/connection";
import authRoutes from "./routes/authRoute";
import navigationPlanRoutes from "./routes/navigationPlanRoute";

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Inizializza il DB e i modelli
(async () => {
  try {
    await runSqlMigrations();          // esegue SQL di setup
    DatabaseConnection.getInstance();  // inizializza UserModel e NavigationPlanModel
    console.log(" Modelli Sequelize inizializzati");
  } catch (err) {
    console.error("Errore inizializzazione DB:", err);
  }
})();

app.use("/auth", authRoutes);
app.use("/plans", navigationPlanRoutes);
app.use("/plans/show", navigationPlanRoutes);
app.use(navigationPlanRoutes);
app.get("/", (req, res) => res.send("API PoseiDrone attiva"));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server in ascolto su http://localhost:${port}`));
