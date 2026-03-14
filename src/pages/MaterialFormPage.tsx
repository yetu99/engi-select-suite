import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMaterials } from '@/context/MaterialContext';
import { Material, MaterialCategory, CorrosionResistance, ManufacturingMethod } from '@/types/material';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save } from 'lucide-react';

const categories: MaterialCategory[] = ['Metall', 'Polymer', 'Keramik', 'Verbundwerkstoff', 'Naturwerkstoff'];
const corrosionLevels: CorrosionResistance[] = ['Niedrig', 'Mittel', 'Hoch', 'Sehr hoch'];
const allMethods: ManufacturingMethod[] = ['Gießen', 'Schmieden', 'Walzen', 'Extrudieren', 'Spritzgießen', 'Sintern', 'Schweißen', 'Zerspanen', 'Faserwickeln', 'Laminieren', '3D-Druck', 'Pressen', 'Blasformen', 'Tiefziehen'];

type FormData = Omit<Material, 'id' | 'specificStiffness' | 'specificStrength' | 'isFavorite' | 'lectureNotes'>;

const emptyForm: FormData = {
  name: '', category: 'Metall', subcategory: '', shortDescription: '',
  density: 0, youngsModulus: 0, yieldStrength: 0, tensileStrength: 0,
  maxServiceTemp: 0, thermalConductivity: 0, corrosionResistance: 'Mittel',
  manufacturingMethods: [], relativeCost: 5, recyclable: false, fractureToughness: 0,
  typicalApplications: '', advantages: '', limitations: '', selectionNotes: '', source: '',
};

function NumField({ label, unit, value, onChange }: { label: string; unit: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="text-[13px] font-medium text-foreground block mb-1.5">{label}</label>
      <div className="relative">
        <Input type="number" value={value || ''} onChange={e => onChange(parseFloat(e.target.value) || 0)} className="pr-16 font-mono-data rounded-lg" />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-label text-muted-foreground">{unit}</span>
      </div>
    </div>
  );
}

