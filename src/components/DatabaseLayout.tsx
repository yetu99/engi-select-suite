import { Link, useLocation, Outlet } from 'react-router-dom';
import { Search, Star, GitCompareArrows, Lightbulb, PlusCircle, ArrowLeft } from 'lucide-react';
import { useMaterials } from '@/context/MaterialContext';
import { useReadOnly } from '@/hooks/useReadOnly';

const navItems = [
  { to: '/datenbank', label: 'Übersicht', icon: Search },
  { to: '/datenbank/favoriten', label: 'Favoriten', icon: Star },
  { to: '/datenbank/vergleich', label: 'Vergleich', icon: GitCompareArrows },
  { to: '/datenbank/empfehlung', label: 'Empfehlung', icon: Lightbulb },
  { to: '/datenbank/hinzufuegen', label: 'Hinzufügen', icon: PlusCircle, hideReadOnly: true },
];

export default function DatabaseLayout() {
  const location = useLocation();
  const { compareIds } = useMaterials();
  const readOnly = useReadOnly();

  return (
    <div>
      <div className="sticky top-14 z-40 bg-card/80 backdrop-blur-md border-b border-border/50">
        <div className="flex items-center gap-1 px-6 h-11 max-w-[1600px] mx-auto">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mr-4 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Start
          </Link>
          <div className="w-px h-5 bg-border mr-3" />
          {navItems
            .filter(item => !(item.hideReadOnly && readOnly))
            .map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to || 
                (to !== '/datenbank' && location.pathname.startsWith(to));
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                  {to === '/datenbank/vergleich' && compareIds.length > 0 && (
                    <span className="ml-0.5 bg-primary-foreground/20 text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold">
                      {compareIds.length}
                    </span>
                  )}
                </Link>
              );
            })}
        </div>
      </div>
      <Outlet />
    </div>
  );
}
