/**
 * Enum PlanStatus
 * -----------------
 * Rappresenta gli stati possibili di un piano di navigazione.
 * Usato sia a livello ORM che nel database SQL (ENUM Postgres).
 */

export enum PlanStatus {
  Pending = "pending",      // In attesa di approvazione
  Accepted = "accepted",    // Approvato dall’operatore
  Rejected = "rejected",    // Rifiutato (ha motivazione obbligatoria)
  Cancelled = "cancelled",  // Cancellato dall’utente
}
