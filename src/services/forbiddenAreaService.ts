// src/services/ForbiddenAreaService.ts
/**
 * Service Layer per la gestione delle Aree Vietate.
 * Contiene la logica di orchestrazione per la rotta pubblica GET /.
 */

import { ForbiddenAreaDAO, forbiddenAreaDAO } from '../dao/forbiddenAreaDao';
import { ForbiddenAreaRepository } from '../repositories/forbiddenAreaRepository';
import { ForbiddenAreaModel } from '../models/forbiddenAreaModel';
import { ErrorFactory } from '../factories/errorFactory';

// Inizializziamo il Repository qui, collegandolo al DAO
const forbiddenAreaRepository = new ForbiddenAreaRepository(forbiddenAreaDAO); 

export class ForbiddenAreaService {
    
    /**
     * Metodo per la rotta pubblica (senza autenticazione) che restituisce solo le aree attive.
     */
    public async getAreeVietateAttive(): Promise<ForbiddenAreaModel[]> {
        
        try {
            // Chiama il Repository per eseguire la query con il filtro temporale
            const aree = await forbiddenAreaRepository.getActiveAreas();
            
            return aree;
            
        } catch (error) {
            // Se il DB è offline o c'è un errore interno non gestito, solleva 500
            throw ErrorFactory.createError("Impossibile recuperare le aree dal database.", 500);
        }
    }
}
export const forbiddenAreaService = new ForbiddenAreaService();