import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  disasterZones, populationClusters, aseanCountries,
  countryDefaultCenters, type PopulationCluster, type ZoneLevel, type DisasterType
} from '@/data/mockData';
import { X, Layers, Filter, ChevronDown, Navigation, Phone, Users, MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { usePreferences } from '@/contexts/UserPreferencesContext';

const zoneColors: Record<ZoneLevel, string> = {
  evacuation: '#22c55e',
  caution: '#eab308',
  danger: '#ef4444',
};

const zoneLabels: Record<ZoneLevel, string> = {
  evacuation: 'Evacuation Point',
  caution: 'Caution',
  danger: 'Danger',
};

const MapPage = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<PopulationCluster | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [filterType, setFilterType] = useState<DisasterType | 'all'>('all');
  const { preferences } = usePreferences();
  const [selectedCountry, setSelectedCountry] = useState(preferences.country || 'Indonesia');
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    const center = countryDefaultCenters[selectedCountry] || [-6.200, 106.845];
    const map = L.map(mapRef.current, {
      center, zoom: 13, zoomControl: false, attributionControl: false,
    });
    L.control.zoom({ position: 'topright' }).addTo(map);
    const tileUrl = preferences.theme === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
    L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(map);
    mapInstance.current = map;
    return () => { map.remove(); mapInstance.current = null; };
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;
    const center = countryDefaultCenters[selectedCountry];
    if (center) mapInstance.current.setView(center, 13, { animate: true });
  }, [selectedCountry]);

  // Draw zones and markers
  useEffect(() => {
    if (!mapInstance.current) return;
    const map = mapInstance.current;
    map.eachLayer(l => { if (!(l instanceof L.TileLayer)) map.removeLayer(l); });

    const filteredZones = disasterZones.filter(z =>
      z.country === selectedCountry && (filterType === 'all' || z.disasterType === filterType)
    );

    filteredZones.forEach(zone => {
      L.circle(zone.center, {
        radius: zone.radius,
        fillColor: zoneColors[zone.level],
        fillOpacity: showHeatmap ? 0.25 : 0.15,
        color: zoneColors[zone.level],
        weight: 2, opacity: 0.6,
      }).addTo(map).bindTooltip(zone.name, { permanent: false, direction: 'top' });
    });

    const filteredClusters = populationClusters.filter(c =>
      c.country === selectedCountry && (filterType === 'all' || c.disasterType === filterType)
    );

    filteredClusters.forEach(cluster => {
      const color = zoneColors[cluster.severity];
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background:${color};color:#fff;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:11px;border:2px solid rgba(255,255,255,0.3);box-shadow:0 2px 8px rgba(0,0,0,0.4)">${cluster.count}</div>`,
        iconSize: [36, 36], iconAnchor: [18, 18],
      });
      L.marker(cluster.position, { icon })
        .addTo(map)
        .on('click', () => setSelectedCluster(cluster));
    });
  }, [selectedCountry, filterType, showHeatmap]);

  // Location search using Nominatim
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (query.length < 2) { setSearchResults([]); return; }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=${getCountryCode(selectedCountry)}&limit=6&addressdetails=1`
        );
        const data = await res.json();
        setSearchResults(data);
      } catch { setSearchResults([]); }
      setIsSearching(false);
    }, 400);
  };

  const selectSearchResult = (result: any) => {
    if (mapInstance.current) {
      const lat = parseFloat(result.lat);
      const lon = parseFloat(result.lon);
      mapInstance.current.setView([lat, lon], 15, { animate: true });
    }
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="h-full w-full p-3">
    <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-clay">
      <div ref={mapRef} className="h-full w-full" />

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
                {aseanCountries.map(c => (
                  <button
                    key={c}
                    onClick={() => { setSelectedCountry(c); setShowCountryPicker(false); }}
                    className={cn(
                      'w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors',
                      c === selectedCountry && 'bg-accent text-primary font-medium'
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
              onChange={e => handleSearch(e.target.value)}
              onFocus={() => setShowSearch(true)}
              className="w-full rounded-[var(--radius)] bg-card/70 backdrop-blur-md shadow-clay-sm px-9 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary border border-white/20"
              style={{ boxShadow: 'var(--clay-shadow-sm), var(--clay-inner-sm)' }}
            />
          </div>

          {/* Filter & Heatmap toggles */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="clay-sm backdrop-blur-md bg-card/70 p-2 text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-clay active:animate-clay-bounce"
          >
            <Filter className="h-4 w-4" />
          </button>
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={cn(
              'backdrop-blur-md bg-card/70 p-2 transition-all duration-300 hover:-translate-y-0.5 active:animate-clay-bounce',
              showHeatmap ? 'clay-primary text-primary' : 'clay-sm text-foreground hover:shadow-clay'
            )}
          >
            <Layers className="h-4 w-4" />
          </button>
        </div>

        {/* Search Results Dropdown */}
        {showSearch && searchQuery.length >= 2 && (
          <div className="clay backdrop-blur-md bg-card/80 overflow-hidden animate-scale-in">
            {isSearching ? (
              <div className="px-3 py-4 text-center text-xs text-muted-foreground">Searching...</div>
            ) : searchResults.length > 0 ? (
              searchResults.map((r, i) => (
                <button
                  key={i}
                  onClick={() => selectSearchResult(r)}
                  className="w-full px-3 py-2.5 text-left hover:bg-accent transition-colors border-b border-border/30 last:border-0"
                >
                  <p className="text-sm text-foreground truncate">{r.display_name}</p>
                  <p className="text-[10px] text-muted-foreground">{r.type}</p>
                </button>
              ))
            ) : (
              <div className="px-3 py-4 text-center text-xs text-muted-foreground">No results found</div>
            )}
          </div>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="absolute top-16 right-4 z-[1000] clay backdrop-blur-md bg-card/80 p-3 space-y-2 w-44 animate-scale-in">
          <p className="text-xs font-medium text-muted-foreground">Disaster Type</p>
          {(['all', 'flood', 'landslide', 'typhoon', 'earthquake'] as const).map(t => (
            <button
              key={t}
              onClick={() => { setFilterType(t as any); setShowFilters(false); }}
              className={cn(
                'w-full rounded-lg px-3 py-1.5 text-left text-sm transition-all',
                filterType === t ? 'bg-primary/20 text-primary shadow-clay-sm' : 'hover:bg-accent text-foreground'
              )}
            >
              {t === 'all' ? 'All Types' : t === 'flood' ? '🌊 Flood' : t === 'landslide' ? '⛰️ Landslide' : t === 'typhoon' ? '🌀 Typhoon' : '🌍 Earthquake'}
            </button>
          ))}
        </div>
      )}

      {/* Zone Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] clay-sm backdrop-blur-md bg-card/70 p-3">
        <p className="text-[10px] font-medium text-muted-foreground mb-1.5">ZONE STATUS</p>
        <div className="space-y-1">
          {(Object.entries(zoneLabels) as [ZoneLevel, string][]).map(([level, label]) => (
            <div key={level} className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full" style={{ background: zoneColors[level] }} />
              <span className="text-[11px] text-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Evacuation Route Button */}
      <div className="absolute bottom-4 right-4 z-[1000]">
        <Button
          onClick={() => navigate('/evacuation')}
          className="h-12 rounded-xl clay-primary gap-2 font-semibold transition-all duration-300 hover:-translate-y-1 active:animate-clay-bounce"
        >
          <Navigation className="h-4 w-4" />
          Evacuate
        </Button>
      </div>

      {/* Bottom Sheet for selected cluster */}
      {selectedCluster && (
        <div className="absolute bottom-0 left-0 right-0 z-[1000] animate-in slide-in-from-bottom">
          <div className="clay-lg backdrop-blur-md bg-card/85 rounded-b-none p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full animate-pulse-emergency" style={{ background: zoneColors[selectedCluster.severity] }} />
                  <span className="text-xs font-medium uppercase tracking-wider" style={{ color: zoneColors[selectedCluster.severity] }}>
                    {zoneLabels[selectedCluster.severity]}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground mt-1">{selectedCluster.areaName}</h3>
                <p className="text-xs text-muted-foreground">{selectedCluster.country}</p>
              </div>
              <button onClick={() => setSelectedCluster(null)} className="p-1 rounded-lg hover:bg-accent transition-all active:animate-clay-bounce">
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            <div className="flex gap-3">
              <div className="flex-1 clay-inset p-3 text-center">
                <span className="text-2xl">{selectedCluster.disasterType === 'flood' ? '🌊' : selectedCluster.disasterType === 'typhoon' ? '🌀' : '⛰️'}</span>
                <p className="text-sm font-medium text-foreground capitalize">{selectedCluster.disasterType}</p>
                <p className="text-[10px] text-muted-foreground">Disaster Type</p>
              </div>
            </div>

            <div className="clay-inset h-32 flex items-center justify-center">
              <p className="text-xs text-muted-foreground">📸 Drone Snapshot — {selectedCluster.areaName}</p>
            </div>

            <p className="text-xs text-muted-foreground font-mono">
              📍 {selectedCluster.position[0].toFixed(4)}, {selectedCluster.position[1].toFixed(4)}
            </p>

            <div className="flex items-center justify-between clay-sm p-3">
              <div>
                <p className="text-xs text-muted-foreground">{selectedCluster.sarContact.team}</p>
                <p className="text-sm font-medium text-foreground">{selectedCluster.sarContact.name}</p>
              </div>
              <a href={`tel:${selectedCluster.sarContact.phone}`}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground clay-primary transition-all duration-300 hover:-translate-y-0.5 active:animate-clay-bounce">
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

// Helper to get ISO country code for Nominatim
function getCountryCode(country: string): string {
  const codes: Record<string, string> = {
    'Indonesia': 'id', 'Philippines': 'ph', 'Thailand': 'th', 'Malaysia': 'my',
    'Vietnam': 'vn', 'Myanmar': 'mm', 'Cambodia': 'kh', 'Laos': 'la',
    'Singapore': 'sg', 'Brunei': 'bn',
  };
  return codes[country] || 'id';
}

export default MapPage;
