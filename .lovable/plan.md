

# Fix Plan: Profile Page Crash, Country Detail Crash, and Feature Additions

## Root Cause Analysis

The Profile page and Country Detail page both crash with a fatal React error:
```
TypeError: render2 is not a function (at updateContextConsumer)
```

This is caused by **`react-leaflet`'s declarative components** (`MapContainer`, `TileLayer`, `Circle`, `Marker`) being incompatible with React 18. The `MapContainer` internally uses a legacy React context consumer pattern that crashes the entire React tree.

**Proof:** `MapPage.tsx` and `EvacuationPage.tsx` work perfectly because they use Leaflet directly via `useRef` + `useEffect` (imperative API). `ProfilePage.tsx` and `CountryDetailPage.tsx` both import `MapContainer` from `react-leaflet` and crash.

---

## Changes Required

### 1. Fix ProfilePage.tsx (Critical - Crash Fix + Content)

**Problem:** Blank page due to `react-leaflet` `MapContainer` crash.

**Fix:** Rewrite the mini-map to use imperative Leaflet API (same pattern as MapPage.tsx), wrapped in a `useRef` div + `useEffect` that creates/destroys the map instance.

**Content that will be present after fix:**
- User info section (name, email, country)
- Location display with address, coordinates, Edit Location button, Share Location button
- Location search panel (Nominatim API) when editing
- Mini Leaflet map (imperative, 176px height) showing user position marker + nearby zone circles
- Current status card (Safe/Caution/Danger with zone color, description)
- Evacuation Guide CTA button (visible only when caution/danger)
- Quick stats grid (unread alerts, active zones, shelters)
- Nearest emergency contacts (2 contacts with one-tap call)
- Language switcher (all 6 ASEAN languages, grid layout)
- Sign Out button

**Share Location:** Uses `navigator.share()` with Google Maps link fallback to clipboard copy.

**Edit Location:** Auto-syncs the country preference based on reverse geocoding the new coordinates.

### 2. Fix CountryDetailPage.tsx (Critical - Crash Fix)

**Problem:** Same `MapContainer` crash causes blank page when clicking any country from ASEAN Status.

**Fix:** Rewrite the mini-map section to use imperative Leaflet API. Keep all existing content (header, stats, forecast, recent events, map, related news, reports).

### 3. Minor Fixes

- **Duplicate key warning:** The language selector in ProfilePage uses `lang.name` as key, but Malaysia and Brunei both have `name: 'Malay'`. Fix by using `lang.country` (from the mapping) or a unique identifier instead.

---

## Technical Approach

Both mini-maps will follow this pattern (already proven working in MapPage.tsx):

```text
const mapRef = useRef<HTMLDivElement>(null);
const mapInstance = useRef<L.Map | null>(null);

useEffect(() => {
  if (!mapRef.current || mapInstance.current) return;
  const map = L.map(mapRef.current, { center, zoom, zoomControl: false, ... });
  L.tileLayer(darkTileUrl).addTo(map);
  // Add circles, markers imperatively
  mapInstance.current = map;
  return () => { map.remove(); mapInstance.current = null; };
}, [center]);

<div ref={mapRef} className="h-44 w-full" />
```

No imports from `react-leaflet` will be used. Only `leaflet` directly.

### Files Modified
- `src/pages/ProfilePage.tsx` -- Remove `react-leaflet` imports, rewrite map to imperative Leaflet, fix duplicate key
- `src/pages/CountryDetailPage.tsx` -- Remove `react-leaflet` imports, rewrite map to imperative Leaflet

No new files or dependencies needed.

