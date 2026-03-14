export type MaterialCategory = 'Metall' | 'Polymer' | 'Keramik' | 'Verbundwerkstoff' | 'Naturwerkstoff';

export type CorrosionResistance = 'Niedrig' | 'Mittel' | 'Hoch' | 'Sehr hoch';

export type ManufacturingMethod =
  | 'Gießen'
  | 'Schmieden'
  | 'Walzen'
  | 'Extrudieren'
  | 'Spritzgießen'
  | 'Sintern'
  | 'Schweißen'
  | 'Zerspanen'
  | 'Faserwickeln'
  | 'Laminieren'
  | '3D-Druck'
  | 'Pressen'
  | 'Blasformen'
  | 'Tiefziehen';

export interface Material {
  id: string;
  name: string;
  category: MaterialCategory;
  subcategory: string;
  shortDescription: string;
  density: number; // kg/m³
  youngsModulus: number; // GPa
  yieldStrength: number; // MPa
  tensileStrength: number; // MPa
  maxServiceTemp: number; // °C
  thermalConductivity: number; // W/(m·K)
  corrosionResistance: CorrosionResistance;
  manufacturingMethods: ManufacturingMethod[];
  relativeCost: number; // 1-10
  recyclable: boolean;
  typicalApplications: string;
  advantages: string;
  limitations: string;
  selectionNotes: string;
  lectureNotes: string;
  source: string;
  isFavorite: boolean;
  // Computed
  specificStiffness: number; // E/ρ (GPa/(kg/m³)) → (MPa·m³/kg)
  specificStrength: number; // σ_y/ρ (MPa/(kg/m³)) → (kPa·m³/kg)
}

export function computeSpecificProperties(m: Pick<Material, 'youngsModulus' | 'density' | 'yieldStrength'>) {
  return {
    specificStiffness: m.density > 0 ? (m.youngsModulus * 1e3) / m.density : 0, // kN·m/kg
    specificStrength: m.density > 0 ? (m.yieldStrength * 1e3) / m.density : 0, // N·m/kg
  };
}

export type SortField = 'name' | 'density' | 'youngsModulus' | 'yieldStrength' | 'tensileStrength' |
  'maxServiceTemp' | 'thermalConductivity' | 'relativeCost' | 'specificStiffness' | 'specificStrength';

export type SortDirection = 'asc' | 'desc';

export interface FilterState {
  search: string;
  categories: MaterialCategory[];
  densityRange: [number, number];
  modulusRange: [number, number];
  strengthRange: [number, number];
  tempRange: [number, number];
  corrosionResistance: CorrosionResistance[];
  manufacturingMethods: ManufacturingMethod[];
  costRange: [number, number];
  recyclableOnly: boolean;
}

export const defaultFilterState: FilterState = {
  search: '',
  categories: [],
  densityRange: [0, 25000],
  modulusRange: [0, 500],
  strengthRange: [0, 2500],
  tempRange: [-200, 3000],
  corrosionResistance: [],
  manufacturingMethods: [],
  costRange: [1, 10],
  recyclableOnly: false,
};
