import React, { useRef, useMemo, useState } from 'react';
import {
  ComposedChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Customized,
  Cell,
  LabelList,
} from 'recharts';
import { Material, MaterialCategory } from '@/types/material';
import { CATEGORY_FILLS } from './types';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';

interface DataPoint {
  x: number;
  y: number;
  id: string;
  name: string;
  category: MaterialCategory;
  density: number;
  youngsModulus: number;
  yieldStrength: number;
  tensileStrength: number;
  fractureToughness: number;
  maxServiceTemp: number;
  relativeCost: number;
}

interface AshbyChartProps {
  materials: Material[];
  xKey: string;
  yKey: string;
  xLabel: string;
  yLabel: string;
  logX?: boolean;
  logY?: boolean;
  guidelineSlope?: number | null;
  guidelineIntercept: number;
  onInterceptChange: (v: number) => void;
  highlightIds?: Set<string>;
  shortlistIds?: Set<string>;
  onMaterialClick?: (id: string) => void;
}

const CHART_MARGIN = { top: 20, right: 40, bottom: 50, left: 80 };

function GuidelineRenderer({ xAxisMap, yAxisMap, slope, intercept }: any) {
  if (slope == null) return null;
  const xAxis = xAxisMap && Object.values(xAxisMap)[0] as any;
  const yAxis = yAxisMap && Object.values(yAxisMap)[0] as any;
  if (!xAxis?.scale || !yAxis?.scale) return null;

  const xScale = xAxis.scale;
  const yScale = yAxis.scale;
  const [xMin, xMax] = xScale.domain();
  const [yDomMin, yDomMax] = yScale.domain();

  if (xMin <= 0 || xMax <= 0) return null;

  const y1Raw = Math.pow(10, slope * Math.log10(xMin) + intercept);
  const y2Raw = Math.pow(10, slope * Math.log10(xMax) + intercept);
  const y1 = Math.max(yDomMin, Math.min(yDomMax, y1Raw));
  const y2 = Math.max(yDomMin, Math.min(yDomMax, y2Raw));

  const px1 = xScale(y1 === y1Raw ? xMin : Math.pow(10, (Math.log10(y1) - intercept) / slope));
  const py1 = yScale(y1);
  const px2 = xScale(y2 === y2Raw ? xMax : Math.pow(10, (Math.log10(y2) - intercept) / slope));
  const py2 = yScale(y2);

  return (
    <g>
      <line
        x1={px1} y1={py1} x2={px2} y2={py2}
        stroke="hsl(0, 70%, 50%)"
        strokeWidth={2.5}
        strokeDasharray="10 6"
        style={{ pointerEvents: 'none' }}
      />
      <text
        x={px2 - 8} y={py2 - 10}
        fill="hsl(0, 70%, 50%)"
        fontSize={11}
        textAnchor="end"
        fontFamily="'JetBrains Mono', monospace"
        fontWeight={600}
      >
        M = const
      </text>
    </g>
  );
}

