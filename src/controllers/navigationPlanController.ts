import { Request, Response } from "express";
import { NavigationPlanModel } from "../models/navigationPlanModel";
import { PlanStatus } from "../enum/planStatus";
import { navigationPlanDAO } from "../dao/navigationPlanDao";
import { waypointsToLineString } from "../utils/geo"; 
import { UserModel } from "../models/userModel";
import { TOKEN_RULES } from "../enum/tokenRules";
export const navigationPlanController = {
  /**
   * Crea un nuovo piano di navigazione
   */
  async createPlan(req: Request, res: Response) {
    try {
      const {
        userId,
        boatCode,
        routeWaypoints,
        startDate,
        expectedEndDate,
        status,
        requestCost,
        tokensDebited,
        rejectionReason,
      } = req.body;

      if (!userId || !boatCode || !routeWaypoints || !startDate) {
        return res.status(400).json({ error: "Dati mancanti nel body." });
      }

      // 1. Controllo credito utente
      const user = await UserModel.findByPk(userId);
      if (!user) return res.status(404).json({ error: "Utente non trovato" });

      if (user.token_residui< TOKEN_RULES.MIN_REQUIRED_FOR_PLAN) {
        return res
          .status(401)
          .json({ error: "Token insufficienti per creare un piano di navigazione." });
      }

      // 2. Conversione Waypoints → LineString
      let routeGeo;
      try {
        routeGeo = waypointsToLineString(routeWaypoints);
      } catch (err: any) {
        return res.status(400).json({ error: err.message });
      }

      // 3. Creazione piano di navigazione
      const plan = await NavigationPlanModel.create({
        userId,
        boatCode,
        routeWaypoints: routeGeo,
        startDate,
        expectedEndDate,
        status: status ?? PlanStatus.Pending,
        requestCost: requestCost ?? 5,
        tokensDebited: tokensDebited ?? 2,
        rejectionReason: rejectionReason ?? null,
      });

      // 4. Addebito dei token all’utente
      user.token_residui -= TOKEN_RULES.DEFAULT_PLAN_COST;
      await user.save();

      return res.status(201).json({
        message: "Piano di navigazione creato con successo",
        plan,
        tokensResidui: user.token_residui,
      });
    } catch (err: any) {
      console.error("Errore creazione piano:", err);
      return res.status(500).json({ error: "Errore interno del server" });
    }
  },

  /**
   * Ottiene tutti i piani
   */
  async getAll(req: Request, res: Response) {
    try {
      const plans = await NavigationPlanModel.findAll();
      return res.json(plans);
    } catch (err: any) {
      console.error("Errore lettura piani:", err);
      return res.status(500).json({ error: err.message });
    }
  },

  /**
   * Trova un piano per ID
   */
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const plan = await NavigationPlanModel.findByPk(id);
      if (!plan) return res.status(404).json({ error: "Piano non trovato" });
      return res.json(plan);
    } catch (err: any) {
      console.error("Errore ricerca piano:", err);
      return res.status(500).json({ error: err.message });
    }
  },

  /**
   * Cancella un piano (solo se pending)
   */
  async cancelPlan(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const cancelled = await navigationPlanDAO.cancelPlan(id);

      return res.status(200).json({
        message: "Piano di navigazione cancellato con successo.",
        plan: cancelled,
      });
    } catch (err: any) {
      console.error("Errore cancellazione piano:", err);
      // Se il DAO ha lanciato un errore (piano non trovato o non pending)
      if (err.message.includes("Piano non trovato")) {
        return res.status(404).json({ error: err.message });
      }
      if (err.message.includes("Solo i piani")) {
        return res.status(400).json({ error: err.message });
      }
      return res.status(500).json({ error: "Errore interno del server" });
    }
  },
};
