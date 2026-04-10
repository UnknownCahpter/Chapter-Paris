// ============================================================
// tripConfig.tsx — thin re-export
// ============================================================
// App.tsx and other consumers import from here unchanged.
// To configure a new city, edit:
//   - src/config/city.config.ts  (all config values)
//   - src/data/[city]/            (all city data)
// ============================================================

export * from './trip.types';
export { tripConfig, firebaseNamespace } from './city.config';
