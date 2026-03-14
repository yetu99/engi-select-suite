import { Material, computeSpecificProperties } from '@/types/material';

function mat(partial: Omit<Material, 'id' | 'specificStiffness' | 'specificStrength' | 'isFavorite' | 'lectureNotes'>): Material {
  const computed = computeSpecificProperties(partial);
  return { ...partial, id: crypto.randomUUID(), specificStiffness: computed.specificStiffness, specificStrength: computed.specificStrength, isFavorite: false, lectureNotes: '' };
}

export const seedMaterials: Material[] = [
  // METALLE
  mat({
    name: 'Baustahl S235', category: 'Metall', subcategory: 'Unlegierter Stahl',
    shortDescription: 'Allgemeiner Baustahl mit guter Schweißbarkeit',
    density: 7850, youngsModulus: 210, yieldStrength: 235, tensileStrength: 360,
    maxServiceTemp: 400, thermalConductivity: 50, corrosionResistance: 'Niedrig',
    manufacturingMethods: ['Walzen', 'Schweißen', 'Zerspanen'],
    relativeCost: 2, recyclable: true,
    typicalApplications: 'Stahlbau, Brücken, Fahrzeugrahmen',
    advantages: 'Günstig, gute Schweißbarkeit, hohe Verfügbarkeit',
    limitations: 'Korrosionsanfällig ohne Beschichtung',
    selectionNotes: 'Standardwerkstoff für tragende Konstruktionen', source: 'DIN EN 10025'
  }),
  mat({
    name: 'Edelstahl 1.4301 (V2A)', category: 'Metall', subcategory: 'Austenitischer Edelstahl',
    shortDescription: 'Korrosionsbeständiger austenitischer Cr-Ni-Stahl',
    density: 7900, youngsModulus: 200, yieldStrength: 210, tensileStrength: 520,
    maxServiceTemp: 600, thermalConductivity: 15, corrosionResistance: 'Hoch',
    manufacturingMethods: ['Walzen', 'Tiefziehen', 'Schweißen', 'Zerspanen'],
    relativeCost: 5, recyclable: true,
    typicalApplications: 'Lebensmittelindustrie, Chemie, Architektur',
    advantages: 'Korrosionsbeständig, hygienisch, langlebig',
    limitations: 'Teuer, schwer zerspanbar, nicht magnetisch',
    selectionNotes: 'Standard-Edelstahl für korrosive Umgebungen', source: 'DIN EN 10088'
  }),
  mat({
    name: 'Aluminium 6061-T6', category: 'Metall', subcategory: 'Al-Mg-Si-Legierung',
    shortDescription: 'Aushärtbare Al-Legierung mit guter Festigkeit',
    density: 2700, youngsModulus: 69, yieldStrength: 276, tensileStrength: 310,
    maxServiceTemp: 150, thermalConductivity: 167, corrosionResistance: 'Hoch',
    manufacturingMethods: ['Extrudieren', 'Zerspanen', 'Schweißen'],
    relativeCost: 4, recyclable: true,
    typicalApplications: 'Luftfahrt, Fahrradrahmen, Strukturteile',
    advantages: 'Leicht, gute spezifische Festigkeit, korrosionsbeständig',
    limitations: 'Geringe Maximaltemperatur, Spannungsrisskorrosion',
    selectionNotes: 'Universelle Leichtbau-Legierung', source: 'ASM Handbook'
  }),
  mat({
    name: 'Aluminium 7075-T6', category: 'Metall', subcategory: 'Al-Zn-Mg-Legierung',
    shortDescription: 'Hochfeste Al-Legierung für Luftfahrtanwendungen',
    density: 2810, youngsModulus: 72, yieldStrength: 503, tensileStrength: 572,
    maxServiceTemp: 120, thermalConductivity: 130, corrosionResistance: 'Mittel',
    manufacturingMethods: ['Walzen', 'Schmieden', 'Zerspanen'],
    relativeCost: 6, recyclable: true,
    typicalApplications: 'Flugzeugstrukturen, hochbelastete Bauteile',
    advantages: 'Sehr hohe Festigkeit, gute Ermüdungseigenschaften',
    limitations: 'Schlecht schweißbar, empfindlich gegen SRK',
    selectionNotes: 'Top-Wahl wenn hohe spezifische Festigkeit gefragt', source: 'ASM Handbook'
  }),
  mat({
    name: 'Titan Ti-6Al-4V', category: 'Metall', subcategory: 'Titanlegierung',
    shortDescription: 'Meistverwendete Titanlegierung (α+β)',
    density: 4430, youngsModulus: 114, yieldStrength: 880, tensileStrength: 950,
    maxServiceTemp: 400, thermalConductivity: 6.7, corrosionResistance: 'Sehr hoch',
    manufacturingMethods: ['Schmieden', 'Zerspanen', '3D-Druck'],
    relativeCost: 9, recyclable: true,
    typicalApplications: 'Luftfahrt, Medizintechnik, Turbinen',
    advantages: 'Hohe spez. Festigkeit, biokompatibel, korrosionsbeständig',
    limitations: 'Sehr teuer, schwer zu bearbeiten',
    selectionNotes: 'Premium-Leichtbauwerkstoff', source: 'ASM Handbook'
  }),
  mat({
    name: 'Kupfer Cu-ETP', category: 'Metall', subcategory: 'Reinkupfer',
    shortDescription: 'Elektrolytisch raffiniertes Reinkupfer',
    density: 8940, youngsModulus: 117, yieldStrength: 70, tensileStrength: 220,
    maxServiceTemp: 200, thermalConductivity: 394, corrosionResistance: 'Mittel',
    manufacturingMethods: ['Walzen', 'Extrudieren', 'Gießen'],
    relativeCost: 5, recyclable: true,
    typicalApplications: 'Elektroleitungen, Wärmetauscher, Leiterplatten',
    advantages: 'Höchste elektrische/thermische Leitfähigkeit',
    limitations: 'Weich, schwer, hoher Preis',
    selectionNotes: 'Standard für elektrische Anwendungen', source: 'DIN EN 13601'
  }),
  mat({
    name: 'Messing CuZn37', category: 'Metall', subcategory: 'Kupfer-Zink-Legierung',
    shortDescription: 'Kaltumformbares Messing',
    density: 8440, youngsModulus: 103, yieldStrength: 120, tensileStrength: 350,
    maxServiceTemp: 250, thermalConductivity: 120, corrosionResistance: 'Mittel',
    manufacturingMethods: ['Walzen', 'Tiefziehen', 'Zerspanen', 'Gießen'],
    relativeCost: 4, recyclable: true,
    typicalApplications: 'Armaturen, Beschläge, Patronenhülsen',
    advantages: 'Gute Zerspanbarkeit, dekorative Oberfläche',
    limitations: 'Spannungsrisskorrosion in Ammoniakumgebung',
    selectionNotes: 'Vielseitige Cu-Legierung', source: 'DIN EN 12164'
  }),
  // POLYMERE
  mat({
    name: 'Polyethylen HD (PE-HD)', category: 'Polymer', subcategory: 'Thermoplast',
    shortDescription: 'Teilkristalliner Standardkunststoff',
    density: 960, youngsModulus: 1.1, yieldStrength: 26, tensileStrength: 32,
    maxServiceTemp: 80, thermalConductivity: 0.45, corrosionResistance: 'Sehr hoch',
    manufacturingMethods: ['Spritzgießen', 'Blasformen', 'Extrudieren'],
    relativeCost: 1, recyclable: true,
    typicalApplications: 'Rohre, Behälter, Flaschen, Folien',
    advantages: 'Sehr günstig, chemisch beständig, leicht',
    limitations: 'Geringe Steifigkeit, UV-empfindlich',
    selectionNotes: 'Massenkunststoff für einfache Anwendungen', source: 'CAMPUS Datenbank'
  }),
  mat({
    name: 'Polyamid 6.6 (PA66)', category: 'Polymer', subcategory: 'Technischer Thermoplast',
    shortDescription: 'Technischer Kunststoff mit hoher Festigkeit',
    density: 1140, youngsModulus: 3.3, yieldStrength: 85, tensileStrength: 85,
    maxServiceTemp: 120, thermalConductivity: 0.25, corrosionResistance: 'Hoch',
    manufacturingMethods: ['Spritzgießen', 'Extrudieren'],
    relativeCost: 3, recyclable: true,
    typicalApplications: 'Zahnräder, Gleitlager, Kabelbinder',
    advantages: 'Hohe Festigkeit, gute Gleiteigenschaften',
    limitations: 'Wasseraufnahme, Maßänderung durch Feuchte',
    selectionNotes: 'Standardwerkstoff im Maschinenbau-Kunststofftechnik', source: 'CAMPUS Datenbank'
  }),
  mat({
    name: 'Polycarbonat (PC)', category: 'Polymer', subcategory: 'Technischer Thermoplast',
    shortDescription: 'Transparenter technischer Kunststoff',
    density: 1200, youngsModulus: 2.4, yieldStrength: 62, tensileStrength: 70,
    maxServiceTemp: 130, thermalConductivity: 0.21, corrosionResistance: 'Hoch',
    manufacturingMethods: ['Spritzgießen', 'Extrudieren', 'Pressen'],
    relativeCost: 4, recyclable: true,
    typicalApplications: 'Schutzscheiben, Brillengläser, Gehäuse',
    advantages: 'Transparent, schlagfest, gute Maßhaltigkeit',
    limitations: 'Spannungsrissempfindlich, UV-empfindlich',
    selectionNotes: 'Wo Transparenz und Schlagzähigkeit kombiniert nötig', source: 'CAMPUS Datenbank'
  }),
  mat({
    name: 'PEEK', category: 'Polymer', subcategory: 'Hochleistungskunststoff',
    shortDescription: 'Hochtemperatur-Hochleistungsthermoplast',
    density: 1300, youngsModulus: 4.1, yieldStrength: 100, tensileStrength: 100,
    maxServiceTemp: 260, thermalConductivity: 0.25, corrosionResistance: 'Sehr hoch',
    manufacturingMethods: ['Spritzgießen', 'Zerspanen', '3D-Druck'],
    relativeCost: 10, recyclable: false,
    typicalApplications: 'Medizinimplantate, Luftfahrt, Öl/Gas-Dichtungen',
    advantages: 'Höchste Temperaturbeständigkeit, chemisch inert',
    limitations: 'Extrem teuer',
    selectionNotes: 'Nur wenn keine Alternative reicht', source: 'Victrex Datenblatt'
  }),
  // KERAMIKEN
  mat({
    name: 'Aluminiumoxid (Al₂O₃)', category: 'Keramik', subcategory: 'Oxidkeramik',
    shortDescription: 'Meistverwendete technische Keramik',
    density: 3950, youngsModulus: 380, yieldStrength: 300, tensileStrength: 300,
    maxServiceTemp: 1700, thermalConductivity: 30, corrosionResistance: 'Sehr hoch',
    manufacturingMethods: ['Sintern', 'Pressen'],
    relativeCost: 5, recyclable: false,
    typicalApplications: 'Schneidkeramik, Isolatoren, Implantate',
    advantages: 'Extrem hart, chemisch beständig, Hochtemperatur',
    limitations: 'Spröde, schwer zu bearbeiten',
    selectionNotes: 'Standard-Ingenieurkeramik', source: 'CeramTec Datenblatt'
  }),
  mat({
    name: 'Siliziumcarbid (SiC)', category: 'Keramik', subcategory: 'Nichtoxidkeramik',
    shortDescription: 'Extrem harte und temperaturbeständige Keramik',
    density: 3100, youngsModulus: 410, yieldStrength: 400, tensileStrength: 400,
    maxServiceTemp: 1600, thermalConductivity: 120, corrosionResistance: 'Sehr hoch',
    manufacturingMethods: ['Sintern', 'Pressen'],
    relativeCost: 7, recyclable: false,
    typicalApplications: 'Schleifmittel, Bremsscheiben, Halbleiter',
    advantages: 'Höchste Härte, exzellente Wärmeleitfähigkeit',
    limitations: 'Spröde, teuer, schwer zu formen',
    selectionNotes: 'Wenn Verschleiß und Temperatur kritisch sind', source: 'ASM Handbook'
  }),
  mat({
    name: 'Zirkonoxid (ZrO₂)', category: 'Keramik', subcategory: 'Oxidkeramik',
    shortDescription: 'Zähe Keramik mit Umwandlungsverstärkung',
    density: 6050, youngsModulus: 210, yieldStrength: 500, tensileStrength: 500,
    maxServiceTemp: 1200, thermalConductivity: 2, corrosionResistance: 'Sehr hoch',
    manufacturingMethods: ['Sintern', 'Pressen', 'Zerspanen'],
    relativeCost: 8, recyclable: false,
    typicalApplications: 'Dentalkeramik, Schneidwerkzeuge, Ventilsitze',
    advantages: 'Hohe Bruchzähigkeit für eine Keramik, biokompatibel',
    limitations: 'Teuer, Alterung bei 200-300°C in Feuchtigkeit',
    selectionNotes: 'Bevorzugt wenn Keramik-Zähigkeit gefragt', source: 'CeramTec Datenblatt'
  }),
  // VERBUNDWERKSTOFFE
  mat({
    name: 'CFK (UD, Epoxid)', category: 'Verbundwerkstoff', subcategory: 'Faserverbund',
    shortDescription: 'Kohlefaserverstärkter Kunststoff, unidirektional',
    density: 1600, youngsModulus: 135, yieldStrength: 1500, tensileStrength: 1500,
    maxServiceTemp: 150, thermalConductivity: 5, corrosionResistance: 'Sehr hoch',
    manufacturingMethods: ['Laminieren', 'Faserwickeln', 'Pressen'],
    relativeCost: 9, recyclable: false,
    typicalApplications: 'Luftfahrt, Formel 1, Windkraftrotoren',
    advantages: 'Höchste spezifische Festigkeit und Steifigkeit',
    limitations: 'Teuer, sprödes Versagen, schwer zu reparieren',
    selectionNotes: 'Premium-Leichtbau, UD-Werte in Faserrichtung', source: 'Hexcel Datenblatt'
  }),
  mat({
    name: 'GFK (Gewebe, Epoxid)', category: 'Verbundwerkstoff', subcategory: 'Faserverbund',
    shortDescription: 'Glasfaserverstärkter Kunststoff',
    density: 2000, youngsModulus: 25, yieldStrength: 300, tensileStrength: 350,
    maxServiceTemp: 130, thermalConductivity: 0.3, corrosionResistance: 'Hoch',
    manufacturingMethods: ['Laminieren', 'Pressen', 'Spritzgießen'],
    relativeCost: 3, recyclable: false,
    typicalApplications: 'Bootsbau, Tanks, Rohrleitungen, Karosserieteile',
    advantages: 'Günstig, gute Festigkeit, korrosionsbeständig',
    limitations: 'Schwerer als CFK, UV-empfindlich',
    selectionNotes: 'Kostengünstige Alternative zu CFK', source: 'Owens Corning Datenblatt'
  }),
  mat({
    name: 'WPC (Holz-Polymer)', category: 'Verbundwerkstoff', subcategory: 'Partikelverbund',
    shortDescription: 'Wood-Plastic-Composite aus Holzfasern und PP',
    density: 1150, youngsModulus: 4, yieldStrength: 25, tensileStrength: 30,
    maxServiceTemp: 70, thermalConductivity: 0.3, corrosionResistance: 'Hoch',
    manufacturingMethods: ['Extrudieren', 'Spritzgießen'],
    relativeCost: 3, recyclable: true,
    typicalApplications: 'Terrassendielen, Zäune, Fassaden',
    advantages: 'Witterungsbeständig, wartungsarm, nachhaltig',
    limitations: 'Geringe Steifigkeit, Kriechneigung',
    selectionNotes: 'Holzersatz im Außenbereich', source: 'Herstellerangaben'
  }),
  mat({
    name: 'Stahlbeton C30/37', category: 'Verbundwerkstoff', subcategory: 'Matrixverbund',
    shortDescription: 'Bewehrter Beton der Festigkeitsklasse C30/37',
    density: 2400, youngsModulus: 33, yieldStrength: 30, tensileStrength: 3.8,
    maxServiceTemp: 300, thermalConductivity: 1.8, corrosionResistance: 'Mittel',
    manufacturingMethods: ['Gießen'],
    relativeCost: 1, recyclable: true,
    typicalApplications: 'Hochbau, Brücken, Fundamente',
    advantages: 'Günstig, druckfest, lokal verfügbar',
    limitations: 'Schwer, geringe Zugfestigkeit, Karbonatisierung',
    selectionNotes: 'Wichtigster Bauwerkstoff weltweit', source: 'DIN EN 206'
  }),
];
