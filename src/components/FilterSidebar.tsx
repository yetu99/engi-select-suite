import { useMaterials } from '@/context/MaterialContext';
import { FilterState, MaterialCategory, CorrosionResistance, ManufacturingMethod } from '@/types/material';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

const categories: MaterialCategory[] = ['Metall', 'Polymer', 'Keramik', 'Verbundwerkstoff', 'Naturwerkstoff'];
const corrosionLevels: CorrosionResistance[] = ['Niedrig', 'Mittel', 'Hoch', 'Sehr hoch'];
const methods: ManufacturingMethod[] = ['Gießen', 'Schmieden', 'Walzen', 'Extrudieren', 'Spritzgießen', 'Sintern', 'Schweißen', 'Zerspanen', 'Faserwickeln', 'Laminieren', '3D-Druck', 'Pressen'];

function RangeFilter({ label, unit, value, onChange, min, max, step = 1 }: {
  label: string; unit: string; value: [number, number]; onChange: (v: [number, number]) => void; min: number; max: number; step?: number;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-label">
        <span className="text-foreground font-medium">{label}</span>
        <span className="text-muted-foreground">{value[0]}–{value[1]} {unit}</span>
      </div>
      <Slider min={min} max={max} step={step} value={value} onValueChange={(v) => onChange(v as [number, number])} className="py-1" />
    </div>
  );
}

function CheckboxGroup<T extends string>({ label, options, selected, onChange }: {
  label: string; options: T[]; selected: T[]; onChange: (v: T[]) => void;
}) {
  return (
    <div className="space-y-1.5">
      <span className="text-label font-medium text-foreground">{label}</span>
      <div className="space-y-1">
        {options.map(opt => (
          <label key={opt} className="flex items-center gap-2 text-label cursor-pointer hover:text-foreground text-muted-foreground">
            <Checkbox
              checked={selected.includes(opt)}
              onCheckedChange={checked => {
                onChange(checked ? [...selected, opt] : selected.filter(s => s !== opt));
              }}
              className="w-3.5 h-3.5 rounded-sm"
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
}

export default function FilterSidebar() {
  const { filters, updateFilter, resetFilters } = useMaterials();

  return (
    <aside className="w-[260px] shrink-0 p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-48px)] sticky top-12">
      <div className="flex items-center justify-between">
        <h2 className="text-label font-semibold text-foreground uppercase tracking-wider">Filter</h2>
        <Button variant="ghost" size="sm" onClick={resetFilters} className="h-6 px-2 text-label text-muted-foreground">
          <RotateCcw className="w-3 h-3 mr-1" />
          Zurücksetzen
        </Button>
      </div>

      <CheckboxGroup label="Kategorie" options={categories} selected={filters.categories} onChange={v => updateFilter('categories', v)} />

      <RangeFilter label="Dichte" unit="kg/m³" value={filters.densityRange} onChange={v => updateFilter('densityRange', v)} min={0} max={25000} step={100} />
      <RangeFilter label="E-Modul" unit="GPa" value={filters.modulusRange} onChange={v => updateFilter('modulusRange', v)} min={0} max={500} step={1} />
      <RangeFilter label="Streckgrenze" unit="MPa" value={filters.strengthRange} onChange={v => updateFilter('strengthRange', v)} min={0} max={2500} step={10} />
      <RangeFilter label="Max. Temperatur" unit="°C" value={filters.tempRange} onChange={v => updateFilter('tempRange', v)} min={-200} max={3000} step={10} />
      <RangeFilter label="Relative Kosten" unit="" value={filters.costRange} onChange={v => updateFilter('costRange', v)} min={1} max={10} step={1} />

      <CheckboxGroup label="Korrosionsbeständigkeit" options={corrosionLevels} selected={filters.corrosionResistance} onChange={v => updateFilter('corrosionResistance', v)} />
      <CheckboxGroup label="Fertigungsverfahren" options={methods} selected={filters.manufacturingMethods} onChange={v => updateFilter('manufacturingMethods', v)} />

      <label className="flex items-center gap-2 text-label cursor-pointer text-muted-foreground hover:text-foreground">
        <Checkbox checked={filters.recyclableOnly} onCheckedChange={checked => updateFilter('recyclableOnly', !!checked)} className="w-3.5 h-3.5 rounded-sm" />
        Nur recycelbar
      </label>
    </aside>
  );
}
