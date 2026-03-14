import { useMaterials } from '@/context/MaterialContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export default function ComparisonPage() {
  const { compareIds, materials, toggleCompare, clearCompare } = useMaterials();
  const compared = materials.filter(m => compareIds.includes(m.id));

  if (compared.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground mb-2">Keine Werkstoffe zum Vergleich ausgewählt.</p>
        <p className="text-label text-muted-foreground">Werkstoffe im Dashboard über das Vergleichssymbol markieren.</p>
      </div>
    );
  }

  const rows: { label: string; unit?: string; getter: (m: typeof compared[0]) => string | number }[] = [
    { label: 'Kategorie', getter: m => m.category },
    { label: 'Unterkategorie', getter: m => m.subcategory },
    { label: 'Dichte', unit: 'kg/m³', getter: m => m.density.toLocaleString('de-DE') },
    { label: 'E-Modul', unit: 'GPa', getter: m => m.youngsModulus },
    { label: 'Streckgrenze', unit: 'MPa', getter: m => m.yieldStrength },
    { label: 'Zugfestigkeit', unit: 'MPa', getter: m => m.tensileStrength },
    { label: 'Spez. Steifigkeit', unit: 'kN·m/kg', getter: m => m.specificStiffness.toFixed(1) },
    { label: 'Spez. Festigkeit', unit: 'N·m/kg', getter: m => m.specificStrength.toFixed(1) },
    { label: 'Max. Temperatur', unit: '°C', getter: m => m.maxServiceTemp },
    { label: 'Wärmeleitf.', unit: 'W/(m·K)', getter: m => m.thermalConductivity },
    { label: 'Korrosionsbest.', getter: m => m.corrosionResistance },
    { label: 'Relative Kosten', getter: m => `${m.relativeCost}/10` },
    { label: 'Recycelbar', getter: m => m.recyclable ? 'Ja' : 'Nein' },
  ];

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-subheading font-semibold">Werkstoffvergleich ({compared.length})</h1>
        <Button variant="ghost" size="sm" onClick={clearCompare} className="text-muted-foreground">Alle entfernen</Button>
      </div>
      <div className="bg-card shadow-card rounded-lg overflow-x-auto">
        <table className="w-full text-body">
          <thead>
            <tr className="bg-muted">
              <th className="p-3 text-left text-label font-semibold w-48">Eigenschaft</th>
              {compared.map(m => (
                <th key={m.id} className="p-3 text-left text-label font-semibold min-w-[180px]">
                  <div className="flex items-center justify-between">
                    <Link to={`/werkstoff/${m.id}`} className="text-primary hover:underline">{m.name}</Link>
                    <button onClick={() => toggleCompare(m.id)} className="text-muted-foreground hover:text-foreground"><X className="w-3.5 h-3.5" /></button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.label} className="border-b border-border/50 hover:bg-muted/30">
                <td className="p-3 text-muted-foreground">
                  {row.label}{row.unit && <span className="text-unit">({row.unit})</span>}
                </td>
                {compared.map(m => (
                  <td key={m.id} className="p-3 font-mono-data">{row.getter(m)}</td>
                ))}
              </tr>
            ))}
            <tr className="border-b border-border/50">
              <td className="p-3 text-muted-foreground">Vorteile</td>
              {compared.map(m => <td key={m.id} className="p-3 text-label">{m.advantages}</td>)}
            </tr>
            <tr>
              <td className="p-3 text-muted-foreground">Limitierungen</td>
              {compared.map(m => <td key={m.id} className="p-3 text-label">{m.limitations}</td>)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
