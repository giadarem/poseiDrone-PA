
-- Inserisce utenti di esempio
-- Le password sono hashate con bcrypt (usa valori reali!)


INSERT INTO users (email, password_hash, ruolo, token_residui)
VALUES
-- pw admin123  
  ('admin@example.com', '$2y$10$snCk.UISuVh4T96UpPrxUOk5rK6f07zRUIjIdtMfU4n9TWGhh5CiG', 'Amministratore', 0),
  -- pw: op123
  ('operatore@example.com', '$2b$10$PR6KrW2YV76VFYRBrOis2O7Z4YAPzCgxReaXol8lqeh8hP7kPq3QS', 'Operatore', 0),
  -- pw: user123
  ('utente@example.com', '$2b$10$KbUTPv36U0dcftfVkNIPQ.V5vYryFcq6RJajhA/bADms7suyhRUV2', 'Utente', 10);

INSERT INTO users (id, email, password_hash, ruolo, token_residui)
VALUES ('00000000-0000-0000-0000-000000000000', 'test@example.com', 'hash_fittizio', 'Utente', 100)
ON CONFLICT DO NOTHING;


INSERT INTO "forbiddenAreas" ("boundingBox", "validFrom", "validTo", "operatorId")
VALUES (
  ST_GeomFromText(
    'POLYGON((13.505 43.62, 13.520 43.62, 13.520 43.63, 13.505 43.63, 13.505 43.62))',
    4326
  ),
  NOW(),          -- validFrom: attiva da subito
  NULL,           -- validTo: senza scadenza
  (SELECT id FROM "users" WHERE ruolo = 'Operatore' LIMIT 1) -- assegna l’operatore creato nel seed utenti
);