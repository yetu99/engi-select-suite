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
  manufacturingMethods: [], relativeCost: 5, recyclable: false,
  typicalApplications: '', advantages: '', limitations: '', selectionNotes: '', source: '',
};

function NumField({ label, unit, value, onChange }: { label: string; unit: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="text-label font-medium text-foreground block mb-1">{label}</label>
      <div className="relative">
        <Input type="number" value={value || ''} onChange={e => onChange(parseFloat(e.target.value) || 0)} className="pr-16 font-mono-data" />
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
    typicalApplications: existing.typicalApplications, advantages: existing.advantages, limitations: existing.limitations,
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
    <div className="p-4 max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-label text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="w-3.5 h-3.5" /> Zurück
      </button>
      <h1 className="text-subheading font-semibold mb-4">{existing ? 'Werkstoff bearbeiten' : 'Werkstoff hinzufügen'}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card shadow-card rounded-lg p-4 space-y-4">
          <h2 className="text-label font-semibold uppercase tracking-wider text-muted-foreground">Allgemein</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-label font-medium text-foreground block mb-1">Werkstoffbezeichnung</label>
              <Input value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>
            <div>
              <label className="text-label font-medium text-foreground block mb-1">Kategorie</label>
              <Select value={form.category} onValueChange={v => set('category', v as MaterialCategory)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-label font-medium text-foreground block mb-1">Unterkategorie</label>
              <Input value={form.subcategory} onChange={e => set('subcategory', e.target.value)} />
            </div>
            <div>
              <label className="text-label font-medium text-foreground block mb-1">Quelle</label>
              <Input value={form.source} onChange={e => set('source', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-label font-medium text-foreground block mb-1">Kurzbeschreibung</label>
            <Textarea value={form.shortDescription} onChange={e => set('shortDescription', e.target.value)} rows={2} />
          </div>
        </div>

        <div className="bg-card shadow-card rounded-lg p-4 space-y-4">
          <h2 className="text-label font-semibold uppercase tracking-wider text-muted-foreground">Mechanische Eigenschaften</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <NumField label="Dichte" unit="kg/m³" value={form.density} onChange={v => set('density', v)} />
            <NumField label="E-Modul" unit="GPa" value={form.youngsModulus} onChange={v => set('youngsModulus', v)} />
            <NumField label="Streckgrenze" unit="MPa" value={form.yieldStrength} onChange={v => set('yieldStrength', v)} />
            <NumField label="Zugfestigkeit" unit="MPa" value={form.tensileStrength} onChange={v => set('tensileStrength', v)} />
          </div>
        </div>

        <div className="bg-card shadow-card rounded-lg p-4 space-y-4">
          <h2 className="text-label font-semibold uppercase tracking-wider text-muted-foreground">Thermische & Chemische Eigenschaften</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <NumField label="Max. Einsatztemperatur" unit="°C" value={form.maxServiceTemp} onChange={v => set('maxServiceTemp', v)} />
            <NumField label="Wärmeleitfähigkeit" unit="W/(m·K)" value={form.thermalConductivity} onChange={v => set('thermalConductivity', v)} />
            <div>
              <label className="text-label font-medium text-foreground block mb-1">Korrosionsbeständigkeit</label>
              <Select value={form.corrosionResistance} onValueChange={v => set('corrosionResistance', v as CorrosionResistance)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{corrosionLevels.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="bg-card shadow-card rounded-lg p-4 space-y-4">
          <h2 className="text-label font-semibold uppercase tracking-wider text-muted-foreground">Fertigung & Kosten</h2>
          <div>
            <span className="text-label font-medium text-foreground block mb-2">Fertigungsverfahren</span>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {allMethods.map(method => (
                <label key={method} className="flex items-center gap-1.5 text-label text-muted-foreground cursor-pointer hover:text-foreground">
                  <Checkbox
                    checked={form.manufacturingMethods.includes(method)}
                    onCheckedChange={checked => set('manufacturingMethods', checked ? [...form.manufacturingMethods, method] : form.manufacturingMethods.filter(m => m !== method))}
                    className="w-3.5 h-3.5 rounded-sm"
                  />
                  {method}
                </label>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <NumField label="Relative Kosten (1–10)" unit="" value={form.relativeCost} onChange={v => set('relativeCost', Math.min(10, Math.max(1, v)))} />
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-label text-foreground cursor-pointer">
                <Checkbox checked={form.recyclable} onCheckedChange={checked => set('recyclable', !!checked)} className="w-3.5 h-3.5 rounded-sm" />
                Recycelbar
              </label>
            </div>
          </div>
        </div>

        <div className="bg-card shadow-card rounded-lg p-4 space-y-4">
          <h2 className="text-label font-semibold uppercase tracking-wider text-muted-foreground">Beschreibung</h2>
          <div>
            <label className="text-label font-medium text-foreground block mb-1">Typische Anwendungen</label>
            <Textarea value={form.typicalApplications} onChange={e => set('typicalApplications', e.target.value)} rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-label font-medium text-foreground block mb-1">Vorteile</label>
              <Textarea value={form.advantages} onChange={e => set('advantages', e.target.value)} rows={2} />
            </div>
            <div>
              <label className="text-label font-medium text-foreground block mb-1">Limitierungen</label>
              <Textarea value={form.limitations} onChange={e => set('limitations', e.target.value)} rows={2} />
            </div>
          </div>
          <div>
            <label className="text-label font-medium text-foreground block mb-1">Auswahlhinweise</label>
            <Textarea value={form.selectionNotes} onChange={e => set('selectionNotes', e.target.value)} rows={2} />
          </div>
        </div>

        <Button type="submit" className="gap-2">
          <Save className="w-4 h-4" />
          {existing ? 'Änderungen speichern' : 'Werkstoff speichern'}
        </Button>
      </form>
    </div>
  );
}
