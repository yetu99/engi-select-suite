
import { useMaterials } from '@/context/MaterialContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, LayoutList, LayoutGrid } from 'lucide-react';
import FilterSidebar from '@/components/FilterSidebar';
import MaterialTable from '@/components/MaterialTable';
import MaterialCards from '@/components/MaterialCards';

export default function DashboardPage() {
  const { filters, updateFilter, viewMode, setViewMode, filteredMaterials, materials } = useMaterials();

  return (
    <div className="flex">
      <FilterSidebar />
      <div className="flex-1 min-w-0">
        <div className="sticky top-14 z-20 bg-background/80 backdrop-blur-md p-4 flex items-center gap-3 border-b border-border/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={filters.search}
              onChange={e => updateFilter('search', e.target.value)}
              placeholder="Werkstoff suchen…"
              className="pl-9 rounded-lg"
            />
          </div>
          <span className="text-[13px] text-muted-foreground">
            {filteredMaterials.length} von {materials.length} Werkstoffen
          </span>
          <div className="flex gap-1 ml-auto">
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="h-8 w-8 p-0 rounded-lg"
            >
              <LayoutList className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'card' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('card')}
              className="h-8 w-8 p-0 rounded-lg"
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {viewMode === 'table' ? <MaterialTable /> : <MaterialCards />}
      </div>
    </div>
  );
}
