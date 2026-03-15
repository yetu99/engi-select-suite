import { Link, Outlet } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';

export default function EngineeringLayout() {
  return (
    <div>
      <div className="sticky top-14 z-40 bg-card/80 backdrop-blur-md border-b border-border/50">
        <div className="flex items-center gap-3 px-6 h-11 max-w-[1600px] mx-auto">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Start
          </Link>
          <div className="w-px h-5 bg-border" />
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <Compass className="w-3.5 h-3.5 text-primary" />
            Auslegungsassistent
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
