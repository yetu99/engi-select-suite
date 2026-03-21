import { Link } from 'react-router-dom';
import {
  Database, Compass, ArrowRight, FlaskConical,
  Lightbulb, CircleDot, Search, Ruler,
  BookOpen, GanttChart, Droplets, FolderDown
} from 'lucide-react';
import { useMaterials } from '@/context/MaterialContext';
import { Badge } from '@/components/ui/badge';
import type { LucideIcon } from 'lucide-react';

interface Module {
  title: string;
  description: string;
  icon: LucideIcon;
  route: string;
  status: 'active' | 'coming_soon';
  cta: string;
  gradient: string;
}

const modules: Module[] = [
  {
    title: 'Materialdatenbank',
    description: 'Werkstoffe durchsuchen, filtern, vergleichen und als Favoriten speichern.',
    icon: Database,
    route: '/datenbank',
    status: 'active',
    cta: 'Öffnen',
    gradient: 'from-[hsl(217,91%,50%)] to-[hsl(217,91%,62%)]',
  },
  {
    title: 'Auslegungsassistent',
    description: 'Werkstoffauswahl nach Ashby mit Charts, Ranking und Dimensionierung.',
    icon: Compass,
    route: '/engineering',
    status: 'active',
    cta: 'Starten',
    gradient: 'from-[hsl(220,80%,42%)] to-[hsl(217,91%,60%)]',
  },
  {
    title: 'Problemlösung & Methodik',
    description: 'VDI 2221/2222, iPeM und SPALTEN nach Prof. Albers.',
    icon: Lightbulb,
    route: '/methodik',
    status: 'coming_soon',
    cta: 'Bald verfügbar',
    gradient: 'from-[hsl(210,70%,45%)] to-[hsl(210,70%,58%)]',
  },
  {
    title: 'O-Ring-Auslegung',
    description: 'Berechnung und Auswahl nach Hersteller-Handbuch.',
    icon: CircleDot,
    route: '/oring',
    status: 'coming_soon',
    cta: 'Bald verfügbar',
    gradient: 'from-[hsl(200,65%,42%)] to-[hsl(200,65%,56%)]',
  },
  {
    title: 'Schadenskunde',
    description: 'Schadensursachen identifizieren mit Bildanalyse.',
    icon: Search,
    route: '/schadenskunde',
    status: 'coming_soon',
    cta: 'Bald verfügbar',
    gradient: 'from-[hsl(225,60%,48%)] to-[hsl(225,60%,62%)]',
  },
  {
    title: 'Tolerierung & Messtechnik',
    description: 'Toleranzrechner nach DIN ISO 286-1, Passungssysteme.',
    icon: Ruler,
    route: '/tolerierung',
    status: 'coming_soon',
    cta: 'Bald verfügbar',
    gradient: 'from-[hsl(215,55%,44%)] to-[hsl(215,55%,58%)]',
  },
  {
    title: 'Normen-Übersicht',
    description: 'ISO, VDI und DIN Normen filtern und durchsuchen.',
    icon: BookOpen,
    route: '/normen',
    status: 'coming_soon',
    cta: 'Bald verfügbar',
    gradient: 'from-[hsl(205,60%,40%)] to-[hsl(205,60%,55%)]',
  },
  {
    title: 'Projektplanung',
    description: 'Gantt-Diagramm-Vorlagen erstellen und herunterladen.',
    icon: GanttChart,
    route: '/projektplanung',
    status: 'coming_soon',
    cta: 'Bald verfügbar',
    gradient: 'from-[hsl(222,50%,46%)] to-[hsl(222,50%,60%)]',
  },
  {
    title: 'Hydraulik-Auslegung',
    description: 'Hydraulische Systeme berechnen und dimensionieren.',
    icon: Droplets,
    route: '/hydraulik',
    status: 'coming_soon',
    cta: 'Bald verfügbar',
    gradient: 'from-[hsl(195,65%,40%)] to-[hsl(195,65%,55%)]',
  },
  {
    title: 'Template-Datenbank',
    description: 'Excel- und PDF-Vorlagen herunterladen.',
    icon: FolderDown,
    route: '/templates',
    status: 'coming_soon',
    cta: 'Bald verfügbar',
    gradient: 'from-[hsl(212,55%,42%)] to-[hsl(212,55%,56%)]',
  },
];

export default function HomePage() {
  const { materials } = useMaterials();

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center px-6 py-10">
      {/* Header */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 text-primary text-xs font-medium tracking-wide">
          <FlaskConical className="w-3.5 h-3.5" />
          Engineering Toolkit
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-[1.1]">
          Engi<span className="text-primary">Select</span>
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
          Dein persönliches Engineering-Toolkit — Werkstoffdaten, Auslegung, Methodik und mehr.
        </p>
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 max-w-5xl w-full">
        {modules.map((m) => {
          const Icon = m.icon;
          const isActive = m.status === 'active';
          const Wrapper = isActive ? Link : 'div';
          const wrapperProps = isActive ? { to: m.route } : {};

          return (
            <Wrapper
              key={m.route}
              {...(wrapperProps as any)}
              className={`group relative overflow-hidden rounded-xl border bg-card px-4 py-4 transition-all duration-300 ${
                isActive
                  ? 'border-border/60 hover:shadow-blue-lg hover:border-primary/30 hover:-translate-y-0.5 cursor-pointer'
                  : 'border-border/30 opacity-60 cursor-default'
              }`}
            >
              {/* Background glow */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}

              <div className="relative flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${m.gradient} flex items-center justify-center shadow-sm flex-shrink-0`}>
                    <Icon className="w-4.5 h-4.5 text-white" />
                  </div>
                  {!isActive && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 font-medium">
                      Bald
                    </Badge>
                  )}
                </div>

                <div>
                  <h2 className="text-sm font-bold tracking-tight text-foreground mb-0.5 leading-tight">{m.title}</h2>
                  <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                    {m.title === 'Materialdatenbank'
                      ? `${materials.length} ${m.description}`
                      : m.description}
                  </p>
                </div>

                {isActive && (
                  <div className="flex items-center gap-1 text-primary text-xs font-semibold">
                    {m.cta} <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </div>
                )}
              </div>
            </Wrapper>
          );
        })}
      </div>

      {/* Footer */}
      <p className="text-[10px] text-muted-foreground/50 mt-8">
        SI-Einheiten · Quellen: Ashby, CES EduPack, MatWeb
      </p>
    </div>
  );
}
