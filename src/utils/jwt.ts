import fs from "fs/promises";
import * as jwt from "jsonwebtoken";
import { JwtPayload, SignOptions, Algorithm } from "jsonwebtoken"; // Importa i tipi necessari

/**
 * Percorsi e parametri dal file .env
 */
const privatePath = process.env.JWT_PRIVATE_KEY_PATH!;
const publicPath  = process.env.JWT_PUBLIC_KEY_PATH!;
// Usiamo 'as Algorithm' per assicurare il tipo corretto per l'algoritmo.
const algorithm   = (process.env.JWT_ALGORITHM as Algorithm) || "RS256"; 
const expiresIn   = process.env.JWT_EXPIRES_IN || "1h";

// Definisci l'oggetto options con i tipi corretti.
const signOptions: SignOptions = {
    // Il cast 'as SignOptions['expiresIn']' risolve l'errore di tipizzazione per 'expiresIn'.
    expiresIn: expiresIn as SignOptions['expiresIn'], 
    algorithm: algorithm,
};

/**
 * Firma JWT con RS256
 */
export async function signJwt<T extends object>(payload: T): Promise<string> {
    const privateKey = await fs.readFile(privatePath, "utf8");
    // Passiamo l'oggetto options creato con i tipi corretti
    return jwt.sign(payload, privateKey, signOptions); 
}

/**
 * Verifica JWT con RS256
 */
export async function verifyJwt<T = JwtPayload>(token: string): Promise<T> {
    const publicKey = await fs.readFile(publicPath, "utf8");
    return jwt.verify(token, publicKey, { algorithms: [algorithm] }) as T;
}

/**
 * Estrae token dal header Authorization: Bearer <token>
 */
export function extractBearer(header?: string): string {
    if (!header) throw new Error("Header Authorization mancante");
    const [type, token] = header.split(" ");
    if (type !== "Bearer" || !token) throw new Error("Formato Authorization non valido");
    return token;
}