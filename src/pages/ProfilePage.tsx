import { useAuth } from '@/contexts/AuthContext';
import { usePreferences } from '@/contexts/UserPreferencesContext';
import { useTranslation } from '@/contexts/TranslationContext';
import { useNavigate } from 'react-router-dom';
import {
  disasterZones, alerts, countryFlags, emergencyContacts,
  countryDefaultCenters, aseanLanguages, aseanCountries, type ZoneLevel
} from '@/data/mockData';
import {
  User, LogOut, Bell, MapPin, Navigation, Phone, Edit2, Share2, Globe, ChevronRight, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { MapContainer, TileLayer, Circle, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const zoneColors: Record<ZoneLevel, string> = {
  evacuation: 'hsl(var(--zone-evacuation))',
  caution: 'hsl(var(--zone-caution))',
  danger: 'hsl(var(--zone-danger))',
};

const zoneHex: Record<ZoneLevel, string> = {
  evacuation: '#22c55e',
  caution: '#eab308',
  danger: '#dc2626',
};

const userIcon = L.divIcon({
  className: '',
  html: '<div style="width:14px;height:14px;border-radius:50%;background:#3b82f6;border:3px solid #fff;box-shadow:0 0 8px rgba(59,130,246,0.6)"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { preferences, setLanguage, setLocation } = usePreferences();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [editingLocation, setEditingLocation] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ display_name: string; lat: string; lon: string }>>([]);

  const userCountry = preferences.country || 'Indonesia';
  const userZone = disasterZones.find(z => z.level === 'caution' && z.country === userCountry)
    || disasterZones.find(z => z.country === userCountry);
  const unreadAlerts = alerts.filter(a => !a.read).length;
  const center: [number, number] = preferences.location
    ? [preferences.location.lat, preferences.location.lng]
    : (userZone ? userZone.center : (countryDefaultCenters[userCountry] || [-6.2, 106.845]));
  const nearbyZones = disasterZones.filter(z => z.country === userCountry);
  const nearbyContacts = emergencyContacts.filter(c => c.country === userCountry).slice(0, 2);
  const isInDanger = userZone && (userZone.level === 'caution' || userZone.level === 'danger');
  const locationLabel = preferences.location?.label || userZone?.name || `${userCountry}`;

  const currentLangName = preferences.language || 'English';
  const availableLanguages = Object.entries(aseanLanguages).map(([country, lang]) => ({
    country,
    name: lang.name,
    nativeName: lang.nativeName,
  }));

  const searchLocation = async (query: string) => {
    if (query.length < 3) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
      const data = await res.json();
      setSearchResults(data);
    } catch { setSearchResults([]); }
  };

  const shareLocation = () => {
    const text = `📍 ${t('your_location')}: ${locationLabel}\nhttps://www.google.com/maps?q=${center[0]},${center[1]}`;
    if (navigator.share) {
      navigator.share({ title: 'My Location — ADRRS', text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-background">
      <div className="px-4 pt-6 pb-6 space-y-4">
        {/* User Info */}
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary border border-border">
            <User className="h-7 w-7 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">{user?.name || 'User'}</h1>
            <p className="text-sm text-muted-foreground">{user?.email || 'Guest access'}</p>
            {preferences.country && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {countryFlags[preferences.country]} {preferences.country}
              </p>
            )}
          </div>
        </div>

        {/* Location Display */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('your_location')}</span>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setEditingLocation(!editingLocation)} className="flex items-center gap-1 text-primary text-[10px] font-medium px-2 py-1 rounded-lg hover:bg-accent">
                <Edit2 className="h-3 w-3" /> {t('edit_location')}
              </button>
              <button onClick={shareLocation} className="flex items-center gap-1 text-primary text-[10px] font-medium px-2 py-1 rounded-lg hover:bg-accent">
                <Share2 className="h-3 w-3" /> {t('share_location')}
              </button>
            </div>
          </div>
          <p className="text-sm text-foreground">{locationLabel}</p>
          <p className="text-[10px] text-muted-foreground">{center[0].toFixed(4)}, {center[1].toFixed(4)}</p>
        </div>

        {/* Location Edit */}
        {editingLocation && (
          <div className="rounded-xl bg-card border border-border p-3 space-y-2">
            <input
              type="text"
              placeholder={t('search_location')}
              value={locationSearch}
              onChange={e => { setLocationSearch(e.target.value); searchLocation(e.target.value); }}
              className="w-full rounded-lg bg-secondary border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {searchResults.map((r, i) => (
              <button key={i} onClick={() => {
                setLocation({ lat: parseFloat(r.lat), lng: parseFloat(r.lon), label: r.display_name });
                setEditingLocation(false);
                setLocationSearch('');
                setSearchResults([]);
              }} className="w-full text-left text-xs text-foreground p-2 rounded-lg hover:bg-accent truncate">
                {r.display_name}
              </button>
            ))}
          </div>
        )}

        {/* Mini Map */}
        <div className="rounded-xl overflow-hidden border border-border">
          <div className="h-44">
            <MapContainer
              key={`${center[0]}-${center[1]}`}
              center={center}
              zoom={13}
              zoomControl={false}
              dragging={false}
              scrollWheelZoom={false}
              doubleClickZoom={false}
              touchZoom={false}
              attributionControl={false}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
              {nearbyZones.map(zone => (
                <Circle
                  key={zone.id}
                  center={zone.center}
                  radius={zone.radius}
                  pathOptions={{
                    color: zoneHex[zone.level],
                    fillColor: zoneHex[zone.level],
                    fillOpacity: 0.2,
                    weight: 2,
                  }}
                />
              ))}
              <Marker position={center} icon={userIcon} />
            </MapContainer>
          </div>
        </div>

        {/* Current Status */}
        {userZone && (
          <div
            className="rounded-xl border-2 p-4 space-y-2"
            style={{ borderColor: zoneColors[userZone.level] + '60', background: zoneColors[userZone.level] + '10' }}
          >
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full animate-pulse" style={{ background: zoneColors[userZone.level] }} />
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: zoneColors[userZone.level] }}>
                {t('current_status')}
              </span>
            </div>
            <p className="text-foreground text-sm font-medium">
              {userZone.level === 'evacuation' && t('near_evacuation')}
              {userZone.level === 'caution' && t('caution_zone')}
              {userZone.level === 'danger' && t('danger_zone')}
            </p>
            <p className="text-xs text-muted-foreground">{userZone.name} — {userZone.description}</p>
          </div>
        )}

        {/* Evacuation CTA */}
        {isInDanger && (
          <Button
            onClick={() => navigate('/evacuation')}
            className="w-full h-14 gap-2 text-base font-bold rounded-xl"
            style={{
              background: zoneColors[userZone!.level],
              color: userZone!.level === 'caution' ? '#000' : '#fff',
            }}
          >
            <Navigation className="h-5 w-5" />
            {t('get_evacuation_guide')}
          </Button>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-card border border-border p-3 text-center">
            <Bell className="h-5 w-5 mx-auto text-primary mb-1" />
            <p className="text-lg font-bold text-foreground">{unreadAlerts}</p>
            <p className="text-[10px] text-muted-foreground">{t('unread_alerts')}</p>
          </div>
          <div className="rounded-xl bg-card border border-border p-3 text-center">
            <MapPin className="h-5 w-5 mx-auto text-zone-caution mb-1" />
            <p className="text-lg font-bold text-foreground">{disasterZones.filter(z => z.level !== 'evacuation').length}</p>
            <p className="text-[10px] text-muted-foreground">{t('active_zones')}</p>
          </div>
          <div className="rounded-xl bg-card border border-border p-3 text-center">
            <Shield className="h-5 w-5 mx-auto text-zone-evacuation mb-1" />
            <p className="text-lg font-bold text-foreground">{disasterZones.filter(z => z.level === 'evacuation').length}</p>
            <p className="text-[10px] text-muted-foreground">{t('shelters')}</p>
          </div>
        </div>

        {/* Nearby Contacts */}
        {nearbyContacts.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('nearest_emergency')}</p>
            {nearbyContacts.map(c => (
              <a
                key={c.id}
                href={`tel:${c.phone}`}
                className="flex items-center gap-3 rounded-xl bg-card border border-border p-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-foreground">{c.name}</p>
                  <p className="text-[10px] text-muted-foreground">{c.distance} away • {c.phone}</p>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Settings Section */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('settings')}</p>

          {/* Language Selector */}
          <div className="rounded-xl bg-card border border-border p-3 space-y-2">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">{t('language')}</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {availableLanguages.map(lang => (
                <button
                  key={lang.name}
                  onClick={() => setLanguage(lang.name)}
                  className={`text-left rounded-lg px-3 py-2 text-xs transition-colors ${
                    currentLangName === lang.name
                      ? 'bg-primary/10 text-primary border border-primary/30'
                      : 'bg-secondary text-foreground hover:bg-accent border border-transparent'
                  }`}
                >
                  <span className="font-medium">{lang.nativeName}</span>
                  <span className="block text-[10px] text-muted-foreground">{countryFlags[lang.country]} {lang.country}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Logout */}
        <Button variant="outline" className="w-full gap-2 border-border" onClick={logout}>
          <LogOut className="h-4 w-4" />
          {t('sign_out')}
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;
