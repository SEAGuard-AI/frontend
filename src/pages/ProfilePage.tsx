import { useAuth } from '@/contexts/AuthContext';
import { disasterZones, alerts, disasterReports, educationGuides } from '@/data/mockData';
import {
  User, LogOut, Shield, Bell, MapPin, ChevronRight,
  Droplets, Mountain, BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [showReports, setShowReports] = useState(false);
  const [showEducation, setShowEducation] = useState(false);

  // Mock: user is in a warning zone
  const userZone = disasterZones.find(z => z.level === 'warning' && z.country === 'Indonesia');
  const unreadAlerts = alerts.filter(a => !a.read).length;

  const zoneColors: Record<string, string> = {
    safe: 'hsl(142, 70%, 45%)',
    caution: 'hsl(45, 95%, 55%)',
    warning: 'hsl(25, 95%, 55%)',
    danger: 'hsl(0, 85%, 55%)',
  };

  const zoneLabels: Record<string, string> = {
    safe: 'Safe Zone',
    caution: 'Alert / Caution',
    warning: 'Warning Zone',
    danger: 'Danger Zone',
  };

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
            <MapPin className="h-5 w-5 mx-auto text-zone-warning mb-1" />
            <p className="text-lg font-bold text-foreground">{disasterZones.filter(z => z.level !== 'safe').length}</p>
            <p className="text-[10px] text-muted-foreground">Active Zones</p>
          </div>
          <div className="rounded-xl bg-card border border-border p-3 text-center">
            <Shield className="h-5 w-5 mx-auto text-zone-safe mb-1" />
            <p className="text-lg font-bold text-foreground">{disasterZones.filter(z => z.level === 'safe').length}</p>
            <p className="text-[10px] text-muted-foreground">Safe Zones</p>
          </div>
        </div>

        {/* Disaster Reports */}
        <div>
          <button
            onClick={() => setShowReports(!showReports)}
            className="w-full flex items-center justify-between rounded-xl bg-card border border-border p-4"
          >
            <div className="flex items-center gap-3">
              <Droplets className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Disaster Reports</span>
            </div>
            <ChevronRight className={cn('h-4 w-4 text-muted-foreground transition-transform', showReports && 'rotate-90')} />
          </button>
          {showReports && (
            <div className="mt-2 space-y-2">
              {disasterReports.map(report => (
                <div key={report.id} className="rounded-xl bg-card border border-border p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    {report.disasterType === 'flood'
                      ? <Droplets className="h-4 w-4 text-zone-caution" />
                      : <Mountain className="h-4 w-4 text-zone-warning" />
                    }
                    <span className="text-xs font-medium" style={{ color: zoneColors[report.severity] }}>
                      {report.country} • {report.date}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">{report.title}</h3>
                  <p className="text-xs text-muted-foreground">{report.summary}</p>
                  <p className="text-xs text-muted-foreground">Affected: {report.affectedPopulation.toLocaleString()} people</p>
                  <div className="space-y-1 mt-2">
                    {report.timeline.map((t, i) => (
                      <div key={i} className="flex gap-2 text-[11px]">
                        <span className="text-muted-foreground font-mono shrink-0">{t.time}</span>
                        <span className="text-foreground">{t.event}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Education Hub */}
        <div>
          <button
            onClick={() => setShowEducation(!showEducation)}
            className="w-full flex items-center justify-between rounded-xl bg-card border border-border p-4"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Safety Guides</span>
            </div>
            <ChevronRight className={cn('h-4 w-4 text-muted-foreground transition-transform', showEducation && 'rotate-90')} />
          </button>
          {showEducation && (
            <div className="mt-2 space-y-2">
              {educationGuides.map(guide => (
                <div key={guide.id} className="rounded-xl bg-card border border-border p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-2">{guide.icon} {guide.title}</h3>
                  <ul className="space-y-1.5">
                    {guide.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span className="text-primary mt-0.5">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
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
