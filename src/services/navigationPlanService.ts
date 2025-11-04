import { navigationPlanDAO } from "../dao/navigationPlanDao";
import { ErrorFactory } from "../factories/errorFactory";
import { PlanStatus } from "../enum/planStatus";
import { UserModel } from "../models/userModel";

const REQUEST_COST = Number(process.env.REQUEST_COST) || 5;
const NAVIGATION_COST = Number(process.env.NAVIGATION_COST) || 2;
const MIN_HOURS_BEFORE_START = Number(process.env.MIN_HOURS_BEFORE_START) || 48;

export const navigationPlanService = {
  /**
   * Crea un nuovo piano di navigazione
   * (La rotta è già convertita in GeoJSON dal controller)
   */
  async createPlan(
    userId: string,
    boatCode: string,
    routeGeo: any, 
    startDate: Date,
    expectedEndDate?: Date | null
  ) {
    // Trova utente
    const user = await UserModel.findByPk(userId);
    if (!user) throw ErrorFactory.notFound("Utente non trovato");

    // Controlla credito
    if (user.token_residui < REQUEST_COST)
      throw ErrorFactory.unauthorized("Token insufficienti per creare la richiesta.");

    // Controlla date
    const now = new Date();
    const minStart = new Date(now.getTime() + MIN_HOURS_BEFORE_START * 3600 * 1000);

    if (startDate < minStart) {
      throw ErrorFactory.validationError(
        `La partenza deve essere almeno ${MIN_HOURS_BEFORE_START} ore da ora.`
      );
    }

    if (expectedEndDate && expectedEndDate <= startDate) {
      throw ErrorFactory.validationError("La fine deve essere successiva all’inizio.");
    }

    // Scala token utente e salva
    user.token_residui -= REQUEST_COST;
    await user.save();

    //  Crea piano nel DB (dati già pronti)
    const plan = await navigationPlanDAO.createPlan({
      userId,
      boatCode,
      routeWaypoints: routeGeo, 
      startDate,
      expectedEndDate,
      status: PlanStatus.Pending,
      requestCost: REQUEST_COST,
      tokensDebited: NAVIGATION_COST,
      rejectionReason: null,
    });

    return plan;
  },
};
