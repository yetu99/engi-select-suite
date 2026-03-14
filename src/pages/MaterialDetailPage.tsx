import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMaterials } from '@/context/MaterialContext';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Pencil, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function MaterialDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getMaterialById, toggleFavorite, updateLectureNotes, deleteMaterial } = useMaterials();
  const m = getMaterialById(id!);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (m) setNotes(m.lectureNotes);
  }, [m]);

  if (!m) return <div className="p-8 text-center text-muted-foreground">Werkstoff nicht gefunden.</div>;

  const saveNotes = () => updateLectureNotes(m.id, notes);
  const handleDelete = () => { deleteMaterial(m.id); navigate('/'); };

  const props: { label: string; value: string | number; unit?: string }[] = [
    { label: 'Dichte', value: m.density.toLocaleString('de-DE'), unit: 'kg/m³' },
    { label: 'E-Modul', value: m.youngsModulus, unit: 'GPa' },
    { label: 'Streckgrenze', value: m.yieldStrength, unit: 'MPa' },
    { label: 'Zugfestigkeit', value: m.tensileStrength, unit: 'MPa' },
    { label: 'Spezifische Steifigkeit (E/ρ)', value: m.specificStiffness.toFixed(2), unit: 'kN·m/kg' },
    { label: 'Spezifische Festigkeit (σ/ρ)', value: m.specificStrength.toFixed(2), unit: 'N·m/kg' },
    { label: 'Max. Einsatztemperatur', value: m.maxServiceTemp, unit: '°C' },
    { label: 'Wärmeleitfähigkeit', value: m.thermalConductivity, unit: 'W/(m·K)' },
    { label: 'Korrosionsbeständigkeit', value: m.corrosionResistance },
    { label: 'Relative Kosten', value: `${m.relativeCost}/10` },
    { label: 'Recycelbar', value: m.recyclable ? 'Ja' : 'Nein' },
  ];

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-label text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="w-3.5 h-3.5" /> Zurück
      </button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-subheading font-semibold">{m.name}</h1>
          <p className="text-label text-muted-foreground">{m.category} · {m.subcategory}</p>
          <p className="text-body text-muted-foreground mt-1">{m.shortDescription}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => toggleFavorite(m.id)}>
            <Star className={`w-4 h-4 ${m.isFavorite ? 'fill-warning text-warning' : ''}`} />
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/bearbeiten/${m.id}`}><Pencil className="w-4 h-4" /></Link>
          </Button>
          <Button variant="ghost" size="sm" className="text-destructive" onClick={handleDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="bg-card shadow-card rounded-lg p-4">
            <h2 className="text-label font-semibold uppercase tracking-wider text-muted-foreground mb-3">Technische Daten</h2>
            <table className="w-full text-body">
              <tbody>
                {props.map(p => (
                  <tr key={p.label} className="border-b border-border/50 last:border-0">
                    <td className="py-1.5 text-muted-foreground">{p.label}</td>
                    <td className="py-1.5 text-right font-mono-data font-medium">
                      {p.value}{p.unit && <span className="text-unit">{p.unit}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-card shadow-card rounded-lg p-4">
            <h2 className="text-label font-semibold uppercase tracking-wider text-muted-foreground mb-3">Fertigung</h2>
            <div className="flex flex-wrap gap-1.5">
              {m.manufacturingMethods.map(method => (
                <span key={method} className="bg-muted text-muted-foreground px-2 py-0.5 rounded-sm text-label">{method}</span>
              ))}
            </div>
            <p className="text-label text-muted-foreground mt-3">Quelle: {m.source}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-card shadow-card rounded-lg p-4 space-y-3">
            <h2 className="text-label font-semibold uppercase tracking-wider text-muted-foreground">Anwendungen & Bewertung</h2>
            <div>
              <span className="text-label font-medium text-foreground">Typische Anwendungen</span>
              <p className="text-body text-muted-foreground">{m.typicalApplications}</p>
            </div>
            <div>
              <span className="text-label font-medium text-foreground">Vorteile</span>
              <p className="text-body text-muted-foreground">{m.advantages}</p>
            </div>
            <div>
              <span className="text-label font-medium text-foreground">Limitierungen</span>
              <p className="text-body text-muted-foreground">{m.limitations}</p>
            </div>
            <div>
              <span className="text-label font-medium text-foreground">Auswahlhinweise</span>
              <p className="text-body text-muted-foreground">{m.selectionNotes}</p>
            </div>
          </div>

          <div className="bg-card shadow-card rounded-lg p-4">
            <h2 className="text-label font-semibold uppercase tracking-wider text-muted-foreground mb-3">Vorlesungsnotizen</h2>
            <Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={6} placeholder="Eigene Notizen zu diesem Werkstoff..." />
            <Button size="sm" className="mt-2" onClick={saveNotes}>Notizen speichern</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
