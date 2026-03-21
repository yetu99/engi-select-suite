import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FileText, Search, Lightbulb, CheckCircle2, Layers, Puzzle,
  PenTool, PackageCheck, ShieldCheck, ExternalLink, ChevronRight,
  ChevronLeft, ArrowRight, IterationCw, BookOpen, Target, Zap,
  ListChecks, Combine, ClipboardList
} from 'lucide-react';

/* ──────────────────── Data ──────────────────── */

interface VdiActivity {
  id: number;
  title: string;
  titleEn: string;
  icon: React.ElementType;
  color: string;
  description: string;
  goals: string[];
  results: string[];
  methods: { name: string; desc: string }[];
  example: string;
  vdiRef: string;
}

const activities: VdiActivity[] = [
  {
    id: 1,
    title: 'Klären und Präzisieren der Aufgabe',
    titleEn: 'Clarification of problem / task',
    icon: Search,
    color: 'hsl(220, 70%, 50%)',
    description:
      'Analyse der Ausgangssituation, Sammlung und Strukturierung aller relevanten Informationen. Erstellen der Anforderungsliste als zentrale Dokumentation aller Forderungen und Wünsche.',
    goals: [
      'Problemverständnis vertiefen',
      'Anforderungsliste erstellen / aktualisieren',
      'Stakeholder identifizieren',
      'Randbedingungen und Restriktionen klären',
    ],
    results: ['Anforderungsliste (Lastenheft → Pflichtenheft)', 'Stakeholder-Analyse'],
    methods: [
      { name: 'Anforderungsliste', desc: 'Systematische Erfassung aller Forderungen (F) und Wünsche (W) mit Quellenverweis.' },
      { name: 'Stakeholder-Analyse', desc: 'Identifikation aller Interessensgruppen und ihrer Anforderungen.' },
      { name: 'Fragelisten / Checklisten', desc: 'Leitfaden-basiertes Abfragen aller relevanten Aspekte (Betrieb, Fertigung, Kosten …).' },
      { name: 'Benchmarking', desc: 'Vergleich mit existierenden Konkurrenz- und Referenzprodukten.' },
    ],
    example:
      'Für einen Industrierobotergreifer: Tragkraft, Greifweite, Zykluszeit, Schnittstelle zum Roboterarm, Schutzart, max. Masse, Kostenobergrenze werden als Anforderungen dokumentiert.',
    vdiRef: 'VDI 2221 Blatt 1, Abschnitt 4.2.1 · VDI 2222 Blatt 1, Abschnitt 3.1',
  },
  {
    id: 2,
    title: 'Ermitteln von Funktionen und deren Strukturen',
    titleEn: 'Determination of functions and their structures',
    icon: Layers,
    color: 'hsl(200, 65%, 48%)',
    description:
      'Abstraktion der Aufgabe auf funktionaler Ebene. Aufstellung der Gesamtfunktion als Black Box sowie Zerlegung in Teilfunktionen und deren Verknüpfung zu Funktionsstrukturen.',
    goals: [
      'Gesamtfunktion als Black Box formulieren',
      'Teilfunktionen ableiten',
      'Funktionsstruktur erstellen',
      'Stoff-, Energie- und Signalflüsse definieren',
    ],
    results: ['Funktionsstruktur (Gesamtfunktion → Teilfunktionen)', 'Stoff-/Energie-/Signalflussplan'],
    methods: [
      { name: 'Black-Box-Methode', desc: 'Abstraktion: Input → System → Output ohne Betrachtung des inneren Aufbaus.' },
      { name: 'Funktionsbaum', desc: 'Hierarchische Zerlegung der Gesamtfunktion in Sub- und Elementarfunktionen.' },
      { name: 'Funktionsstruktur', desc: 'Netzwerkartige Verknüpfung einzelner Funktionen mit Stoff-, Energie- und Signalflüssen.' },
    ],
    example:
      'Greifer: Gesamtfunktion = „Werkstück greifen, halten, positionieren, loslassen". Teilfunktionen: Kraft erzeugen, Kraft übertragen, Position fixieren, Werkstück freigeben.',
    vdiRef: 'VDI 2221 Blatt 1, Abschnitt 4.2.2 · VDI 2222 Blatt 1, Abschnitt 3.3',
  },
  {
    id: 3,
    title: 'Suchen nach Lösungsprinzipien und deren Strukturen',
    titleEn: 'Search for solution principles and their structures',
    icon: Lightbulb,
    color: 'hsl(45, 85%, 48%)',
    description:
      'Für jede Teilfunktion werden physikalische Effekte und Wirkprinzipien gesucht. Kombination zu prinzipiellen Gesamtlösungen mittels morphologischem Kasten oder ähnlichen Ordnungsschemata.',
    goals: [
      'Physikalische Effekte identifizieren',
      'Wirkprinzipien zuordnen',
      'Lösungsvarianten systematisch erzeugen',
      'Prinzipielle Lösungen dokumentieren',
    ],
    results: ['Morphologischer Kasten', 'Prinzipielle Lösungsvarianten (Skizzen)'],
    methods: [
      { name: 'Morphologischer Kasten', desc: 'Matrix aus Teilfunktionen × Lösungsprinzipien; Kombination ergibt Gesamtlösungsvarianten.' },
      { name: 'Brainstorming / 6-3-5', desc: 'Kreativtechniken zur Ideenfindung im Team.' },
      { name: 'TRIZ', desc: 'Theorie des erfinderischen Problemlösens – systematische Nutzung physikalischer Widersprüche.' },
      { name: 'Konstruktionskataloge', desc: 'Geordnete Sammlungen von Lösungen, Effekten und Konstruktionselementen (VDI 2222 Blatt 2).' },
      { name: 'Bionik / Analogien', desc: 'Übertragung von Lösungsprinzipien aus Natur oder anderen Technikbereichen.' },
    ],
    example:
      'Kraft erzeugen: pneumatisch, hydraulisch, elektrisch, mechanisch (Feder). → Morphologischer Kasten kombiniert pneumatische Kraft + Parallelkinematik + Formschluss.',
    vdiRef: 'VDI 2221 Blatt 1, Abschnitt 4.2.3 · VDI 2222 Blatt 1, Abschnitte 3.4–4.3',
  },
  {
    id: 4,
    title: 'Bewerten und Auswählen von Lösungskonzepten',
    titleEn: 'Assessment and selection of solution concepts',
    icon: CheckCircle2,
    color: 'hsl(150, 55%, 42%)',
    description:
      'Systematische Bewertung der erarbeiteten Lösungsvarianten anhand gewichteter Kriterien. Auswahl der vielversprechendsten Konzepte für die Weiterbearbeitung.',
    goals: [
      'Bewertungskriterien aus Anforderungen ableiten',
      'Vorauswahl (Ausschlusskriterien)',
      'Bewertung (Nutzwertanalyse, Paarvergleich)',
      'Entscheidung und Dokumentation',
    ],
    results: ['Bewertungsmatrix', 'Ausgewähltes Lösungskonzept', 'Entscheidungsdokumentation'],
    methods: [
      { name: 'Nutzwertanalyse (NWA)', desc: 'Gewichtete Bewertung der Varianten anhand von Kriterien mit Punkteskala.' },
      { name: 'Paarweiser Vergleich', desc: 'Vergleich aller Varianten paarweise zur Ermittlung einer Rangfolge.' },
      { name: 'Technisch-wirtschaftliche Bewertung', desc: 'Gegenüberstellung von technischem Wert (s) und wirtschaftlichem Wert (w) nach VDI 2225.' },
      { name: 'Stärken-Schwächen-Profil', desc: 'Visuelle Darstellung der Vor- und Nachteile jeder Variante.' },
    ],
    example:
      'Drei Greiferkonzepte werden nach Tragkraft, Masse, Kosten, Zuverlässigkeit und Zykluszeit bewertet. Pneumatischer Parallelgreifer erzielt höchsten Nutzwert.',
    vdiRef: 'VDI 2221 Blatt 1, Abschnitt 4.2.4 · VDI 2225',
  },
  {
    id: 5,
    title: 'Gliedern in Module / Gestalten der Module',
    titleEn: 'Subdivision into modules / Shaping of modules',
    icon: Puzzle,
    color: 'hsl(270, 50%, 50%)',
    description:
      'Festlegung der Systemarchitektur: Aufteilung in realisierbare Module mit definierten Schnittstellen. Anschließende Gestaltung (Entwurf) der einzelnen Module und Baugruppen.',
    goals: [
      'Systemarchitektur definieren',
      'Schnittstellen spezifizieren',
      'Module entwerfen (Teilentwürfe)',
      'Werkstoffe und Fertigungsverfahren festlegen',
    ],
    results: ['Systemarchitektur', 'Schnittstellendefinitionen', 'Teilentwürfe der Module'],
    methods: [
      { name: 'Baustruktur / Stückliste', desc: 'Hierarchische Gliederung des Produkts in Baugruppen und Einzelteile.' },
      { name: 'Design for X (DfX)', desc: 'Gestaltungsrichtlinien: fertigungsgerecht, montagegerecht, recyclinggerecht etc.' },
      { name: 'FEM / Simulation', desc: 'Numerische Absicherung der Entwürfe bezüglich Festigkeit, Verformung, Thermik.' },
      { name: 'Toleranzanalyse', desc: 'Überprüfung der Maß- und Formtoleranzen an Schnittstellen (→ ISO 286-1).' },
    ],
    example:
      'Greifer wird gegliedert in: Grundkörper, Greifbacken, Antriebseinheit, Sensorik-Modul, Roboter-Schnittstelle. Jedes Modul bekommt definierte mechanische und elektrische Schnittstellen.',
    vdiRef: 'VDI 2221 Blatt 1, Abschnitte 4.2.5–4.2.6',
  },
  {
    id: 6,
    title: 'Integrieren des gesamten Produkts',
    titleEn: 'Integration of the product as a whole',
    icon: Combine,
    color: 'hsl(190, 60%, 42%)',
    description:
      'Zusammenführung aller Module zum Gesamtentwurf. Prüfung der Kompatibilität, Zusammenbaubarkeit und des Gesamtverhaltens.',
    goals: [
      'Module zum Gesamtprodukt zusammenführen',
      'Gesamtentwurf erstellen',
      'Kompatibilitätsprüfung an Schnittstellen',
      'Gesamtverhalten absichern (virtuell / physisch)',
    ],
    results: ['Gesamtentwurf (3D-Modell / Zeichnung)', 'Validierungsergebnisse'],
    methods: [
      { name: 'DMU (Digital Mock-Up)', desc: 'Virtueller Zusammenbau zur Kollisions- und Bauraumprüfung.' },
      { name: 'Prototyp / Funktionsmuster', desc: 'Physische Absicherung der Gesamtfunktion und Schnittstellen.' },
      { name: 'FMEA (System-FMEA)', desc: 'Risikobewertung auf Systemebene – Fehlerfolgen, -ursachen, Entdeckungsmaßnahmen.' },
    ],
    example:
      'Alle Greifer-Module werden im CAD zusammengebaut, Kollisionsprüfung durchgeführt, Gesamtmasse und Schwerpunkt berechnet, erster Prototyp gefertigt und getestet.',
    vdiRef: 'VDI 2221 Blatt 1, Abschnitt 4.2.7',
  },
  {
    id: 7,
    title: 'Ausarbeiten der Ausführungs- und Nutzungsangaben',
    titleEn: 'Elaboration of execution and usage requirements',
    icon: ClipboardList,
    color: 'hsl(340, 55%, 48%)',
    description:
      'Erstellen aller für die Produktion und Nutzung erforderlichen Dokumente: Fertigungszeichnungen, Stücklisten, Montageanleitungen, Betriebsanleitungen.',
    goals: [
      'Fertigungszeichnungen erstellen',
      'Stücklisten finalisieren',
      'Montage- und Betriebsanleitungen verfassen',
      'Produktdokumentation zur Freigabe vorbereiten',
    ],
    results: ['Fertigungszeichnungen', 'Stückliste', 'Montage-/Betriebsanleitung', 'Produktdokumentation'],
    methods: [
      { name: 'Technische Zeichnung / CAD', desc: 'Normgerechte Darstellung mit Maßen, Toleranzen, Oberflächenangaben nach ISO GPS.' },
      { name: 'Stückliste (BOM)', desc: 'Vollständige Aufstellung aller Bauteile mit Sachnummern, Mengen, Werkstoffen.' },
    ],
    example:
      'Fertigungszeichnungen für alle Greifer-Bauteile mit Toleranzen nach ISO 286-1, Oberflächenangaben, Werkstoffspezifikation. Montagereihenfolge dokumentiert.',
    vdiRef: 'VDI 2221 Blatt 1, Abschnitt 4.2.8',
  },
  {
    id: 8,
    title: 'Absicherung & Freigabe',
    titleEn: 'Assurance of fulfilment & release',
    icon: ShieldCheck,
    color: 'hsl(120, 45%, 40%)',
    description:
      'Durchgängige Validierung und Verifikation über den gesamten Prozess: Abgleich der Ergebnisse mit den Anforderungen – virtuell (Simulation) und physisch (Test). Abschluss: Freigabe der Produktdokumentation.',
    goals: [
      'Anforderungserfüllung nachweisen',
      'Validierung (richtiges Produkt?) und Verifikation (Produkt richtig umgesetzt?)',
      'Produktdokumentation freigeben',
    ],
    results: ['Prüfberichte', 'Freigabedokument', 'Lessons Learned'],
    methods: [
      { name: 'Versuch / Test', desc: 'Physische Prüfung an Prototypen oder Serienteilen.' },
      { name: 'Simulation (FEM, CFD, MKS)', desc: 'Virtuelle Absicherung von Festigkeit, Strömung, Dynamik.' },
      { name: 'Design Review / Gate Review', desc: 'Formale Überprüfung im Team an definierten Meilensteinen.' },
    ],
    example:
      'Greifer wird unter Volllast getestet: 100.000 Zyklen, Greifkraftmessung, Positioniergenauigkeit. Ergebnisse werden gegen Anforderungsliste geprüft → Freigabe.',
    vdiRef: 'VDI 2221 Blatt 1, Abschnitt 4.2.9',
  },
];

