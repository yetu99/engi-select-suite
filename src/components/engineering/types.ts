import { Material, CorrosionResistance, ManufacturingMethod } from '@/types/material';

export type LoadType = 'tension' | 'bending' | 'torsion' | 'fatigue' | 'fracture';

export type DesignObjective =
  | 'minimize-mass'
  | 'minimize-cost'
  | 'maximize-stiffness'
  | 'maximize-strength'
  | 'maximize-fracture-resistance';

export interface EngineeringProblem {
  loadType: LoadType;
  designObjective: DesignObjective;
  constraints: {
    maxTemp: number | null;
    minYieldStrength: number | null;
    corrosionResistance: CorrosionResistance[];
    manufacturingMethods: ManufacturingMethod[];
  };
}

export const defaultProblem: EngineeringProblem = {
  loadType: 'tension',
  designObjective: 'minimize-mass',
  constraints: {
    maxTemp: null,
    minYieldStrength: null,
    corrosionResistance: [],
    manufacturingMethods: [],
  },
};

export interface MaterialIndexDef {
  name: string;
  symbol: string;
  formula: string;
  unit: string;
  description: string;
  compute: (m: Material) => number;
  chartXKey: string;
  chartYKey: string;
  chartXLabel: string;
  chartYLabel: string;
  guidelineSlope: number;
}

const indices: Record<string, MaterialIndexDef> = {
  'E/rho': {
    name: 'Spezifische Steifigkeit (Zug)',
    symbol: 'M₁',
    formula: 'M = E / ρ',
    unit: 'GPa·m³/Mg',
    description: 'Maximiert Steifigkeit bei minimalem Gewicht für Zugbelastung. Leitlinie mit Steigung 1 auf dem log-log E-ρ-Diagramm.',
    compute: (m) => m.density > 0 ? m.youngsModulus / (m.density / 1000) : 0,
    chartXKey: 'density',
    chartYKey: 'youngsModulus',
    chartXLabel: 'Dichte ρ [kg/m³]',
    chartYLabel: 'E-Modul E [GPa]',
    guidelineSlope: 1,
  },
  'E^0.5/rho': {
    name: 'Spezifische Steifigkeit (Biegung)',
    symbol: 'M₂',
    formula: 'M = √E / ρ',
    unit: 'GPa⁰·⁵·m³/Mg',
    description: 'Maximiert Biegesteifigkeit bei minimalem Gewicht. Leitlinie mit Steigung 2 auf dem log-log E-ρ-Diagramm.',
    compute: (m) => m.density > 0 ? Math.sqrt(m.youngsModulus) / (m.density / 1000) : 0,
    chartXKey: 'density',
    chartYKey: 'youngsModulus',
    chartXLabel: 'Dichte ρ [kg/m³]',
    chartYLabel: 'E-Modul E [GPa]',
    guidelineSlope: 2,
  },
  'sigma/rho': {
    name: 'Spezifische Festigkeit (Zug)',
    symbol: 'M₃',
    formula: 'M = σ_y / ρ',
    unit: 'MPa·m³/Mg',
    description: 'Maximiert Festigkeit bei minimalem Gewicht für Zugbelastung. Leitlinie mit Steigung 1 auf dem log-log σ-ρ-Diagramm.',
    compute: (m) => m.density > 0 ? m.yieldStrength / (m.density / 1000) : 0,
    chartXKey: 'density',
    chartYKey: 'yieldStrength',
    chartXLabel: 'Dichte ρ [kg/m³]',
    chartYLabel: 'Streckgrenze σ_y [MPa]',
    guidelineSlope: 1,
  },
  'sigma^0.67/rho': {
    name: 'Spezifische Festigkeit (Biegung)',
    symbol: 'M₄',
    formula: 'M = σ_y^(2/3) / ρ',
    unit: 'MPa²/³·m³/Mg',
    description: 'Maximiert Biegefestigkeit bei minimalem Gewicht. Leitlinie mit Steigung 3/2 auf dem log-log σ-ρ-Diagramm.',
    compute: (m) => m.density > 0 ? Math.pow(m.yieldStrength, 2 / 3) / (m.density / 1000) : 0,
    chartXKey: 'density',
    chartYKey: 'yieldStrength',
    chartXLabel: 'Dichte ρ [kg/m³]',
    chartYLabel: 'Streckgrenze σ_y [MPa]',
    guidelineSlope: 1.5,
  },
  'E/(rho*C)': {
    name: 'Kostenoptimierte Steifigkeit',
    symbol: 'M₅',
    formula: 'M = E / (ρ · C_rel)',
    unit: 'GPa·m³/(Mg·€)',
    description: 'Minimiert Materialkosten bei gegebener Steifigkeitsanforderung.',
    compute: (m) => m.density > 0 && m.relativeCost > 0 ? m.youngsModulus / ((m.density / 1000) * m.relativeCost) : 0,
    chartXKey: 'density',
    chartYKey: 'youngsModulus',
    chartXLabel: 'Dichte ρ [kg/m³]',
    chartYLabel: 'E-Modul E [GPa]',
    guidelineSlope: 1,
  },
};

