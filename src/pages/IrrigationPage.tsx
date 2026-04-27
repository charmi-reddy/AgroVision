import { Droplets, Play, Pause, SkipForward, Clock, TrendingDown, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import type { IrrigationZone } from '../services/api';

export default function IrrigationPage() {
  const { irrigation, hasAnalyzedData } = useData();

  if (!hasAnalyzedData) {
    return (
      <div className="px-5 sm:px-8 lg:px-10 py-6 lg:py-8 space-y-6 max-w-[1480px] mx-auto">
        <div className="hero-mesh px-6 sm:px-10 py-8 sm:py-10 text-white relative">
          <div className="relative z-10">
            <span className="chip mb-4 inline-flex" style={{ background: 'rgba(255,255,255,0.18)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
              <Sparkles className="w-2.5 h-2.5" /> Smart System
            </span>
            <h2 className="text-[32px] sm:text-[40px] font-black tighter leading-tight">Smart Irrigation</h2>
            <p className="text-[14px] opacity-80 mt-3 max-w-lg leading-relaxed">AI-powered irrigation from soil sensors + weather forecasts.</p>
          </div>
        </div>

        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} />
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No Analysis Data Available</h3>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            Please go to <strong>Farm Details</strong> and run an analysis to get personalized irrigation recommendations.
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

  const total = irrigation.reduce((a: number, z: IrrigationZone) => a + z.waterAmount, 0);
  const active = irrigation.filter((z: IrrigationZone) => z.status === 'active').length;

  const chipFor = (s: string) => s === 'active' ? 'chip-blue' : s === 'scheduled' ? 'chip-amber' : s === 'completed' ? 'chip-accent' : 'chip-neutral';

  return (
    <div className="px-5 sm:px-8 lg:px-10 py-6 lg:py-8 space-y-6 max-w-[1480px] mx-auto">
      <div className="hero-mesh px-6 sm:px-10 py-8 sm:py-10 text-white relative">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2">
            <span className="chip mb-4 inline-flex" style={{ background: 'rgba(255,255,255,0.18)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
              <Sparkles className="w-2.5 h-2.5" /> Smart System
            </span>
            <h2 className="text-[32px] sm:text-[40px] font-black tighter leading-tight">Optimized watering</h2>
            <p className="text-[14px] opacity-80 mt-3 max-w-lg leading-relaxed">AI-powered irrigation from soil sensors + weather forecasts.</p>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { l: 'Today', v: `${total.toFixed(0)}`, u: 'L' },
              { l: 'Active', v: `${active}/${irrigation.length}`, u: '' },
              { l: 'Saved', v: '32', u: '%', i: <TrendingDown className="w-4 h-4" /> },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl p-3 backdrop-blur-md"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <p className="text-[9px] uppercase tracking-wider mono opacity-70 font-bold">{s.l}</p>
                <p className="text-[20px] font-black tabular tighter mt-1 flex items-center gap-1">{s.i}{s.v}<span className="text-[12px] font-semibold opacity-70">{s.u}</span></p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <div><h3 className="text-[16px] font-bold tight" style={{ color: 'var(--text-primary)' }}>Active Zones</h3><p className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>Real-time status</p></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 stagger">
          {irrigation.length > 0 ? irrigation.map((z: IrrigationZone) => {
            const pct = Math.min((z.soilMoisture / z.optimalMoisture) * 100, 100);
            const barColor = pct >= 90 ? 'var(--accent)' : pct >= 70 ? '#0ea5e9' : pct >= 50 ? '#f59e0b' : '#ef4444';
            return (
              <div key={z.id} className="surface surface-hover p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="min-w-0">
                    <p className="text-[14px] font-extrabold tight truncate" style={{ color: 'var(--text-primary)' }}>{z.zone}</p>
                    <p className="text-[11px] mt-0.5 mono" style={{ color: 'var(--text-tertiary)' }}>{z.nextWatering}</p>
                  </div>
                  <span className={`chip ${chipFor(z.status)}`}>{z.status}</span>
                </div>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] uppercase tracking-wider mono font-bold" style={{ color: 'var(--text-tertiary)' }}>Moisture</span>
                    <span className="text-[12px] font-extrabold tabular" style={{ color: 'var(--text-primary)' }}>{z.soilMoisture}<span className="opacity-50">/{z.optimalMoisture}%</span></span>
                  </div>
                  <div className="progress" style={{ height: 8 }}><div style={{ width: `${pct}%`, background: barColor, boxShadow: `0 0 12px ${barColor}50` }} /></div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-sunken)', border: '1px solid var(--border)' }}>
                    <Clock className="w-3.5 h-3.5 mx-auto mb-1" style={{ color: 'var(--text-tertiary)' }} />
                    <p className="text-[9px] uppercase tracking-wider mono font-bold" style={{ color: 'var(--text-tertiary)' }}>Duration</p>
                    <p className="text-[14px] font-extrabold tabular tight mt-0.5" style={{ color: 'var(--text-primary)' }}>{z.duration}m</p>
                  </div>
                  <div className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-sunken)', border: '1px solid var(--border)' }}>
                    <Droplets className="w-3.5 h-3.5 mx-auto mb-1" style={{ color: '#0ea5e9' }} />
                    <p className="text-[9px] uppercase tracking-wider mono font-bold" style={{ color: 'var(--text-tertiary)' }}>Water</p>
                    <p className="text-[14px] font-extrabold tabular tight mt-0.5" style={{ color: 'var(--text-primary)' }}>{z.waterAmount}L</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {z.status === 'scheduled' && <><button className="btn-primary flex-1 !py-2 !text-[12px]"><Play className="w-3 h-3" /> Start</button><button className="btn-icon !w-9 !h-9"><SkipForward className="w-3.5 h-3.5" /></button></>}
                  {z.status === 'active' && <button className="btn-primary flex-1 !py-2 !text-[12px]" style={{ background: 'linear-gradient(135deg,#f59e0b,#f97316)' }}><Pause className="w-3 h-3" /> Pause</button>}
                  {z.status === 'completed' && <div className="flex-1 py-2 flex items-center justify-center gap-1.5 text-[12px] font-bold" style={{ color: 'var(--accent)' }}><CheckCircle2 className="w-3.5 h-3.5" /> Done</div>}
                  {z.status === 'skipped' && <div className="flex-1 py-2 text-center text-[12px] font-medium" style={{ color: 'var(--text-tertiary)' }}>☔ Skipped</div>}
                </div>
              </div>
            );
          }) : <p className="col-span-full text-center py-12" style={{ color: 'var(--text-tertiary)' }}>Loading irrigation data...</p>}
        </div>
      </div>
    </div>
  );
}
