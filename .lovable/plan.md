

# Light & Dark Mode with Solar Color Palette

## Overview

Add a light/dark theme system. Light mode (default) uses the solar gold palette (#f4bf3a family) with white backgrounds. Dark mode converts whites to dark greys. Theme toggle lives in Profile settings.

## Color Mapping

### Light Theme (Default) — Solar Palette + White
Using the uploaded palette centered on `#f4bf3a`:

| Token | Value | Source |
|-------|-------|--------|
| background | white `0 0% 100%` | white base |
| foreground | `40 10% 10%` | dark olive from palette (#1e1601) |
| card | `45 60% 97%` | very light cream (#fefbf3) |
| card-foreground | `40 10% 10%` | dark olive |
| primary | `43 88% 59%` | hero gold (#f4bf3a) |
| primary-foreground | `40 20% 10%` | dark brown text on gold |
| secondary | `44 70% 93%` | light cream (#fdf3dc) |
| muted | `44 50% 94%` | pale cream (#fcf1d4) |
| muted-foreground | `40 15% 40%` | medium olive (#8b6507) |
| accent | `44 80% 90%` | warm cream (#fae7b5) |
| border | `43 40% 85%` | (#f1b213 lightened) |
| input | `43 40% 88%` | light gold border |
| ring | `43 88% 59%` | gold |
| destructive | `0 85% 55%` | keep red for emergencies |

### Dark Theme — Solar + Dark Grey
Same hue family but with dark grey backgrounds:

| Token | Value |
|-------|-------|
| background | `40 8% 8%` | very dark warm grey |
| foreground | `44 60% 90%` | light gold text |
| card | `40 8% 12%` | dark warm card |
| primary | `43 88% 55%` | gold (slightly toned down) |
| secondary | `40 10% 16%` | dark warm grey |
| muted | `40 8% 14%` | dark muted |
| muted-foreground | `40 20% 50%` | medium warm grey |
| border | `40 10% 20%` | dark warm border |

## Files Modified

### 1. `src/index.css`
- Change `:root` to light theme (solar palette + white)
- Add `.dark` class with dark theme (solar palette + dark grey)
- Update Leaflet overrides to use CSS variables instead of hardcoded dark colors
- Add `.dark .leaflet-*` overrides for dark tile styling

### 2. `src/contexts/UserPreferencesContext.tsx`
- Add `theme: 'light' | 'dark'` to preferences (default: `'light'`)
- Add `setTheme()` method
- Apply/remove `.dark` class on `document.documentElement` via `useEffect`

### 3. `src/pages/ProfilePage.tsx`
- Add a theme toggle (Sun/Moon icons) in the Settings section, before language selector
- Uses `usePreferences().setTheme()` to switch

### 4. `src/pages/MapPage.tsx`
- Change tile URL to be theme-aware: light mode uses `carto/light_all`, dark uses `carto/dark_all`
- Read theme from preferences context

### 5. `src/pages/CountryDetailPage.tsx`
- Same tile URL adjustment for mini-map

### 6. `src/components/AppLayout.tsx`
- No structural changes needed; colors already use CSS variables

## Technical Notes
- Using Tailwind's `darkMode: ["class"]` which is already configured
- `next-themes` is installed but not needed; a simple `useEffect` toggling `.dark` on `<html>` is lighter and avoids hydration complexity
- Zone colors (evacuation green, caution yellow, danger red) stay consistent across both themes
- The solar gold primary replaces the emergency red as the primary accent in both themes; destructive stays red

