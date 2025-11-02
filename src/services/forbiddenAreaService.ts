/**
 * Service per la gestione delle aree vietate.
 * Si occupa di logiche di business aggiuntive (es. validità temporale).
 */

import { forbiddenAreaDAO } from "../dao/forbiddenAreaDao";
import { ForbiddenAreaModel } from "../models/forbiddenAreaModel";

export class ForbiddenAreaService {
  async getAreeVietateAttive(): Promise<ForbiddenAreaModel[]> {
    const now = new Date();
    const all = await forbiddenAreaDAO.findAll();
    return all.filter(area =>
      (!area.valid_from || area.valid_from <= now) &&
      (!area.valid_to || area.valid_to >= now)
    );
  }

  async createArea(data: Partial<ForbiddenAreaModel>): Promise<ForbiddenAreaModel> {
    return await forbiddenAreaDAO.createArea(data);
  }
}

export const forbiddenAreaService = new ForbiddenAreaService();
