import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Target, Settings, Package, ChevronRight, ChevronDown, X,
  Layers, Eye, Factory, Lightbulb, Rocket, BarChart3,
  Recycle, ClipboardList, ShieldCheck, BookOpen, RefreshCw,
  ArrowRight, Info, CheckCircle2, Download, ExternalLink,
  Wrench, Search, FileText
} from 'lucide-react';

/* ─────── Activities with methods from PGE PDF ─────── */
const peActivities = [
  {
    key: 'manage_projects', label: 'Projekte managen', icon: ClipboardList,
    desc: 'Projektplanung, -steuerung und -controlling über den gesamten PEP. Definition von Projektzielen, Arbeitspaketen und Meilensteinen.',
    methods: [
      { name: 'Projektstrukturplan (PSP)', desc: 'Vollständige hierarchische Darstellung aller Aufgaben eines Projekts als Baumdiagramm.' },
      { name: 'SCRUM Framework', desc: 'Agiles Framework mit kurzen Sprints, Daily Scrums und iterativer Entwicklung.' },
      { name: 'Arbeitspakete', desc: 'Klar definierte Aufgabeneinheiten mit Start-/Endzeitpunkt, Verantwortlichem und Kostenschätzung.' },
      { name: 'RASI-Methode', desc: 'Responsible, Accountable, Support, Informed — Zuordnung von Verantwortlichkeiten.' },
      { name: 'Kapazitätsplanung', desc: 'Ressourcenplanung für Personal, Budget und Maschinen.' },
      { name: 'Kostenplanung', desc: 'Budgetierung und Kostenverfolgung über den Projektverlauf.' },
    ],
    example: 'Meilensteinplan mit GANTT-Diagramm, Risikomanagement, Sprint-Planung für ein Getriebe-Redesign.',
    templateHint: 'Projektstrukturplan-Vorlage, GANTT-Chart Template',
  },
  {
    key: 'validate', label: 'Validieren & Verifizieren', icon: ShieldCheck,
    desc: 'Prüfung ob das Produkt die Anforderungen (Validierung) und Spezifikationen (Verifikation) erfüllt. Schnittstelle zwischen Produkt- und Validierungssystementwicklung.',
    methods: [
      { name: 'IPEK-X-in-the-Loop', desc: 'Framework zur Validierung auf verschiedenen Abstraktionsebenen — von virtuell bis physisch.' },
      { name: 'Design of Experiments (DoE)', desc: 'Statistische Versuchsplanung zur systematischen Untersuchung von Einflussfaktoren.' },
      { name: 'Kritikalitätsbewertung', desc: 'Einschätzung des Risikoniveaus bezüglich Impact und Wahrscheinlichkeit.' },
      { name: 'Versuchsplanung (7 Schritte)', desc: 'Systematischer Ablauf: Ausgangssituation → Ziel → Faktoren → Versuchsplan → Durchführung → Auswertung → Maßnahmen.' },
    ],
    example: 'Hardware-in-the-Loop-Test eines Bremssystems, FEM-Simulation mit DoE für Parametervariation.',
    templateHint: 'Versuchsplan-Vorlage, DoE-Matrix',
  },
  {
    key: 'knowledge', label: 'Wissen managen', icon: BookOpen,
    desc: 'Überblick über interne und externe Daten, Informationen und Fähigkeiten schaffen. Identifikation, Erwerb, Entwicklung, Verteilung, Nutzung und Bewahrung von Wissen.',
    methods: [
      { name: 'Wissensmodell nach Probst', desc: 'Kreislauf: Wissensziele → Identifikation → Erwerb → Entwicklung → Verteilung → Nutzung → Bewahrung → Bewertung.' },
      { name: 'Normwissensstrategie', desc: 'Matrix aus Wissensvorsprung vs. interner Nutzung zur Ableitung von Strategien.' },
      { name: 'Lessons Learned', desc: 'Systematische Erfassung und Auswertung von Erfahrungen zur Fehlervermeidung.' },
      { name: 'Datenbanken', desc: 'Relationale, objektorientierte, hierarchische oder NoSQL-Datenbanken zur Wissensspeicherung.' },
    ],
    example: 'Lessons-Learned-Workshop nach Serienanlauf, Knowledge-Base im Wiki pflegen.',
    templateHint: 'Lessons-Learned-Vorlage, Wissensmatrix',
  },
  {
    key: 'changes', label: 'Änderungen managen', icon: RefreshCw,
    desc: 'Systematische Planung und Durchführung des Änderungsprozesses (ECM nach VDA 4965). Koordination technischer und wirtschaftlicher Änderungen.',
    methods: [
      { name: 'Ursache-Wirkungs-Diagramm (Ishikawa)', desc: 'Grafische Darstellung von Ursachen die zu einem Ergebnis führen — Fischgrätendiagramm mit 7M.' },
      { name: 'Design-Struktur-Matrix (DSM)', desc: 'Universelle Methode zur Beschreibung von Verknüpfungen in komplexen Systemen. Kennwerte: Aktivsumme, Passivsumme, Kritikalität.' },
      { name: 'ECR/ECO-Prozess', desc: 'Engineering Change Request/Order — strukturierter Änderungsprozess von Identifikation bis Implementierung.' },
    ],
    example: 'Ishikawa-Analyse für Dichtungsversagen, DSM zur Analyse von Baugruppenabhängigkeiten.',
    templateHint: 'Ishikawa-Vorlage, DSM-Matrix-Template',
  },
  {
    key: 'profiles', label: 'Profile finden', icon: Eye,
    desc: 'Identifikation von Anbieter-, Anwender- und Kundennutzen. Erstellung von Profilen die den Lösungsraum für weitere Aktivitäten beschreiben.',
    methods: [
      { name: 'Persona-Methode', desc: 'Fiktive Nutzerprofile erstellen mit Bedürfnissen, Zielen und Verhaltensweisen. Arbeitsschritte: Zielgruppe → typische Vertreter → Interaktion mit Produkt.' },
      { name: 'Kano-Methode', desc: 'Klassifizierung von Kundenanforderungen in Basis-, Leistungs- und Begeisterungsanforderungen.' },
      { name: 'Quality Function Deployment (QFD)', desc: 'Kundenanforderungen systematisch in technische Merkmale übersetzen mittels House of Quality.' },
    ],
    example: 'Persona „Montagetechniker Max" erstellen, Kano-Fragebogen für Linearführungssystem auswerten.',
    templateHint: 'Persona-Canvas, Kano-Fragebogen, House of Quality',
  },
  {
    key: 'ideas', label: 'Ideen finden', icon: Lightbulb,
    desc: 'Ganzheitliche Lösungssuche bei IST-SOLL-Abweichungen. Kreativitätspotenzial maximal ausschöpfen, Vorfixierungen überwinden.',
    methods: [
      { name: 'TRIZ', desc: 'Theorie des erfinderischen Problemlösens — Nutzung von Gesetzmäßigkeiten aus 2,5 Mio. analysierten Patenten. Widerspruchstabelle mit 40 Innovationsprinzipien.' },
      { name: 'Morphologischer Kasten', desc: 'Problem in Parameter zerlegen → Teillösungen aufstellen → kombinieren → optimale Lösung wählen.' },
      { name: 'Reizbildmethode', desc: 'Bilder lösen Assoziationen außerhalb bestehender Denkmuster aus — fördert intuitives Denken.' },
      { name: 'Funktionsanalyse', desc: 'Wertanalyseobjekte auf Wirkungen, Zwecke und Konzepte analysieren → Funktionsbaum erstellen.' },
      { name: 'Paarweiser Vergleich', desc: 'Systematischer Vergleich von Alternativen zur Rangfolgenbildung.' },
      { name: 'Nutzwertanalyse', desc: 'Scoring-Modell mit gewichteten Kriterien zur objektiven Bewertung von Alternativen.' },
      { name: 'SWOT-Analyse', desc: 'Stärken, Schwächen, Chancen, Risiken — mit SO/ST/WO/WT-Kombinationsstrategien.' },
    ],
    example: 'TRIZ-Widerspruchsmatrix für Gewichtsreduktion vs. Steifigkeit, Morphologischer Kasten für Antriebskonzepte.',
    templateHint: 'Morphologischer Kasten, Nutzwertanalyse-Vorlage, SWOT-Matrix',
  },
  {
    key: 'model', label: 'Prinziplösung & Gestalt modellieren', icon: Layers,
    desc: 'Konzepte entwickeln und in konkrete Gestalt überführen. Methodisches Entwickeln von Lösungsprinzipien nach VDI 2222/2223.',
    methods: [
      { name: 'VDI 2222 — Lösungsprinzipien', desc: 'Klären der Aufgabe → Funktionen ermitteln → Lösungsprinzipien suchen → Gestalt festlegen.' },
      { name: 'Konstruktionskataloge', desc: 'Externer Informationsspeicher: Objekt-, Operations- und Lösungskataloge.' },
      { name: 'VDI 2223 — Gestaltung', desc: 'Zerlegung in Teilverbände und Einzelteile. Gestalt- und Werkstoffeigenschaften festlegen.' },
      { name: 'C&C²-Ansatz', desc: 'Contact & Channel — Modellierung von Gestalt-Funktion-Zusammenhängen in technischen Systemen.' },
      { name: 'FMEA', desc: 'Fehlermöglichkeits- und Einflussanalyse zur Risikobewertung. RPZ = A × B × E.' },
    ],
    example: 'VDI 2222 Funktionsstruktur → Wirkprinzipien → CAD-Entwurf, FMEA für Getriebestufe.',
    templateHint: 'Anforderungsliste, FMEA-Formblatt, C&C²-Vorlage',
  },
  {
    key: 'prototype', label: 'Prototyp aufbauen', icon: Package,
    desc: 'Physische oder virtuelle Prototypen für die Validierung erstellen. Passende Validierungsumgebung wählen.',
    methods: [
      { name: 'Filter-Fidelity-Modell (FF-Profil)', desc: 'Abstufung des Detailgrads von Prototypen — von Low-Fidelity Skizzen bis High-Fidelity Funktionsmustern.' },
      { name: 'Wizard of Oz-Prototyp', desc: 'Mensch simuliert im Hintergrund Systemfunktionalität für den Testnutzer.' },
    ],
    example: '3D-gedruckter Funktionsprototyp für Ergonomietest, FEM-Simulation als virtueller Prototyp.',
    templateHint: 'FF-Profil-Vorlage',
  },
  {
    key: 'produce', label: 'Produzieren', icon: Factory,
    desc: 'Fertigungsprozess etablieren und Produkt herstellen. Berücksichtigung von Fertigungsverfahren und Produktionstypen.',
    methods: [
      { name: 'Fertigungsverfahren-Auswahl', desc: 'Systematische Auswahl basierend auf Stückzahl, Material, Toleranzen und Kosten.' },
      { name: 'Produktionstypen', desc: 'Einzel-, Serien-, Massenfertigung — Einfluss auf Prozessgestaltung.' },
    ],
    example: 'Spritzguss-Werkzeug fertigen, Serienanlauf mit Produktionsplanungstool durchführen.',
    templateHint: 'Fertigungsverfahren-Übersicht',
  },
  {
    key: 'launch', label: 'Markteinführung', icon: Rocket,
    desc: 'Produkt am Markt einführen. Analyse von Zielgruppen, Wettbewerb und Positionierung.',
    methods: [
      { name: 'ABC-Umsatzanalyse', desc: 'Klassifizierung von Produkten nach Umsatzanteil (A=wichtig, C=unwichtig).' },
      { name: 'Portfolioanalyse (BCG-Matrix)', desc: 'Stars, Cash Cows, Question Marks, Poor Dogs — strategische Produktpositionierung.' },
      { name: 'Zielgruppenanalyse', desc: 'Lead-User-Ansatz und Marktsegmentierung.' },
    ],
    example: 'Launch-Event mit Vertriebsschulung, BCG-Matrix für Produktportfolio erstellen.',
    templateHint: 'BCG-Matrix-Vorlage, Launch-Checklist',
  },
  {
    key: 'utilization', label: 'Nutzung analysieren & gestalten', icon: BarChart3,
    desc: 'Produktverhalten im Feld auswerten. Trend- und Szenarioanalysen durchführen.',
    methods: [
      { name: 'Trend-/Szenarioanalyse', desc: 'Zukunftsszenarien entwickeln und Produktstrategie ableiten.' },
      { name: 'Kundenbefragung / Beobachtung', desc: 'Systematische Erfassung von Nutzererfahrungen und Feldverhalten.' },
      { name: 'Nutzersimulation', desc: 'Virtuelle Simulation des Nutzungsverhaltens.' },
    ],
    example: 'Felddaten-Dashboard auswerten, Kundenbefragung nach 12 Monaten Betrieb.',
    templateHint: 'Kundenbefragungs-Vorlage',
  },
  {
    key: 'decommission', label: 'Abbau analysieren & gestalten', icon: Recycle,
    desc: 'End-of-Life-Prozesse bewerten — Recycling-Kaskade, Demontagekonzepte.',
    methods: [
      { name: 'Recycling-Kaskade', desc: 'Stufenweise Verwertung von Materialien und Komponenten.' },
      { name: 'Demontageanalyse', desc: 'Bewertung der Zerlegbarkeit für Recycling und Wiederverwendung.' },
    ],
    example: 'Demontagekonzept entwickeln, Recyclingquoten nach ISO 22628 berechnen.',
    templateHint: 'Demontage-Checkliste',
  },
];

