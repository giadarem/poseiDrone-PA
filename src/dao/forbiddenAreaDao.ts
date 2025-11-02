import { ForbiddenAreaModel, ForbiddenAreaAttributes } from "../models/forbiddenAreaModel";

/**
 * DAO per la gestione delle aree vietate.
 */
export class ForbiddenAreaDAO {
  async findAll(): Promise<ForbiddenAreaModel[]> {
    return await ForbiddenAreaModel.findAll();
  }

  async createArea(data: Partial<ForbiddenAreaAttributes>): Promise<ForbiddenAreaModel> {
    return await ForbiddenAreaModel.create(data as any);
  }
}

export const forbiddenAreaDAO = new ForbiddenAreaDAO();
