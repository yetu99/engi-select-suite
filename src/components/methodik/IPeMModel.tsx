import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Target, Settings, Package, ChevronRight, ChevronDown,
  Layers, Eye, Factory, Lightbulb, Rocket, BarChart3,
  Recycle, ClipboardList, ShieldCheck, BookOpen, RefreshCw,
  ArrowRight, Info, CheckCircle2
} from 'lucide-react';

/* ─── System Triple ─── */
const systemTriple = [
  {
    key: 'objectives',
    title: 'Zielsystem',
    subtitle: 'System of Objectives',
    icon: Target,
    color: 'hsl(217,91%,50%)',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    description: 'Umfasst alle expliziten Ziele des zu entwickelnden Produkts, einschließlich Abhängigkeiten und Randbedingungen.',
    example: 'z. B. Anforderungsliste, Lastenheft, Zielkatalog mit priorisierten Produktanforderungen',
  },
  {
    key: 'operation',
    title: 'Handlungssystem',
    subtitle: 'Operation System',
    icon: Settings,
    color: 'hsl(210,70%,45%)',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/30',
    description: 'Sozio-technisches System aus strukturierten Aktivitäten, Methoden, Prozessen und Ressourcen (Personal, Budget, Maschinen).',
    example: 'z. B. Entwicklungsteam + CAD-Tools + Prüfstände + SPALTEN-Methode als Problemlösungsprozess',
  },
  {
    key: 'objects',
    title: 'Objektsystem',
    subtitle: 'System of Objects',
    icon: Package,
    color: 'hsl(200,65%,42%)',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    description: 'Das Ergebnis — am Ende des Entwicklungsprozesses entspricht es dem fertigen Produkt.',
    example: 'z. B. fertig konstruiertes Bauteil, validierter Prototyp, serienreifes Produkt',
  },
];

/* ─── Activities ─── */
const peActivities = [
  { key: 'profiles', label: 'Profile erkennen', icon: Eye, desc: 'Markt- und Technologietrends identifizieren, Anforderungsprofile erstellen.', example: 'Benchmark-Analyse der Wettbewerbsprodukte, Kundeninterviews durchführen' },
  { key: 'ideas', label: 'Ideen erkennen', icon: Lightbulb, desc: 'Produktideen generieren und bewerten.', example: 'Brainstorming-Workshop mit morphologischem Kasten für neue Antriebskonzepte' },
  { key: 'model', label: 'Prinziplösung & Gestalt modellieren', icon: Layers, desc: 'Konzepte entwickeln und in konkrete Gestalt überführen.', example: 'Funktionsstruktur → Wirkprinzipien → CAD-Entwurf eines Getriebegehäuses' },
  { key: 'prototype', label: 'Prototyp aufbauen', icon: Package, desc: 'Physische oder virtuelle Prototypen für Validierung erstellen.', example: '3D-gedruckter Funktionsprototyp oder FEM-Simulation des Bauteils' },
  { key: 'produce', label: 'Produzieren', icon: Factory, desc: 'Fertigungsprozess etablieren und Produkt herstellen.', example: 'Spritzguss-Werkzeug fertigen, Serienanlauf planen und durchführen' },
  { key: 'launch', label: 'Markteinführung', icon: Rocket, desc: 'Produkt am Markt einführen.', example: 'Launch-Event, Vertriebsschulung, erste Kundenauslieferungen' },
  { key: 'utilization', label: 'Nutzung analysieren', icon: BarChart3, desc: 'Produktverhalten im Feld auswerten.', example: 'Felddaten auswerten, Kundenfeedback systematisch erfassen' },
  { key: 'decommission', label: 'Stilllegung analysieren', icon: Recycle, desc: 'End-of-Life-Prozesse bewerten (Recycling, Entsorgung).', example: 'Demontagekonzept entwickeln, Recyclingquoten berechnen' },
];