/* ─────── Layer definitions ─────── */
const layers = [
  { key: 'strategy', label: 'Strategie', color: 'hsl(220,70%,55%)' },
  { key: 'production', label: 'Produktionssystem', color: 'hsl(210,65%,50%)' },
  { key: 'validation', label: 'Validierungssystem', color: 'hsl(200,60%,48%)' },
  { key: 'product_n1', label: 'Produkt Gn+1', color: 'hsl(190,55%,42%)' },
  { key: 'product_n', label: 'Produkt Gn', color: 'hsl(175,50%,38%)' },
];

/* ─────── System Triple ─────── */
const systemParts = [
  { key: 'objectives', label: 'Zielsystem', subtitle: 'System of Objectives', icon: Target, color: 'hsl(217,91%,50%)', desc: 'Alle expliziten Ziele, Abhängigkeiten und Randbedingungen des Produkts.' },
  { key: 'operation', label: 'Handlungssystem', subtitle: 'Operation System', icon: Settings, color: 'hsl(210,70%,45%)', desc: 'Aktivitäten, Methoden, Prozesse und Ressourcen (Personal, Budget, Maschinen).' },
  { key: 'objects', label: 'Objektsystem', subtitle: 'System of Objects', icon: Package, color: 'hsl(200,65%,42%)', desc: 'Das Ergebnis — am Ende das fertige Produkt.' },
];

