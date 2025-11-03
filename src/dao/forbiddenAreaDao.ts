// src/dao/ForbiddenAreaDAO.ts
/**
 * Data Access Object (DAO) per il modello ForbiddenAreaModel.
 * Gestisce l'accesso diretto al database per le entità delle aree vietate.
 * NOTA: Le query di validazione temporale (validFrom/validTo) sono implementate qui.
 */
import { ForbiddenAreaModel, ForbiddenAreaAttributes } from "../models/forbiddenAreaModel";
import { Op, WhereOptions } from 'sequelize';

export class ForbiddenAreaDAO {
    
    // NOTA: Non usiamo 'static' per permettere la Dependency Injection in Repository (anche se qui è omessa).
    constructor() {}

    /**
     * Recupera tutte le Aree Vietate ATIVE nel database.
     * Un'area è attiva se la data attuale è compresa tra validFrom e validTo, o se le date sono NULL.
     */
    async findActiveAreas(): Promise<ForbiddenAreaModel[]> {
        
        const now = new Date();
        
        // Condizione per considerare un'area attiva (valida_dal <= NOW AND valida_al >= NOW, oppure NULL)
        const whereCondition: WhereOptions = {
            [Op.and]: [
                // Condizione 1: (valida_dal IS NULL OR valida_dal <= NOW)
                {
                    validFrom: { [Op.or]: [{ [Op.is]: null }, { [Op.lte]: now }] }
                },
                // Condizione 2: AND (valida_al IS NULL OR valida_al >= NOW)
                {
                    validTo: { [Op.or]: [{ [Op.is]: null }, { [Op.gte]: now }] }
                },
            ],
        };
        
        // Esegue la query filtrando per la condizione di attività temporale.
        return await ForbiddenAreaModel.findAll({
            where: whereCondition,
            raw: true, // Ritorna oggetti JavaScript semplici
        });
    }

    /**
     * Crea un nuovo record Area Vietata. (Usato tipicamente dal Controller Operatore [O]).
     */
    async createArea(data: Partial<ForbiddenAreaAttributes>): Promise<ForbiddenAreaModel> {
        return await ForbiddenAreaModel.create(data as any);
    }
    
    // Metodo getByOperator, update, e delete andrebbero aggiunti per il CRUD completo dell'Operatore.
}

export const forbiddenAreaDAO = new ForbiddenAreaDAO();