

# 🚁 ASEAN Disaster Response & Recovery System (ADRRS)

## Overview
A mobile-first PWA that serves as an integrated disaster response platform for ASEAN communities, combining real-time disaster mapping, early warning notifications, AR-guided evacuation, and emergency contacts — all with clean, panic-proof UX designed for emergency situations.

**Language:** English | **Platform:** PWA (installable from browser) | **Data:** Mock/simulated for prototype

---

## 📱 App Flow & Pages

### 1. Authentication
- Clean login/signup screen with ADRRS branding
- Simple email + password auth (mock for now)
- "Guest access" option for emergency situations where sign-up is a barrier

### 2. Home — Live Disaster Map (Main Screen)
The heart of the app. Opens immediately to a **Mapbox GL** full-screen map centered on the user's current GPS location.

**Map Features:**
- **Color-coded zones** overlaid as polygons:
  - 🟢 **Green — Safe Zone:** No immediate threat, evacuation shelters located here
  - 🟡 **Yellow — Alert/Caution:** Potential threat developing, stay vigilant
  - 🟠 **Orange — Warning:** High risk, prepare to evacuate
  - 🔴 **Red — Danger:** Active disaster, evacuate immediately
- **Drone-detected population clusters** shown as marker pins with crowd count badges
- **Heatmap layer toggle** showing population density concentration
- **Disaster type icons** (flood 🌊, landslide ⛰️) on affected areas
- Tappable markers that open a **bottom sheet** with:
  - Area overview (estimated people count, disaster type, severity)
  - Drone snapshot photo of the area
  - Location name & coordinates
  - Assigned SAR team contact info
- **Region switcher** to browse disaster conditions in other ASEAN countries (dropdown or search)
- Disaster type filter (floods, landslides)

### 3. Early Warning & Notifications
- **Notification center** (bell icon) listing all alerts chronologically
- Alert levels clearly visualized:
  - **Level 1 (Siaga 1):** Information — monitor situation
  - **Level 2 (Siaga 2):** Warning — prepare to evacuate
  - **Level 3 (Siaga 3):** Critical — evacuate now
- Each alert card shows: disaster type, affected area, time, recommended action
- Push notification simulation with toast/banner alerts
- Links to evacuation routes from each alert

### 4. Evacuation Routes & AR Navigation
**Evacuation Map View:**
- Map showing available evacuation routes from user's current position to nearest safe zones
- Routes color-coded by safety: green (safest), yellow (caution), red (avoid)
- Estimated walking/driving time for each route
- Nearest shelters, hospitals, rally points marked

**AR Camera View (activated from route):**
- "Start AR Guide" button launches device camera
- Compass + GPS-based directional arrows overlaid on camera feed
- Color-coded ground zones projected ahead:
  - Green path overlay = safe direction
  - Yellow = proceed with caution
  - Red = do not proceed
- Distance to next waypoint and destination shown
- Large, clear directional indicators designed for stress situations

### 5. Disaster Reports & Education Hub
- Overview cards of currently affected regions across ASEAN
- Each card shows: country, disaster type, severity, date, affected population estimate
- Tappable for detailed report with timeline of events
- Educational section with:
  - "What to do during a flood" quick guides
  - "Landslide warning signs" infographics
  - Emergency preparedness checklist
- Simple, scannable content — icons + short text, no walls of text

### 6. Emergency Contacts
- Dedicated page with one-tap call buttons
- Categories: SAR Teams, Ambulance, Police, Fire Department, Hospitals
- Automatically shows contacts nearest to user's location
- Each contact shows: name, distance, phone number, status (active/busy)
- "SOS" prominent button that alerts nearest emergency services

### 7. User Profile & Status
- User's current location status: "You are in a **Yellow (Alert)** zone"
- Personal safety status indicator
- Registered family members / emergency contacts
- Notification preferences
- Evacuation history
- Language preference (for future multi-language support)

---

## 🧭 Navigation
- **Bottom tab bar** with 4 tabs: Map | Alerts | Contacts | Profile
- AR and Reports accessible from contextual buttons within Map and Alerts
- Large touch targets, high contrast — optimized for one-handed emergency use

## 🎨 Design Principles
- **Dark-mode default** for battery saving and outdoor visibility
- High contrast colors, large fonts
- Minimal cognitive load — every screen has one clear primary action
- Emergency-red accent for critical actions
- Smooth but fast transitions (no unnecessary animations)

## 🔧 Technical Approach
- Mapbox GL JS for all map features (zones, markers, heatmaps, routes)
- Device camera + compass/gyroscope APIs for AR overlay (WebRTC + DeviceOrientation)
- All data mocked with realistic ASEAN geography
- PWA setup with service worker for offline capability
- Mobile-optimized responsive design throughout

