# Chapter Paris — Codex Execution Plan

## Context

巴黎旅行 web app，基於 `chapter-trip-template`（React 19 + TypeScript + Vite）。
大部分工作已完成（data files、CSS variables、dining tabs）。
以下是剩餘的 3 個 task。

**Working directory:** `/Users/marcoproto/Desktop/Unknown Chapter/Chapter Paris/`

---

## Task 1: Journey Tab Placeholder

**目標：** Journey tab 目前渲染完整 itinerary UI（day selector、location cards），但 itinerary data 是空的 placeholder。改為顯示簡潔 placeholder message + 保留 WeatherWidget。

**檔案：** `src/App.tsx`

**找到這段代碼（約 line 962）：**
```tsx
{activeTab === 'journey' && (
  <div className="day-list">
    <WeatherWidget />

    {/* Day Selector Slide Bar */}
    <div className="day-selector">
```

**替換整個 `{activeTab === 'journey' && (...)}` block** 為：
```tsx
{activeTab === 'journey' && (
  <div className="day-list">
    <WeatherWidget />
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1.5rem',
      textAlign: 'center',
      gap: '0.5rem',
    }}>
      <span style={{ fontSize: '2.5rem' }}>🗼</span>
      <h3 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '1.3rem',
        color: 'var(--color-ink)',
        margin: 0,
      }}>Itinerary Coming Soon</h3>
      <p style={{
        fontSize: '0.92rem',
        color: 'var(--color-ink-light)',
        margin: 0,
      }}>Your Paris journey will appear here</p>
    </div>
  </div>
)}
```

**重要：** 這個 block 很長（約 line 962 到結束 `activeTab === 'journey'` 的 `)}` 結尾）。你需要找到這整個 conditional block 的結尾——它在 `{activeTab === 'wallet' && (` 之前。替換從 `{activeTab === 'journey' && (` 到它的閉合 `)}` 的全部內容。

**驗證：** `npx tsc --noEmit` 零錯誤。App 的 Journey tab 顯示 weather widget + placeholder text。

---

## Task 2: App.tsx Inline Color Cleanup

**目標：** 清理 App.tsx 中剩餘的 3 處 hardcoded color。

**檔案：** `src/App.tsx`

### 2a. Phrase button tap color

**找到：**
```tsx
whileTap={{ scale: 0.95, backgroundColor: "#FFF9F3" }}
```
**替換為：**
```tsx
whileTap={{ scale: 0.95 }}
```
（移除 hardcoded backgroundColor，tap feedback 由 scale 足夠）

### 2b. Rate status badge

**找到：**
```tsx
background: rateStatus === 'live' ? '#E6FFFA' : '#FFFBEB',
color: rateStatus === 'live' ? '#2C7A7B' : '#B7791F',
```
**替換為：**
```tsx
background: rateStatus === 'live' ? 'rgba(201, 169, 110, 0.12)' : 'rgba(157, 150, 142, 0.12)',
color: rateStatus === 'live' ? 'var(--color-gold)' : 'var(--color-muted)',
```
（用 Paris gold palette 替代原本的 teal/amber）

**驗證：** `npx tsc --noEmit` 零錯誤。Wallet tab 的 rate badge 顯示金色調。

---

## Task 3: Filter Bar（Cuisine + Area）

**目標：** 在 DiningSection 的 subtab 下方加入 filter bar，讓用家按菜式和地區快速篩選 venues。只在 Restaurant 和 Cafe tab 顯示，Grocery tab 隱藏。

**檔案：** `src/components/DiningSection.tsx` + `src/components/DiningSection.css`

### 3a. DiningSection.tsx — 加入 filter state 和邏輯

在 `DiningSection` component 裡面，`const venues = tripConfig.venues ?? [];` 之後，加入以下 state 和 memo：

