import { Link, useLocation } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border/50 shadow-header">
        <div className="flex items-center h-14 px-6 max-w-[1600px] mx-auto">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl gradient-blue flex items-center justify-center shadow-blue">
              <BarChart3 className="w-4.5 h-4.5 text-primary-foreground" />
            </div>
            <span className="font-bold text-[15px] tracking-tight">
              Material<span className="text-primary">Select</span>
            </span>
          </Link>
        </div>
      </header>
      <main className="max-w-[1600px] mx-auto">
        {children}
      </main>
    </div>
  );
}