type ViewMode = 'overview' | 'activity';

export default function IPeMModel() {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [activeLayer, setActiveLayer] = useState<string>('product_n');
  const [expandedMethod, setExpandedMethod] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('overview');

  const activity = selectedActivity ? peActivities.find(a => a.key === selectedActivity) : null;

  const openActivity = (key: string) => {
    setSelectedActivity(key);
    setExpandedMethod(null);
    setViewMode('activity');
  };

  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Das integrierte Produktentwicklungsmodell (iPeM)
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
          Das iPeM nach Prof. Albers (KIT/IPEK) ist ein generisches Meta-Modell zur situationsspezifischen 
          Modellierung von Produktentwicklungsprozessen. Klicke auf die Bereiche des Modells, um Details und Methoden zu erkunden.
        </p>
        <div className="flex flex-wrap gap-2">
          <a href="https://raw.githubusercontent.com/yetu99/engi-select-suite/main/public/papers/iPeM_Albers_2016.pdf" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline">
            <BookOpen className="w-3.5 h-3.5" /> Originalpaper (Albers et al., 2016)
          </a>
          <a href="https://raw.githubusercontent.com/yetu99/engi-select-suite/main/public/papers/PGE_Zusammenfassung.pdf" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline">
            <FileText className="w-3.5 h-3.5" /> PGE-Zusammenfassung (PDF)
          </a>
        </div>
      </div>

      {/* ── Interactive iPeM Diagram ── */}
      <Card className="border-border/60 overflow-hidden">
        <CardContent className="p-4 sm:p-6">
          <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">1</div>
            Interaktives iPeM-Modell
            <Badge variant="secondary" className="text-[9px] ml-auto">Klicke auf Bereiche zum Erkunden</Badge>
          </h3>

          <div className="relative">
            {/* The layered diagram visualization */}
            <div className="flex gap-3">
              {/* Left: System of Objectives */}
              <button
                onClick={() => { setSelectedActivity(null); setViewMode('overview'); }}
                className={`writing-mode-vertical flex-shrink-0 w-10 rounded-lg border-2 flex items-center justify-center text-[10px] font-bold tracking-wider transition-all cursor-pointer hover:scale-[1.02] ${
                  viewMode === 'overview' && !selectedActivity ? 'border-primary bg-primary/10 text-primary' : 'border-border/50 bg-muted/30 text-muted-foreground hover:border-primary/40'
                }`}
                style={{ minHeight: '320px', writingMode: 'vertical-lr', textOrientation: 'mixed', transform: 'rotate(180deg)' }}
              >
                ZIELSYSTEM
              </button>

              {/* Center: Layered operation system */}
              <div className="flex-1 space-y-1.5">
                {layers.map((layer, i) => (
                  <button
                    key={layer.key}
                    onClick={() => setActiveLayer(layer.key)}
                    className={`w-full rounded-lg border px-3 py-2 transition-all duration-200 text-left ${
                      activeLayer === layer.key
                        ? 'border-primary/40 shadow-md scale-[1.01]'
                        : 'border-border/30 opacity-50 hover:opacity-75'
                    }`}
                    style={{
                      background: activeLayer === layer.key
                        ? `linear-gradient(135deg, ${layer.color}15, ${layer.color}08)`
                        : undefined,
                      marginLeft: `${i * 6}px`,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: layer.color }} />
                      <span className="text-[11px] font-bold text-foreground">{layer.label}</span>
                      <span className="text-[9px] text-muted-foreground ml-auto">Handlungssystem</span>
                    </div>
                    {activeLayer === layer.key && (
                      <div className="grid grid-cols-3 gap-1.5 mt-2">
                        {/* PE Activities */}
                        <div className="col-span-1 rounded-md bg-background/60 border border-border/30 p-1.5">
                          <p className="text-[8px] font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Aktivitäten der PE</p>
                          <div className="space-y-0.5">
                            {peActivities.slice(0, 6).map(a => (
                              <button
                                key={a.key}
                                onClick={(e) => { e.stopPropagation(); openActivity(a.key); }}
                                className={`w-full text-left text-[9px] px-1.5 py-0.5 rounded transition-colors ${
                                  selectedActivity === a.key ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-foreground/70'
                                }`}
                              >
                                {a.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        {/* Problem solving (SPALTEN) */}
                        <div className="col-span-1 rounded-md bg-background/60 border border-border/30 p-1.5">
                          <p className="text-[8px] font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Problemlösung</p>
                          <div className="flex gap-0.5 mb-1">
                            {'SPALTEN'.split('').map(l => (
                              <div key={l} className="w-4 h-4 rounded text-[8px] font-bold flex items-center justify-center text-white" style={{ background: layer.color }}>
                                {l}
                              </div>
                            ))}
                          </div>
                          <div className="space-y-0.5">
                            {peActivities.slice(6).map(a => (
                              <button
                                key={a.key}
                                onClick={(e) => { e.stopPropagation(); openActivity(a.key); }}
                                className={`w-full text-left text-[9px] px-1.5 py-0.5 rounded transition-colors ${
                                  selectedActivity === a.key ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-foreground/70'
                                }`}
                              >
                                {a.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        {/* Phase model */}
                        <div className="col-span-1 rounded-md bg-background/60 border border-border/30 p-1.5">
                          <p className="text-[8px] font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Phasenmodell</p>
                          <div className="space-y-1">
                            {['Referenzprozess', 'SOLL-Prozess', 'IST-Prozess'].map(p => (
                              <div key={p} className="flex items-center gap-1">
                                <div className="h-1 flex-1 rounded-full" style={{ background: layer.color, opacity: p === 'IST-Prozess' ? 1 : 0.4 }} />
                                <span className="text-[8px] text-muted-foreground w-16 text-right">{p}</span>
                              </div>
                            ))}
                            <p className="text-[8px] text-muted-foreground/60 italic mt-1">Zeitliche Abfolge der Aktivitäten</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Right: System of Objects (stacked) */}
              <div className="flex-shrink-0 flex gap-0.5">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className={`w-6 rounded-lg border border-border/30 flex items-center justify-center ${i === 0 ? 'bg-muted/40' : 'bg-muted/20'}`}
                    style={{ minHeight: '320px', writingMode: 'vertical-lr' as any, textOrientation: 'mixed' as any, transform: 'rotate(180deg)' }}
                  >
                    <span className="text-[8px] font-bold text-muted-foreground tracking-wider">
                      {i === 0 ? 'OBJEKTSYSTEM' : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── System Triple ── */}
      <div>
        <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">2</div>
          Systemtripel der Produktentwicklung
        </h3>
        <div className="grid md:grid-cols-3 gap-3">
          {systemParts.map(s => {
            const Icon = s.icon;
            return (
              <Card key={s.key} className="border-border/50">
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: s.color }}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{s.label}</p>
                    <p className="text-[10px] text-muted-foreground italic">{s.subtitle}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{s.desc}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <div className="flex items-center justify-center gap-2 mt-3 text-xs text-muted-foreground">
          <Badge variant="outline" className="text-[10px]">Zielsystem</Badge>
          <ArrowRight className="w-3.5 h-3.5 text-primary" />
          <Badge variant="outline" className="text-[10px]">Handlungssystem</Badge>
          <ArrowRight className="w-3.5 h-3.5 text-primary" />
          <Badge variant="outline" className="text-[10px]">Objektsystem</Badge>
        </div>
      </div>

      {/* ── Activity Detail Panel ── */}
      {activity && viewMode === 'activity' && (
        <Card className="border-primary/30 shadow-lg">
          <div className="h-1 bg-primary" />
          <CardContent className="p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                  {(() => { const Icon = activity.icon; return <Icon className="w-5 h-5 text-white" />; })()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">{activity.label}</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed max-w-2xl">{activity.desc}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0" onClick={() => { setSelectedActivity(null); setViewMode('overview'); }}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Methods */}
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Methoden & Werkzeuge ({activity.methods.length})
              </p>
              <div className="space-y-1.5">
                {activity.methods.map(m => {
                  const isOpen = expandedMethod === m.name;
                  return (
                    <button
                      key={m.name}
                      onClick={() => setExpandedMethod(isOpen ? null : m.name)}
                      className={`w-full text-left rounded-lg border px-3 py-2 transition-all ${
                        isOpen ? 'bg-primary/5 border-primary/30' : 'border-border/40 hover:border-primary/20'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Wrench className={`w-3.5 h-3.5 flex-shrink-0 ${isOpen ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className="text-xs font-medium text-foreground flex-1">{m.name}</span>
                        {isOpen ? <ChevronDown className="w-3 h-3 text-muted-foreground" /> : <ChevronRight className="w-3 h-3 text-muted-foreground" />}
                      </div>
                      {isOpen && (
                        <p className="text-[11px] text-muted-foreground leading-relaxed mt-1.5 pl-5">{m.desc}</p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Example */}
            <div className="rounded-lg bg-muted/50 border border-border/40 px-3 py-2.5">
              <p className="text-[10px] font-semibold text-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                <Lightbulb className="w-3 h-3 text-amber-500" /> Praxisbeispiel
              </p>
              <p className="text-xs text-foreground/70 leading-relaxed">{activity.example}</p>
            </div>

            {/* Template hint — links to Templates module */}
            <div className="rounded-lg bg-primary/5 border border-primary/15 px-3 py-2.5 flex items-start gap-2">
              <Download className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-semibold text-primary uppercase tracking-wider">Templates</p>
                <p className="text-xs text-foreground/70">{activity.templateHint}</p>
                <a href="/templates" className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline mt-1">
                  Zum Template-Bereich <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── PGE Insight ── */}
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
