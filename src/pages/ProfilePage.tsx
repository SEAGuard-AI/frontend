import { useAuth } from '@/contexts/AuthContext';
import { usePreferences } from '@/contexts/UserPreferencesContext';
import { useNavigate } from 'react-router-dom';
import {
  disasterZones, alerts, countryFlags, emergencyContacts,
  countryDefaultCenters, type ZoneLevel
} from '@/data/mockData';
import {
  User, LogOut, Shield, Bell, MapPin, Navigation, Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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

const zoneLabels: Record<ZoneLevel, string> = {
  evacuation: 'Near Evacuation Point',
  caution: 'Caution Zone',
  danger: 'Danger Zone',
};

const userIcon = L.divIcon({
  className: '',
  html: '<div style="width:14px;height:14px;border-radius:50%;background:#3b82f6;border:3px solid #fff;box-shadow:0 0 8px rgba(59,130,246,0.6)"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { preferences } = usePreferences();
  const navigate = useNavigate();

  const userCountry = preferences.country || 'Indonesia';
  const userZone = disasterZones.find(z => z.level === 'caution' && z.country === userCountry)
    || disasterZones.find(z => z.country === userCountry);
  const unreadAlerts = alerts.filter(a => !a.read).length;
  const center = userZone ? userZone.center : (countryDefaultCenters[userCountry] || [-6.2, 106.845]);
  const nearbyZones = disasterZones.filter(z => z.country === userCountry);
  const nearbyContacts = emergencyContacts.filter(c => c.country === userCountry).slice(0, 2);
  const isInDanger = userZone && (userZone.level === 'caution' || userZone.level === 'danger');

  return (
    <div className="h-full overflow-y-auto bg-background">
      <div className="px-4 pt-6 pb-6 space-y-4">
        {/* User Info */}
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary border border-border">
            <User className="h-7 w-7 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">{user?.name || 'User'}</h1>
            <p className="text-sm text-muted-foreground">{user?.email || 'Guest access'}</p>
            {preferences.country && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {countryFlags[preferences.country]} {preferences.country} • {preferences.language}
              </p>
            )}
          </div>
        </div>

        {/* Mini Map — Current Location */}
        <div className="rounded-xl overflow-hidden border border-border">
          <div className="h-44">
            <MapContainer
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
                Your Current Status
              </span>
            </div>
            <p className="text-foreground text-sm font-medium">
              You are in a <strong style={{ color: zoneColors[userZone.level] }}>{zoneLabels[userZone.level]}</strong>
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
            Get Evacuation Guide
          </Button>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-card border border-border p-3 text-center">
            <Bell className="h-5 w-5 mx-auto text-primary mb-1" />
            <p className="text-lg font-bold text-foreground">{unreadAlerts}</p>
            <p className="text-[10px] text-muted-foreground">Unread Alerts</p>
          </div>
          <div className="rounded-xl bg-card border border-border p-3 text-center">
            <MapPin className="h-5 w-5 mx-auto text-zone-caution mb-1" />
            <p className="text-lg font-bold text-foreground">{disasterZones.filter(z => z.level !== 'evacuation').length}</p>
            <p className="text-[10px] text-muted-foreground">Active Zones</p>
          </div>
          <div className="rounded-xl bg-card border border-border p-3 text-center">
            <Shield className="h-5 w-5 mx-auto text-zone-evacuation mb-1" />
            <p className="text-lg font-bold text-foreground">{disasterZones.filter(z => z.level === 'evacuation').length}</p>
            <p className="text-[10px] text-muted-foreground">Shelters</p>
          </div>
        </div>

        {/* Nearby Contacts */}
        {nearbyContacts.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Nearest Emergency</p>
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

        {/* Logout */}
        <Button variant="outline" className="w-full gap-2 border-border" onClick={logout}>
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;
