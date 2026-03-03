import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Map, Phone, Bell, User, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { alerts } from '@/data/mockData';
import { useTranslation } from '@/contexts/TranslationContext';

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const unreadCount = alerts.filter(a => !a.read).length;

  const hideBar = location.pathname.includes('/ar');

  const navItems = [
    { path: '/', icon: Home, label: t('home') },
    { path: '/map', icon: Map, label: t('map') },
    { path: '/contacts', icon: Phone, label: t('contacts') },
    { path: '/profile', icon: User, label: t('profile') },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      {!hideBar && (
        <aside className="hidden lg:flex flex-col w-60 border-r border-border bg-card shrink-0">
          {/* Logo */}
          <div className="flex items-center gap-2.5 px-5 h-16 border-b border-border shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <span className="text-base font-bold text-foreground tracking-tight">ADRRS</span>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map(({ path, icon: Icon, label }) => {
              const active = location.pathname === path;
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>

          {/* Sidebar Alerts Button */}
          <div className="px-3 pb-4">
            <button
              onClick={() => navigate('/alerts')}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                location.pathname === '/alerts'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <div className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                    {unreadCount}
                  </span>
                )}
              </div>
              <span>Alerts</span>
            </button>
          </div>
        </aside>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile Top Bar */}
        {!hideBar && (
          <div className="flex lg:hidden items-center justify-between px-4 pt-[env(safe-area-inset-top)] py-2 bg-card border-b border-border shrink-0">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm font-bold text-foreground">ADRRS</span>
            </div>
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

        {/* Desktop Top Bar */}
        {!hideBar && (
          <div className="hidden lg:flex items-center justify-end gap-2 px-6 h-16 border-b border-border bg-card shrink-0">
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
            <button
              onClick={() => navigate('/profile')}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-full bg-secondary border border-border transition-colors',
                location.pathname === '/profile' ? 'border-primary' : 'hover:border-primary/50'
              )}
            >
              <User className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        )}

        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>

        {/* Mobile Bottom Tab Bar */}
        {!hideBar && (
          <nav className="flex lg:hidden items-center justify-around border-t border-border bg-card px-2 pb-[env(safe-area-inset-bottom)] h-16 shrink-0">
            {navItems.map(({ path, icon: Icon, label }) => {
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
    </div>
  );
};

export default AppLayout;
