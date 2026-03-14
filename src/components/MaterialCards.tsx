import { useMaterials } from '@/context/MaterialContext';
import { Link } from 'react-router-dom';
import { Star, GitCompareArrows } from 'lucide-react';

export default function MaterialCards() {
  const { filteredMaterials, toggleFavorite, toggleCompare, compareIds } = useMaterials();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {filteredMaterials.map(m => (
        <div key={m.id} className="bg-card shadow-card rounded-xl p-5 hover:shadow-card-hover transition-card border border-border/50">
          <div className="flex items-start justify-between mb-3">
            <div>
              <Link to={`/werkstoff/${m.id}`} className="text-[15px] font-semibold text-primary hover:underline">{m.name}</Link>
              <p className="text-label text-muted-foreground mt-0.5">{m.category} · {m.subcategory}</p>
            </div>
            <div className="flex gap-0.5">
              <button onClick={() => toggleFavorite(m.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-warning hover:bg-accent transition-colors">
                <Star className={`w-4 h-4 ${m.isFavorite ? 'fill-warning text-warning' : ''}`} />
              </button>
              <button onClick={() => toggleCompare(m.id)} className={`p-1.5 rounded-lg transition-colors ${compareIds.includes(m.id) ? 'text-primary bg-accent' : 'text-muted-foreground hover:text-primary hover:bg-accent'}`}>
                <GitCompareArrows className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-label text-muted-foreground mb-4 line-clamp-2">{m.shortDescription}</p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[13px]">
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
        <div className="col-span-full p-12 text-center text-muted-foreground">Keine Werkstoffe gefunden. Filter anpassen.</div>
      )}
    </div>
  );
}
