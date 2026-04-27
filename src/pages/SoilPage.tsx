import { Sparkles, AlertCircle } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { useData } from '../context/DataContext';

const soilHistoryData = [
  { date: 'Wk 1', moisture: 38, nitrogen: 165 },
  { date: 'Wk 2', moisture: 42, nitrogen: 172 },
  { date: 'Wk 3', moisture: 35, nitrogen: 168 },
  { date: 'Wk 4', moisture: 48, nitrogen: 180 },
  { date: 'Wk 5', moisture: 44, nitrogen: 175 },
  { date: 'Wk 6', moisture: 42, nitrogen: 180 },
];

export default function SoilPage() {
  const { soil, hasAnalyzedData } = useData();

  if (!hasAnalyzedData) {
    return (
      <div className="px-5 sm:px-8 lg:px-10 py-6 lg:py-8 space-y-6 max-w-[1480px] mx-auto">
        <div className="hero-mesh px-6 sm:px-10 py-8 sm:py-10 text-white relative">
          <div className="relative z-10">
            <span className="chip mb-4 inline-flex" style={{ background: 'rgba(255,255,255,0.18)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
              <Sparkles className="w-2.5 h-2.5" /> Deep Analysis
            </span>
            <h2 className="text-[32px] sm:text-[40px] font-black tighter leading-tight">Soil Diagnostics</h2>
            <p className="text-[14px] opacity-80 mt-3 max-w-lg leading-relaxed">Deep nutrient & moisture analysis.</p>
          </div>
        </div>

        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} />
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No Soil Data Available</h3>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            Please go to <strong>Farm Details</strong> and run an analysis to get soil diagnostics for your farm.
          </p>
          <button
            onClick={() => window.location.hash = '#/farm'}
            className="px-6 py-3 rounded-lg font-medium transition-colors"
            style={{ background: 'var(--accent)', color: 'white' }}
          >
            Go to Farm Details
          </button>
        </div>
      </div>
    );
  }
  const h = (v: number, lo: number, hi: number) => v >= lo && v <= hi ? { tag: 'Optimal', chip: 'chip-accent', c: 'var(--accent)' } : v < lo ? { tag: 'Low', chip: 'chip-amber', c: '#f59e0b' } : { tag: 'High', chip: 'chip-red', c: '#ef4444' };

  const metrics = soil ? [
    { l: 'Moisture', v: soil.moisture, u: '%', lo: 40, hi: 60, e: '💧' },
    { l: 'pH Level', v: soil.ph, u: '', lo: 6, hi: 7.5, e: '⚗️' },
    { l: 'Nitrogen', v: soil.nitrogen, u: 'kg/ha', lo: 150, hi: 250, e: '🧪' },
    { l: 'Phosphorus', v: soil.phosphorus, u: 'kg/ha', lo: 25, hi: 50, e: '🔬' },
    { l: 'Potassium', v: soil.potassium, u: 'kg/ha', lo: 150, hi: 280, e: '💎' },
    { l: 'Organic', v: soil.organicMatter, u: '%', lo: 3, hi: 5, e: '🌱' },
    { l: 'Temp', v: soil.temperature, u: '°C', lo: 15, hi: 30, e: '🌡️' },
    { l: 'EC', v: soil.conductivity, u: 'dS/m', lo: 0.5, hi: 2, e: '⚡' },
  ] : [];

  const radar = soil ? [
    { s: 'Moisture', A: soil.moisture, O: 55 },
    { s: 'pH', A: (soil.ph / 14) * 100, O: (6.5 / 14) * 100 },
    { s: 'N', A: (soil.nitrogen / 300) * 100, O: 65 },
    { s: 'P', A: (soil.phosphorus / 80) * 100, O: 50 },
    { s: 'K', A: (soil.potassium / 300) * 100, O: 70 },
    { s: 'OM', A: (soil.organicMatter / 6) * 100, O: 75 },
  ] : [];

  return (
    <div className="px-5 sm:px-8 lg:px-10 py-6 lg:py-8 space-y-6 max-w-[1480px] mx-auto">
      <div className="hero-mesh px-6 sm:px-10 py-8 sm:py-10 text-white relative">
        <div className="relative z-10">
          <span className="chip mb-4 inline-flex" style={{ background: 'rgba(255,255,255,0.18)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
            <Sparkles className="w-2.5 h-2.5" /> IoT + AI Diagnostics
          </span>
          <h2 className="text-[32px] sm:text-[40px] font-black tighter leading-tight max-w-3xl">
            Deep <span style={{ color: '#a7f3d0' }}>soil intelligence</span> from sensors & lab data.
          </h2>
          <div className="flex items-center gap-2 mt-4">
            <span className="live-dot" />
            <p className="text-[12px] opacity-80 mono">Live sensor data · Updated in real-time</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
        {metrics.length > 0 ? metrics.map(m => {
          const s = h(m.v, m.lo, m.hi);
          const pct = Math.min(Math.max(((m.v - m.lo) / (m.hi - m.lo)) * 100, 5), 100);
          return (
            <div key={m.l} className="surface surface-hover p-5">
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{m.e}</span>
                <span className={`chip ${s.chip}`}>{s.tag}</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider mono" style={{ color: 'var(--text-tertiary)' }}>{m.l}</p>
              <p className="text-[26px] font-black tabular tighter mt-1" style={{ color: 'var(--text-primary)' }}>{m.v}<span className="text-[12px] font-semibold ml-1" style={{ color: 'var(--text-tertiary)' }}>{m.u}</span></p>
              <div className="mt-3 progress" style={{ height: 4 }}><div style={{ width: `${pct}%`, background: s.c }} /></div>
              <div className="flex justify-between mt-1.5 text-[9px] mono" style={{ color: 'var(--text-tertiary)' }}><span>min {m.lo}</span><span>max {m.hi}</span></div>
            </div>
          );
        }) : <p className="col-span-4 text-center py-12" style={{ color: 'var(--text-tertiary)' }}>Loading soil data...</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="surface p-6 sm:p-7">
          <div className="flex items-center justify-between mb-4">
            <div><h3 className="text-[16px] font-bold tight" style={{ color: 'var(--text-primary)' }}>Soil Profile</h3><p className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>Current vs optimal</p></div>
            <span className="chip chip-accent">Analyzed</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart cx="50%" cy="50%" outerRadius="68%" data={radar}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="s" tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontWeight: 600 }} />
              <Radar name="Current" dataKey="A" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.25} strokeWidth={2.5} />
              <Radar name="Optimal" dataKey="O" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.08} strokeWidth={2} strokeDasharray="4 4" />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="surface p-6 sm:p-7">
          <div className="flex items-center justify-between mb-4">
            <div><h3 className="text-[16px] font-bold tight" style={{ color: 'var(--text-primary)' }}>Trends</h3><p className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>6-week monitoring</p></div>
            <span className="chip chip-blue">↗ Improving</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={soilHistoryData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="date" axisLine={false} tickLine={false} fontSize={11} />
              <YAxis axisLine={false} tickLine={false} fontSize={11} width={28} />
              <Tooltip />
              <Line type="monotone" dataKey="moisture" stroke="#0ea5e9" strokeWidth={2.5} dot={{ r: 4, fill: '#0ea5e9', strokeWidth: 2, stroke: 'var(--bg-elevated)' }} name="Moisture %" />
              <Line type="monotone" dataKey="nitrogen" stroke="var(--accent)" strokeWidth={2.5} dot={{ r: 4, fill: '#22c55e', strokeWidth: 2, stroke: 'var(--bg-elevated)' }} name="Nitrogen kg/ha" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
