import { Sparkles, ArrowUpRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import type { FertilizerRecommendation } from '../services/api';

export default function FertilizerPage() {
  const { fertilizer, soil, hasAnalyzedData } = useData();

  if (!hasAnalyzedData) {
    return (
      <div className="px-5 sm:px-8 lg:px-10 py-6 lg:py-8 space-y-6 max-w-[1480px] mx-auto">
        <div className="hero-mesh px-6 sm:px-10 py-8 sm:py-10 text-white relative">
          <div className="relative z-10">
            <span className="chip mb-4 inline-flex" style={{ background: 'rgba(255,255,255,0.18)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
              <Sparkles className="w-2.5 h-2.5" /> Precision Agriculture
            </span>
            <h2 className="text-[32px] sm:text-[40px] font-black tighter leading-tight">Nutrient Plan</h2>
            <p className="text-[14px] opacity-80 mt-3 max-w-lg leading-relaxed">Precision fertilizer prescriptions.</p>
          </div>
        </div>

        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} />
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No Fertilizer Plan Available</h3>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            Please go to <strong>Farm Details</strong> and run an analysis to get personalized fertilizer recommendations.
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

  const npk = soil ? [
    { l: 'Nitrogen', s: 'N', c: soil.nitrogen.toString(), o: '200', u: 'kg/ha', st: soil.nitrogen < 150 ? 'Low' : 'OK', p: Math.min((soil.nitrogen / 200) * 100, 100), color: '#0ea5e9' },
    { l: 'Phosphorus', s: 'P', c: soil.phosphorus.toString(), o: '40', u: 'kg/ha', st: soil.phosphorus < 25 ? 'Low' : 'OK', p: Math.min((soil.phosphorus / 40) * 100, 100), color: 'var(--accent)' },
    { l: 'Potassium', s: 'K', c: soil.potassium.toString(), o: '200', u: 'kg/ha', st: soil.potassium < 150 ? 'Low' : 'Good', p: Math.min((soil.potassium / 200) * 100, 100), color: 'var(--accent)' },
  ] : [];

  return (
    <div className="px-5 sm:px-8 lg:px-10 py-6 lg:py-8 space-y-6 max-w-[1480px] mx-auto">
      <div className="hero-mesh px-6 sm:px-10 py-8 sm:py-10 text-white relative">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2">
            <span className="chip mb-4 inline-flex" style={{ background: 'rgba(255,255,255,0.18)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
              <Sparkles className="w-2.5 h-2.5" /> Precision Agriculture
            </span>
            <h2 className="text-[32px] sm:text-[40px] font-black tighter leading-tight">Smart nutrient plans</h2>
            <p className="text-[14px] opacity-80 mt-3 max-w-lg leading-relaxed">AI-calculated prescriptions from soil data.</p>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { l: 'Active', v: fertilizer.length.toString() },
              { l: 'High Priority', v: fertilizer.filter((f: FertilizerRecommendation) => f.priority === 'high').length.toString() },
              { l: 'Est. Savings', v: '₹12.5K' },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl p-3 backdrop-blur-md"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <p className="text-[9px] uppercase tracking-wider mono opacity-70 font-bold">{s.l}</p>
                <p className="text-[22px] font-black tabular tighter mt-1">{s.v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger">
        {npk.length > 0 ? npk.map((n, i) => (
          <div key={i} className="surface surface-hover p-6 relative overflow-hidden">
            <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full opacity-15" style={{ background: n.color, filter: 'blur(30px)' }} />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-[18px] font-black tighter" style={{ background: `${n.color}15`, color: n.color, border: `1px solid ${n.color}25` }}>{n.s}</div>
                <span className={`chip ${n.st === 'Low' ? 'chip-amber' : 'chip-accent'}`}>{n.st}</span>
              </div>
              <p className="text-[11px] uppercase tracking-wider mono font-bold" style={{ color: 'var(--text-tertiary)' }}>{n.l}</p>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-[32px] font-black tabular tighter" style={{ color: 'var(--text-primary)' }}>{n.c}</span>
                <span className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>{n.u}</span>
              </div>
              <p className="text-[10px] mt-1 mono" style={{ color: 'var(--text-tertiary)' }}>Optimal: {n.o} {n.u}</p>
              <div className="mt-3 progress" style={{ height: 5 }}><div style={{ width: `${n.p}%`, background: n.color, boxShadow: `0 0 8px ${n.color}50` }} /></div>
            </div>
          </div>
        )) : <p className="col-span-3 text-center py-8" style={{ color: 'var(--text-tertiary)' }}>Loading soil data...</p>}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <div><h3 className="text-[16px] font-bold tight" style={{ color: 'var(--text-primary)' }}>Treatment Plan</h3><p className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>AI-prescribed applications</p></div>
        </div>
        <div className="space-y-3 stagger">
          {fertilizer.length > 0 ? fertilizer.map((f: FertilizerRecommendation) => (
            <div key={f.id} className="surface surface-hover p-5">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0" style={{ background: 'var(--bg-sunken)', border: '1px solid var(--border)' }}>{f.emoji}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="text-[15px] font-extrabold tight" style={{ color: 'var(--text-primary)' }}>{f.type}</p>
                      <span className={`chip ${f.priority === 'high' ? 'chip-red' : f.priority === 'medium' ? 'chip-amber' : 'chip-accent'}`}>{f.priority}</span>
                    </div>
                    <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.reason}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 lg:min-w-[380px] lg:flex-shrink-0">
                  {[{ k: 'Amount', v: f.amount }, { k: 'NPK', v: f.npkRatio }, { k: 'Timing', v: f.timing }, { k: 'Cycle', v: f.frequency }].map(d => (
                    <div key={d.k} className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-sunken)', border: '1px solid var(--border)' }}>
                      <p className="text-[9px] font-bold uppercase tracking-wider mono" style={{ color: 'var(--text-tertiary)' }}>{d.k}</p>
                      <p className="text-[12px] font-bold mt-0.5 leading-tight" style={{ color: 'var(--text-primary)' }}>{d.v}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                <div className="flex items-center gap-1.5 text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>
                  {f.priority === 'high' ? <><AlertCircle className="w-3.5 h-3.5" style={{ color: '#ef4444' }} /> Immediate</> : <><CheckCircle2 className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} /> Scheduled</>}
                </div>
                <button className="btn-primary !py-2 !px-3.5 !text-[11px]">Applied <ArrowUpRight className="w-3 h-3" /></button>
              </div>
            </div>
          )) : <p className="text-center py-12" style={{ color: 'var(--text-tertiary)' }}>Loading fertilizer recommendations...</p>}
        </div>
      </div>
    </div>
  );
}
