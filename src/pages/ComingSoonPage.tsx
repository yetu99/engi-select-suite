import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';
import { Button } from '@/components/ui/button';

const moduleNames: Record<string, string> = {
  '/methodik': 'Problemlösung & Methodik',
  '/oring': 'O-Ring-Auslegung',
  '/schadenskunde': 'Schadenskunde',
  '/tolerierung': 'Tolerierung & Messtechnik',
  '/normen': 'Normen-Übersicht',
  '/projektplanung': 'Projektplanung',
  '/hydraulik': 'Hydraulik-Auslegung',
  '/templates': 'Template-Datenbank',
};

export default function ComingSoonPage() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const title = moduleNames[pathname] ?? 'Modul';

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-6 text-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
        <Construction className="w-7 h-7 text-muted-foreground" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
      <p className="text-sm text-muted-foreground max-w-sm">
        Dieses Modul befindet sich in Entwicklung und wird bald verfügbar sein.
      </p>
      <Button variant="outline" size="sm" onClick={() => navigate('/')} className="mt-2 gap-1.5">
        <ArrowLeft className="w-4 h-4" /> Zur Startseite
      </Button>
    </div>
  );
}