const problemSolvingSteps = [
  { label: 'Situationsanalyse', desc: 'Informationen über das Problem sammeln und analysieren' },
  { label: 'Zielformulierung', desc: 'Präzisierung des gewünschten Endzustands' },
  { label: 'Synthese von Lösungen', desc: 'Alternative Lösungsideen erarbeiten und kombinieren' },
  { label: 'Analyse von Lösungen', desc: 'Lösungsalternativen hinsichtlich Eigenschaften analysieren' },
  { label: 'Bewertung', desc: 'Systematische Bewertung anhand gewichteter Kriterien' },
  { label: 'Entscheidung', desc: 'Auswahl der besten Lösung und Dokumentation' },
];

const iterationTypes = [
  { name: 'Exploration', desc: 'Abwechselndes Erkunden von Problem und Lösung', color: 'hsl(220,60%,55%)' },
  { name: 'Konvergenz', desc: 'Annäherung an Zielzustand durch Anpassen vernetzter Parameter', color: 'hsl(150,50%,45%)' },
  { name: 'Korrektur', desc: 'Rückkehr zu früherem Schritt aufgrund neuer Erkenntnisse', color: 'hsl(0,55%,50%)' },
  { name: 'Vertiefung', desc: 'Detaillierung eines Teilaspekts vor Weitergehen', color: 'hsl(270,45%,50%)' },
];

