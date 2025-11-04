// src/utils/geo.ts
export type Waypoint = { lat: number; lon: number };

/**
 * Converte un array di waypoint in un oggetto GeoJSON LineString.
 * Esegue anche una validazione di base:
 * - minimo 4 punti
 * - primo e ultimo punto devono coincidere (rotta chiusa)
 */
export function waypointsToLineString(points: Waypoint[]) {
  if (!Array.isArray(points) || points.length < 4) {
    throw new Error("La rotta deve avere almeno 4 punti e deve essere chiusa");
  }

  const first = points[0];
  const last = points[points.length - 1];
  if (first.lat !== last.lat || first.lon !== last.lon) {
    throw new Error("Primo e ultimo waypoint devono coincidere (rotta chiusa)");
  }

  return {
    type: "LineString",
    coordinates: points.map((p) => [p.lon, p.lat]),
  };
}
