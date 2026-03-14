import { useState } from 'react';
import { useMaterials } from '@/context/MaterialContext';
import { Material } from '@/types/material';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';

interface Requirement {
  maxDensity: number;
  minYieldStrength: number;
  minModulus: number;
  minTemp: number;
  maxCost: number;
  prioritize: 'specificStiffness' | 'specificStrength' | 'cost' | 'temperature';
}

const defaultReq: Requirement = {
  maxDensity: 10000,
  minYieldStrength: 0,
  minModulus: 0,
  minTemp: 0,
  maxCost: 10,
  prioritize: 'specificStiffness',
};

export default function RecommendationPage() {
  const { materials } = useMaterials();
  const [req, setReq] = useState<Requirement>(defaultReq);
  const [results, setResults] = useState<Material[] | null>(null);

  const set = <K extends keyof Requirement>(key: K, val: Requirement[K]) => setReq(prev => ({ ...prev, [key]: val }));

  const findMaterials = () => {
    let filtered = materials.filter(m =>
      m.density <= req.maxDensity &&
      m.yieldStrength >= req.minYieldStrength &&
      m.youngsModulus >= req.minModulus &&
      m.maxServiceTemp >= req.minTemp &&
      m.relativeCost <= req.maxCost
    );

    filtered.sort((a, b) => {
      switch (req.prioritize) {
        case 'specificStiffness': return b.specificStiffness - a.specificStiffness;
        case 'specificStrength': return b.specificStrength - a.specificStrength;
        case 'cost': return a.relativeCost - b.relativeCost;
        case 'temperature': return b.maxServiceTemp - a.maxServiceTemp;
      }
    });

    setResults(filtered);
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-subheading font-semibold mb-4">Werkstoffempfehlung</h1>
      <p className="text-body text-muted-foreground mb-6">
        Anforderungen eingeben – das System berechnet die spezifischen Kennwerte und schlägt passende Werkstoffe vor.
      </p>

      <div className="bg-card shadow-card rounded-lg p-4 mb-6">
        <h2 className="text-label font-semibold uppercase tracking-wider text-muted-foreground mb-4">Muss-Kriterien (Hard Limits)</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="text-label font-medium text-foreground block mb-1">Max. Dichte</label>
            <div className="relative">
              <Input type="number" value={req.maxDensity || ''} onChange={e => set('maxDensity', parseFloat(e.target.value) || 0)} className="pr-16 font-mono-data" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-label text-muted-foreground">kg/m³</span>
            </div>
          </div>
          <div>
            <label className="text-label font-medium text-foreground block mb-1">Min. Streckgrenze</label>
            <div className="relative">
              <Input type="number" value={req.minYieldStrength || ''} onChange={e => set('minYieldStrength', parseFloat(e.target.value) || 0)} className="pr-12 font-mono-data" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-label text-muted-foreground">MPa</span>
            </div>
          </div>
          <div>
            <label className="text-label font-medium text-foreground block mb-1">Min. E-Modul</label>
            <div className="relative">
              <Input type="number" value={req.minModulus || ''} onChange={e => set('minModulus', parseFloat(e.target.value) || 0)} className="pr-12 font-mono-data" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-label text-muted-foreground">GPa</span>
            </div>
          </div>
          <div>
            <label className="text-label font-medium text-foreground block mb-1">Min. Einsatztemperatur</label>
            <div className="relative">
              <Input type="number" value={req.minTemp || ''} onChange={e => set('minTemp', parseFloat(e.target.value) || 0)} className="pr-8 font-mono-data" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-label text-muted-foreground">°C</span>
            </div>
          </div>
          <div>
            <label className="text-label font-medium text-foreground block mb-1">Max. Kosten (1–10)</label>
            <Input type="number" value={req.maxCost || ''} onChange={e => set('maxCost', Math.min(10, Math.max(1, parseFloat(e.target.value) || 1)))} className="font-mono-data" />
          </div>
        </div>

        <h2 className="text-label font-semibold uppercase tracking-wider text-muted-foreground mt-6 mb-3">Soll-Kriterium (Ranking)</h2>
        <div className="max-w-xs">
          <label className="text-label font-medium text-foreground block mb-1">Sortieren nach</label>
          <Select value={req.prioritize} onValueChange={v => set('prioritize', v as Requirement['prioritize'])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="specificStiffness">Spezifische Steifigkeit (E/ρ)</SelectItem>
              <SelectItem value="specificStrength">Spezifische Festigkeit (σ/ρ)</SelectItem>
              <SelectItem value="cost">Niedrigste Kosten</SelectItem>
              <SelectItem value="temperature">Höchste Einsatztemperatur</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="mt-6" onClick={findMaterials}>Werkstoffe suchen</Button>
      </div>

      {results !== null && (
        <div className="bg-card shadow-card rounded-lg overflow-hidden">
          <div className="bg-muted p-3">
            <h2 className="text-label font-semibold">
              {results.length} Werkstoff{results.length !== 1 ? 'e' : ''} gefunden
            </h2>
          </div>
          {results.length === 0 ? (
            <p className="p-4 text-muted-foreground text-body">Keine Werkstoffe erfüllen alle Anforderungen. Kriterien anpassen.</p>
          ) : (
            <table className="w-full text-body">
              <thead>
                <tr className="border-b border-border/50 text-label text-muted-foreground">
                  <th className="p-3 text-left font-semibold">#</th>
                  <th className="p-3 text-left font-semibold">Werkstoff</th>
                  <th className="p-3 text-left font-semibold">Dichte <span className="font-normal">(kg/m³)</span></th>
                  <th className="p-3 text-left font-semibold">E-Modul <span className="font-normal">(GPa)</span></th>
                  <th className="p-3 text-left font-semibold">σ_y <span className="font-normal">(MPa)</span></th>
                  <th className="p-3 text-left font-semibold">Spez. Steif. <span className="font-normal">(kN·m/kg)</span></th>
                  <th className="p-3 text-left font-semibold">Spez. Fest. <span className="font-normal">(N·m/kg)</span></th>
                  <th className="p-3 text-left font-semibold">T_max <span className="font-normal">(°C)</span></th>
                  <th className="p-3 text-left font-semibold">Kosten</th>
                </tr>
              </thead>
              <tbody>
                {results.map((m, i) => (
                  <tr key={m.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="p-3 text-muted-foreground">{i + 1}</td>
                    <td className="p-3">
                      <Link to={`/werkstoff/${m.id}`} className="text-primary hover:underline font-medium">{m.name}</Link>
                      <div className="text-label text-muted-foreground">{m.category}</div>
                    </td>
                    <td className="p-3 font-mono-data">{m.density.toLocaleString('de-DE')}</td>
                    <td className="p-3 font-mono-data">{m.youngsModulus}</td>
                    <td className="p-3 font-mono-data">{m.yieldStrength}</td>
                    <td className="p-3 font-mono-data text-primary font-medium">{m.specificStiffness.toFixed(1)}</td>
                    <td className="p-3 font-mono-data text-primary font-medium">{m.specificStrength.toFixed(1)}</td>
                    <td className="p-3 font-mono-data">{m.maxServiceTemp}</td>
                    <td className="p-3">{m.relativeCost}/10</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