/* Custom tooltip that renders as a floating card near the mouse */
function ChartTooltipContent({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload as DataPoint;
  if (!d) return null;
  return (
    <div className="bg-card/95 backdrop-blur-sm border border-border rounded-xl px-4 py-3 shadow-lg text-xs min-w-[200px] pointer-events-none z-[100]">
      <div className="font-bold text-foreground text-sm mb-0.5">{d.name}</div>
      <div className="text-muted-foreground text-[10px] mb-2 font-medium">{d.category}</div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[11px] text-muted-foreground">
        <div>ρ: <span className="text-foreground font-medium">{d.density.toLocaleString('de-DE')} kg/m³</span></div>
        <div>E: <span className="text-foreground font-medium">{d.youngsModulus} GPa</span></div>
        <div>σ_y: <span className="text-foreground font-medium">{d.yieldStrength} MPa</span></div>
        <div>R_m: <span className="text-foreground font-medium">{d.tensileStrength} MPa</span></div>
        <div>K_IC: <span className="text-foreground font-medium">{d.fractureToughness} MPa√m</span></div>
        <div>T_max: <span className="text-foreground font-medium">{d.maxServiceTemp} °C</span></div>
        <div className="col-span-2">Kosten: <span className="text-foreground font-medium">{d.relativeCost}/10</span></div>
      </div>
    </div>
  );
}

export default function AshbyChart({
  materials,
  xKey,
  yKey,
  xLabel,
  yLabel,
  logX = true,
  logY = true,
  guidelineSlope = null,
  guidelineIntercept,
  onInterceptChange,
  highlightIds,
  shortlistIds,
  onMaterialClick,
}: AshbyChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const searchMatchIds = useMemo(() => {
    if (!searchTerm.trim()) return new Set<string>();
    const lower = searchTerm.toLowerCase();
    return new Set(
      materials
        .filter((m) => m.name.toLowerCase().includes(lower))
        .map((m) => m.id)
    );
  }, [materials, searchTerm]);

  const allData = useMemo<DataPoint[]>(() => {
    return materials
      .map((m) => ({
        x: (m as any)[xKey] as number,
        y: (m as any)[yKey] as number,
        id: m.id,
        name: m.name,
        category: m.category,
        density: m.density,
        youngsModulus: m.youngsModulus,
        yieldStrength: m.yieldStrength,
        tensileStrength: m.tensileStrength,
        fractureToughness: m.fractureToughness,
        maxServiceTemp: m.maxServiceTemp,
        relativeCost: m.relativeCost,
      }))
      .filter((d) => (logX ? d.x > 0 : true) && (logY ? d.y > 0 : true));
  }, [materials, xKey, yKey, logX, logY]);

  const categories = useMemo(() => Array.from(new Set(allData.map((d) => d.category))), [allData]);

  const xDomain = useMemo<[number, number]>(() => {
    const vals = allData.map((d) => d.x);
    if (vals.length === 0) return [1, 10];
    if (logX) {
      const logMin = Math.floor(Math.log10(Math.min(...vals)));
      const logMax = Math.ceil(Math.log10(Math.max(...vals)));
      return [Math.pow(10, logMin), Math.pow(10, logMax)];
    }
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const pad = (max - min) * 0.1 || 1;
    return [min - pad, max + pad];
  }, [allData, logX]);

  const yDomain = useMemo<[number, number]>(() => {
    const vals = allData.map((d) => d.y);
    if (vals.length === 0) return [1, 10];
    if (logY) {
      const logMin = Math.floor(Math.log10(Math.min(...vals)));
      const logMax = Math.ceil(Math.log10(Math.max(...vals)));
      return [Math.pow(10, logMin), Math.pow(10, logMax)];
    }
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const pad = (max - min) * 0.1 || 1;
    return [min - pad, max + pad];
  }, [allData, logY]);

  const interceptRange = useMemo<[number, number]>(() => {
    if (guidelineSlope == null || !logX || !logY) return [0, 0];
    const values = allData.map((d) => Math.log10(d.y) - guidelineSlope * Math.log10(d.x));
    if (values.length === 0) return [-2, 2];
    const min = Math.min(...values);
    const max = Math.max(...values);
    const pad = (max - min) * 0.4;
    return [min - pad, max + pad];
  }, [allData, guidelineSlope, logX, logY]);

  const formatTick = (v: number) => {
    if (v === 0) return '0';
    if (Math.abs(v) >= 1e6) return `${(v / 1e6).toFixed(0)}M`;
    if (Math.abs(v) >= 10000) return `${(v / 1000).toFixed(0)}k`;
    if (Math.abs(v) >= 1000) return `${(v / 1000).toFixed(1)}k`;
    if (v < 0.01 && v > 0) return v.toExponential(1);
    if (v < 1 && v > 0) return v.toPrecision(2);
    return String(Math.round(v * 100) / 100);
  };

  const logTicks = (domain: [number, number]) => {
    const minExp = Math.floor(Math.log10(domain[0]));
    const maxExp = Math.ceil(Math.log10(domain[1]));
    const ticks: number[] = [];
    for (let e = minExp; e <= maxExp; e++) {
      ticks.push(Math.pow(10, e));
    }
    return ticks;
  };

  // Custom shape that renders the dot AND a name label for shortlisted/hovered items
  const renderDot = (props: any, cat: string) => {
    const { cx, cy, payload } = props;
    if (!cx || !cy || !payload) return null;
    const d = payload as DataPoint;
    const isShortlisted = shortlistIds?.has(d.id);
    const isHighlighted = highlightIds?.has(d.id);
    const isHovered = hoveredId === d.id;
    const isSearchMatch = searchMatchIds.has(d.id);
    const showLabel = isShortlisted || isHovered || isSearchMatch;

    const r = isSearchMatch ? 10 : isShortlisted ? 8 : isHighlighted ? 7 : 5;
    const fill = isSearchMatch ? '#ef4444' : isShortlisted ? '#facc15' : CATEGORY_FILLS[d.category] || '#888';
    const opacity = isHighlighted || isShortlisted || isSearchMatch ? 1 : 0.7;
    const stroke = isSearchMatch ? '#991b1b' : isShortlisted ? '#a16207' : isHighlighted ? 'hsl(215, 28%, 17%)' : 'none';
    const sw = isSearchMatch ? 3 : isShortlisted ? 2.5 : isHighlighted ? 1.5 : 0;

    return (
      <g key={d.id}>
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill={fill}
          fillOpacity={opacity}
          stroke={stroke}
          strokeWidth={sw}
          style={{ cursor: 'pointer', transition: 'r 150ms ease' }}
          onMouseEnter={() => setHoveredId(d.id)}
          onMouseLeave={() => setHoveredId(null)}
          onClick={() => onMaterialClick?.(d.id)}
        />
        {showLabel && (
          <text
            x={cx}
            y={cy - r - 4}
            textAnchor="middle"
            fill="hsl(215, 28%, 17%)"
            fontSize={9}
            fontWeight={600}
            fontFamily="'Inter', sans-serif"
            style={{ pointerEvents: 'none' }}
          >
            {d.name}
          </text>
        )}
      </g>
    );
  };

  return (
    <div className="space-y-3">
      <div
        ref={containerRef}
        className="select-none rounded-xl border border-border/60 bg-card overflow-hidden"
      >
        <ResponsiveContainer width="100%" height={480}>
          <ComposedChart margin={CHART_MARGIN}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.35} />
            <XAxis
              dataKey="x"
              type="number"
              scale={logX ? 'log' : 'linear'}
              domain={xDomain}
              ticks={logX ? logTicks(xDomain) : undefined}
              tickFormatter={formatTick}
              label={{
                value: logX ? `${xLabel} [log]` : xLabel,
                position: 'bottom',
                offset: 30,
                style: { fontSize: 11, fill: 'hsl(var(--muted-foreground))', fontFamily: "'JetBrains Mono', monospace" },
              }}
              tick={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}
              allowDuplicatedCategory={false}
              tickCount={logX ? undefined : 8}
            />
            <YAxis
              dataKey="y"
              type="number"
              scale={logY ? 'log' : 'linear'}
              domain={yDomain}
              tickFormatter={formatTick}
              label={{
                value: logY ? `${yLabel} [log]` : yLabel,
                angle: -90,
                position: 'left',
                offset: 55,
                style: { fontSize: 12, fill: 'hsl(var(--muted-foreground))', fontFamily: "'JetBrains Mono', monospace" },
              }}
              tick={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}
            />
            <Tooltip
              content={<ChartTooltipContent />}
              trigger="hover"
              isAnimationActive={false}
              allowEscapeViewBox={{ x: true, y: true }}
            />
            <Legend
              verticalAlign="top"
              height={30}
              wrapperStyle={{ fontSize: 11, fontFamily: "'Inter', sans-serif" }}
            />
            {categories.map((cat) => {
              const catData = allData.filter((d) => d.category === cat);
              return (
                <Scatter
                  key={cat}
                  name={cat}
                  data={catData}
                  fill={CATEGORY_FILLS[cat] || '#888'}
                  isAnimationActive={false}
                  shape={(props: any) => renderDot(props, cat)}
                />
              );
            })}
            {guidelineSlope != null && logX && logY && (
              <Customized
                component={
                  <GuidelineRenderer slope={guidelineSlope} intercept={guidelineIntercept} />
                }
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      {guidelineSlope != null && logX && logY && (
        <div className="flex items-center gap-4 px-4">
          <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">Leitlinie verschieben:</span>
          <Slider
            value={[guidelineIntercept]}
            onValueChange={([v]) => onInterceptChange(v)}
            min={interceptRange[0]}
            max={interceptRange[1]}
            step={0.01}
            className="flex-1"
          />
          <span className="text-xs font-mono text-muted-foreground w-32 text-right">
            M ≥ {Math.pow(10, guidelineIntercept).toExponential(2)}
          </span>
        </div>
      )}
    </div>
  );
}
