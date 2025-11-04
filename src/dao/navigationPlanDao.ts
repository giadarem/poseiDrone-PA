import { PlanStatus } from "../enum/planStatus";
import { NavigationPlanModel } from "../models/navigationPlanModel";

export const navigationPlanDAO = {
  /**
   * Crea un nuovo piano di navigazione
   */
  async createPlan(data: {
    userId: string;
    boatCode: string;
    routeWaypoints: any; 
    startDate: Date;
    expectedEndDate?: Date | null;
    status?: PlanStatus;
    requestCost?: number;
    tokensDebited?: number;
    rejectionReason?: string | null;
  }) {
    const plan = await NavigationPlanModel.create({
      userId: data.userId,
      boatCode: data.boatCode,
      routeWaypoints: data.routeWaypoints,
      startDate: data.startDate,
      expectedEndDate: data.expectedEndDate ?? null,
      status: data.status ?? PlanStatus.Pending,
      requestCost: data.requestCost ?? 5,
      tokensDebited: data.tokensDebited ?? 2,
      rejectionReason: data.rejectionReason ?? null,
    });

    return plan;
  },

  /**
   * Trova un piano per ID
   */
  async findById(id: string) {
    return await NavigationPlanModel.findByPk(id);
  },

  /**
   * Trova tutti i piani di un utente
   */
  async findByUser(userId: string) {
    return await NavigationPlanModel.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });
  },

  /**
   * Aggiorna lo stato di un piano
   */
  async updateStatus(
    id: string,
    status: PlanStatus,
    rejectionReason?: string | null
  ) {
    const [rowsUpdated] = await NavigationPlanModel.update(
      {
        status,
        rejectionReason: rejectionReason ?? null,
      },
      {
        where: { id },
        returning: true, // restituisce il record aggiornato
      }
    );

    if (rowsUpdated === 0) {
      throw new Error("Piano non trovato o non aggiornato");
    }

    return await NavigationPlanModel.findByPk(id);
  },

  /**
   * Cancella un piano (solo se pending)
   */
  async cancelPlan(id: string) {
    const plan = await NavigationPlanModel.findByPk(id);

    if (!plan) {
      throw new Error("Piano non trovato");
    }

    if (plan.status !== PlanStatus.Pending) {
      throw new Error("Solo i piani in stato 'pending' possono essere cancellati");
    }

    plan.status = PlanStatus.Cancelled;
    await plan.save();

    return plan;
  },
};
