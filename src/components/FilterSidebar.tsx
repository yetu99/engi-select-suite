import { useState } from 'react';
import { useMaterials } from '@/context/MaterialContext';
import { MaterialCategory, CorrosionResistance, ManufacturingMethod } from '@/types/material';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { RotateCcw, ChevronRight } from 'lucide-react';

const categories: MaterialCategory[] = ['Metall', 'Polymer', 'Keramik', 'Verbundwerkstoff', 'Naturwerkstoff'];
const corrosionLevels: CorrosionResistance[] = ['Niedrig', 'Mittel', 'Hoch', 'Sehr hoch'];
const methods: ManufacturingMethod[] = ['Gießen', 'Schmieden', 'Walzen', 'Extrudieren', 'Spritzgießen', 'Sintern', 'Schweißen', 'Zerspanen', 'Faserwickeln', 'Laminieren', '3D-Druck', 'Pressen'];

function CollapsibleSection({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full text-[13px] font-medium text-foreground hover:text-primary transition-colors py-1">
        <span>{title}</span>
        <ChevronRight className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${open ? 'rotate-90' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

function RangeFilter({ label, unit, value, onChange, min, max, step = 1 }: {
  label: string; unit: string; value: [number, number]; onChange: (v: [number, number]) => void; min: number; max: number; step?: number;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[13px]">
        <span className="text-foreground font-medium">{label}</span>
        <span className="text-muted-foreground font-mono-data text-label">{value[0]}–{value[1]} {unit}</span>
      </div>
      <Slider min={min} max={max} step={step} value={value} onValueChange={(v) => onChange(v as [number, number])} className="py-1" />
    </div>
  );
}

function CheckboxGroup<T extends string>({ options, selected, onChange }: {
  options: T[]; selected: T[]; onChange: (v: T[]) => void;
}) {
  return (
    <div className="space-y-1.5">
      {options.map(opt => (
        <label key={opt} className="flex items-center gap-2.5 text-[13px] cursor-pointer hover:text-foreground text-muted-foreground transition-colors">
          <Checkbox
            checked={selected.includes(opt)}
            onCheckedChange={checked => {
              onChange(checked ? [...selected, opt] : selected.filter(s => s !== opt));
            }}
            className="w-4 h-4 rounded"
          />
          {opt}
        </label>
      ))}
    </div>
  );
}

export default function FilterSidebar() {
  const { filters, updateFilter, resetFilters } = useMaterials();

  return (
    <aside className="w-[280px] shrink-0 p-5 space-y-4 overflow-y-auto max-h-[calc(100vh-56px)] sticky top-14 border-r border-border/50">
      <div className="flex items-center justify-between">
        <h2 className="text-[13px] font-semibold text-foreground uppercase tracking-wider">Filter</h2>
        <Button variant="ghost" size="sm" onClick={resetFilters} className="h-7 px-2.5 text-label text-muted-foreground rounded-lg">
          <RotateCcw className="w-3 h-3 mr-1.5" />
          Zurücksetzen
        </Button>
      </div>

      <CollapsibleSection title="Kategorie" defaultOpen>
        <CheckboxGroup options={categories} selected={filters.categories} onChange={v => updateFilter('categories', v)} />
      </CollapsibleSection>

      <CollapsibleSection title="Mechanische Eigenschaften" defaultOpen>
        <div className="space-y-4">
          <RangeFilter label="Dichte" unit="kg/m³" value={filters.densityRange} onChange={v => updateFilter('densityRange', v)} min={0} max={25000} step={100} />
          <RangeFilter label="E-Modul" unit="GPa" value={filters.modulusRange} onChange={v => updateFilter('modulusRange', v)} min={0} max={500} step={1} />
          <RangeFilter label="Streckgrenze" unit="MPa" value={filters.strengthRange} onChange={v => updateFilter('strengthRange', v)} min={0} max={2500} step={10} />
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Thermische Eigenschaften">
        <RangeFilter label="Max. Temperatur" unit="°C" value={filters.tempRange} onChange={v => updateFilter('tempRange', v)} min={-200} max={3000} step={10} />
      </CollapsibleSection>

      <CollapsibleSection title="Kosten">
        <RangeFilter label="Relative Kosten" unit="" value={filters.costRange} onChange={v => updateFilter('costRange', v)} min={1} max={10} step={1} />
      </CollapsibleSection>

      <CollapsibleSection title="Korrosionsbeständigkeit">
        <CheckboxGroup options={corrosionLevels} selected={filters.corrosionResistance} onChange={v => updateFilter('corrosionResistance', v)} />
      </CollapsibleSection>

      <CollapsibleSection title="Fertigungsverfahren">
        <CheckboxGroup options={methods} selected={filters.manufacturingMethods} onChange={v => updateFilter('manufacturingMethods', v)} />
      </CollapsibleSection>

      <label className="flex items-center gap-2.5 text-[13px] cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
        <Checkbox checked={filters.recyclableOnly} onCheckedChange={checked => updateFilter('recyclableOnly', !!checked)} className="w-4 h-4 rounded" />
        Nur recycelbar
      </label>
    </aside>
  );
}
