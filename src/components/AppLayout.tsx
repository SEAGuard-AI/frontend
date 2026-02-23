import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Map, Bell, Phone, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { alerts } from '@/data/mockData';

const tabs = [
  { path: '/', icon: Map, label: 'Map' },
  { path: '/alerts', icon: Bell, label: 'Alerts' },
  { path: '/contacts', icon: Phone, label: 'Contacts' },
  { path: '/profile', icon: User, label: 'Profile' },
];

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const unreadCount = alerts.filter(a => !a.read).length;

  // Hide bottom bar on AR view
  const hideBar = location.pathname.includes('/ar');

  return (
    <div className="flex h-screen flex-col bg-background">
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
      {!hideBar && (
        <nav className="flex items-center justify-around border-t border-border bg-card px-2 pb-[env(safe-area-inset-bottom)] h-16 shrink-0">
          {tabs.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
            const isMapActive = path === '/' && location.pathname === '/';
            const active = isActive || isMapActive;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-1 relative transition-colors',
                  active ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <div className="relative">
                  <Icon className="h-6 w-6" />
                  {label === 'Alerts' && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {unreadCount}
                    </span>
                  )}
                </div>
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