const basicActivities = [
  { key: 'manage_projects', label: 'Projekte managen', icon: ClipboardList, desc: 'Projektplanung, -steuerung und -controlling über den gesamten PEP.', example: 'Meilensteinplan mit GANTT-Diagramm, Risikomanagement' },
  { key: 'validate', label: 'Validieren & Verifizieren', icon: ShieldCheck, desc: 'Prüfung ob Produkt die Anforderungen (Validierung) und Spezifikationen (Verifikation) erfüllt.', example: 'Hardware-in-the-Loop-Test, Belastungstest nach DIN-Norm' },
  { key: 'knowledge', label: 'Wissen managen', icon: BookOpen, desc: 'Daten, Informationen und Kompetenzen identifizieren, erwerben, verteilen und pflegen.', example: 'Lessons-Learned-Datenbank, Knowledge-Base im Wiki pflegen' },
  { key: 'changes', label: 'Änderungen managen', icon: RefreshCw, desc: 'Technische, wirtschaftliche und soziale Änderungen koordinieren.', example: 'ECR/ECO-Prozess für eine Designänderung nach Kundenfeedback' },
];

/* ─── Layers ─── */
const layers = [
  { key: 'product', title: 'Produktschicht', subtitle: 'Entwicklung des Produkts selbst — abbildbar für mehrere Produktgenerationen (Gn, Gn+1).', color: 'hsl(217,91%,50%)' },
  { key: 'strategy', title: 'Strategieschicht', subtitle: 'Strategische Produktplanung und Portfoliomanagement.', color: 'hsl(210,70%,45%)' },
  { key: 'production', title: 'Produktionssystemschicht', subtitle: 'Entwicklung des Fertigungssystems parallel zum Produkt.', color: 'hsl(200,65%,42%)' },
  { key: 'validation', title: 'Validierungssystemschicht', subtitle: 'Entwicklung des Validierungssystems (Prüfstände, Testumgebungen).', color: 'hsl(225,60%,48%)' },
];

