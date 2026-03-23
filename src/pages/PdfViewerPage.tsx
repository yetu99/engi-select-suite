import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Download, ExternalLink, FileText } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

const documents = {
  'ipem-albers-2016': {
    title: 'iPeM Originalpaper',
    url: 'https://rrlkamlzjvzhgyuiwpxl.supabase.co/storage/v1/object/public/papers/iPeM_Albers_2016.pdf',
  },
  'pge-zusammenfassung': {
    title: 'PGE-Zusammenfassung',
    url: 'https://rrlkamlzjvzhgyuiwpxl.supabase.co/storage/v1/object/public/papers/PGE_Zusammenfassung.pdf',
  },
  'spalten-albers-2005': {
    title: 'SPALTEN Originalpaper',
    url: 'https://rrlkamlzjvzhgyuiwpxl.supabase.co/storage/v1/object/public/papers/SPALTEN_Albers_2005.pdf',
  },
  'vdi-2221-blatt-1': {
    title: 'VDI 2221 Blatt 1',
    url: 'https://rrlkamlzjvzhgyuiwpxl.supabase.co/storage/v1/object/public/papers/VDI_2221_Blatt_1.pdf',
  },
  'vdi-2221-blatt-2': {
    title: 'VDI 2221 Blatt 2',
    url: 'https://rrlkamlzjvzhgyuiwpxl.supabase.co/storage/v1/object/public/papers/VDI_2221_Blatt_2.pdf',
  },
  'vdi-2222-blatt-1': {
    title: 'VDI 2222 Blatt 1',
    url: 'https://rrlkamlzjvzhgyuiwpxl.supabase.co/storage/v1/object/public/papers/VDI_2222_Blatt_1.pdf',
  },
  'vdi-2222-blatt-2': {
    title: 'VDI 2222 Blatt 2',
    url: 'https://rrlkamlzjvzhgyuiwpxl.supabase.co/storage/v1/object/public/papers/VDI_2222_Blatt_2.pdf',
  },
} as const;

export default function PdfViewerPage() {
  const navigate = useNavigate();
  const { documentId } = useParams();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [pageWidth, setPageWidth] = useState(820);

  const documentEntry = documentId ? documents[documentId as keyof typeof documents] : undefined;

  useEffect(() => {
    const updateWidth = () => {
      if (!containerRef.current) return;
      setPageWidth(Math.max(280, Math.min(containerRef.current.clientWidth - 24, 980)));
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  if (!documentEntry) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4">
        <Card className="w-full max-w-lg border-border/60">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-bold text-foreground">Dokument nicht gefunden</h1>
              <p className="text-sm text-muted-foreground">Der angeforderte PDF-Link ist nicht verfügbar.</p>
            </div>
            <Button variant="outline" onClick={() => navigate('/methodik')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Zurück zur Methodik
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] px-4 py-6 sm:px-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/80 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <Button variant="ghost" size="sm" onClick={() => navigate('/methodik')} className="-ml-2 w-fit">
              <ArrowLeft className="mr-2 h-4 w-4" /> Zurück zur Methodik
            </Button>
            <h1 className="text-xl font-bold tracking-tight text-foreground">{documentEntry.title}</h1>
            <p className="text-sm text-muted-foreground">Direkt in der App angezeigt, damit die PDFs zuverlässig lesbar sind.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <a href={documentEntry.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" /> Direkt öffnen
              </a>
            </Button>
            <Button asChild size="sm">
              <a href={documentEntry.url} download>
                <Download className="mr-2 h-4 w-4" /> Herunterladen
              </a>
            </Button>
          </div>
        </div>

        <div ref={containerRef} className="rounded-2xl border border-border/60 bg-muted/30 p-3 sm:p-4">
          <Document
            file={documentEntry.url}
            loading={<div className="py-12 text-center text-sm text-muted-foreground">PDF wird geladen…</div>}
            error={<div className="py-12 text-center text-sm text-destructive">Die PDF konnte nicht geladen werden.</div>}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          >
            <div className="flex flex-col items-center gap-4">
              {Array.from({ length: numPages }, (_, index) => (
                <Page
                  key={index + 1}
                  pageNumber={index + 1}
                  width={pageWidth}
                  renderAnnotationLayer
                  renderTextLayer
                  className="overflow-hidden rounded-lg border border-border/60 bg-background shadow-sm"
                />
              ))}
            </div>
          </Document>
        </div>
      </div>
    </div>
  );
}
