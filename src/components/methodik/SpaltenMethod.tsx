import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Search, Target, Lightbulb, ListChecks, Scale, Rocket,
  BookOpen, ChevronLeft, ChevronRight, Info, CheckCircle2,
  AlertTriangle, Users, FileText, Download, ExternalLink
} from 'lucide-react';

/* ─── SPALTEN Steps ─── */
interface SpaltenStep {
  key: string;
  letter: string;
  titleDe: string;
  titleEn: string;
  icon: React.ElementType;
  color: string;
  description: string;
  goal: string;
  methods: string[];
  example: string;
  infoDirection: 'expand' | 'narrow';
  promptLabel: string;
  promptPlaceholder: string;
  templateHint: string;
}

const steps: SpaltenStep[] = [
  {
    key: 'S', letter: 'S', titleDe: 'Situationsanalyse', titleEn: 'Situation Analysis',
    icon: Search, color: 'hsl(217,91%,50%)',
    description: 'Die Situation wird erfasst und ihre Details aufgedeckt. Daten werden gesammelt, strukturiert und dokumentiert. Ein Problemlösungsansatz wird gewählt.',
    goal: 'Vollständiges Verständnis der Ausgangssituation und Datenbasis für alle folgenden Schritte.',
    methods: ['Ist-Analyse', '5W-Fragen', 'Ishikawa-Diagramm', 'Stakeholder-Analyse', 'Datensammlung'],
    example: 'Ein Hydraulikzylinder versagt nach 500 Betriebsstunden. → Betriebsdaten sammeln, Umgebungsbedingungen dokumentieren, bisherige Wartungshistorie prüfen.',
    infoDirection: 'expand',
    promptLabel: 'Beschreibe die aktuelle Situation',
    promptPlaceholder: 'Was ist der Ist-Zustand? Welche Daten liegen vor?',
    templateHint: 'Situationsanalyse-Checkliste, 5W-Fragebogen',
  },
  {
    key: 'P', letter: 'P', titleDe: 'Problemeingrenzung', titleEn: 'Problem Containment',
    icon: Target, color: 'hsl(210,70%,45%)',
    description: 'Fokussierung auf die problemrelevanten Daten. Ursache und Wirkung der Abweichung zwischen Soll- und Ist-Zustand identifizieren. Hypothesen aufstellen und verifizieren.',
    goal: 'Klare Problembeschreibung mit verifizierten Ursachen und definiertem Ziel.',
    methods: ['Ist/Nicht-Ist-Analyse', 'Hypothesentest', 'Anforderungsliste', 'Problembaum', 'Pareto-Analyse'],
    example: 'Hydraulikzylinder: Ursache eingegrenzt auf Dichtungsverschleiß durch erhöhte Temperatur im Einsatzbereich > 80°C.',
    infoDirection: 'narrow',
    promptLabel: 'Grenze das Problem ein',
    promptPlaceholder: 'Was genau ist das Problem? Was ist Soll- vs. Ist-Zustand?',
    templateHint: 'Ist/Nicht-Ist-Matrix, Problembaum-Vorlage',
  },
  {
    key: 'A', letter: 'A', titleDe: 'Alternative Lösungssuche', titleEn: 'Search for Alternative Solutions',
    icon: Lightbulb, color: 'hsl(200,65%,42%)',
    description: 'Lösungen entwickeln. Randbedingungen definieren, abstrakte Zielformulierung nutzen (um Fixierung zu vermeiden). Kreativitätspotenzial maximal ausschöpfen.',
    goal: 'Breites Spektrum an Lösungsalternativen ohne vorzeitige Einschränkung.',
    methods: ['Brainstorming', 'Morphologischer Kasten', '6-3-5 Methode', 'TRIZ', 'Bionik', 'Analogiemethode'],
    example: '3 Alternativen: (1) Hochtemperatur-Dichtung aus FKM, (2) Kühlsystem integrieren, (3) Zylinderdesign mit Wärmeableitung optimieren.',
    infoDirection: 'expand',
    promptLabel: 'Entwickle Lösungsalternativen',
    promptPlaceholder: 'Welche Lösungsmöglichkeiten gibt es? (min. 3 Alternativen)',
    templateHint: 'Morphologischer Kasten, Brainstorming-Canvas',
  },
  {
    key: 'L', letter: 'L', titleDe: 'Lösungsauswahl', titleEn: 'Selection of Solutions',
    icon: ListChecks, color: 'hsl(225,60%,48%)',
    description: 'Lösungen analysieren, bewerten und die vielversprechendsten auswählen. Bewertungskriterien definieren und gewichten.',
    goal: 'Ausgewählte Vorzugslösung(en) basierend auf objektiver Bewertung.',
    methods: ['Nutzwertanalyse', 'Paarweiser Vergleich', 'Punktbewertung', 'Kosten-Nutzen-Analyse', 'QFD'],
    example: 'Nutzwertanalyse: FKM-Dichtung (82 Pkt.) > Kühlsystem (65 Pkt.) > Redesign (71 Pkt.) → FKM-Dichtung als Vorzugslösung.',
    infoDirection: 'narrow',
    promptLabel: 'Bewerte und wähle die beste Lösung',
    promptPlaceholder: 'Welche Kriterien? Welche Lösung schneidet am besten ab?',
    templateHint: 'Nutzwertanalyse-Vorlage, Paarweiser Vergleich',
  },
  {
    key: 'T', letter: 'T', titleDe: 'Tragweitenanalyse', titleEn: 'Analysis of Level of Fulfillment',
    icon: Scale, color: 'hsl(215,55%,44%)',
    description: 'Vorhersehbare Risiken und Chancen der ausgewählten Lösung untersuchen. Kritische Stellen aufdecken und Maßnahmen zur Risikominimierung planen.',
    goal: 'Risiko- und Chancenbewertung mit konkreten Gegenmaßnahmen.',
    methods: ['FMEA', 'Risikoanalyse', 'Chancen-/Risiko-Matrix', 'Sensitivitätsanalyse', 'Szenarioplanung'],
    example: 'Risiko: FKM-Dichtung teurer (Faktor 2,5). Chance: Lebensdauer steigt um Faktor 4. Maßnahme: Langzeittest über 2000h vor Serienfreigabe.',
    infoDirection: 'expand',
    promptLabel: 'Analysiere Risiken und Chancen',
    promptPlaceholder: 'Welche Risiken bestehen? Welche Chancen ergeben sich?',
    templateHint: 'FMEA-Formblatt, Risiko-Matrix',
  },
  {
    key: 'E', letter: 'E', titleDe: 'Entscheiden / Umsetzen', titleEn: 'Make Decision / Implement',
    icon: Rocket, color: 'hsl(205,60%,40%)',
    description: 'Ergebnisse aus Lösungsauswahl und Tragweitenanalyse zusammenführen. Entscheidung dokumentieren. Implementierung in drei Phasen: Planen → Durchführen → Abschließen.',
    goal: 'Dokumentierte Entscheidung und vollständige Umsetzung der Lösung.',
    methods: ['Implementierungsplan', 'Meilensteinplanung', 'PDCA-Zyklus', 'Pilotprojekt', 'Change Management'],
    example: 'Entscheidung: FKM-Dichtung einführen. Phase 1: Lieferant qualifizieren (2 Wo.). Phase 2: Muster testen (4 Wo.). Phase 3: Serienumstellung.',
    infoDirection: 'narrow',
    promptLabel: 'Plane die Umsetzung',
    promptPlaceholder: 'Wie wird die Lösung implementiert? Welche Schritte?',
    templateHint: 'Implementierungsplan, PDCA-Vorlage',
  },
  {
    key: 'N', letter: 'N', titleDe: 'Nacharbeiten / Lernen', titleEn: 'Recapitulate / Learn',
    icon: BookOpen, color: 'hsl(222,50%,46%)',
    description: 'Grundlegendes Wissen und optimierte Ansätze aus der Erfahrung extrahieren. Dokumentation des Verbesserungspotenzials (KVP).',
    goal: 'Lessons Learned und optimierte Vorgehensweisen für zukünftige Problemlösungen.',
    methods: ['Lessons Learned', 'After Action Review', 'Wissens­dokumentation', 'Best Practices', 'KVP-Maßnahmen'],
    example: 'Lesson: Einsatztemperatur muss frühzeitig in Dichtstoff-Auswahlmatrix → Aktualisierung der internen Konstruktionsrichtlinie.',
    infoDirection: 'expand',
    promptLabel: 'Dokumentiere Lessons Learned',
    promptPlaceholder: 'Was wurde gelernt? Was kann zukünftig verbessert werden?',
    templateHint: 'Lessons-Learned-Vorlage, KVP-Maßnahmenplan',
  },
];

