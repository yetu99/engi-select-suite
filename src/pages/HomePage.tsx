import { Link } from 'react-router-dom';
import { Database, Compass, ArrowRight, BarChart3, Layers, FlaskConical, Search } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-4xl w-full space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-primary text-xs font-medium tracking-wide">
              <FlaskConical className="w-3.5 h-3.5" />
              Engineering Material Platform
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              Material<span className="text-primary">Select</span>
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
              Werkstoffdatenbank und Auslegungswerkzeuge für die systematische Materialauswahl im Engineering.
            </p>
          </div>

          {/* Module Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Materialdatenbank */}
            <Link
              to="/datenbank"
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-7 transition-all duration-300 hover:shadow-blue-lg hover:border-primary/30 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative space-y-5">
                <div className="w-14 h-14 rounded-2xl gradient-blue flex items-center justify-center shadow-blue">
                  <Database className="w-7 h-7 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-foreground mb-2">Materialdatenbank</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    88 technische Werkstoffe mit detaillierten Kennwerten durchsuchen, filtern, vergleichen und als Favoriten speichern.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Suche & Filter', 'Vergleich', 'Favoriten', 'Kennwerte'].map((tag) => (
                    <span key={tag} className="text-[11px] font-medium text-primary/80 bg-primary/8 px-2.5 py-1 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-primary text-sm font-semibold pt-1">
                  Datenbank öffnen
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>

            {/* Auslegungstool */}
            <Link
              to="/engineering"
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-7 transition-all duration-300 hover:shadow-blue-lg hover:border-primary/30 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative space-y-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[hsl(220,80%,42%)] to-[hsl(217,91%,60%)] flex items-center justify-center shadow-blue">
                  <Compass className="w-7 h-7 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-foreground mb-2">Auslegungsassistent</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Systematische Werkstoffauswahl nach Ashby-Methode mit interaktiven Charts, Ranking und mechanischer Dimensionierung.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Ashby-Charts', 'Materialindex', 'Dimensionierung', 'Ranking'].map((tag) => (
                    <span key={tag} className="text-[11px] font-medium text-primary/80 bg-primary/8 px-2.5 py-1 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-primary text-sm font-semibold pt-1">
                  Auslegung starten
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer hint */}
      <div className="text-center pb-8">
        <p className="text-xs text-muted-foreground/60">
          Alle Werkstoffkennwerte in SI-Einheiten · Quellen: Ashby, CES EduPack, MatWeb
        </p>
      </div>
    </div>
  );
}
