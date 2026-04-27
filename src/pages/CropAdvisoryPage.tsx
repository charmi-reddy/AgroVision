import { useState } from 'react';
import { TrendingUp, Droplets, Clock, Shield, Sparkles, ArrowUpRight, Award, AlertCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import type { CropRecommendation } from '../services/api';

export default function CropAdvisoryPage() {
  const { crops, hasAnalyzedData } = useData();

  if (!hasAnalyzedData) {
    return (
      <div className="px-5 sm:px-8 lg:px-10 py-6 lg:py-8 space-y-6 max-w-[1480px] mx-auto">
        <div className="hero-mesh px-6 sm:px-10 py-8 sm:py-10 text-white relative">
          <div className="relative z-10">
            <span className="chip mb-4 inline-flex" style={{ background: 'rgba(255,255,255,0.18)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
              <Sparkles className="w-2.5 h-2.5" /> AI-Ranked
            </span>
            <h2 className="text-[32px] sm:text-[40px] font-black tighter leading-tight">Crop Advisory</h2>
            <p className="text-[14px] opacity-80 mt-3 max-w-lg leading-relaxed">Climate-resilient planting recommendations.</p>
          </div>
        </div>

        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} />
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No Crop Recommendations Available</h3>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            Please go to <strong>Farm Details</strong> and run an analysis to get personalized crop recommendations.
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

  const [sel, setSel] = useState<CropRecommendation | null>(null);
  const [wf, setWf] = useState('all');
  const list = wf === 'all' ? crops : crops.filter((c: CropRecommendation) => c.waterNeed === wf);

  return (
    <div className="px-5 sm:px-8 lg:px-10 py-6 lg:py-8 space-y-6 max-w-[1480px] mx-auto">
      <div className="hero-mesh px-6 sm:px-10 py-8 sm:py-10 text-white relative">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div>
            <span className="chip mb-4 inline-flex" style={{ background: 'rgba(255,255,255,0.18)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
              <Sparkles className="w-2.5 h-2.5" /> AI-Ranked
            </span>
            <h2 className="text-[32px] sm:text-[40px] font-black tighter leading-tight">
              Climate-resilient<br /><span style={{ color: '#a7f3d0' }}>crop selection</span>
            </h2>
            <p className="text-[14px] opacity-80 mt-3 max-w-lg leading-relaxed">
              ML models analyze soil, weather, and yield data to rank the best crops for your farm.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h3 className="text-[16px] font-bold tight" style={{ color: 'var(--text-primary)' }}>Recommendations</h3>
          <span className="chip chip-neutral">{list.length} results</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap p-1 rounded-xl" style={{ background: 'var(--bg-sunken)', border: '1px solid var(--border)' }}>
          <span className="chip chip-neutral mx-1">Water need</span>
          {['all', 'Low', 'Medium', 'High'].map(f => (
            <button key={f} onClick={() => setWf(f)}
              className="px-3 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer transition-all"
              style={{ background: wf === f ? 'var(--bg-elevated)' : 'transparent', color: wf === f ? 'var(--text-primary)' : 'var(--text-tertiary)', boxShadow: wf === f ? 'var(--shadow-xs)' : 'none' }}>
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 stagger">
        {list.length > 0 ? list.map((c: CropRecommendation, i: number) => {
          const open = sel?.id === c.id;
          return (
            <div key={c.id} onClick={() => setSel(open ? null : c)}
              className="surface surface-hover cursor-pointer transition-all duration-300 relative overflow-hidden"
              style={{ borderColor: open ? 'var(--border-accent)' : undefined, boxShadow: open ? 'var(--shadow-glow)' : undefined }}>
              {i < 3 && (
                <div className="absolute top-4 right-4 w-9 h-9 rounded-xl flex items-center justify-center text-[12px] font-extrabold text-white shadow-lg"
                  style={{ background: i === 0 ? 'linear-gradient(135deg,#fbbf24,#f59e0b)' : i === 1 ? 'linear-gradient(135deg,#cbd5e1,#94a3b8)' : 'linear-gradient(135deg,#fb923c,#c2410c)' }}>
                  <Award className="w-4 h-4" />
                </div>
              )}
              <div className="p-6">
                <div className="text-[44px] mb-3">{c.emoji}</div>
                <p className="text-[17px] font-extrabold tighter" style={{ color: 'var(--text-primary)' }}>{c.name}</p>
                <p className="text-[11px] mt-0.5 mono uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>{c.season} · #{i + 1} pick</p>
                <div className="my-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-wider mono font-bold" style={{ color: 'var(--text-tertiary)' }}>AI Confidence</span>
                    <span className="text-[14px] font-extrabold tabular tight" style={{ color: 'var(--accent)' }}>{c.confidence}%</span>
                  </div>
                  <div className="progress"><div style={{ width: `${c.confidence}%` }} /></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { I: Droplets, l: 'Water', v: c.waterNeed, c: '#0ea5e9' },
                    { I: Clock, l: 'Growth', v: c.growthPeriod, c: '#f59e0b' },
                    { I: TrendingUp, l: 'Yield', v: c.expectedYield, c: 'var(--accent)' },
                    { I: Shield, l: 'Resilience', v: `${c.resilience}%`, c: '#a78bfa' },
                  ].map((s, j) => (
                    <div key={j} className="p-2.5 rounded-xl" style={{ background: 'var(--bg-sunken)', border: '1px solid var(--border)' }}>
                      <div className="flex items-center gap-1 mb-1">
                        <s.I className="w-3 h-3" style={{ color: s.c }} />
                        <span className="text-[9px] uppercase tracking-wider mono font-bold" style={{ color: 'var(--text-tertiary)' }}>{s.l}</span>
                      </div>
                      <p className="text-[12px] font-extrabold truncate" style={{ color: 'var(--text-primary)' }}>{s.v}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-xl" style={{ background: 'var(--accent-soft)', border: '1px solid var(--border-accent)' }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-2.5 h-2.5" style={{ color: 'var(--accent)' }} />
                    <span className="text-[9px] uppercase tracking-wider mono font-bold" style={{ color: 'var(--accent)' }}>AI Analysis</span>
                  </div>
                  <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{c.reason}</p>
                </div>
                {open && (
                  <div className="mt-4 pt-4 anim-fade-up space-y-2.5" style={{ borderTop: '1px solid var(--border)' }}>
                    {[['Sowing window', 'June – July'], ['Soil temp', '18–30°C'], ['Fertilizer plan', 'NPK 120-60-40'], ['Market trend', '↗ Bullish']].map(([k, v]) => (
                      <div key={k} className="flex justify-between text-[12px]">
                        <span style={{ color: 'var(--text-tertiary)' }}>{k}</span>
                        <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{v}</span>
                      </div>
                    ))}
                    <button className="btn-primary w-full mt-3 !py-2.5">Add to plan <ArrowUpRight className="w-3.5 h-3.5" /></button>
                  </div>
                )}
              </div>
            </div>
          );
        }) : (
          <div className="col-span-full flex items-center justify-center py-16">
            <p className="text-[14px]" style={{ color: 'var(--text-tertiary)' }}>Loading crop recommendations from AI...</p>
          </div>
        )}
      </div>
    </div>
  );
}
