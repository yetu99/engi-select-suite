import { Link, useLocation } from 'react-router-dom';
import { Search, BarChart3, Star, PlusCircle, Lightbulb, GitCompareArrows, FlaskConical } from 'lucide-react';
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
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center h-14 px-6 max-w-[1600px] mx-auto">
          <Link to="/" className="flex items-center gap-2.5 mr-10">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <BarChart3 className="w-4.5 h-4.5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-[15px] tracking-tight">Material Select</span>
          </Link>
          <nav className="flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                  {to === '/vergleich' && compareIds.length > 0 && (
                    <span className="ml-0.5 bg-primary-foreground/20 text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
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