```tsx
// ── Filter state ──────────────────────────────────────
const [activeCuisineFilters, setActiveCuisineFilters] = useState<string[]>([]);
const [activeAreaFilters, setActiveAreaFilters] = useState<string[]>([]);

// Reset filters when switching subtabs
useEffect(() => {
  setActiveCuisineFilters([]);
  setActiveAreaFilters([]);
}, [activeSubTab]);

// Extract unique cuisine tags from venues in current tab
const cuisineOptions = useMemo(() => {
  const tags = new Set<string>();
  venues
    .filter((v) => v.tab === activeSubTab)
    .forEach((v) => {
      v.category.split(',').map((s) => s.trim()).filter(Boolean).forEach((tag) => tags.add(tag));
    });
  return [...tags].sort();
}, [activeSubTab, venues]);

// Extract unique arrondissement areas from venue addresses
const ARRONDISSEMENT_LABELS: Record<string, string> = {
  '75001': '1er (Louvre)',
  '75002': '2e (Bourse)',
  '75003': '3e (Le Marais)',
  '75004': '4e (Le Marais)',
  '75005': '5e (Latin Quarter)',
  '75006': '6e (Saint-Germain)',
  '75007': '7e (Eiffel Tower)',
  '75008': '8e (Champs-Élysées)',
  '75009': '9e (Opéra)',
  '75010': '10e (Canal St-Martin)',
  '75011': '11e (Bastille)',
  '75012': '12e (Bercy)',
  '75016': '16e (Trocadéro)',
  '75018': '18e (Montmartre)',
};

const extractArrondissement = (address?: string): string | null => {
  if (!address) return null;
  const match = address.match(/750\d{2}/);
  if (!match) return null;
  return ARRONDISSEMENT_LABELS[match[0]] ?? null;
};

const areaOptions = useMemo(() => {
  const areas = new Set<string>();
  venues
    .filter((v) => v.tab === activeSubTab)
    .forEach((v) => {
      const area = extractArrondissement(v.address);
      if (area) areas.add(area);
    });
  return [...areas].sort();
}, [activeSubTab, venues]);

const toggleFilter = (
  current: string[],
  setter: React.Dispatch<React.SetStateAction<string[]>>,
  value: string,
) => {
  setter(current.includes(value) ? current.filter((v) => v !== value) : [...current, value]);
};
```

### 3b. 修改 filteredVenues memo — 加入 filter 邏輯

**找到現有的 `filteredVenues` memo：**
```tsx
const filteredVenues = useMemo(
  () => venues.filter((venue) => (
    venue.tab === activeSubTab
    && !(activeSubTab !== 'restaurant' && hasMatchingRestaurant(allRestaurants, venue))
  )),
  [activeSubTab, allRestaurants, venues],
);
```

**替換為：**
```tsx
const filteredVenues = useMemo(
  () => venues.filter((venue) => {
    if (venue.tab !== activeSubTab) return false;
    if (activeSubTab !== 'restaurant' && hasMatchingRestaurant(allRestaurants, venue)) return false;

    // Apply cuisine filter (OR within dimension)
    if (activeCuisineFilters.length > 0) {
      const venueCuisines = venue.category.split(',').map((s) => s.trim());
      if (!activeCuisineFilters.some((f) => venueCuisines.includes(f))) return false;
    }

    // Apply area filter (OR within dimension)
    if (activeAreaFilters.length > 0) {
      const venueArea = extractArrondissement(venue.address);
      if (!venueArea || !activeAreaFilters.includes(venueArea)) return false;
    }

    return true;
  }),
  [activeSubTab, activeCuisineFilters, activeAreaFilters, allRestaurants, venues],
);
```

### 3c. 在 JSX 中加入 filter bar UI

在 subtabs `</div>` 和 `<section className="dining-guide-card">` 之間插入 filter bar：

**找到：**
```tsx
      </div>

      <section className="dining-guide-card" aria-label="Local dining guide">
```

**在中間插入：**
```tsx
      </div>

      {(activeSubTab === 'restaurant' || activeSubTab === 'cafe') && (cuisineOptions.length > 0 || areaOptions.length > 0) && (
        <div className="dining-filter-bar">
          {cuisineOptions.length > 0 && (
            <div className="dining-filter-row">
              <span className="dining-filter-label">Cuisine</span>
              <div className="dining-filter-pills">
                {cuisineOptions.map((cuisine) => (
                  <button
                    key={cuisine}
                    type="button"
                    className={`dining-filter-pill ${activeCuisineFilters.includes(cuisine) ? 'active' : ''}`}
                    onClick={() => toggleFilter(activeCuisineFilters, setActiveCuisineFilters, cuisine)}
                  >
                    {cuisine}
                  </button>
                ))}
              </div>
            </div>
          )}
          {areaOptions.length > 0 && (
            <div className="dining-filter-row">
              <span className="dining-filter-label">Area</span>
              <div className="dining-filter-pills">
                {areaOptions.map((area) => (
                  <button
                    key={area}
                    type="button"
                    className={`dining-filter-pill ${activeAreaFilters.includes(area) ? 'active' : ''}`}
                    onClick={() => toggleFilter(activeAreaFilters, setActiveAreaFilters, area)}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <section className="dining-guide-card" aria-label="Local dining guide">
```

### 3d. 加入 empty state

**找到 `<div className="dining-section-grid">` 後面的內容，在整個 grid 的 closing `</div>` 之前加入 empty state。**

**找到：**
```tsx
            : displayVenues.map((venue, index) => (
```

**這段邏輯結束後（grid 的 closing `</div>` 之前），加入 empty state。整個 grid block 應改為：**

在 `<div className="dining-section-grid">` 和 `</div>` 之間，替換為：

