

# Remove Onboarding & Add Desktop Responsiveness

## What Changes

### 1. Remove Onboarding Flow
- Delete `OnboardingPage.tsx` — the multi-slide feature preview before login is removed
- Update `App.tsx` routing: unauthenticated users go directly to `/login` instead of `/onboarding`
- Update `LoginPage.tsx`: remove the "Don't have an account?" toggle since there's no onboarding funnel; keep it as a clean login/signup page

### 2. Convert AppLayout to Desktop-Responsive
Currently the layout uses a mobile bottom tab bar. For desktop:

```text
┌──────────────────────────────────────────────┐
│  ADRRS Logo          [Bell]  [User Avatar]   │  ← Top navbar (desktop)
├──────────┬───────────────────────────────────┤
│  Home    │                                   │
│  Map     │       Main Content Area           │  ← Sidebar nav (desktop)
│  Contacts│       (Outlet)                    │
│  Profile │                                   │
│          │                                   │
└──────────┴───────────────────────────────────┘

Mobile stays the same (bottom tab bar).
```

- **Desktop (≥1024px)**: Left sidebar navigation with icons + labels, top header bar with logo and notification bell. No bottom bar.
- **Mobile (<1024px)**: Keep current bottom tab bar layout.

### 3. Desktop Content Adjustments
- **HomePage**: Change grid from `grid-cols-2` to responsive `grid-cols-2 lg:grid-cols-3 xl:grid-cols-4` for country status. Constrain content with `max-w-6xl mx-auto`. News cards use side-by-side layout on desktop.
- **AlertsPage**: Add `max-w-4xl mx-auto` container.
- **ContactsPage**: Responsive grid for contact cards `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`.
- **ProfilePage**: Two-column layout on desktop — left column for user info/map, right column for settings.
- **MapPage**: Already full-width, works well. No changes needed.

## Files Modified
1. **`src/pages/OnboardingPage.tsx`** — Delete
2. **`src/App.tsx`** — Remove OnboardingPage import, redirect unauthenticated to `/login`, remove `/onboarding` route
3. **`src/pages/LoginPage.tsx`** — Center on desktop with max-width, keep clean
4. **`src/components/AppLayout.tsx`** — Add responsive sidebar for desktop, keep bottom bar for mobile
5. **`src/pages/HomePage.tsx`** — Responsive grids, max-width container
6. **`src/pages/AlertsPage.tsx`** — Max-width container
7. **`src/pages/ContactsPage.tsx`** — Responsive contact grid
8. **`src/pages/ProfilePage.tsx`** — Two-column layout on desktop

## Technical Notes
- Breakpoint: `lg:` (1024px) for sidebar/bottom-bar switch
- Sidebar width: ~240px, collapsible to icon-only is not in scope (can add later)
- Uses existing Tailwind responsive utilities — no new dependencies

