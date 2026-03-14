import React, { useState, useMemo, useCallback } from 'react';
import { useMaterials } from '@/context/MaterialContext';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  EngineeringProblem,
  DimensioningInput,
  defaultProblem,
  defaultDimensioning,
  getMaterialIndex,
  applyConstraints,
  computeNominalStress,
} from '@/components/engineering/types';
import {
  StepProblemDefinition,
  StepMaterialIndex,
  StepAshbyCharts,
  StepMaterialRanking,
  StepDimensioning,
  StepResultShortlist,
} from '@/components/engineering/EngineeringSteps';

const STEPS = [
  { label: 'Problem', short: '1' },
  { label: 'Index', short: '2' },
  { label: 'Ashby-Charts', short: '3' },
  { label: 'Ranking', short: '4' },
  { label: 'Dimensionierung', short: '5' },
  { label: 'Ergebnis', short: '6' },
];

export default function EngineeringSelectionPage() {
  const { materials } = useMaterials();
  const [step, setStep] = useState(0);
  const [problem, setProblem] = useState<EngineeringProblem>(defaultProblem);
  const [selectedChart, setSelectedChart] = useState('e-vs-rho');
  const [guidelineIntercept, setGuidelineIntercept] = useState(-1.5);
  const [shortlistIds, setShortlistIds] = useState<Set<string>>(new Set());
  const [dimensioning, setDimensioning] = useState<DimensioningInput>(defaultDimensioning);

  const materialIndex = useMemo(
    () => getMaterialIndex(problem.loadType, problem.designObjective),
    [problem.loadType, problem.designObjective]
  );

  const constrainedMaterials = useMemo(
    () => applyConstraints(materials, problem),
    [materials, problem]
  );

  const nominalStress = dimensioning.area > 0 ? dimensioning.force / dimensioning.area : 0;

  // Materials above guideline (for highlighting)
  const passingGuidelineIds = useMemo(() => {
    const ids = new Set<string>();
    constrainedMaterials.forEach((m) => {
      const x = (m as any)[materialIndex.chartXKey] as number;
      const y = (m as any)[materialIndex.chartYKey] as number;
      if (x > 0 && y > 0) {
        const mValue = Math.log10(y) - materialIndex.guidelineSlope * Math.log10(x);
        if (mValue >= guidelineIntercept) ids.add(m.id);
      }
    });
    return ids;
  }, [constrainedMaterials, materialIndex, guidelineIntercept]);

  const toggleShortlist = useCallback((id: string) => {
    setShortlistIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const canPrev = step > 0;
  const canNext = step < STEPS.length - 1;

  return (
    <div className="p-6 space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Engineering Material Selection</h1>
        <p className="text-sm text-muted-foreground font-mono">
          Werkstoffauswahl nach Ashby-Methode — {constrainedMaterials.length} Werkstoffe verfügbar
        </p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-1">
        {STEPS.map((s, i) => (
          <React.Fragment key={i}>
            <button
              onClick={() => setStep(i)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono font-medium transition-all ${
                i === step
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : i < step
                  ? 'bg-primary/10 text-primary hover:bg-primary/20'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-current/10 flex items-center justify-center text-[10px] font-bold">
                {s.short}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
            {i < STEPS.length - 1 && (
              <div className="w-4 h-px bg-border flex-shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      <div className="min-h-[500px]">
        {step === 0 && <StepProblemDefinition problem={problem} onChange={setProblem} />}
        {step === 1 && (
          <StepMaterialIndex index={materialIndex} materialCount={constrainedMaterials.length} />
        )}
        {step === 2 && (
          <StepAshbyCharts
            materials={constrainedMaterials}
            selectedChart={selectedChart}
            onSelectChart={setSelectedChart}
            guidelineSlope={materialIndex.guidelineSlope}
            guidelineIntercept={guidelineIntercept}
            onInterceptChange={setGuidelineIntercept}
            highlightIds={passingGuidelineIds}
          />
        )}
        {step === 3 && (
          <StepMaterialRanking
            materials={constrainedMaterials}
            index={materialIndex}
            shortlistIds={shortlistIds}
            onToggleShortlist={toggleShortlist}
          />
        )}
        {step === 4 && (
          <StepDimensioning
            dimensioning={dimensioning}
            onChange={setDimensioning}
            materials={constrainedMaterials}
            index={materialIndex}
            shortlistIds={shortlistIds}
          />
        )}
        {step === 5 && (
          <StepResultShortlist
            materials={constrainedMaterials}
            index={materialIndex}
            shortlistIds={shortlistIds}
            nominalStress={nominalStress}
            safetyFactor={dimensioning.safetyFactor}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setStep((s) => s - 1)}
          disabled={!canPrev}
          className="font-mono"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Zurück
        </Button>
        <span className="text-xs font-mono text-muted-foreground">
          Schritt {step + 1} / {STEPS.length}
        </span>
        <Button
          size="sm"
          onClick={() => setStep((s) => s + 1)}
          disabled={!canNext}
          className="font-mono"
        >
          Weiter <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
