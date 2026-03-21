import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import IPeMModel from '@/components/methodik/IPeMModel';
import SpaltenMethod from '@/components/methodik/SpaltenMethod';
import VdiProcess from '@/components/methodik/VdiProcess';

export default function MethodikPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-3.5rem)] max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(210,70%,45%)] to-[hsl(210,70%,58%)] flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-foreground">Problemlösung & Methodik</h1>
            <p className="text-[11px] text-muted-foreground">iPeM · SPALTEN · VDI 2221/2222</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="ipem" className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full max-w-lg">
          <TabsTrigger value="ipem" className="text-xs">iPeM — Produktentwicklung</TabsTrigger>
          <TabsTrigger value="spalten" className="text-xs">SPALTEN — Problemlösung</TabsTrigger>
          <TabsTrigger value="vdi" className="text-xs">VDI 2221/2222</TabsTrigger>
        </TabsList>

        <TabsContent value="ipem">
          <IPeMModel />
        </TabsContent>

        <TabsContent value="spalten">
          <SpaltenMethod />
        </TabsContent>

        <TabsContent value="vdi">
          <VdiProcess />
        </TabsContent>
      </Tabs>
    </div>
  );
}
