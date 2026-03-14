import React, { useMemo, useState } from 'react';
import { Material, MaterialCategory, CorrosionResistance, ManufacturingMethod } from '@/types/material';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Trophy, ArrowUpDown } from 'lucide-react';
import {
  EngineeringProblem,
  MaterialIndexDef,
  DimensioningInput,
  DimensioningLoadCase,
  LoadType,
  DesignObjective,
  LOAD_TYPE_LABELS,
  OBJECTIVE_LABELS,
  AshbyChartConfig,
  ashbyCharts,
  computeNominalStress,
  DIMENSIONING_LOAD_LABELS,
} from './types';
import AshbyChart from './AshbyChart';
import { Link } from 'react-router-dom';

/* ───────── Step 1: Problem Definition ───────── */

interface Step1Props {
  problem: EngineeringProblem;
  onChange: (p: EngineeringProblem) => void;
}

const corrosionOptions: CorrosionResistance[] = ['Niedrig', 'Mittel', 'Hoch', 'Sehr hoch'];
const manufacturingOptions: ManufacturingMethod[] = [
  'Gießen', 'Schmieden', 'Walzen', 'Extrudieren', 'Spritzgießen',
  'Sintern', 'Schweißen', 'Zerspanen', 'Faserwickeln', 'Laminieren',
  '3D-Druck', 'Pressen', 'Blasformen', 'Tiefziehen',
];

