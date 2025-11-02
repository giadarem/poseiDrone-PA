
-- Estensioni PostGIS e UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;


-- ENUM CUSTOM TYPES

CREATE TYPE user_ruolo AS ENUM ('Utente', 'Operatore', 'Amministratore');
CREATE TYPE request_status AS ENUM ('pending', 'accepted', 'rejected', 'cancelled');


-- USERS (utenti + credito)
CREATE TABLE "users" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "password_hash" VARCHAR(255) NOT NULL,
    "ruolo" user_ruolo NOT NULL DEFAULT 'Utente',
    "token_residui" INTEGER NOT NULL DEFAULT 100,
    "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- FORBIDDEN AREAS 
CREATE TABLE "forbiddenAreas" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "boundingBox" GEOMETRY(Polygon, 4326) NOT NULL,
    "validFrom" TIMESTAMPTZ,
    "validTo" TIMESTAMPTZ,
    "operatorId" UUID, -- definita sotto come FK
    "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Relazione: ogni forbiddenArea può essere creata da un operatore
ALTER TABLE "forbiddenAreas"
ADD CONSTRAINT fk_forbiddenareas_operator
FOREIGN KEY ("operatorId") REFERENCES "users"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;

-- Indice spaziale
CREATE INDEX idx_forbidden_areas_geom ON "forbiddenAreas" USING GIST ("boundingBox");


-- NAVIGATION PLAN (Richieste di navigazione)
CREATE TABLE "navigationPlan" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL,
    "boatCode" VARCHAR(10) NOT NULL,
    "routeWaypoints" GEOMETRY(LineString, 4326) NOT NULL,
    "startDate" TIMESTAMPTZ NOT NULL,
    "expectedEndDate" TIMESTAMPTZ,
    "status" request_status NOT NULL DEFAULT 'pending',
    "requestCost" INTEGER NOT NULL DEFAULT 5,
    "tokensDebited" INTEGER NOT NULL DEFAULT 2,
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Relazione: ogni piano di navigazione appartiene a un utente
ALTER TABLE "navigationPlan"
ADD CONSTRAINT fk_navigationplan_user
FOREIGN KEY ("userId") REFERENCES "users"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

-- Indice spaziale
CREATE INDEX idx_requests_route ON "navigationPlan" USING GIST ("routeWaypoints");
