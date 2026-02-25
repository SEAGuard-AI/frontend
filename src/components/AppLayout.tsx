import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Map, Phone, Bell, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { alerts } from '@/data/mockData';
import { useTranslation } from '@/contexts/TranslationContext';

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const unreadCount = alerts.filter(a => !a.read).length;

  const hideBar = location.pathname.includes('/ar');

  const bottomTabs = [
    { path: '/', icon: Home, label: t('home') },
    { path: '/map', icon: Map, label: t('map') },
    { path: '/contacts', icon: Phone, label: t('contacts') },
    { path: '/profile', icon: User, label: t('profile') },
  ];

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Top Bar — Notifications only */}
      {!hideBar && (
        <div className="flex items-center justify-end gap-1 px-4 pt-[env(safe-area-inset-top)] py-2 bg-card border-b border-border shrink-0">
          <button
            onClick={() => navigate('/alerts')}
            className={cn(
              'relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
              location.pathname === '/alerts' ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:bg-accent'
            )}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      )}

      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>

      {/* Bottom Tab Bar — includes Profile */}
      {!hideBar && (
        <nav className="flex items-center justify-around border-t border-border bg-card px-2 pb-[env(safe-area-inset-bottom)] h-16 shrink-0">
          {bottomTabs.map(({ path, icon: Icon, label }) => {
            const active = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={cn(
                  'flex flex-col items-center gap-1 px-4 py-1 transition-colors',
                  active ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <Icon className="h-6 w-6" />
                <span className="text-[10px] font-medium">{label}</span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
};

export default AppLayout;
