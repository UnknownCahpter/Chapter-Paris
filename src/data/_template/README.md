# City Data Template

This folder contains blank typed templates for every city data file.

## Setup Steps

1. Copy this `_template/` folder → `src/data/{city}/` (e.g. `src/data/london/`)
2. Fill in each file following the inline comments
3. Copy `city.config.ts` (this template) → `src/config/city.config.ts` and update all `TODO` values
4. See `TEMPLATE_GUIDE.md` (project root) for the full walkthrough

## Files in this folder

| File | What it contains |
|---|---|
| `itinerary.ts` | Day-by-day schedule (dates, times, location names, types, tags) |
| `locations.ts` | Maps location names → Google Maps search addresses |
| `attractions.ts` | Descriptions and tips for locations, shown in story blocks |
| `phrases.ts` | Survival phrases for the Tools tab (spoken aloud on tap) |
| `cheatSheet.ts` | Quick-reference facts for the Tools tab |
| `emergency.ts` | Emergency contacts shown in the SOS panel |
| `venues.ts` | Dining, café, and bar recommendations for the Food & Drink tab |
| `city.config.ts` | Full config — copy to `src/config/city.config.ts` |

## Tips

- **Location name keys in `attractions.ts` and `locations.ts`** must exactly match
  the `name` strings used in `itinerary.ts`. Copy-paste to avoid typos.
- **Transport route entries** in `attractions.ts` use the full location name as the key
  (e.g. `'Train to Airport'`) and their content appears in the route guide modal,
  not the story block.
- **Attraction images**: place them at `public/attractions/{city}/filename.png`
  and reference as `image: '/attractions/{city}/filename.png'`
