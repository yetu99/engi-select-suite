import { Link, useLocation } from 'react-router-dom';
import { Search, BarChart3, Star, PlusCircle, Lightbulb, GitCompareArrows } from 'lucide-react';
import { useMaterials } from '@/context/MaterialContext';

const navItems = [
  { to: '/', label: 'Dashboard', icon: Search },
  { to: '/favoriten', label: 'Favoriten', icon: Star },
  { to: '/vergleich', label: 'Vergleich', icon: GitCompareArrows },
  { to: '/empfehlung', label: 'Empfehlung', icon: Lightbulb },
  { to: '/hinzufuegen', label: 'Hinzufügen', icon: PlusCircle },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { compareIds } = useMaterials();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card shadow-header">
        <div className="flex items-center h-12 px-4 max-w-[1600px] mx-auto">
          <Link to="/" className="flex items-center gap-2 mr-8">
            <BarChart3 className="w-5 h-5 text-primary" />
            <span className="font-semibold text-body tracking-tight">Material Select</span>
          </Link>
          <nav className="flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-label transition-colors duration-150 ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                  {to === '/vergleich' && compareIds.length > 0 && (
                    <span className="ml-1 bg-primary text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-semibold">
                      {compareIds.length}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="max-w-[1600px] mx-auto">
        {children}
      </main>
    </div>
  );
}