export default function IPeMModel() {
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);
  const [activeLayer, setActiveLayer] = useState<string>('product');

  const toggle = (key: string) => setExpandedActivity(prev => prev === key ? null : key);

  return (
    <div className="space-y-8">
      {/* Intro */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Das integrierte Produktentwicklungsmodell (iPeM)
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
          Das iPeM nach Prof. Albers (KIT/IPEK) ist ein generisches Meta-Modell zur situationsspezifischen 
          Modellierung von Produktentwicklungsprozessen. Es basiert auf dem <strong>Systemtripel</strong> und 
          verknüpft Ziele, Handlungen und Ergebnisse in einem ganzheitlichen Rahmen.
        </p>
        <a
          href="/papers/iPeM_Albers_2016.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline mt-1"
        >
          <BookOpen className="w-3.5 h-3.5" /> Originalpaper lesen (Albers et al., 2016)
        </a>
      </div>

      {/* ── Section 1: System Triple ── */}
      <div>
        <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">1</div>
          Systemtripel der Produktentwicklung
        </h3>
        <div className="grid md:grid-cols-3 gap-3">
          {systemTriple.map((s, i) => {
            const Icon = s.icon;
            return (
              <Card key={s.key} className={`${s.bg} ${s.border} border`}>
                <CardHeader className="pb-2 pt-4 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: s.color }}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-sm">{s.title}</CardTitle>
                      <p className="text-[10px] text-muted-foreground italic">{s.subtitle}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-2">
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.description}</p>
                  <div className="rounded-md bg-background/60 border border-border/40 px-3 py-2">
                    <p className="text-[11px] text-foreground/80"><strong>Beispiel:</strong> {s.example}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        {/* Flow arrow */}
        <div className="flex items-center justify-center gap-2 mt-3 text-xs text-muted-foreground">
          <Badge variant="outline" className="text-[10px]">Zielsystem</Badge>
          <ArrowRight className="w-3.5 h-3.5 text-primary" />
          <Badge variant="outline" className="text-[10px]">Handlungssystem</Badge>
          <ArrowRight className="w-3.5 h-3.5 text-primary" />
          <Badge variant="outline" className="text-[10px]">Objektsystem</Badge>
        </div>
      </div>

      {/* ── Section 2: Activities ── */}
      <div>
        <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">2</div>
          Aktivitäten des Handlungssystems
        </h3>

        {/* PE Activities */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-primary" /> Produktentwicklungsaktivitäten
          </p>
          <div className="grid sm:grid-cols-2 gap-2">
            {peActivities.map(a => {
              const Icon = a.icon;
              const open = expandedActivity === a.key;
              return (
                <button
                  key={a.key}
                  onClick={() => toggle(a.key)}
                  className={`text-left rounded-lg border px-3 py-2.5 transition-all duration-200 ${
                    open ? 'bg-primary/5 border-primary/30 shadow-sm' : 'bg-card border-border/50 hover:border-primary/20'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${open ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="text-xs font-medium text-foreground flex-1">{a.label}</span>
                    {open ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
                  </div>
                  {open && (
                    <div className="mt-2 pl-6 space-y-1.5">
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{a.desc}</p>
                      <div className="rounded bg-background/60 border border-border/40 px-2.5 py-1.5">
                        <p className="text-[10px] text-foreground/70"><strong>Beispiel:</strong> {a.example}</p>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Basic Activities */}
        <div>
          <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5 text-primary" /> Basisaktivitäten <span className="font-normal text-muted-foreground">(parallel & kontinuierlich)</span>
          </p>
          <div className="grid sm:grid-cols-2 gap-2">
            {basicActivities.map(a => {
              const Icon = a.icon;
              const open = expandedActivity === a.key;
              return (
                <button
                  key={a.key}
                  onClick={() => toggle(a.key)}
                  className={`text-left rounded-lg border px-3 py-2.5 transition-all duration-200 ${
                    open ? 'bg-primary/5 border-primary/30 shadow-sm' : 'bg-card border-border/50 hover:border-primary/20'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${open ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="text-xs font-medium text-foreground flex-1">{a.label}</span>
                    {open ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
                  </div>
                  {open && (
                    <div className="mt-2 pl-6 space-y-1.5">
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{a.desc}</p>
                      <div className="rounded bg-background/60 border border-border/40 px-2.5 py-1.5">
                        <p className="text-[10px] text-foreground/70"><strong>Beispiel:</strong> {a.example}</p>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Section 3: Layers ── */}
      <div>
        <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">3</div>
          Mehrdimensionale Projektion — Schichten
        </h3>
        <p className="text-xs text-muted-foreground mb-3 max-w-2xl">
          Jede Schicht enthält die gleiche Struktur (Aktivitäten + Phasenmodell), wird aber 
          auf den jeweiligen Betrachtungsgegenstand projiziert. So können z. B. Produktgenerationen 
          (Gn, Gn+1) in eigenen Schichten abgebildet werden.
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          {layers.map(l => (
            <Button
              key={l.key}
              variant={activeLayer === l.key ? 'default' : 'outline'}
              size="sm"
              className="text-xs h-7 gap-1.5"
              onClick={() => setActiveLayer(l.key)}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: l.color }} />
              {l.title}
            </Button>
          ))}
        </div>

        {layers.filter(l => l.key === activeLayer).map(l => (
          <Card key={l.key} className="border-border/60">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: l.color }}>
                  <Layers className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{l.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{l.subtitle}</p>
                </div>
              </div>

              {/* Visual: stacked layers */}
              <div className="mt-4 space-y-1">
                {layers.map((layer, i) => (
                  <div
                    key={layer.key}
                    className={`h-8 rounded-md flex items-center px-3 text-[10px] font-medium text-white transition-all duration-300 ${
                      layer.key === activeLayer ? 'opacity-100 scale-[1.02]' : 'opacity-30 scale-100'
                    }`}
                    style={{
                      background: layer.color,
                      marginLeft: `${i * 8}px`,
                    }}
                  >
                    {layer.title}
                    {layer.key === activeLayer && <CheckCircle2 className="w-3 h-3 ml-auto" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Key Insight ── */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 flex gap-3">
          <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-xs text-foreground/80 leading-relaxed space-y-1">
            <p className="font-semibold text-foreground">Kernprinzip: Produktgenerationsentwicklung (PGE)</p>
            <p>
              Über 80 % aller Produkte werden in Generationen entwickelt. Das iPeM bildet dies durch 
              mehrere Produktschichten (Gn, Gn+1, …) ab und ermöglicht die Koordination von Übernahme- 
              und Neuentwicklungsanteilen zwischen Generationen.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