/* ──────────────────── Component ──────────────────── */

export default function VdiProcess() {
  const [selectedActivity, setSelectedActivity] = useState<number>(1);
  const [view, setView] = useState<'overview' | 'detail'>('overview');

  const current = activities.find((a) => a.id === selectedActivity)!;
  const Icon = current.icon;

  return (
    <div className="space-y-6">
      {/* Intro */}
      <Card className="border-border/60 bg-gradient-to-br from-background to-muted/30">
        <CardContent className="pt-5 pb-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(220,70%,45%)] to-[hsl(200,65%,55%)] flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground text-sm">VDI 2221 / 2222 — Systematische Produktentwicklung</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Das allgemeine Modell der Produktentwicklung nach VDI 2221 (2019) beschreibt ein generisches, branchenunabhängiges Vorgehen
                in <strong>8 Aktivitäten</strong>. VDI 2222 ergänzt dies um Methoden zur systematischen Entwicklung von Lösungsprinzipien
                und den Einsatz von Konstruktionskatalogen. Der Prozess ist <strong>iterativ</strong> — Aktivitäten werden je nach Kontext
                vollständig, teilweise oder mehrmals durchlaufen.
              </p>
            </div>
          </div>

          {/* PDF links */}
          <div className="flex flex-wrap gap-2 pt-1">
            {[
              { label: 'VDI 2221 Bl. 1', href: '/papers/VDI_2221_Blatt_1.pdf' },
              { label: 'VDI 2221 Bl. 2', href: '/papers/VDI_2221_Blatt_2.pdf' },
              { label: 'VDI 2222 Bl. 1', href: '/papers/VDI_2222_Blatt_1.pdf' },
              { label: 'VDI 2222 Bl. 2', href: '/papers/VDI_2222_Blatt_2.pdf' },
            ].map((pdf) => (
              <a key={pdf.label} href={pdf.href} target="_blank" rel="noopener noreferrer">
                <Badge variant="outline" className="text-[10px] gap-1 cursor-pointer hover:bg-accent">
                  <FileText className="w-3 h-3" />
                  {pdf.label}
                  <ExternalLink className="w-2.5 h-2.5" />
                </Badge>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* View Toggle */}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={view === 'overview' ? 'default' : 'outline'}
          className="text-xs h-8"
          onClick={() => setView('overview')}
        >
          Prozessübersicht
        </Button>
        <Button
          size="sm"
          variant={view === 'detail' ? 'default' : 'outline'}
          className="text-xs h-8"
          onClick={() => setView('detail')}
        >
          Aktivität im Detail
        </Button>
      </div>

      {view === 'overview' ? (
        /* ─── OVERVIEW: Process Flow ─── */
        <div className="space-y-6">
          {/* Visual process flow */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                Allgemeines Modell der Produktentwicklung (Bild 10, VDI 2221)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {activities.map((act, idx) => {
                const ActIcon = act.icon;
                return (
                  <div key={act.id}>
                    <button
                      onClick={() => {
                        setSelectedActivity(act.id);
                        setView('detail');
                      }}
                      className={`w-full text-left p-3 rounded-lg border transition-all hover:shadow-md group
                        ${selectedActivity === act.id
                          ? 'border-primary/40 bg-primary/5 shadow-sm'
                          : 'border-border/40 hover:border-primary/30 bg-card'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-white text-xs font-bold"
                          style={{ background: act.color }}
                        >
                          {act.id}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate">{act.title}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{act.titleEn}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex gap-1">
                            {act.results.slice(0, 2).map((r) => (
                              <Badge key={r} variant="secondary" className="text-[9px] hidden sm:inline-flex">
                                {r.length > 20 ? r.substring(0, 20) + '…' : r}
                              </Badge>
                            ))}
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </button>
                    {idx < activities.length - 1 && (
                      <div className="flex justify-center py-0.5">
                        <div className="w-px h-3 bg-border" />
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Problem-solving cycle */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <IterationCw className="w-4 h-4 text-primary" />
                Problemlösungszyklus (VDI 2221, Bild 4)
              </CardTitle>
              <p className="text-[11px] text-muted-foreground">
                Jede Aktivität folgt intern einem Zyklus aus Zielsuche → Lösungssuche → Lösungsauswahl.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {problemSolvingSteps.map((step, i) => (
                  <div
                    key={step.label}
                    className="p-3 rounded-lg border border-border/40 bg-muted/20 space-y-1"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-primary">{i + 1}</span>
                      <span className="text-xs font-medium text-foreground">{step.label}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{step.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Iterations */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                Iterationen — Grundprinzip des Vorgehens
              </CardTitle>
              <p className="text-[11px] text-muted-foreground">
                Es gibt keine streng sequenzielle Abfolge — Iterationsschleifen sind üblich und wichtig.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {iterationTypes.map((it) => (
                  <div key={it.name} className="p-3 rounded-lg border border-border/40 bg-card space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: it.color }} />
                      <span className="text-xs font-semibold text-foreground">{it.name}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{it.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* ─── DETAIL VIEW ─── */
        <div className="space-y-4">
          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              disabled={selectedActivity === 1}
              onClick={() => setSelectedActivity((p) => p - 1)}
            >
              <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Vorheriger
            </Button>
            <Badge variant="outline" className="text-xs">
              Aktivität {selectedActivity} / {activities.length}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              disabled={selectedActivity === activities.length}
              onClick={() => setSelectedActivity((p) => p + 1)}
            >
              Nächster <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>

          {/* Activity step bar */}
          <div className="flex gap-1">
            {activities.map((a) => (
              <button
                key={a.id}
                onClick={() => setSelectedActivity(a.id)}
                className={`flex-1 h-2 rounded-full transition-all ${
                  a.id === selectedActivity ? 'scale-y-150' : 'opacity-40 hover:opacity-70'
                }`}
                style={{ background: a.color }}
                title={a.title}
              />
            ))}
          </div>

          {/* Main card */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0"
                  style={{ background: current.color }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-sm">{current.title}</CardTitle>
                  <p className="text-[10px] text-muted-foreground italic">{current.titleEn}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Description */}
              <p className="text-xs text-muted-foreground leading-relaxed">{current.description}</p>

              {/* Goals */}
              <div>
                <h4 className="text-[11px] font-semibold text-foreground mb-2 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-primary" /> Ziele
                </h4>
                <ul className="space-y-1">
                  {current.goals.map((g) => (
                    <li key={g} className="text-[11px] text-muted-foreground flex items-start gap-2">
                      <ArrowRight className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                      {g}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Results */}
              <div>
                <h4 className="text-[11px] font-semibold text-foreground mb-2 flex items-center gap-1.5">
                  <ListChecks className="w-3.5 h-3.5 text-primary" /> Arbeitsergebnisse
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {current.results.map((r) => (
                    <Badge key={r} variant="secondary" className="text-[10px]">
                      {r}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Methods */}
              <div>
                <h4 className="text-[11px] font-semibold text-foreground mb-2 flex items-center gap-1.5">
                  <PenTool className="w-3.5 h-3.5 text-primary" /> Methoden & Hilfsmittel
                </h4>
                <div className="space-y-2">
                  {current.methods.map((m) => (
                    <div key={m.name} className="p-2.5 rounded-lg border border-border/40 bg-muted/20">
                      <p className="text-[11px] font-medium text-foreground">{m.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{m.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Example */}
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <h4 className="text-[11px] font-semibold text-primary mb-1.5 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5" /> Praxisbeispiel: Industrieroboter-Greifer
                </h4>
                <p className="text-[10px] text-foreground/80 leading-relaxed">{current.example}</p>
              </div>

              {/* VDI Reference */}
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <FileText className="w-3 h-3" />
                <span>Referenz: {current.vdiRef}</span>
              </div>
            </CardContent>
          </Card>

          {/* VDI 2222 Kataloge Insight */}
          {selectedActivity === 3 && (
            <Card className="border-[hsl(45,85%,48%)]/30 bg-[hsl(45,85%,48%)]/5">
              <CardContent className="pt-4 pb-3">
                <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-2">
                  <PackageCheck className="w-4 h-4" style={{ color: 'hsl(45,85%,48%)' }} />
                  VDI 2222 Blatt 2 — Konstruktionskataloge
                </h4>
                <p className="text-[10px] text-muted-foreground leading-relaxed mb-2">
                  Konstruktionskataloge sind systematisch aufgebaute Sammlungen von Lösungen, Objekten oder Operationen.
                  Sie unterstützen die gezielte Suche nach Lösungsprinzipien und die Wiederverwendung von bewährtem Wissen.
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { type: 'Lösungskatalog', desc: 'Zuordnung physikalischer Effekte zu Funktionen' },
                    { type: 'Objektkatalog', desc: 'Sammlung konkreter Konstruktionselemente' },
                    { type: 'Operationskatalog', desc: 'Gestalt-Variationsmöglichkeiten' },
                  ].map((cat) => (
                    <div key={cat.type} className="p-2 rounded border border-border/40 bg-card">
                      <p className="text-[10px] font-semibold text-foreground">{cat.type}</p>
                      <p className="text-[9px] text-muted-foreground mt-0.5">{cat.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
