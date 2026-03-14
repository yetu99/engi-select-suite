import { useMaterials } from '@/context/MaterialContext';
import MaterialCards from '@/components/MaterialCards';

export default function FavoritesPage() {
  const { materials, filteredMaterials } = useMaterials();
  const favorites = filteredMaterials.filter(m => m.isFavorite);

  if (favorites.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Keine Favoriten vorhanden.</p>
        <p className="text-label text-muted-foreground mt-1">Werkstoffe über das Sternsymbol als Favorit markieren.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-subheading font-semibold mb-4">Favoriten ({favorites.length})</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {favorites.map(m => (
          <div key={m.id} className="bg-card shadow-card rounded-lg p-4 hover:shadow-card-hover transition-card">
            <div className="flex items-start justify-between mb-2">
              <div>
                <a href={`/werkstoff/${m.id}`} className="text-body font-semibold text-primary hover:underline">{m.name}</a>
                <p className="text-label text-muted-foreground">{m.category} · {m.subcategory}</p>
              </div>
            </div>
            <p className="text-label text-muted-foreground mb-2">{m.shortDescription}</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-label">
              <div className="flex justify-between"><span className="text-muted-foreground">Dichte</span><span className="font-mono-data">{m.density.toLocaleString('de-DE')} <span className="text-unit">kg/m³</span></span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">E-Modul</span><span className="font-mono-data">{m.youngsModulus} <span className="text-unit">GPa</span></span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Spez. Steif.</span><span className="font-mono-data text-primary">{m.specificStiffness.toFixed(1)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Spez. Fest.</span><span className="font-mono-data text-primary">{m.specificStrength.toFixed(1)}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
