import { useMaterials } from '@/context/MaterialContext';
import { Link } from 'react-router-dom';
import { Star, GitCompareArrows } from 'lucide-react';

export default function MaterialCards() {
  const { filteredMaterials, toggleFavorite, toggleCompare, compareIds } = useMaterials();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-3">
      {filteredMaterials.map(m => (
        <div key={m.id} className="bg-card shadow-card rounded-lg p-4 hover:shadow-card-hover transition-card">
          <div className="flex items-start justify-between mb-2">
            <div>
              <Link to={`/werkstoff/${m.id}`} className="text-body font-semibold text-primary hover:underline">{m.name}</Link>
              <p className="text-label text-muted-foreground">{m.category} · {m.subcategory}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => toggleFavorite(m.id)} className="p-1 text-muted-foreground hover:text-warning">
                <Star className={`w-4 h-4 ${m.isFavorite ? 'fill-warning text-warning' : ''}`} />
              </button>
              <button onClick={() => toggleCompare(m.id)} className={`p-1 ${compareIds.includes(m.id) ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}>
                <GitCompareArrows className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-label text-muted-foreground mb-3">{m.shortDescription}</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-label">
            <div className="flex justify-between"><span className="text-muted-foreground">Dichte</span><span className="font-mono-data">{m.density.toLocaleString('de-DE')} <span className="text-unit">kg/m³</span></span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">E-Modul</span><span className="font-mono-data">{m.youngsModulus} <span className="text-unit">GPa</span></span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Streckgr.</span><span className="font-mono-data">{m.yieldStrength} <span className="text-unit">MPa</span></span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Zugfest.</span><span className="font-mono-data">{m.tensileStrength} <span className="text-unit">MPa</span></span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Spez. Steif.</span><span className="font-mono-data text-primary font-medium">{m.specificStiffness.toFixed(1)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Spez. Fest.</span><span className="font-mono-data text-primary font-medium">{m.specificStrength.toFixed(1)}</span></div>
          </div>
        </div>
      ))}
      {filteredMaterials.length === 0 && (
        <div className="col-span-full p-8 text-center text-muted-foreground">Keine Werkstoffe gefunden. Filter anpassen.</div>
      )}
    </div>
  );
}
