export type Ruolo = "utente" | "operatore" | "amministratore";

export interface UserPayload {
  sub: string;            // user id
  email: string;
  ruolo: Ruolo;
  token_residui: number;  // richiesto dalla logica di token residui
  iat?: number;
  exp?: number;
}

export function validateUserPayload(obj: any): UserPayload {
  if (!obj || typeof obj !== "object") throw new Error("Invalid JWT payload");
  const { sub, email, ruolo, token_residui } = obj;
  if (!sub || !email || !ruolo || token_residui === undefined) throw new Error("Missing JWT claims");
  if (!["utente", "operatore", "amministratore"].includes(ruolo)) throw new Error("Invalid role");
  return obj as UserPayload;
}
