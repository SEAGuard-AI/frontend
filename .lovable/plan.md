

# Revision Plan for ADRRS

## Changes Overview

There are 6 distinct revisions to implement across multiple files. Here's the plan:

---

## 1. Onboarding Page — Swipeable Slides

**Problem:** Users can't swipe between slides manually; only button-based navigation exists.

**Solution:** Add touch gesture support (swipe left/right) using `touchstart`/`touchend` event listeners on the slide container. Track touch X coordinates and trigger `setCurrent` accordingly. Keep the dots and buttons as-is.

**File:** `src/pages/OnboardingPage.tsx`
- Add `onTouchStart`/`onTouchEnd` handlers with a 50px swipe threshold
- Animate slide transitions with CSS transition on opacity/transform

---

## 2. Homepage UI Overhaul — Visual, Image-Rich, Better Color Balance

**Problem:** Homepage is text-heavy, monotonous dark cards, no images, visually dull.

**Solution:** Complete visual redesign of `HomePage.tsx`:

- **News cards:** Add prominent image thumbnails (using Unsplash placeholder URLs for disaster-related images). Local news gets a hero-style card with large image; global news uses horizontal image+text cards.
- **Section differentiation:** Use distinct background accent bands — e.g., danger-tinted section for critical alerts, dark neutral for news, subtle colored headers per segment.
- **Risk Forecast:** Change from vertical stacked cards to a **horizontal scrollable row** of compact country cards with flag, risk indicator, and brief text.
- **ASEAN Status grid:** When a country is tapped, navigate to a **new dedicated page** (`/country/:name`) instead of a bottom sheet.
- **Survival Guide:** When tapped, navigate to a **new dedicated page** (`/guide/:id`) with WikiHow-style step-by-step layout (step number → image placeholder → instruction text).
- **Overall:** Better spacing, section dividers, accent color bands for visual rhythm.

**Files:**
- `src/pages/HomePage.tsx` — Major rewrite
- `src/data/mockData.ts` — Add real-looking placeholder image URLs to `disasterNews`, add `imageUrl` fields to `survivalTips` steps

---

## 3. New Country Detail Page (`/country/:name`)

**Problem:** Clicking a country in ASEAN Status opens a bottom sheet. User wants a full page with overview, related news, and a map segment linking to the Map page.

**Solution:** Create `src/pages/CountryDetailPage.tsx`:
- Country flag + name header with alert level badge
- Stats cards (active disasters, affected population)
- Recent events timeline
- Risk forecast section
- Related news cards (filtered from `disasterNews`)
- **Mini map preview** (small static Leaflet map showing the country's disaster zones) with a "View Full Map" button that navigates to `/map` (could set a query param or context to auto-center on that country)
- Back button navigation

**Files:**
- `src/pages/CountryDetailPage.tsx` — New file
- `src/App.tsx` — Add route `/country/:name`

---

## 4. New Survival Guide Detail Page (`/guide/:id`)

**Problem:** Survival tips expand inline as small text. User wants WikiHow-style step pages with images.

**Solution:** Create `src/pages/GuideDetailPage.tsx`:
- Full-page layout with guide title and icon
- Each step rendered as a numbered card: step number badge → placeholder illustration image → instruction text
- Clean, scannable layout with generous spacing
- Back button

**Files:**
- `src/pages/GuideDetailPage.tsx` — New file
- `src/data/mockData.ts` — Add `imageUrl` to each step in `survivalTips`
- `src/App.tsx` — Add route `/guide/:id`

---

## 5. Profile Page — Richer Status with Mini Map & Evacuation CTA

**Problem:** Profile page is sparse. Needs location visualization and actionable guidance.

**Solution:** Enhance `ProfilePage.tsx`:
- **Mini Leaflet map** (200px height) showing user's current position with the surrounding zone colored by status level
- **Status card** with zone level prominently displayed, zone name, and description
- If status is `caution` or `danger`: show a prominent **"Get Evacuation Guide"** button (styled in zone color) that navigates to `/evacuation` → AR flow
- Keep existing stats grid and logout button
- Add emergency contacts summary (nearest 2 contacts with one-tap call)

**File:** `src/pages/ProfilePage.tsx`

---

## 6. Risk Forecast — Horizontal Scroll Layout

**Problem:** Risk forecast is vertical stacked cards, looks generic.

**Solution:** In `HomePage.tsx`, render forecast as a horizontal scrollable strip of compact cards. Each card shows: country flag (large), country name, disaster type icon, a colored risk bar/indicator, and 1-line prediction text. Cards have subtle gradient backgrounds based on alert level.

**File:** Already part of the HomePage rewrite (item 2).

---

## Technical Notes

- New Leaflet mini-maps (Profile, Country Detail) will be small embedded maps initialized with `zoomControl: false`, `dragging: false`, `scrollWheelZoom: false` for a static preview feel.
- Image URLs will use Unsplash source URLs (`https://images.unsplash.com/...`) with disaster/nature themes as realistic placeholders.
- New routes added to `App.tsx` will be inside the `ProtectedRoute > SetupGuard > AppLayout` wrapper.
- Touch swipe uses vanilla JS touch events — no additional dependency needed.

