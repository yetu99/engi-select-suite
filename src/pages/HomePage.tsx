import { Link } from 'react-router-dom';
import { Database, Compass, ArrowRight, FlaskConical } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-6">
      {/* Header */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 text-primary text-xs font-medium tracking-wide">
          <FlaskConical className="w-3.5 h-3.5" />
          Engineering Material Platform
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-[1.1]">
          Material<span className="text-primary">Select</span>
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto leading-relaxed">
          Werkstoffdatenbank und Auslegungswerkzeuge für die systematische Materialauswahl.
        </p>
      </div>

      {/* Module Cards — compact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl w-full">
        <Link
          to="/datenbank"
          className="group relative overflow-hidden rounded-xl border border-border/60 bg-card px-5 py-4 transition-all duration-300 hover:shadow-blue-lg hover:border-primary/30 hover:-translate-y-0.5"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl gradient-blue flex items-center justify-center shadow-blue flex-shrink-0">
              <Database className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold tracking-tight text-foreground mb-1">Materialdatenbank</h2>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                88 Werkstoffe durchsuchen, filtern, vergleichen und als Favoriten speichern.
              </p>
              <div className="flex items-center gap-1.5 text-primary text-xs font-semibold mt-2">
                Öffnen <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </Link>

        <Link
          to="/engineering"
          className="group relative overflow-hidden rounded-xl border border-border/60 bg-card px-5 py-4 transition-all duration-300 hover:shadow-blue-lg hover:border-primary/30 hover:-translate-y-0.5"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(220,80%,42%)] to-[hsl(217,91%,60%)] flex items-center justify-center shadow-blue flex-shrink-0">
              <Compass className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold tracking-tight text-foreground mb-1">Auslegungsassistent</h2>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                Werkstoffauswahl nach Ashby mit Charts, Ranking und Dimensionierung.
              </p>
              <div className="flex items-center gap-1.5 text-primary text-xs font-semibold mt-2">
                Starten <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Footer */}
      <p className="text-[10px] text-muted-foreground/50 mt-8">
        SI-Einheiten · Quellen: Ashby, CES EduPack, MatWeb
      </p>
    </div>
  );
}
