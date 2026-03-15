import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Material } from '@/types/material';
import {
  MaterialIndexDef,
  EngineeringProblem,
  DimensioningInput,
  LOAD_TYPE_LABELS,
  OBJECTIVE_LABELS,
  DIMENSIONING_LOAD_LABELS,
  BENDING_SUBTYPE_LABELS,
  computeNominalStress,
  computeBendingMoment,
} from './types';

interface PdfExportParams {
  problem: EngineeringProblem;
  index: MaterialIndexDef;
  dimensioning: DimensioningInput;
  materials: Material[];
  shortlistIds: Set<string>;
}

export function exportEngineeringPdf({
  problem,
  index,
  dimensioning,
  materials,
  shortlistIds,
}: PdfExportParams) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  let y = 18;

  const addHeading = (text: string) => {
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 64, 175);
    doc.text(text, 14, y);
    y += 2;
    doc.setDrawColor(30, 64, 175);
    doc.line(14, y, pageW - 14, y);
    y += 7;
  };

  const addKV = (label: string, value: string) => {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    doc.text(label, 16, y);
    doc.setTextColor(30);
    doc.text(value, 70, y);
    y += 5;
  };

  // Title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('MaterialSelect — Auslegungsbericht', 14, y);
  y += 4;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120);
  doc.text(`Erstellt am ${new Date().toLocaleDateString('de-DE')}`, 14, y);
  y += 10;

  // 1. Problem Definition
  addHeading('1. Problemdefinition');
  addKV('Belastungsart:', LOAD_TYPE_LABELS[problem.loadType]);
  addKV('Entwurfsziel:', OBJECTIVE_LABELS[problem.designObjective]);
  if (problem.constraints.maxTemp !== null)
    addKV('Max. Temperatur:', `${problem.constraints.maxTemp} °C`);
  if (problem.constraints.minYieldStrength !== null)
    addKV('Min. Streckgrenze:', `${problem.constraints.minYieldStrength} MPa`);
  if (problem.constraints.corrosionResistance.length > 0)
    addKV('Korrosion:', problem.constraints.corrosionResistance.join(', '));
  if (problem.constraints.manufacturingMethods.length > 0)
    addKV('Fertigung:', problem.constraints.manufacturingMethods.join(', '));
  y += 3;

  // 2. Material Index
  addHeading('2. Materialindex');
  addKV('Index:', `${index.symbol} = ${index.formula}`);
  addKV('Einheit:', index.unit);
  addKV('Leitlinien-Steigung:', String(index.guidelineSlope));
  y += 3;

  // 3. Dimensioning
  addHeading('3. Dimensionierung');
  addKV('Lastfall:', DIMENSIONING_LOAD_LABELS[dimensioning.loadCase]);
  if (dimensioning.loadCase === 'bending')
    addKV('Biegefall:', BENDING_SUBTYPE_LABELS[dimensioning.bendingSubType]);

  const nominalStress = computeNominalStress(dimensioning);
  const isTorsion = dimensioning.loadCase === 'torsion';

  if (dimensioning.loadCase === 'tension') {
    addKV('Kraft F:', `${dimensioning.force} N`);
    addKV('Fläche A:', `${dimensioning.area} mm²`);
  } else if (dimensioning.loadCase === 'bending') {
    const M = computeBendingMoment(dimensioning);
    addKV('M_max:', `${M.toFixed(0)} N·mm`);
    addKV('y:', `${dimensioning.distanceY} mm`);
    addKV('I:', `${dimensioning.momentOfInertia} mm⁴`);
  } else {
    addKV('Torsionsmoment T:', `${dimensioning.torque} N·mm`);
    addKV('r:', `${dimensioning.radiusR} mm`);
    addKV('J:', `${dimensioning.polarMomentJ} mm⁴`);
  }
  addKV('Sicherheitsfaktor S:', String(dimensioning.safetyFactor));
  addKV('Nennspannung:', `${nominalStress.toFixed(1)} MPa`);
  y += 3;

  // 4. Results table
  addHeading('4. Ergebnisse — Shortlist');

  const subset = shortlistIds.size > 0
    ? materials.filter((m) => shortlistIds.has(m.id))
    : [...materials].sort((a, b) => index.compute(b) - index.compute(a)).slice(0, 10);

  const rows = subset
    .map((m) => {
      const strength = isTorsion ? m.yieldStrength / Math.sqrt(3) : m.yieldStrength;
      const allowable = strength / dimensioning.safetyFactor;
      return {
        name: m.name,
        category: m.category,
        indexVal: index.compute(m),
        density: m.density,
        yieldStrength: m.yieldStrength,
        E: m.youngsModulus,
        allowable,
        passes: nominalStress <= allowable,
      };
    })
    .sort((a, b) => b.indexVal - a.indexVal);

  autoTable(doc, {
    startY: y,
    margin: { left: 14, right: 14 },
    headStyles: { fillColor: [30, 64, 175], fontSize: 7, font: 'helvetica' },
    bodyStyles: { fontSize: 7, font: 'helvetica' },
    head: [['#', 'Werkstoff', 'Kategorie', index.symbol, 'ρ [kg/m³]', 'σ_y [MPa]', 'E [GPa]', `${isTorsion ? 'τ' : 'σ'}_zul`, 'Status']],
    body: rows.map((r, i) => [
      String(i + 1),
      r.name,
      r.category,
      r.indexVal.toFixed(2),
      r.density.toLocaleString('de-DE'),
      String(r.yieldStrength),
      String(r.E),
      r.allowable.toFixed(1),
      r.passes ? '✓ OK' : '✗ FAIL',
    ]),
    didParseCell(data) {
      if (data.section === 'body' && data.column.index === 8) {
        const val = data.cell.raw as string;
        data.cell.styles.textColor = val.includes('OK') ? [22, 163, 74] : [220, 38, 38];
        data.cell.styles.fontStyle = 'bold';
      }
    },
  });

  doc.save('MaterialSelect_Auslegungsbericht.pdf');
}
