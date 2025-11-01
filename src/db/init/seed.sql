-- ===========================================
-- 02_seed_users.sql
-- Inserisce utenti di esempio
-- Le password sono hashate con bcrypt (usa valori reali!)
-- ===========================================

INSERT INTO users (email, password_hash, ruolo, token_residui)
VALUES
-- pw admin123
  ('admin@example.com', '$2b$10$uWrYwcjFhDNeRkU9tEdWeOhZCRmD2kHEF8T9U9DXqBEXC8kGTPk5C', 'amministratore', 0),
  -- pw: op123
  ('operatore@example.com', '$2b$10$PR6KrW2YV76VFYRBrOis2O7Z4YAPzCgxReaXol8lqeh8hP7kPq3QS', 'operatore', 0),
  -- pw: user123
  ('utente@example.com', '$2b$10$KbUTPv36U0dcftfVkNIPQ.V5vYryFcq6RJajhA/bADms7suyhRUV2', 'utente', 10);
