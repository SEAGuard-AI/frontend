import { useAuth } from '@/contexts/AuthContext';
import { usePreferences } from '@/contexts/UserPreferencesContext';
import { disasterZones, alerts, countryFlags } from '@/data/mockData';
import {
  User, LogOut, Shield, Bell, MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type ZoneLevel } from '@/data/mockData';

const zoneColors: Record<ZoneLevel, string> = {
  evacuation: 'hsl(var(--zone-evacuation))',
  caution: 'hsl(var(--zone-caution))',
  danger: 'hsl(var(--zone-danger))',
};

const zoneLabels: Record<ZoneLevel, string> = {
  evacuation: 'Near Evacuation Point',
  caution: 'Caution Zone',
  danger: 'Danger Zone',
};

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { preferences } = usePreferences();

  const userZone = disasterZones.find(z => z.level === 'caution' && z.country === (preferences.country || 'Indonesia'));
  const unreadAlerts = alerts.filter(a => !a.read).length;

  return (
    <div className="h-full overflow-y-auto bg-background">
      <div className="px-4 pt-6 pb-6 space-y-5">
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

        {/* Current Status */}
        {userZone && (
          <div
            className="rounded-xl border-2 p-4 space-y-2"
            style={{ borderColor: zoneColors[userZone.level] + '60', background: zoneColors[userZone.level] + '10' }}
          >
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full animate-pulse-emergency" style={{ background: zoneColors[userZone.level] }} />
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