export default function SpaltenMethod() {
  const [currentStep, setCurrentStep] = useState(0);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const step = steps[currentStep];
  const Icon = step.icon;

  const completedSteps = Object.keys(notes).filter(k => notes[k]?.trim().length > 0);

  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          SPALTEN — Problemlösungsmethodik
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
          Die SPALTEN-Methodik nach Prof. Albers (KIT/IPEK) ist ein universeller, modularer Ansatz 
          zur systematischen Problemlösung in der Produktentwicklung.
        </p>
        <div className="flex flex-wrap gap-2">
          <a href="https://raw.githubusercontent.com/yetu99/engi-select-suite/main/public/papers/SPALTEN_Albers_2005.pdf" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline">
            <BookOpen className="w-3.5 h-3.5" /> Originalpaper (Albers et al., ICED 2005)
          </a>
          <a href="/papers/PGE_Zusammenfassung.pdf" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline">
            <FileText className="w-3.5 h-3.5" /> PGE-Zusammenfassung (PDF)
          </a>
        </div>
      </div>

      {/* Letter bar */}
      <div className="flex items-center justify-center gap-1">
        {steps.map((s, i) => {
          const isActive = i === currentStep;
          const isDone = completedSteps.includes(s.key);
          return (
            <button key={s.key} onClick={() => setCurrentStep(i)}
              className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg font-bold text-base sm:text-lg transition-all duration-300 ${
                isActive ? 'text-white shadow-lg scale-110 z-10'
                  : isDone ? 'text-white/80 opacity-70 hover:opacity-90'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
              style={isActive || isDone ? { background: s.color } : undefined}
            >
              {s.letter}
              {isDone && !isActive && (
                <CheckCircle2 className="w-3 h-3 absolute -top-1 -right-1 text-green-500 bg-background rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Active step detail */}
      <Card className="border-border/60 overflow-hidden">
        <div className="h-1" style={{ background: step.color }} />
        <CardContent className="p-5 space-y-4">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: step.color }}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-foreground">{step.titleDe}</h3>
                <Badge variant="outline" className="text-[10px]">{step.titleEn}</Badge>
                <Badge variant="secondary" className="text-[10px] gap-1">
                  {step.infoDirection === 'expand' ? '↗ Info erweitert' : '↘ Info fokussiert'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{step.description}</p>
            </div>
          </div>

          {/* Goal */}
          <div className="flex items-start gap-2 bg-primary/5 rounded-lg px-3 py-2.5 border border-primary/15">
            <Target className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-semibold text-primary uppercase tracking-wider">Ziel</p>
              <p className="text-xs text-foreground/80 leading-relaxed">{step.goal}</p>
            </div>
          </div>

          {/* Methods */}
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Methoden & Werkzeuge</p>
            <div className="flex flex-wrap gap-1.5">
              {step.methods.map(m => (
                <Badge key={m} variant="secondary" className="text-[10px] font-normal">{m}</Badge>
              ))}
            </div>
          </div>

          {/* Example */}
          <div className="rounded-lg bg-muted/50 border border-border/40 px-3 py-2.5">
            <p className="text-[10px] font-semibold text-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
              <Lightbulb className="w-3 h-3 text-amber-500" /> Praxisbeispiel
            </p>
            <p className="text-xs text-foreground/70 leading-relaxed">{step.example}</p>
          </div>

          {/* IC + PST info */}
          <div className="grid sm:grid-cols-2 gap-2">
            <div className="rounded-md border border-border/40 px-3 py-2 flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-semibold text-foreground">Information Check (IC)</p>
                <p className="text-[10px] text-muted-foreground">Zwischen jedem Modul: Sind alle Informationen für den nächsten Schritt ausreichend?</p>
              </div>
            </div>
            <div className="rounded-md border border-border/40 px-3 py-2 flex items-start gap-2">
              <Users className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-semibold text-foreground">Problem Solving Team (PST)</p>
                <p className="text-[10px] text-muted-foreground">Teamzusammensetzung modulspezifisch anpassen.</p>
              </div>
            </div>
          </div>

          {/* Template hint */}
          <div className="rounded-lg bg-primary/5 border border-primary/15 px-3 py-2.5 flex items-start gap-2">
            <Download className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-semibold text-primary uppercase tracking-wider">Templates</p>
              <p className="text-xs text-foreground/70">{step.templateHint}</p>
              <a href="/templates" className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline mt-1">
                Zum Template-Bereich <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Interactive notepad */}
          <div className="border-t border-border/40 pt-3">
            <p className="text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-primary" />
              {step.promptLabel}
            </p>
            <Textarea
              value={notes[step.key] || ''}
              onChange={e => setNotes(prev => ({ ...prev, [step.key]: e.target.value }))}
              placeholder={step.promptPlaceholder}
              className="text-xs min-h-[80px] resize-y"
            />
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-1">
            <Button variant="outline" size="sm" className="text-xs gap-1" disabled={currentStep === 0}
              onClick={() => setCurrentStep(prev => prev - 1)}>
              <ChevronLeft className="w-3.5 h-3.5" /> Zurück
            </Button>
            <span className="text-[10px] text-muted-foreground">Schritt {currentStep + 1} von {steps.length}</span>
            <Button size="sm" className="text-xs gap-1" disabled={currentStep === steps.length - 1}
              onClick={() => setCurrentStep(prev => prev + 1)}>
              Weiter <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Honeycomb insight */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 flex gap-3">
          <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-xs text-foreground/80 leading-relaxed space-y-1">
            <p className="font-semibold text-foreground">Wabenmodell (Honeycomb Model)</p>
            <p>
              Die Informationsmenge wechselt zwischen den Modulen — mal wird sie erweitert 
              (z. B. Situationsanalyse, Alternativensuche), mal fokussiert (z. B. Problemeingrenzung, 
              Lösungsauswahl). Nicht alle Module müssen immer durchlaufen werden.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
