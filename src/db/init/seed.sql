
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
