import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { disasterZones, countryDefaultCenters } from "@/data/mockData";
import { ArrowLeft, Camera, Clock, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const evacuationZone = disasterZones.find(
  (z) => z.level === "evacuation" && z.country === "Indonesia",
)!;
const dangerZone = disasterZones.find(
  (z) => z.level === "danger" && z.country === "Indonesia",
)!;

const evacuationRoutes = [
  {
    id: "r1",
    name: "Primary Route — Via Jl. MT Haryono",
    safety: "evacuation" as const,
    time: "18 min walk",
    distance: "1.4 km",
    points: [
      dangerZone.center,
      [-6.21, 106.85],
      [-6.23, 106.84],
      [-6.25, 106.815],
      evacuationZone.center,
    ] as [number, number][],
  },
  {
    id: "r2",
    name: "Alternate — Via Jl. Casablanca",
    safety: "caution" as const,
    time: "25 min walk",
    distance: "2.1 km",
    points: [
      dangerZone.center,
      [-6.205, 106.83],
      [-6.225, 106.82],
      [-6.245, 106.81],
      evacuationZone.center,
    ] as [number, number][],
  },
  {
    id: "r3",
    name: "Avoid — Flooded Path",
    safety: "danger" as const,
    time: "Blocked",
    distance: "0.8 km",
    points: [dangerZone.center, [-6.195, 106.835], [-6.19, 106.825]] as [
      number,
      number,
    ][],
  },
];

const routeColors = {
  evacuation: "#22c55e",
  caution: "#eab308",
  danger: "#ef4444",
};

const EvacuationPage = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const navigate = useNavigate();
  const [selectedRoute, setSelectedRoute] = useState(evacuationRoutes[0].id);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    const map = L.map(mapRef.current, {
      center: countryDefaultCenters["Indonesia"],
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
    });
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      { maxZoom: 19 },
    ).addTo(map);
    mapInstance.current = map;

    evacuationRoutes.forEach((route) => {
      L.polyline(route.points, {
        color: routeColors[route.safety],
        weight: route.safety === "evacuation" ? 5 : 3,
        opacity: 0.8,
        dashArray: route.safety === "danger" ? "8, 8" : undefined,
      }).addTo(map);
    });

    const shelterIcon = L.divIcon({
      html: '<div style="background:#22c55e;color:#fff;border-radius:8px;padding:4px 8px;font-size:11px;font-weight:700;white-space:nowrap">🏥 Evacuation Shelter</div>',
      className: "custom-marker",
      iconAnchor: [40, 12],
    });
    L.marker(evacuationZone.center, { icon: shelterIcon }).addTo(map);

    const userIcon = L.divIcon({
      html: '<div style="background:#3b82f6;border:3px solid #fff;border-radius:50%;width:16px;height:16px;box-shadow:0 0 12px rgba(59,130,246,0.5)"></div>',
      className: "custom-marker",
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
    L.marker(dangerZone.center, { icon: userIcon }).addTo(map);

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  return (
    <div className="relative h-full w-full flex flex-col bg-background">
      <div ref={mapRef} className="flex-1" />

      <div className="shrink-0 border-t border-border bg-card p-4 space-y-3 max-h-[45%] overflow-y-auto">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/map")}
            className="flex items-center gap-1.5 rounded-lg bg-secondary border border-border px-3 py-1.5 text-sm text-foreground shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <h2 className="text-base font-bold text-foreground">
            Evacuation Routes
          </h2>
        </div>
        <div className="space-y-2">
          {evacuationRoutes.map((route) => (
            <button
              key={route.id}
              onClick={() => setSelectedRoute(route.id)}
              className={`w-full rounded-xl border p-3 text-left transition-colors ${
                selectedRoute === route.id
                  ? "border-primary bg-primary/5"
                  : "border-border bg-secondary"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ background: routeColors[route.safety] }}
                />
                <span className="text-sm font-medium text-foreground">
                  {route.name}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1.5 ml-5">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" /> {route.time}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Route className="h-3 w-3" /> {route.distance}
                </span>
              </div>
            </button>
          ))}
        </div>

        <Button
          onClick={() =>
            window.open("https://github.com/SEAGuard-AI/mobile-app", "_blank")
          }
          className="w-full h-12 rounded-xl font-semibold gap-2 text-base"
          disabled={selectedRoute === "r3"}
        >
          <Camera className="h-5 w-5" />
          Start AR Guide
        </Button>
      </div>
    </div>
  );
};

export default EvacuationPage;