export function StepProblemDefinition({ problem, onChange }: Step1Props) {
  const setField = <K extends keyof EngineeringProblem>(key: K, value: EngineeringProblem[K]) =>
    onChange({ ...problem, [key]: value });

  const setConstraint = <K extends keyof EngineeringProblem['constraints']>(
    key: K,
    value: EngineeringProblem['constraints'][K]
  ) => onChange({ ...problem, constraints: { ...problem.constraints, [key]: value } });

  const toggleInArray = <T,>(arr: T[], item: T) =>
    arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Load type */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
            Belastungsart
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {(Object.keys(LOAD_TYPE_LABELS) as LoadType[]).map((lt) => (
            <label
              key={lt}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                problem.loadType === lt
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/40'
              }`}
            >
              <input
                type="radio"
                name="loadType"
                value={lt}
                checked={problem.loadType === lt}
                onChange={() => setField('loadType', lt)}
                className="accent-primary"
              />
              <span className="font-medium text-sm">{LOAD_TYPE_LABELS[lt]}</span>
            </label>
          ))}
        </CardContent>
      </Card>

      {/* Design objective */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
            Entwurfsziel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {(Object.keys(OBJECTIVE_LABELS) as DesignObjective[]).map((obj) => (
            <label
              key={obj}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                problem.designObjective === obj
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/40'
              }`}
            >
              <input
                type="radio"
                name="objective"
                value={obj}
                checked={problem.designObjective === obj}
                onChange={() => setField('designObjective', obj)}
                className="accent-primary"
              />
              <span className="font-medium text-sm">{OBJECTIVE_LABELS[obj]}</span>
            </label>
          ))}
        </CardContent>
      </Card>

      {/* Constraints */}
      <Card className="lg:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
            Randbedingungen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label className="text-xs font-mono">Max. Temperatur [°C]</Label>
              <Input
                type="number"
                placeholder="z.B. 500"
                value={problem.constraints.maxTemp ?? ''}
                onChange={(e) =>
                  setConstraint('maxTemp', e.target.value ? Number(e.target.value) : null)
                }
                className="font-mono"
              />
            </div>
            <div>
              <Label className="text-xs font-mono">Min. Streckgrenze [MPa]</Label>
              <Input
                type="number"
                placeholder="z.B. 200"
                value={problem.constraints.minYieldStrength ?? ''}
                onChange={(e) =>
                  setConstraint('minYieldStrength', e.target.value ? Number(e.target.value) : null)
                }
                className="font-mono"
              />
            </div>
            <div>
              <Label className="text-xs font-mono mb-2 block">Korrosionsbeständigkeit</Label>
              <div className="space-y-1.5">
                {corrosionOptions.map((cr) => (
                  <label key={cr} className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox
                      checked={problem.constraints.corrosionResistance.includes(cr)}
                      onCheckedChange={() =>
                        setConstraint(
                          'corrosionResistance',
                          toggleInArray(problem.constraints.corrosionResistance, cr)
                        )
                      }
                    />
                    {cr}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-xs font-mono mb-2 block">Fertigungsverfahren</Label>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {manufacturingOptions.map((mm) => (
                  <label key={mm} className="flex items-center gap-2 text-xs cursor-pointer">
                    <Checkbox
                      checked={problem.constraints.manufacturingMethods.includes(mm)}
                      onCheckedChange={() =>
                        setConstraint(
                          'manufacturingMethods',
                          toggleInArray(problem.constraints.manufacturingMethods, mm)
                        )
                      }
                    />
                    {mm}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ───────── Step 2: Material Index ───────── */

interface Step2Props {
  index: MaterialIndexDef;
  materialCount: number;
}

export function StepMaterialIndex({ index, materialCount }: Step2Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
            Abgeleiteter Materialindex
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 rounded-xl p-6 text-center border border-border">
            <div className="text-3xl font-mono font-bold text-primary mb-2">{index.formula}</div>
            <div className="text-sm text-muted-foreground">{index.symbol} — {index.name}</div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{index.description}</p>
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <span>Einheit:</span>
            <Badge variant="outline">{index.unit}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
            Ashby-Methode
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            Der Materialindex <strong className="text-foreground">{index.formula}</strong> wird aus
            der Kombination von Belastungsart und Entwurfsziel abgeleitet (nach Ashby, 1999).
          </p>
          <p>
            Auf dem logarithmischen {index.chartYLabel.split('[')[0].trim()}-{index.chartXLabel.split('[')[0].trim()}-Diagramm
            entspricht dieser Index einer Geraden mit Steigung <strong className="text-foreground">{index.guidelineSlope}</strong>.
          </p>
          <p>
            Werkstoffe oberhalb der Leitlinie haben einen höheren Materialindex und sind für das
            gewählte Entwurfsziel besser geeignet.
          </p>
          <div className="pt-2">
            <Badge variant="secondary">{materialCount} Werkstoffe nach Filterung verfügbar</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ───────── Step 3: Ashby Charts ───────── */

interface Step3Props {
  materials: Material[];
  selectedChart: string;
  onSelectChart: (id: string) => void;
  guidelineSlope: number;
  guidelineIntercept: number;
  onInterceptChange: (v: number) => void;
  highlightIds?: Set<string>;
  onMaterialClick?: (id: string) => void;
}

export function StepAshbyCharts({
  materials,
  selectedChart,
  onSelectChart,
  guidelineSlope,
  guidelineIntercept,
  onInterceptChange,
  highlightIds,
  onMaterialClick,
}: Step3Props) {
  const chart = ashbyCharts.find((c) => c.id === selectedChart) || ashbyCharts[0];
  const isLogLog = chart.logX && chart.logY;

  return (
    <div className="space-y-4">
      <Tabs value={selectedChart} onValueChange={onSelectChart}>
        <TabsList className="bg-muted/50 border border-border">
          {ashbyCharts.map((c) => (
            <TabsTrigger key={c.id} value={c.id} className="text-xs font-mono">
              {c.title}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <AshbyChart
        materials={materials}
        xKey={chart.xKey}
        yKey={chart.yKey}
        xLabel={chart.xLabel}
        yLabel={chart.yLabel}
        logX={chart.logX}
        logY={chart.logY}
        guidelineSlope={isLogLog ? guidelineSlope : null}
        guidelineIntercept={guidelineIntercept}
        onInterceptChange={onInterceptChange}
        highlightIds={highlightIds}
        onMaterialClick={onMaterialClick}
      />

      {isLogLog && (
        <p className="text-xs text-muted-foreground font-mono">
          Leitlinie auf dem Diagramm ziehen oder Slider verwenden. Werkstoffe oberhalb der Linie erfüllen den Materialindex.
        </p>
      )}
    </div>
  );
}

/* ───────── Step 4: Material Ranking ───────── */

interface Step4Props {
  materials: Material[];
  index: MaterialIndexDef;
  shortlistIds: Set<string>;
  onToggleShortlist: (id: string) => void;
}

export function StepMaterialRanking({ materials, index, shortlistIds, onToggleShortlist }: Step4Props) {
  const ranked = useMemo(() => {
    return [...materials]
      .map((m) => ({ material: m, indexValue: index.compute(m) }))
      .sort((a, b) => b.indexValue - a.indexValue);
  }, [materials, index]);

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="w-10 font-mono text-xs">#</TableHead>
              <TableHead className="font-mono text-xs">Werkstoff</TableHead>
              <TableHead className="font-mono text-xs">{index.symbol}</TableHead>
              <TableHead className="font-mono text-xs">ρ [kg/m³]</TableHead>
              <TableHead className="font-mono text-xs">σ_y [MPa]</TableHead>
              <TableHead className="font-mono text-xs">E [GPa]</TableHead>
              <TableHead className="font-mono text-xs">T_max [°C]</TableHead>
              <TableHead className="font-mono text-xs">Kosten</TableHead>
              <TableHead className="font-mono text-xs w-12">Shortlist</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ranked.slice(0, 30).map((r, i) => (
              <TableRow
                key={r.material.id}
                className={shortlistIds.has(r.material.id) ? 'bg-primary/5' : ''}
              >
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {i < 3 ? <Trophy className="w-4 h-4 text-amber-500" /> : i + 1}
                </TableCell>
                <TableCell>
                  <Link
                    to={`/werkstoff/${r.material.id}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {r.material.name}
                  </Link>
                  <div className="text-xs text-muted-foreground">{r.material.category}</div>
                </TableCell>
                <TableCell className="font-mono text-sm font-bold">{r.indexValue.toFixed(2)}</TableCell>
                <TableCell className="font-mono text-xs">{r.material.density.toLocaleString('de-DE')}</TableCell>
                <TableCell className="font-mono text-xs">{r.material.yieldStrength}</TableCell>
                <TableCell className="font-mono text-xs">{r.material.youngsModulus}</TableCell>
                <TableCell className="font-mono text-xs">{r.material.maxServiceTemp}</TableCell>
                <TableCell className="font-mono text-xs">{r.material.relativeCost}/10</TableCell>
                <TableCell>
                  <Checkbox
                    checked={shortlistIds.has(r.material.id)}
                    onCheckedChange={() => onToggleShortlist(r.material.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {ranked.length > 30 && (
        <div className="p-3 text-center text-xs text-muted-foreground font-mono border-t border-border">
          Zeige Top 30 von {ranked.length} Werkstoffen
        </div>
      )}
    </div>
  );
}

/* ───────── Geometry Helpers ───────── */

type CrossSection = 'rectangle' | 'circle';

function GeometryHelperI({ onApply }: { onApply: (I: number, y: number) => void }) {
  const [shape, setShape] = useState<CrossSection>('rectangle');
  const [b, setB] = useState(40);
  const [h, setH] = useState(50);
  const [d, setD] = useState(40);

  const result = useMemo(() => {
    if (shape === 'rectangle') {
      const I = (b * Math.pow(h, 3)) / 12;
      const y = h / 2;
      return { I, y, formula: `I = b·h³/12 = ${I.toFixed(0)} mm⁴, y = h/2 = ${y.toFixed(1)} mm` };
    }
    const I = (Math.PI * Math.pow(d, 4)) / 64;
    const y = d / 2;
    return { I, y, formula: `I = π·d⁴/64 = ${I.toFixed(0)} mm⁴, y = d/2 = ${y.toFixed(1)} mm` };
  }, [shape, b, h, d]);

  return (
    <div className="bg-accent/30 rounded-lg p-3 border border-border space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">⚙ Querschnitts-Rechner (I)</span>
      </div>
      <div className="flex gap-2">
        {(['rectangle', 'circle'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setShape(s)}
            className={`text-[10px] font-mono px-2 py-1 rounded border transition-colors ${shape === s ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}
          >
            {s === 'rectangle' ? '▭ Rechteck' : '○ Kreis'}
          </button>
        ))}
      </div>
      {shape === 'rectangle' ? (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-[10px] font-mono">Breite b [mm]</Label>
            <Input type="number" value={b} onChange={(e) => setB(Number(e.target.value))} className="font-mono h-7 text-xs" />
          </div>
          <div>
            <Label className="text-[10px] font-mono">Höhe h [mm]</Label>
            <Input type="number" value={h} onChange={(e) => setH(Number(e.target.value))} className="font-mono h-7 text-xs" />
          </div>
        </div>
      ) : (
        <div>
          <Label className="text-[10px] font-mono">Durchmesser d [mm]</Label>
          <Input type="number" value={d} onChange={(e) => setD(Number(e.target.value))} className="font-mono h-7 text-xs" />
        </div>
      )}
      <div className="text-[10px] font-mono text-muted-foreground">{result.formula}</div>
      <Button size="sm" variant="outline" className="h-6 text-[10px] font-mono" onClick={() => onApply(result.I, result.y)}>
        Übernehmen → I = {result.I.toFixed(0)}, y = {result.y.toFixed(1)}
      </Button>
    </div>
  );
}

function GeometryHelperJ({ onApply }: { onApply: (J: number, r: number) => void }) {
  const [dOuter, setDOuter] = useState(40);
  const [hollow, setHollow] = useState(false);
  const [dInner, setDInner] = useState(20);

  const result = useMemo(() => {
    const Do = dOuter;
    const Di = hollow ? dInner : 0;
    const J = (Math.PI / 32) * (Math.pow(Do, 4) - Math.pow(Di, 4));
    const r = Do / 2;
    const label = hollow
      ? `J = π/32·(D⁴−d⁴) = ${J.toFixed(0)} mm⁴`
      : `J = π·d⁴/32 = ${J.toFixed(0)} mm⁴`;
    return { J, r, formula: `${label}, r = D/2 = ${r.toFixed(1)} mm` };
  }, [dOuter, dInner, hollow]);

  return (
    <div className="bg-accent/30 rounded-lg p-3 border border-border space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">⚙ Querschnitts-Rechner (J)</span>
      </div>
      <div className="flex gap-2 items-center">
        <button
          onClick={() => setHollow(false)}
          className={`text-[10px] font-mono px-2 py-1 rounded border transition-colors ${!hollow ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}
        >
          ○ Vollkreis
        </button>
        <button
          onClick={() => setHollow(true)}
          className={`text-[10px] font-mono px-2 py-1 rounded border transition-colors ${hollow ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}
        >
          ◎ Hohlkreis
        </button>
      </div>
      <div className={`grid gap-2 ${hollow ? 'grid-cols-2' : 'grid-cols-1'}`}>
        <div>
          <Label className="text-[10px] font-mono">Außen-Ø D [mm]</Label>
          <Input type="number" value={dOuter} onChange={(e) => setDOuter(Number(e.target.value))} className="font-mono h-7 text-xs" />
        </div>
        {hollow && (
          <div>
            <Label className="text-[10px] font-mono">Innen-Ø d [mm]</Label>
            <Input type="number" value={dInner} onChange={(e) => setDInner(Number(e.target.value))} className="font-mono h-7 text-xs" />
          </div>
        )}
      </div>
      <div className="text-[10px] font-mono text-muted-foreground">{result.formula}</div>
      <Button size="sm" variant="outline" className="h-6 text-[10px] font-mono" onClick={() => onApply(result.J, result.r)}>
        Übernehmen → J = {result.J.toFixed(0)}, r = {result.r.toFixed(1)}
      </Button>
    </div>
  );
}

/* ───────── Step 5: Dimensioning ───────── */

interface Step5Props {
  dimensioning: DimensioningInput;
  onChange: (d: DimensioningInput) => void;
  materials: Material[];
  index: MaterialIndexDef;
  shortlistIds: Set<string>;
}

export function StepDimensioning({ dimensioning, onChange, materials, index, shortlistIds }: Step5Props) {
  const nominalStress = computeNominalStress(dimensioning);
  const isTorsion = dimensioning.loadCase === 'torsion';

  const ranked = useMemo(() => {
    const subset = shortlistIds.size > 0
      ? materials.filter((m) => shortlistIds.has(m.id))
      : [...materials].sort((a, b) => index.compute(b) - index.compute(a)).slice(0, 10);
    return subset.map((m) => {
      // For torsion use shear yield ≈ σ_y / √3 (von Mises)
      const strength = isTorsion ? m.yieldStrength / Math.sqrt(3) : m.yieldStrength;
      const allowable = strength / dimensioning.safetyFactor;
      return { material: m, allowable, passes: nominalStress <= allowable };
    });
  }, [materials, shortlistIds, dimensioning, nominalStress, index, isTorsion]);

  const stressSymbol = isTorsion ? 'τ' : 'σ';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Inputs */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
            Lastfall & Geometrie
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Load case selector */}
          <div className="space-y-2">
            {(Object.keys(DIMENSIONING_LOAD_LABELS) as DimensioningLoadCase[]).map((lc) => (
              <label
                key={lc}
                className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors text-xs font-mono ${
                  dimensioning.loadCase === lc
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/40'
                }`}
              >
                <input
                  type="radio"
                  name="dimLoadCase"
                  value={lc}
                  checked={dimensioning.loadCase === lc}
                  onChange={() => onChange({ ...dimensioning, loadCase: lc })}
                  className="accent-primary"
                />
                {DIMENSIONING_LOAD_LABELS[lc]}
              </label>
            ))}
          </div>

          <div className="border-t border-border pt-4 space-y-3">
            {/* Tension inputs */}
            {dimensioning.loadCase === 'tension' && (
              <>
                <div>
                  <Label className="text-xs font-mono">Kraft F [N]</Label>
                  <Input
                    type="number"
                    value={dimensioning.force}
                    onChange={(e) => onChange({ ...dimensioning, force: Number(e.target.value) })}
                    className="font-mono"
                  />
                </div>
                <div>
                  <Label className="text-xs font-mono">Querschnittsfläche A [mm²]</Label>
                  <Input
                    type="number"
                    value={dimensioning.area}
                    onChange={(e) => onChange({ ...dimensioning, area: Number(e.target.value) })}
                    className="font-mono"
                  />
                </div>
              </>
            )}

            {/* Bending inputs */}
            {dimensioning.loadCase === 'bending' && (
              <>
                <div>
                  <Label className="text-xs font-mono">Biegemoment M [N·mm]</Label>
                  <Input
                    type="number"
                    value={dimensioning.bendingMoment}
                    onChange={(e) => onChange({ ...dimensioning, bendingMoment: Number(e.target.value) })}
                    className="font-mono"
                  />
                </div>
                <div>
                  <Label className="text-xs font-mono">Randabstand y [mm]</Label>
                  <Input
                    type="number"
                    value={dimensioning.distanceY}
                    onChange={(e) => onChange({ ...dimensioning, distanceY: Number(e.target.value) })}
                    className="font-mono"
                  />
                </div>
                <div>
                  <Label className="text-xs font-mono">Flächenträgheitsmoment I [mm⁴]</Label>
                  <Input
                    type="number"
                    value={dimensioning.momentOfInertia}
                    onChange={(e) => onChange({ ...dimensioning, momentOfInertia: Number(e.target.value) })}
                    className="font-mono"
                  />
                </div>
                {/* Geometry helper for I */}
                <GeometryHelperI onApply={(I, y) => onChange({ ...dimensioning, momentOfInertia: I, distanceY: y })} />
              </>
            )}

            {/* Torsion inputs */}
            {dimensioning.loadCase === 'torsion' && (
              <>
                <div>
                  <Label className="text-xs font-mono">Torsionsmoment T [N·mm]</Label>
                  <Input
                    type="number"
                    value={dimensioning.torque}
                    onChange={(e) => onChange({ ...dimensioning, torque: Number(e.target.value) })}
                    className="font-mono"
                  />
                </div>
                <div>
                  <Label className="text-xs font-mono">Radius r [mm]</Label>
                  <Input
                    type="number"
                    value={dimensioning.radiusR}
                    onChange={(e) => onChange({ ...dimensioning, radiusR: Number(e.target.value) })}
                    className="font-mono"
                  />
                </div>
                <div>
                  <Label className="text-xs font-mono">Polares Trägheitsmoment J [mm⁴]</Label>
                  <Input
                    type="number"
                    value={dimensioning.polarMomentJ}
                    onChange={(e) => onChange({ ...dimensioning, polarMomentJ: Number(e.target.value) })}
                    className="font-mono"
                  />
                </div>
                {/* Geometry helper for J */}
                <GeometryHelperJ onApply={(J, r) => onChange({ ...dimensioning, polarMomentJ: J, radiusR: r })} />
              </>
            )}
          </div>

          {/* Safety factor (always visible) */}
          <div>
            <Label className="text-xs font-mono">Sicherheitsfaktor S</Label>
            <Input
              type="number"
              step="0.1"
              value={dimensioning.safetyFactor}
              onChange={(e) => onChange({ ...dimensioning, safetyFactor: Number(e.target.value) })}
              className="font-mono"
            />
          </div>

          {/* Computed stress */}
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <div className="text-xs font-mono text-muted-foreground mb-1">
              {dimensioning.loadCase === 'tension' && 'Nennspannung σ = F / A'}
              {dimensioning.loadCase === 'bending' && 'Biegespannung σ = M·y / I'}
              {dimensioning.loadCase === 'torsion' && 'Schubspannung τ = T·r / J'}
            </div>
            <div className="text-2xl font-mono font-bold text-primary">
              {nominalStress.toFixed(1)} <span className="text-sm font-normal text-muted-foreground">MPa</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card className="lg:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
            Festigkeitsnachweis {isTorsion ? '(Schub)' : '(Normal)'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-mono text-xs">Werkstoff</TableHead>
                <TableHead className="font-mono text-xs">{isTorsion ? 'τ_y [MPa]' : 'σ_y [MPa]'}</TableHead>
                <TableHead className="font-mono text-xs">{stressSymbol}_zul [MPa]</TableHead>
                <TableHead className="font-mono text-xs">{stressSymbol}_nom [MPa]</TableHead>
                <TableHead className="font-mono text-xs">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ranked.map((r) => (
                <TableRow
                  key={r.material.id}
                  className={r.passes ? 'bg-green-500/5' : 'bg-red-500/5'}
                >
                  <TableCell className="text-sm font-medium">{r.material.name}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {isTorsion
                      ? (r.material.yieldStrength / Math.sqrt(3)).toFixed(0)
                      : r.material.yieldStrength}
                  </TableCell>
                  <TableCell className="font-mono text-xs">{r.allowable.toFixed(1)}</TableCell>
                  <TableCell className="font-mono text-xs">{nominalStress.toFixed(1)}</TableCell>
                  <TableCell>
                    {r.passes ? (
                      <span className="flex items-center gap-1 text-green-600 text-xs font-mono font-semibold">
                        <CheckCircle2 className="w-4 h-4" /> OK
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-500 text-xs font-mono font-semibold">
                        <XCircle className="w-4 h-4" /> FAIL
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {ranked.length === 0 && (
            <div className="p-8 text-center text-muted-foreground text-sm">
              Keine Werkstoffe in der Shortlist. Wähle Werkstoffe in Schritt 4.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ───────── Step 6: Result Shortlist ───────── */

interface Step6Props {
  materials: Material[];
  index: MaterialIndexDef;
  shortlistIds: Set<string>;
  nominalStress: number;
  safetyFactor: number;
  isTorsion: boolean;
}

export function StepResultShortlist({ materials, index, shortlistIds, nominalStress, safetyFactor, isTorsion }: Step6Props) {
  const results = useMemo(() => {
    const subset = shortlistIds.size > 0
      ? materials.filter((m) => shortlistIds.has(m.id))
      : [...materials].sort((a, b) => index.compute(b) - index.compute(a)).slice(0, 5);

    return subset
      .map((m) => {
        const strength = isTorsion ? m.yieldStrength / Math.sqrt(3) : m.yieldStrength;
        const allowable = strength / safetyFactor;
        return {
          material: m,
          indexValue: index.compute(m),
          allowable,
          passes: nominalStress <= allowable,
        };
      })
      .sort((a, b) => b.indexValue - a.indexValue);
  }, [materials, index, shortlistIds, nominalStress, safetyFactor, isTorsion]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((r, i) => (
          <Card
            key={r.material.id}
            className={`relative overflow-hidden ${
              i === 0 ? 'border-primary ring-1 ring-primary/20' : ''
            }`}
          >
            {i === 0 && (
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-mono font-bold px-2 py-0.5 rounded-bl-lg">
                EMPFEHLUNG
              </div>
            )}
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                <Link to={`/werkstoff/${r.material.id}`} className="hover:text-primary transition-colors">
                  {r.material.name}
                </Link>
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px]">{r.material.category}</Badge>
                {r.passes ? (
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-[10px]">σ OK</Badge>
                ) : (
                  <Badge className="bg-red-500/10 text-red-500 border-red-500/20 text-[10px]">σ FAIL</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-muted-foreground">{index.symbol}:</span>{' '}
                  <span className="font-bold">{r.indexValue.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">ρ:</span>{' '}
                  {r.material.density.toLocaleString('de-DE')} kg/m³
                </div>
                <div>
                  <span className="text-muted-foreground">σ_y:</span> {r.material.yieldStrength} MPa
                </div>
                <div>
                  <span className="text-muted-foreground">E:</span> {r.material.youngsModulus} GPa
                </div>
                <div>
                  <span className="text-muted-foreground">T_max:</span> {r.material.maxServiceTemp}°C
                </div>
                <div>
                  <span className="text-muted-foreground">Kosten:</span> {r.material.relativeCost}/10
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong>Vorteile:</strong> {r.material.advantages}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                  <strong>Einschränkungen:</strong> {r.material.limitations}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {results.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Keine Werkstoffe ausgewählt. Nutze die Shortlist in Schritt 4 oder passe die Randbedingungen an.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
