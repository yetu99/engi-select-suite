import { useMaterials } from '@/context/MaterialContext';
import { SortField } from '@/types/material';
import { Link } from 'react-router-dom';
import { Star, GitCompareArrows, ChevronUp, ChevronDown } from 'lucide-react';

const columns: { key: SortField; label: string; unit?: string }[] = [
  { key: 'name', label: 'Werkstoffbezeichnung' },
  { key: 'density', label: 'Dichte', unit: 'kg/m³' },
  { key: 'youngsModulus', label: 'E-Modul', unit: 'GPa' },
  { key: 'yieldStrength', label: 'Streckgr.', unit: 'MPa' },
  { key: 'tensileStrength', label: 'Zugfest.', unit: 'MPa' },
  { key: 'specificStiffness', label: 'Spez. Steif.', unit: 'kN·m/kg' },
  { key: 'specificStrength', label: 'Spez. Fest.', unit: 'N·m/kg' },
  { key: 'maxServiceTemp', label: 'T_max', unit: '°C' },
  { key: 'relativeCost', label: 'Kosten' },
];

export default function MaterialTable() {
  const { filteredMaterials, sortField, sortDirection, setSort, toggleFavorite, toggleCompare, compareIds } = useMaterials();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-body">
        <thead>
          <tr className="bg-accent/50 border-b border-border">
            <th className="w-10 p-2.5" />
            <th className="w-10 p-2.5" />
            {columns.map(col => (
              <th
                key={col.key}
                className="p-2.5 text-left text-label font-semibold text-foreground cursor-pointer select-none hover:bg-accent rounded-lg whitespace-nowrap transition-colors"
                onClick={() => setSort(col.key)}
              >
                <span className="flex items-center gap-1">
                  {col.label}
                  {col.unit && <span className="text-muted-foreground font-normal">({col.unit})</span>}
                  {sortField === col.key && (
                    sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredMaterials.map(m => (
            <tr key={m.id} className="hover:bg-accent/30 transition-colors duration-150 border-b border-border/40">
              <td className="p-2.5">
                <button onClick={() => toggleFavorite(m.id)} className="p-1 rounded-md text-muted-foreground hover:text-warning hover:bg-accent transition-colors">
                  <Star className={`w-3.5 h-3.5 ${m.isFavorite ? 'fill-warning text-warning' : ''}`} />
                </button>
              </td>
              <td className="p-2.5">
                <button onClick={() => toggleCompare(m.id)} className={`p-1 rounded-md transition-colors ${compareIds.includes(m.id) ? 'text-primary bg-accent' : 'text-muted-foreground hover:text-primary hover:bg-accent'}`}>
                  <GitCompareArrows className="w-3.5 h-3.5" />
                </button>
              </td>
              <td className="p-2.5">
                <Link to={`/werkstoff/${m.id}`} className="text-primary hover:underline font-medium">{m.name}</Link>
                <div className="text-label text-muted-foreground">{m.category} · {m.subcategory}</div>
              </td>
              <td className="p-2.5 font-mono-data">{m.density.toLocaleString('de-DE')}</td>
              <td className="p-2.5 font-mono-data">{m.youngsModulus}</td>
              <td className="p-2.5 font-mono-data">{m.yieldStrength}</td>
              <td className="p-2.5 font-mono-data">{m.tensileStrength}</td>
              <td className="p-2.5 font-mono-data text-primary font-medium">{m.specificStiffness.toFixed(1)}</td>
              <td className="p-2.5 font-mono-data text-primary font-medium">{m.specificStrength.toFixed(1)}</td>
              <td className="p-2.5 font-mono-data">{m.maxServiceTemp}</td>
              <td className="p-2.5">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 10 }, (_, i) => (
                    <div key={i} className={`w-1.5 h-3.5 rounded-full ${i < m.relativeCost ? 'bg-primary' : 'bg-accent'}`} />
                  ))}
                </div>
              </td>
            </tr>
          ))}
          {filteredMaterials.length === 0 && (
            <tr>
              <td colSpan={11} className="p-12 text-center text-muted-foreground">Keine Werkstoffe gefunden. Filter anpassen.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
