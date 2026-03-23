import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const STORAGE_BASE = 'https://rrlkamlzjvzhgyuiwpxl.supabase.co/storage/v1/object/public/papers';

const documents: Record<string, { title: string; file: string }> = {
  'ipem-albers-2016': { title: 'iPeM Originalpaper', file: 'iPeM_Albers_2016.pdf' },
  'pge-zusammenfassung': { title: 'PGE-Zusammenfassung', file: 'PGE_Zusammenfassung.pdf' },
  'spalten-albers-2005': { title: 'SPALTEN Originalpaper', file: 'SPALTEN_Albers_2005.pdf' },
  'vdi-2221-blatt-1': { title: 'VDI 2221 Blatt 1', file: 'VDI_2221_Blatt_1.pdf' },
  'vdi-2221-blatt-2': { title: 'VDI 2221 Blatt 2', file: 'VDI_2221_Blatt_2.pdf' },
  'vdi-2222-blatt-1': { title: 'VDI 2222 Blatt 1', file: 'VDI_2222_Blatt_1.pdf' },
  'vdi-2222-blatt-2': { title: 'VDI 2222 Blatt 2', file: 'VDI_2222_Blatt_2.pdf' },
};

export default function PdfViewerPage() {
  const navigate = useNavigate();
  const { documentId } = useParams();
  const entry = documentId ? documents[documentId] : undefined;

  // Redirect to the actual PDF URL immediately
  useEffect(() => {
    if (entry) {
      window.open(`${STORAGE_BASE}/${entry.file}`, '_blank');
      navigate('/methodik', { replace: true });
    }
  }, [entry, navigate]);

  if (!entry) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4">
        <Card className="w-full max-w-lg border-border/60">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Dokument nicht gefunden</h1>
            <p className="text-sm text-muted-foreground">Der angeforderte PDF-Link ist nicht verfügbar.</p>
            <Button variant="outline" onClick={() => navigate('/methodik')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Zurück zur Methodik
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
