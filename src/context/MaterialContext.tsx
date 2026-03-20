import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Material, FilterState, defaultFilterState, SortField, SortDirection, computeSpecificProperties, MaterialCategory } from '@/types/material';
import { seedMaterials } from '@/data/seedMaterials';

interface MaterialContextType {
  materials: Material[];
  filters: FilterState;
  sortField: SortField;
  sortDirection: SortDirection;
  compareIds: string[];
  viewMode: 'table' | 'card';
  setFilters: (f: FilterState) => void;
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
  setSort: (field: SortField) => void;
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
  setViewMode: (mode: 'table' | 'card') => void;
  toggleFavorite: (id: string) => void;
  updateLectureNotes: (id: string, notes: string) => void;
  addMaterial: (m: Omit<Material, 'id' | 'specificStiffness' | 'specificStrength' | 'isFavorite' | 'lectureNotes'>) => void;
  updateMaterial: (id: string, m: Partial<Material>) => void;
  deleteMaterial: (id: string) => void;
  getMaterialById: (id: string) => Material | undefined;
  filteredMaterials: Material[];
}

const MaterialContext = createContext<MaterialContextType | null>(null);

export function useMaterials() {
  const ctx = useContext(MaterialContext);
  if (!ctx) throw new Error('useMaterials must be used within MaterialProvider');
  return ctx;
}

function applyFilters(materials: Material[], filters: FilterState): Material[] {
  return materials.filter(m => {
    if (filters.search) {
      const s = filters.search.toLowerCase();
      if (!m.name.toLowerCase().includes(s) && !m.subcategory.toLowerCase().includes(s) && !m.shortDescription.toLowerCase().includes(s) && !m.category.toLowerCase().includes(s)) return false;
    }
    if (filters.categories.length > 0 && !filters.categories.includes(m.category)) return false;
    if (m.density < filters.densityRange[0] || m.density > filters.densityRange[1]) return false;
    if (m.youngsModulus < filters.modulusRange[0] || m.youngsModulus > filters.modulusRange[1]) return false;
    if (m.yieldStrength < filters.strengthRange[0] || m.yieldStrength > filters.strengthRange[1]) return false;
    if (m.maxServiceTemp < filters.tempRange[0] || m.maxServiceTemp > filters.tempRange[1]) return false;
    if (filters.corrosionResistance.length > 0 && !filters.corrosionResistance.includes(m.corrosionResistance)) return false;
    if (filters.manufacturingMethods.length > 0 && !filters.manufacturingMethods.some(mm => m.manufacturingMethods.includes(mm))) return false;
    if (m.relativeCost < filters.costRange[0] || m.relativeCost > filters.costRange[1]) return false;
    if (filters.recyclableOnly && !m.recyclable) return false;
    return true;
  });
}

function applySorting(materials: Material[], field: SortField, direction: SortDirection): Material[] {
  return [...materials].sort((a, b) => {
    const va = a[field];
    const vb = b[field];
    if (typeof va === 'string' && typeof vb === 'string') {
      return direction === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
    }
    return direction === 'asc' ? (va as number) - (vb as number) : (vb as number) - (va as number);
  });
}

export function MaterialProvider({ children }: { children: ReactNode }) {
  const [materials, setMaterials] = useState<Material[]>(seedMaterials);
  const [filters, setFilters] = useState<FilterState>(defaultFilterState);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('card');

  const updateFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => setFilters(defaultFilterState), []);

  const setSort = useCallback((field: SortField) => {
    setSortField(prev => {
      if (prev === field) {
        setSortDirection(d => d === 'asc' ? 'desc' : 'asc');
        return prev;
      }
      setSortDirection('asc');
      return field;
    });
  }, []);

  const toggleCompare = useCallback((id: string) => {
    setCompareIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : prev.length < 5 ? [...prev, id] : prev);
  }, []);

  const clearCompare = useCallback(() => setCompareIds([]), []);

  const toggleFavorite = useCallback((id: string) => {
    setMaterials(prev => prev.map(m => m.id === id ? { ...m, isFavorite: !m.isFavorite } : m));
  }, []);

  const updateLectureNotes = useCallback((id: string, notes: string) => {
    setMaterials(prev => prev.map(m => m.id === id ? { ...m, lectureNotes: notes } : m));
  }, []);

  const addMaterial = useCallback((m: Omit<Material, 'id' | 'specificStiffness' | 'specificStrength' | 'isFavorite' | 'lectureNotes'>) => {
    const computed = computeSpecificProperties(m);
    setMaterials(prev => [...prev, { ...m, id: crypto.randomUUID(), ...computed, isFavorite: false, lectureNotes: '' }]);
  }, []);

  const updateMaterial = useCallback((id: string, updates: Partial<Material>) => {
    setMaterials(prev => prev.map(m => {
      if (m.id !== id) return m;
      const updated = { ...m, ...updates };
      const computed = computeSpecificProperties(updated);
      return { ...updated, ...computed };
    }));
  }, []);

  const deleteMaterial = useCallback((id: string) => {
    setMaterials(prev => prev.filter(m => m.id !== id));
    setCompareIds(prev => prev.filter(i => i !== id));
  }, []);

  const getMaterialById = useCallback((id: string) => materials.find(m => m.id === id), [materials]);

  const filteredMaterials = applySorting(applyFilters(materials, filters), sortField, sortDirection);

  return (
    <MaterialContext.Provider value={{
      materials, filters, sortField, sortDirection, compareIds, viewMode,
      setFilters, updateFilter, resetFilters, setSort, toggleCompare, clearCompare,
      setViewMode, toggleFavorite, updateLectureNotes, addMaterial, updateMaterial,
      deleteMaterial, getMaterialById, filteredMaterials,
    }}>
      {children}
    </MaterialContext.Provider>
  );
}