export function getMaterialIndex(loadType: LoadType, objective: DesignObjective): MaterialIndexDef {
  if (objective === 'minimize-cost') return indices['E/(rho*C)'];

  if (objective === 'maximize-stiffness' || (objective === 'minimize-mass' && !['fatigue', 'fracture'].includes(loadType))) {
    if (loadType === 'bending' || loadType === 'torsion') return indices['E^0.5/rho'];
    return indices['E/rho'];
  }

  if (objective === 'maximize-strength' || objective === 'maximize-fracture-resistance' || objective === 'minimize-mass') {
    if (loadType === 'bending' || loadType === 'torsion') return indices['sigma^0.67/rho'];
    return indices['sigma/rho'];
  }

  return indices['E/rho'];
}

export interface AshbyChartConfig {
  id: string;
  title: string;
  xKey: string;
  yKey: string;
  xLabel: string;
  yLabel: string;
  logX: boolean;
  logY: boolean;
}

export const ashbyCharts: AshbyChartConfig[] = [
  { id: 'e-vs-rho', title: 'E-Modul vs. Dichte', xKey: 'density', yKey: 'youngsModulus', xLabel: 'Dichte ρ [kg/m³]', yLabel: 'E-Modul E [GPa]', logX: true, logY: true },
  { id: 'sigma-vs-rho', title: 'Festigkeit vs. Dichte', xKey: 'density', yKey: 'yieldStrength', xLabel: 'Dichte ρ [kg/m³]', yLabel: 'Streckgrenze σ_y [MPa]', logX: true, logY: true },
  { id: 'sigma-vs-temp', title: 'Festigkeit vs. Temperatur', xKey: 'maxServiceTemp', yKey: 'yieldStrength', xLabel: 'Max. Einsatztemperatur [°C]', yLabel: 'Streckgrenze σ_y [MPa]', logX: false, logY: true },
  { id: 'tensile-vs-yield', title: 'Zugfestigkeit vs. Streckgrenze', xKey: 'yieldStrength', yKey: 'tensileStrength', xLabel: 'Streckgrenze σ_y [MPa]', yLabel: 'Zugfestigkeit R_m [MPa]', logX: true, logY: true },
  { id: 'cost-vs-density', title: 'Kosten vs. Dichte', xKey: 'density', yKey: 'relativeCost', xLabel: 'Dichte ρ [kg/m³]', yLabel: 'Relative Kosten [1-10]', logX: true, logY: false },
];

export const CATEGORY_COLORS: Record<string, string> = {
  Metall: 'hsl(210, 70%, 50%)',
  Polymer: 'hsl(140, 60%, 45%)',
  Keramik: 'hsl(30, 80%, 55%)',
  Verbundwerkstoff: 'hsl(270, 60%, 55%)',
  Naturwerkstoff: 'hsl(45, 70%, 40%)',
};

export const CATEGORY_FILLS: Record<string, string> = {
  Metall: '#3b82f6',
  Polymer: '#22c55e',
  Keramik: '#f97316',
  Verbundwerkstoff: '#a855f7',
  Naturwerkstoff: '#a3752c',
};

export function applyConstraints(materials: Material[], problem: EngineeringProblem): Material[] {
  return materials.filter((m) => {
    if (problem.constraints.maxTemp !== null && m.maxServiceTemp < problem.constraints.maxTemp) return false;
    if (problem.constraints.minYieldStrength !== null && m.yieldStrength < problem.constraints.minYieldStrength) return false;
    if (problem.constraints.corrosionResistance.length > 0 && !problem.constraints.corrosionResistance.includes(m.corrosionResistance)) return false;
    if (problem.constraints.manufacturingMethods.length > 0 && !problem.constraints.manufacturingMethods.some((method) => m.manufacturingMethods.includes(method))) return false;
    return true;
  });
}

export const LOAD_TYPE_LABELS: Record<LoadType, string> = {
  tension: 'Zug',
  bending: 'Biegung',
  torsion: 'Torsion',
  fatigue: 'Ermüdung',
  fracture: 'Bruch',
};

export const OBJECTIVE_LABELS: Record<DesignObjective, string> = {
  'minimize-mass': 'Masse minimieren',
  'minimize-cost': 'Kosten minimieren',
  'maximize-stiffness': 'Steifigkeit maximieren',
  'maximize-strength': 'Festigkeit maximieren',
  'maximize-fracture-resistance': 'Bruchzähigkeit maximieren',
};

export interface DimensioningInput {
  force: number;
  area: number;
  safetyFactor: number;
}

export const defaultDimensioning: DimensioningInput = {
  force: 10000,
  area: 100,
  safetyFactor: 2.0,
};