export default function MaterialForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addMaterial, updateMaterial, getMaterialById } = useMaterials();

  const existing = id ? getMaterialById(id) : undefined;
  const [form, setForm] = useState<FormData>(existing ? {
    name: existing.name, category: existing.category, subcategory: existing.subcategory,
    shortDescription: existing.shortDescription, density: existing.density, youngsModulus: existing.youngsModulus,
    yieldStrength: existing.yieldStrength, tensileStrength: existing.tensileStrength, maxServiceTemp: existing.maxServiceTemp,
    thermalConductivity: existing.thermalConductivity, corrosionResistance: existing.corrosionResistance,
    manufacturingMethods: existing.manufacturingMethods, relativeCost: existing.relativeCost, recyclable: existing.recyclable,
    fractureToughness: existing.fractureToughness, typicalApplications: existing.typicalApplications,
    advantages: existing.advantages, limitations: existing.limitations,
    selectionNotes: existing.selectionNotes, source: existing.source,
  } : emptyForm);

  const set = <K extends keyof FormData>(key: K, val: FormData[K]) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (existing) {
      updateMaterial(existing.id, form);
      navigate(`/werkstoff/${existing.id}`);
    } else {
      addMaterial(form);
      navigate('/');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground mb-5 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Zurück
      </button>
      <h1 className="text-xl font-semibold mb-6">{existing ? 'Werkstoff bearbeiten' : 'Werkstoff hinzufügen'}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card shadow-card rounded-xl p-5 space-y-4 border border-border/50">
          <h2 className="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground">Allgemein</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[13px] font-medium text-foreground block mb-1.5">Werkstoffbezeichnung</label>
              <Input value={form.name} onChange={e => set('name', e.target.value)} required className="rounded-lg" />
            </div>
            <div>
              <label className="text-[13px] font-medium text-foreground block mb-1.5">Kategorie</label>
              <Select value={form.category} onValueChange={v => set('category', v as MaterialCategory)}>
                <SelectTrigger className="rounded-lg"><SelectValue /></SelectTrigger>
                <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-[13px] font-medium text-foreground block mb-1.5">Unterkategorie</label>
              <Input value={form.subcategory} onChange={e => set('subcategory', e.target.value)} className="rounded-lg" />
            </div>
            <div>
              <label className="text-[13px] font-medium text-foreground block mb-1.5">Quelle</label>
              <Input value={form.source} onChange={e => set('source', e.target.value)} className="rounded-lg" />
            </div>
          </div>
          <div>
            <label className="text-[13px] font-medium text-foreground block mb-1.5">Kurzbeschreibung</label>
            <Textarea value={form.shortDescription} onChange={e => set('shortDescription', e.target.value)} rows={2} className="rounded-lg" />
          </div>
        </div>

        <div className="bg-card shadow-card rounded-xl p-5 space-y-4 border border-border/50">
          <h2 className="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground">Mechanische Eigenschaften</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <NumField label="Dichte" unit="kg/m³" value={form.density} onChange={v => set('density', v)} />
            <NumField label="E-Modul" unit="GPa" value={form.youngsModulus} onChange={v => set('youngsModulus', v)} />
            <NumField label="Streckgrenze" unit="MPa" value={form.yieldStrength} onChange={v => set('yieldStrength', v)} />
            <NumField label="Zugfestigkeit" unit="MPa" value={form.tensileStrength} onChange={v => set('tensileStrength', v)} />
            <NumField label="Bruchzähigkeit K_IC" unit="MPa√m" value={form.fractureToughness} onChange={v => set('fractureToughness', v)} />
          </div>
        </div>

        <div className="bg-card shadow-card rounded-xl p-5 space-y-4 border border-border/50">
          <h2 className="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground">Thermische & Chemische Eigenschaften</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <NumField label="Max. Einsatztemperatur" unit="°C" value={form.maxServiceTemp} onChange={v => set('maxServiceTemp', v)} />
            <NumField label="Wärmeleitfähigkeit" unit="W/(m·K)" value={form.thermalConductivity} onChange={v => set('thermalConductivity', v)} />
            <div>
              <label className="text-[13px] font-medium text-foreground block mb-1.5">Korrosionsbeständigkeit</label>
              <Select value={form.corrosionResistance} onValueChange={v => set('corrosionResistance', v as CorrosionResistance)}>
                <SelectTrigger className="rounded-lg"><SelectValue /></SelectTrigger>
                <SelectContent>{corrosionLevels.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="bg-card shadow-card rounded-xl p-5 space-y-4 border border-border/50">
          <h2 className="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground">Fertigung & Kosten</h2>
          <div>
            <span className="text-[13px] font-medium text-foreground block mb-2">Fertigungsverfahren</span>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {allMethods.map(method => (
                <label key={method} className="flex items-center gap-2 text-[13px] text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                  <Checkbox
                    checked={form.manufacturingMethods.includes(method)}
                    onCheckedChange={checked => set('manufacturingMethods', checked ? [...form.manufacturingMethods, method] : form.manufacturingMethods.filter(m => m !== method))}
                    className="w-4 h-4 rounded"
                  />
                  {method}
                </label>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <NumField label="Relative Kosten (1–10)" unit="" value={form.relativeCost} onChange={v => set('relativeCost', Math.min(10, Math.max(1, v)))} />
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2.5 text-[13px] text-foreground cursor-pointer">
                <Checkbox checked={form.recyclable} onCheckedChange={checked => set('recyclable', !!checked)} className="w-4 h-4 rounded" />
                Recycelbar
              </label>
            </div>
          </div>
        </div>

        <div className="bg-card shadow-card rounded-xl p-5 space-y-4 border border-border/50">
          <h2 className="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground">Beschreibung</h2>
          <div>
            <label className="text-[13px] font-medium text-foreground block mb-1.5">Typische Anwendungen</label>
            <Textarea value={form.typicalApplications} onChange={e => set('typicalApplications', e.target.value)} rows={2} className="rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[13px] font-medium text-foreground block mb-1.5">Vorteile</label>
              <Textarea value={form.advantages} onChange={e => set('advantages', e.target.value)} rows={2} className="rounded-lg" />
            </div>
            <div>
              <label className="text-[13px] font-medium text-foreground block mb-1.5">Limitierungen</label>
              <Textarea value={form.limitations} onChange={e => set('limitations', e.target.value)} rows={2} className="rounded-lg" />
            </div>
          </div>
          <div>
            <label className="text-[13px] font-medium text-foreground block mb-1.5">Auswahlhinweise</label>
            <Textarea value={form.selectionNotes} onChange={e => set('selectionNotes', e.target.value)} rows={2} className="rounded-lg" />
          </div>
        </div>

        <Button type="submit" className="gap-2 rounded-lg">
          <Save className="w-4 h-4" />
          {existing ? 'Änderungen speichern' : 'Werkstoff speichern'}
        </Button>
      </form>
    </div>
  );
}