```tsx
      <div className="dining-section-grid">
        {activeSubTab === 'restaurant' && loading
          ? Array.from({ length: SKELETON_COUNT }, (_, i) => (
              <DiningSkeletonCard key={i} />
            ))
          : activeSubTab === 'restaurant'
            ? displayRestaurants.length > 0
              ? displayRestaurants.map((restaurant, index) => (
                <motion.div
                  key={restaurant.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.36, delay: index * 0.06 }}
                >
                  <DiningCard restaurant={restaurant} />
                </motion.div>
                ))
              : (
                <p className="dining-empty-state">No results — try adjusting your filters</p>
              )
            : displayVenues.length > 0
              ? displayVenues.map((venue, index) => (
                <motion.div
                  key={`${venue.city}-${venue.name}`}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.36, delay: index * 0.06 }}
                >
                  <VenueCard
                    venue={venue}
                    images={venueImages[`${venue.city}:${venue.name}`] ?? []}
                    showReservation={activeSubTab === 'restaurant'}
                  />
                </motion.div>
              ))
              : (
                <p className="dining-empty-state">No results — try adjusting your filters</p>
              )}
      </div>
```

**注意：** restaurant tab 的 filter 需要也套用到 `displayRestaurants`。目前 `displayRestaurants` 是從 Firestore data 來的，filter 只套用在 `filteredVenues`。需要在 `displayRestaurants` 的 memo 也加入 filter：

**找到 `displayRestaurants` 的 useMemo（目前在 `.sort(...)` 結尾）：**

在 `.sort((a, b) => ...)` 之前，加入 filter：

```tsx
const displayRestaurants = useMemo(
  () => visibleRestaurants.map((restaurant) => {
    const matchedVenue = findMatchingRestaurantVenue(venues, restaurant.name, restaurant.city);
    const googleMapsUrl = matchedVenue?.googleMapsUrl
      ?? restaurant.googleMapsUrl
      ?? buildGoogleMapsSearchUrl(restaurant.name, matchedVenue?.address ?? restaurant.address);
    const reservationUrl = matchedVenue?.reservationUrl ?? googleMapsUrl;

    return {
      ...restaurant,
      address: matchedVenue?.address ?? restaurant.address,
      googleMapsUrl,
      reservationUrl,
      remark: matchedVenue?.remark,
      isMarcosPick: matchedVenue?.isMarcosPick ?? false,
      category: matchedVenue?.category ?? '',
      images: photoOverrides[`restaurant:${restaurant.id}`] ?? restaurant.images,
    };
  })
  .filter((restaurant) => {
    // Apply cuisine filter
    if (activeCuisineFilters.length > 0) {
      const cuisines = restaurant.category.split(',').map((s: string) => s.trim());
      if (!activeCuisineFilters.some((f) => cuisines.includes(f))) return false;
    }
    // Apply area filter
    if (activeAreaFilters.length > 0) {
      const area = extractArrondissement(restaurant.address);
      if (!area || !activeAreaFilters.includes(area)) return false;
    }
    return true;
  })
  .sort((a, b) => Number(b.isMarcosPick ?? false) - Number(a.isMarcosPick ?? false)),
  [activeCuisineFilters, activeAreaFilters, photoOverrides, venues, visibleRestaurants],
);
```

### 3e. DiningSection.css — Filter bar styles

**在檔案末尾（`@media` query 之前）加入：**

```css
/* ── Filter Bar ───────────────────────────────────────── */

.dining-filter-bar {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.dining-filter-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dining-filter-label {
  flex-shrink: 0;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--color-muted);
  min-width: 52px;
}

.dining-filter-pills {
  display: flex;
  gap: 0.45rem;
  overflow-x: auto;
  padding-bottom: 0.15rem;
  scrollbar-width: none;
}

.dining-filter-pills::-webkit-scrollbar {
  display: none;
}

.dining-filter-pill {
  border: 0;
  border-radius: 999px;
  padding: 0.45rem 0.75rem;
  background: var(--color-soft-surface);
  color: var(--color-ink);
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.dining-filter-pill.active {
  background: var(--color-ink);
  color: #fff;
}

.dining-filter-pill:active {
  transform: scale(0.97);
}

.dining-empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 2rem 1rem;
  font-size: 0.92rem;
  color: var(--color-muted);
}
```

---

## Verification Checklist

完成所有 task 後，依序執行：

```bash
# 1. TypeScript 零錯誤
npx tsc --noEmit

# 2. Vite build 成功
npx vite build

# 3. Dev server 啟動
npm run dev
```

**目視驗證：**
1. Journey tab → 顯示 weather widget + "Itinerary Coming Soon" placeholder
2. Food tab → Restaurant subtab → 看到 filter bar（Cuisine + Area 兩行）
3. Food tab → Cafe subtab → 看到 filter bar
4. Food tab → Grocery subtab → **不顯示** filter bar，只顯示 4 筆 grocery venues
5. 點擊 filter pill → venues 正確篩選
6. 選擇多個 filter → AND 跨維度、OR 同維度
7. 全選到無結果 → 顯示 "No results — try adjusting your filters"
8. 切換 subtab → filter 自動 reset
9. Wallet tab → rate badge 顯示金色調（非原來的 teal）
10. Dark mode 切換 → filter bar 顏色協調
