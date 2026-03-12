import { useEffect, useRef, useState, useCallback } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import {
  aseanCountries,
  countryDefaultCenters,
  type PopulationCluster,
  type ZoneLevel,
  type DisasterType,
} from "@/data/mockData";
import {
  X,
  Filter,
  ChevronDown,
  Navigation,
  Phone,
  MapPin,
  Search,
  Droplets,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { usePreferences } from "@/contexts/UserPreferencesContext";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:3000";
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? "";

const darkMapStyles: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#212121" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#757575" }] },
  { featureType: "administrative.country", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
  { featureType: "administrative.land_parcel", stylers: [{ visibility: "off" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#bdbdbd" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#181818" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { featureType: "poi.park", elementType: "labels.text.stroke", stylers: [{ color: "#1b1b1b" }] },
  { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#2c2c2c" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#8a8a8a" }] },
  { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#373737" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#3c3c3c" }] },
  { featureType: "road.highway.controlled_access", elementType: "geometry", stylers: [{ color: "#4e4e4e" }] },
  { featureType: "road.local", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { featureType: "transit", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#3d3d3d" }] },
];

const zoneColors: Record<ZoneLevel, string> = {
  evacuation: "#22c55e",
  caution: "#eab308",
  danger: "#ef4444",
};

const zoneLabels: Record<ZoneLevel, string> = {
  evacuation: "Evacuation Point",
  caution: "Caution",
  danger: "Danger",
};

interface Prediction {
  disaster_occurred: number;
  risk_level: string;
  confidence: number | null;
  nearest_area: string;
  lat: number;
  lng: number;
  nearby_points?: { lat: number; lng: number; label: string }[];
  sensor_data: Record<string, number | string>;
  type: "flood" | "landslide" | "typhoon";
}

interface PredictionPin {
  id: string;
  lat: number;
  lng: number;
  result: Prediction | null;
  circle: google.maps.Circle | null;
  loadingMarker: google.maps.Marker | null;
}

const MapPage = () => {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const [selectedCluster, setSelectedCluster] =
    useState<PopulationCluster | null>(null);

  const [filterType, setFilterType] = useState<DisasterType>("flood");
  const { preferences } = usePreferences();
  const [selectedCountry, setSelectedCountry] = useState(
    preferences.country || "Indonesia",
  );
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // ── Predict Mode ─────────────────────────────────────────────────────────
  const [detectMode, setDetectMode] = useState(false);
  const [selectedPrediction, setSelectedPrediction] =
    useState<Prediction | null>(null);
  const pinsRef = useRef<PredictionPin[]>([]);
  const clickListenerRef = useRef<google.maps.MapsEventListener | null>(null);
  const filterTypeRef = useRef<DisasterType>(filterType);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  // Keep filterTypeRef in sync
  useEffect(() => {
    filterTypeRef.current = filterType;
  }, [filterType]);

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapDivRef.current || mapInstance.current) return;

    const defaultCenter = countryDefaultCenters[selectedCountry] || [
      -6.2, 106.845,
    ];

    const map = new google.maps.Map(mapDivRef.current, {
      center: { lat: defaultCenter[0], lng: defaultCenter[1] },
      zoom: 13,
      disableDefaultUI: true,
      zoomControl: true,
      zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_TOP },
      styles: preferences.theme === "dark" ? darkMapStyles : [],
    });

    mapInstance.current = map;

    // Auto-center to user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userPos = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          map.setCenter(userPos);
          map.setZoom(15);

          // User location marker (blue dot)
          userMarkerRef.current = new google.maps.Marker({
            position: userPos,
            map,
            title: "Your Location",
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 9,
              fillColor: "#4285F4",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2.5,
            },
            zIndex: 999,
          });
        },
        () => {
          // Geolocation denied / unavailable — keep default country center
        },
      );
    }

    return () => {
      mapInstance.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  // Pan to selected country
  useEffect(() => {
    if (!mapInstance.current) return;
    const center = countryDefaultCenters[selectedCountry];
    if (center) {
      mapInstance.current.panTo({ lat: center[0], lng: center[1] });
      mapInstance.current.setZoom(13);
    }
  }, [selectedCountry]);

  // Handle prediction
  const runPrediction = useCallback(async (lat: number, lng: number) => {
    const map = mapInstance.current;
    if (!map) return;

    const disasterType = filterTypeRef.current;
    const isFloodMode = disasterType === "flood";
    const isLandslideMode = disasterType === "landslide";
    const isTyphoonMode = disasterType === "typhoon";
    if (!isFloodMode && !isLandslideMode && !isTyphoonMode) return;

    const endpoint = isFloodMode
      ? `${BACKEND_URL}/api/flood/predict`
      : isLandslideMode
        ? `${BACKEND_URL}/api/landslide/predict`
        : `${BACKEND_URL}/api/typhoon/predict`;

    const pinId = `${Date.now()}`;

    // Loading marker
    const loadingMarker = new google.maps.Marker({
      position: { lat, lng },
      map,
      animation: google.maps.Animation.BOUNCE,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: "#6b7280",
        fillOpacity: 0.8,
        strokeColor: "#ffffff",
        strokeWeight: 2,
      },
    });

    const pin: PredictionPin = {
      id: pinId,
      lat,
      lng,
      result: null,
      circle: null,
      loadingMarker,
    };
    pinsRef.current.push(pin);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lng }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error((errBody as any).error ?? `Server error ${res.status}`);
      }

      const raw = (await res.json()) as any;
      const data: Prediction = {
        ...raw,
        disaster_occurred: isFloodMode
          ? raw.flood_occurred
          : isLandslideMode
            ? raw.landslide_occurred
            : raw.typhoon_occurred,
        type: disasterType as "flood" | "landslide" | "typhoon",
      };

      loadingMarker.setMap(null);

      const isDisaster = data.disaster_occurred === 1;
      const circleColor = isDisaster
        ? isFloodMode
          ? "#eab308"
          : isTyphoonMode
            ? "#3b82f6"
            : "#f97316"
        : "#22c55e";

      const circle = new google.maps.Circle({
        center: { lat, lng },
        radius: 700,
        map,
        fillColor: circleColor,
        fillOpacity: 0.35,
        strokeColor: circleColor,
        strokeWeight: 2.5,
        strokeOpacity: 0.85,
        clickable: true,
      });

      let opacity = 0.35;
      let dir = -1;
      const pulseInterval = setInterval(() => {
        opacity += dir * 0.04;
        if (opacity <= 0.15) dir = 1;
        if (opacity >= 0.4) dir = -1;
        circle.setOptions({ fillOpacity: opacity });
      }, 80);

      circle.addListener("click", () => setSelectedPrediction(data));
      (circle as any)._pulseInterval = pulseInterval;

      pin.result = data;
      pin.circle = circle;
      pin.loadingMarker = null;

      // Fade out + remove after 5s
      setTimeout(() => {
        clearInterval(pulseInterval);
        let fadeOpacity = 0.35;
        const fadeInterval = setInterval(() => {
          fadeOpacity = Math.max(0, fadeOpacity - 0.05);
          circle.setOptions({
            fillOpacity: fadeOpacity,
            strokeOpacity: fadeOpacity,
          });
          if (fadeOpacity <= 0) {
            clearInterval(fadeInterval);
            circle.setMap(null);
          }
        }, 40);
      }, 5000);

      setSelectedPrediction(data);
    } catch {
      loadingMarker.setMap(null);

      const errorCircle = new google.maps.Circle({
        center: { lat, lng },
        radius: 700,
        map,
        fillColor: "#6b7280",
        fillOpacity: 0.25,
        strokeColor: "#6b7280",
        strokeWeight: 2,
        strokeOpacity: 0.6,
        clickable: false,
      });

      // Tooltip via InfoWindow
      const infoWindow = new google.maps.InfoWindow({
        content: "⚠️ Not Available",
        position: { lat, lng },
      });
      infoWindow.open(map);

      setTimeout(() => {
        let fadeOpacity = 0.25;
        const fadeInterval = setInterval(() => {
          fadeOpacity = Math.max(0, fadeOpacity - 0.05);
          errorCircle.setOptions({
            fillOpacity: fadeOpacity,
            strokeOpacity: fadeOpacity,
          });
          if (fadeOpacity <= 0) {
            clearInterval(fadeInterval);
            errorCircle.setMap(null);
            infoWindow.close();
          }
        }, 40);
      }, 5000);
    }
  }, []);

  // Register / unregister click handler on detect mode toggle
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    if (detectMode) {
      clickListenerRef.current = map.addListener(
        "click",
        (e: google.maps.MapMouseEvent) => {
          if (e.latLng) runPrediction(e.latLng.lat(), e.latLng.lng());
        },
      );
      map.setOptions({ draggableCursor: "crosshair" });
    } else {
      if (clickListenerRef.current) {
        google.maps.event.removeListener(clickListenerRef.current);
        clickListenerRef.current = null;
      }
      map.setOptions({ draggableCursor: "" });
    }

    return () => {
      if (clickListenerRef.current) {
        google.maps.event.removeListener(clickListenerRef.current);
        clickListenerRef.current = null;
      }
    };
  }, [detectMode, runPrediction]);

  // Location search using Nominatim
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=${getCountryCode(selectedCountry)}&limit=6&addressdetails=1`,
        );
        const data = await res.json();
        setSearchResults(data);
      } catch {
        setSearchResults([]);
      }
      setIsSearching(false);
    }, 400);
  };

  const selectSearchResult = (result: any) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    if (mapInstance.current) {
      mapInstance.current.panTo({ lat, lng: lon });
      mapInstance.current.setZoom(15);
    }
    setShowSearch(false);
    setSearchQuery("");
    setSearchResults([]);
    if (detectMode) {
      runPrediction(lat, lon);
    }
  };

  return (
    <div className="h-full w-full p-3">
      <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-clay">
        {/* Google Map container */}
        {!isLoaded ? (
          <div className="h-full w-full flex items-center justify-center bg-muted">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div ref={mapDivRef} className="h-full w-full" />
        )}

        {/* Search Bar */}
        <div className="absolute top-4 left-4 right-4 z-[1000] space-y-1">
          <div className="flex items-center gap-2">
            {/* Country Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowCountryPicker(!showCountryPicker)}
                className="flex items-center gap-1.5 clay-sm backdrop-blur-md bg-card/70 px-2.5 py-2 text-sm font-medium text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-clay active:animate-clay-bounce"
              >
                <MapPin className="h-4 w-4 text-primary" />
                <ChevronDown className="h-3 w-3" />
              </button>
              {showCountryPicker && (
                <div className="absolute top-full mt-1 w-48 clay backdrop-blur-md bg-card/80 overflow-hidden max-h-60 overflow-y-auto animate-scale-in">
                  {aseanCountries.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setSelectedCountry(c);
                        setShowCountryPicker(false);
                      }}
                      className={cn(
                        "w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors",
                        c === selectedCountry &&
                          "bg-accent text-primary font-medium",
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={`Search location in ${selectedCountry}...`}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => setShowSearch(true)}
                className="w-full rounded-[var(--radius)] bg-card/70 backdrop-blur-md shadow-clay-sm px-9 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary border border-white/20"
                style={{
                  boxShadow: "var(--clay-shadow-sm), var(--clay-inner-sm)",
                }}
              />
            </div>

            {/* Detect Mode Toggle */}
            <button
              onClick={() => {
                setDetectMode((v) => !v);
                setSelectedPrediction(null);
                setSelectedCluster(null);
              }}
              title="Detect Mode — click any map location to predict risk"
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-2 text-sm font-semibold backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 active:animate-clay-bounce",
                detectMode
                  ? "clay-primary text-primary rounded-[var(--radius)]"
                  : "clay-sm bg-card/70 text-foreground hover:shadow-clay rounded-[var(--radius)]",
              )}
            >
              <Droplets className="h-4 w-4" />
              {detectMode && (
                <span className="text-xs hidden sm:inline">Detect</span>
              )}
            </button>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="clay-sm backdrop-blur-md bg-card/70 p-2 text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-clay active:animate-clay-bounce"
            >
              <Filter className="h-4 w-4" />
            </button>
          </div>

          {/* Detect Mode Banner */}
          {detectMode && (
            <div className="flex items-center gap-2 clay-sm backdrop-blur-md bg-primary/10 border border-primary/30 px-3 py-1.5 animate-scale-in">
              <Droplets className="h-3.5 w-3.5 text-primary shrink-0" />
              <p className="text-xs text-primary font-medium">
                {filterType === "flood"
                  ? "Click anywhere to predict flood risk"
                  : filterType === "landslide"
                    ? "Click anywhere to predict landslide risk"
                    : filterType === "typhoon"
                      ? "Click anywhere to check live typhoon conditions"
                      : "Switch filter to Flood, Landslide, or Typhoon to enable predictions"}
              </p>
            </div>
          )}

          {/* Search Results Dropdown */}
          {showSearch && searchQuery.length >= 2 && (
            <div className="clay backdrop-blur-md bg-card/80 overflow-hidden animate-scale-in">
              {isSearching ? (
                <div className="px-3 py-4 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" /> Searching...
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => selectSearchResult(r)}
                    className="w-full px-3 py-2.5 text-left hover:bg-accent transition-colors border-b border-border/30 last:border-0"
                  >
                    <p className="text-sm text-foreground truncate">
                      {r.display_name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {r.type}
                    </p>
                  </button>
                ))
              ) : (
                <div className="px-3 py-4 text-center text-xs text-muted-foreground">
                  No results found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="absolute top-16 right-4 z-[1000] clay backdrop-blur-md bg-card/80 p-3 space-y-2 w-44 animate-scale-in">
            <p className="text-xs font-medium text-muted-foreground">
              Disaster Type
            </p>
            {(["flood", "landslide", "typhoon"] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setFilterType(t);
                  setShowFilters(false);
                }}
                className={cn(
                  "w-full rounded-lg px-3 py-1.5 text-left text-sm transition-all",
                  filterType === t
                    ? "bg-primary/20 text-primary shadow-clay-sm"
                    : "hover:bg-accent text-foreground",
                )}
              >
                {t === "flood"
                  ? "🌊 Flood"
                  : t === "landslide"
                    ? "⛰️ Landslide"
                    : t === "typhoon"
                      ? "🌀 Typhoon"
                      : null}
              </button>
            ))}
          </div>
        )}

        {/* Zone Legend */}
        <div className="absolute bottom-4 left-4 z-[1000] clay-sm backdrop-blur-md bg-card/70 p-3">
          <p className="text-[10px] font-medium text-muted-foreground mb-1.5">
            ZONE STATUS
          </p>
          <div className="space-y-1">
            {(Object.entries(zoneLabels) as [ZoneLevel, string][])
              .filter(([level]) => level !== "evacuation")
              .map(([level, label]) => (
                <div key={level} className="flex items-center gap-2">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: zoneColors[level] }}
                  />
                  <span className="text-[11px] text-foreground">{label}</span>
                </div>
              ))}
            {detectMode && (
              <>
                <div className="my-1 border-t border-border/30" />
                <p className="text-[10px] font-medium text-muted-foreground">
                  {filterType === "landslide"
                    ? "LANDSLIDE DETECT"
                    : filterType === "typhoon"
                      ? "TYPHOON DETECT"
                      : "FLOOD DETECT"}
                </p>
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                  <span className="text-[11px] text-foreground">No Risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      background:
                        filterType === "landslide"
                          ? "#f97316"
                          : filterType === "typhoon"
                            ? "#3b82f6"
                            : "#eab308",
                    }}
                  />
                  <span className="text-[11px] text-foreground">
                    {filterType === "landslide"
                      ? "Landslide Risk"
                      : filterType === "typhoon"
                        ? "Typhoon Detected"
                        : "Flood Risk"}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Evacuation Route Button */}
        <div className="absolute bottom-4 right-4 z-[1000]">
          <Button
            onClick={() => navigate("/evacuation")}
            className="h-12 rounded-xl clay-primary gap-2 font-semibold transition-all duration-300 hover:-translate-y-1 active:animate-clay-bounce"
          >
            <Navigation className="h-4 w-4" />
            Evacuate
          </Button>
        </div>

        {/* Prediction Result Sheet */}
        {selectedPrediction &&
          !selectedCluster &&
          (() => {
            const isFlood = selectedPrediction.type === "flood";
            const isTyphoon = selectedPrediction.type === "typhoon";
            const occurred = selectedPrediction.disaster_occurred === 1;
            const accentColor = occurred
              ? isFlood
                ? "#eab308"
                : isTyphoon
                  ? "#3b82f6"
                  : "#f97316"
              : "#22c55e";
            const occLabel = occurred
              ? isFlood
                ? "🌊 Flood Likely"
                : isTyphoon
                  ? "🌀 Typhoon Detected"
                  : "⛰️ Landslide Likely"
              : "✅ No Risk";
            const occIcon = occurred
              ? isFlood
                ? "🌊"
                : isTyphoon
                  ? "🌀"
                  : "⛰️"
              : "✅";
            const sd = selectedPrediction.sensor_data;
            const sensorRows: [string, string][] = isFlood
              ? [
                  ["🌧 Rainfall", `${sd.rainfall_mm} mm`],
                  ["🌡 Temperature", `${sd.temperature_c}°C`],
                  ["💧 Humidity", `${sd.humidity_pct}%`],
                  ["🏞 Water Level", `${sd.water_level_m} m`],
                  ["⛰ Elevation", `${sd.elevation_m} m`],
                  ["🌱 Land Cover", `${sd.land_cover}`],
                ]
              : isTyphoon
                ? [
                    ["💨 Wind Speed", `${sd.wind_speed_ms} m/s`],
                    ["💨 Wind Gust", `${sd.wind_gust_ms} m/s`],
                    ["🧭 Wind Force", `${sd.wind_beaufort}`],
                    ["🌡 Temperature", `${sd.temperature_c}°C`],
                    ["💧 Humidity", `${sd.humidity_pct}%`],
                    ["🌊 Pressure", `${sd.pressure_hpa} hPa`],
                    ["☁️ Cloudiness", `${sd.cloudiness_pct}%`],
                    ["🌧 Rainfall 1h", `${sd.rainfall_1h_mm} mm`],
                    ["🌤 Conditions", `${sd.weather_description}`],
                  ]
                : [
                    ["🌡 Temperature", `${sd.temperature_c}°C`],
                    ["💧 Humidity", `${sd.humidity_pct}%`],
                    ["🌧 Precipitation", `${sd.precipitation_mm} mm`],
                    ["🪨 Soil Moisture", `${sd.soil_moisture_pct}%`],
                    ["⛰ Elevation", `${sd.elevation_m} m`],
                  ];
            return (
              <div className="absolute bottom-0 left-0 right-0 z-[1000] animate-in slide-in-from-bottom">
                <div className="clay-lg backdrop-blur-md bg-card/90 rounded-b-none p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full animate-pulse-emergency"
                          style={{ background: accentColor }}
                        />
                        <span
                          className="text-xs font-semibold uppercase tracking-wider"
                          style={{ color: accentColor }}
                        >
                          {isTyphoon
                            ? selectedPrediction.risk_level + " WIND"
                            : selectedPrediction.risk_level + " RISK"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          — {occLabel}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-foreground mt-1">
                        {selectedPrediction.nearest_area}
                      </h3>
                      <p className="text-xs text-muted-foreground font-mono">
                        📍 {selectedPrediction.lat.toFixed(5)},{" "}
                        {selectedPrediction.lng.toFixed(5)}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedPrediction(null)}
                      className="p-1 rounded-lg hover:bg-accent transition-all active:animate-clay-bounce"
                    >
                      <X className="h-5 w-5 text-muted-foreground" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="clay-inset p-2.5 text-center">
                      <p
                        className="text-xl font-bold"
                        style={{ color: accentColor }}
                      >
                        {occIcon}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Prediction
                      </p>
                    </div>
                    <div className="clay-inset p-2.5 text-center">
                      <p className="text-base font-bold text-foreground">
                        {isTyphoon
                          ? `${selectedPrediction.sensor_data.wind_speed_ms} m/s`
                          : selectedPrediction.confidence !== null
                            ? `${(selectedPrediction.confidence * 100).toFixed(1)}%`
                            : "—"}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {isTyphoon ? "Wind Speed" : "Confidence"}
                      </p>
                    </div>
                    <div className="clay-inset p-2.5 text-center">
                      <p className="text-base font-bold text-foreground capitalize">
                        {selectedPrediction.risk_level}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Risk Level
                      </p>
                    </div>
                  </div>

                  <div className="clay-inset p-3 space-y-1.5">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      {isTyphoon
                        ? "Live Weather Data (OpenWeatherMap)"
                        : "Sensor Data (Auto-generated)"}
                    </p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                      {sensorRows.map(([label, val]) => (
                        <div
                          key={label}
                          className="flex justify-between text-[11px]"
                        >
                          <span className="text-muted-foreground">{label}</span>
                          <span className="text-foreground font-medium">
                            {val}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

        {/* Cluster Bottom Sheet */}
        {selectedCluster && !selectedPrediction && (
          <div className="absolute bottom-0 left-0 right-0 z-[1000] animate-in slide-in-from-bottom">
            <div className="clay-lg backdrop-blur-md bg-card/85 rounded-b-none p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full animate-pulse-emergency"
                      style={{
                        background: zoneColors[selectedCluster.severity],
                      }}
                    />
                    <span
                      className="text-xs font-medium uppercase tracking-wider"
                      style={{ color: zoneColors[selectedCluster.severity] }}
                    >
                      {zoneLabels[selectedCluster.severity]}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mt-1">
                    {selectedCluster.areaName}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedCluster.country}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedCluster(null)}
                  className="p-1 rounded-lg hover:bg-accent transition-all active:animate-clay-bounce"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              <div className="flex gap-3">
                <div className="flex-1 clay-inset p-3 text-center">
                  <span className="text-2xl">
                    {selectedCluster.disasterType === "flood"
                      ? "🌊"
                      : selectedCluster.disasterType === "typhoon"
                        ? "🌀"
                        : "⛰️"}
                  </span>
                  <p className="text-sm font-medium text-foreground capitalize">
                    {selectedCluster.disasterType}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Disaster Type
                  </p>
                </div>
              </div>

              <div className="clay-inset h-32 flex items-center justify-center">
                <p className="text-xs text-muted-foreground">
                  📸 Drone Snapshot — {selectedCluster.areaName}
                </p>
              </div>

              <p className="text-xs text-muted-foreground font-mono">
                📍 {selectedCluster.position[0].toFixed(4)},{" "}
                {selectedCluster.position[1].toFixed(4)}
              </p>

              <div className="flex items-center justify-between clay-sm p-3">
                <div>
                  <p className="text-xs text-muted-foreground">
                    {selectedCluster.sarContact.team}
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {selectedCluster.sarContact.name}
                  </p>
                </div>
                <a
                  href={`tel:${selectedCluster.sarContact.phone}`}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground clay-primary transition-all duration-300 hover:-translate-y-0.5 active:animate-clay-bounce"
                >
                  <Phone className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function getCountryCode(country: string): string {
  const codes: Record<string, string> = {
    Indonesia: "id",
    Philippines: "ph",
    Thailand: "th",
    Malaysia: "my",
    Vietnam: "vn",
    Myanmar: "mm",
    Cambodia: "kh",
    Laos: "la",
    Singapore: "sg",
    Brunei: "bn",
  };
  return codes[country] || "id";
}

export default MapPage;
