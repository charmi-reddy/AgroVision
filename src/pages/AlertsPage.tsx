import { useState } from 'react';
import { Bell, Check, CheckCheck, AlertTriangle, Info, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { useData } from '../context/DataContext';
import type { Alert } from '../services/api';

export default function AlertsPage() {
  const { alerts: initialAlerts, hasAnalyzedData } = useData();

  if (!hasAnalyzedData) {
    return (
      <div className="px-5 sm:px-8 lg:px-10 py-6 lg:py-8 space-y-6 max-w-[1480px] mx-auto">
        <div className="hero-mesh px-6 sm:px-10 py-8 sm:py-10 text-white relative">
          <div className="relative z-10">
            <span className="chip mb-4 inline-flex" style={{ background: 'rgba(255,255,255,0.18)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
              <Sparkles className="w-2.5 h-2.5" /> Real-Time
            </span>
            <h2 className="text-[32px] sm:text-[40px] font-black tighter leading-tight">Alerts & Insights</h2>
            <p className="text-[14px] opacity-80 mt-3 max-w-lg leading-relaxed">Real-time field notifications.</p>
          </div>
        </div>

        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} />
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No Alerts Available</h3>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            Please go to <strong>Farm Details</strong> and run an analysis to get real-time alerts and insights.
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

  const [list, setList] = useState<Alert[]>([]);
  const [ft, setFt] = useState('all');
  const [fc, setFc] = useState('all');

  if (initialAlerts.length > 0 && list.length === 0) {
    setList(initialAlerts);
  }

  const filtered = list.filter(a => (ft === 'all' || a.type === ft) && (fc === 'all' || a.category === fc));
  const markAll = () => setList(list.map(a => ({ ...a, read: true })));
  const mark = (id: string) => setList(list.map(a => a.id === id ? { ...a, read: true } : a));
  const unread = list.filter(a => !a.read).length;
  const cats = [...new Set(list.map(a => a.category))];

  const Icn = ({ t }: { t: string }) => t === 'danger' ? <AlertCircle className="w-5 h-5" style={{ color: '#ef4444' }} /> : t === 'warning' ? <AlertTriangle className="w-5 h-5" style={{ color: '#f59e0b' }} /> : t === 'success' ? <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--accent)' }} /> : <Info className="w-5 h-5" style={{ color: '#0ea5e9' }} />;

  const accentBg = (t: string) => t === 'danger' ? 'rgba(239,68,68,0.06)' : t === 'warning' ? 'rgba(245,158,11,0.06)' : t === 'success' ? 'var(--accent-soft)' : 'rgba(56,189,248,0.06)';
  const accentBd = (t: string) => t === 'danger' ? 'rgba(239,68,68,0.2)' : t === 'warning' ? 'rgba(245,158,11,0.2)' : t === 'success' ? 'var(--border-accent)' : 'rgba(56,189,248,0.2)';

  return (
    <div className="px-5 sm:px-8 lg:px-10 py-6 lg:py-8 space-y-6 max-w-[1480px] mx-auto">
      <div className="hero-mesh px-6 sm:px-10 py-8 sm:py-10 text-white relative">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2">
            <span className="chip mb-4 inline-flex" style={{ background: 'rgba(255,255,255,0.18)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
              <Sparkles className="w-2.5 h-2.5" /> Real-Time Monitoring
            </span>
            <h2 className="text-[32px] sm:text-[40px] font-black tighter leading-tight">
              <span style={{ color: '#a7f3d0' }}>{unread}</span> alerts<br />need your attention
            </h2>
            <p className="text-[14px] opacity-80 mt-3 max-w-lg">AI alerts from weather, pest, soil & market analytics.</p>
          </div>
          <div className="flex flex-col gap-2.5">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-2xl p-3 backdrop-blur-md" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <p className="text-[9px] uppercase tracking-wider mono opacity-70 font-bold">Unread</p><p className="text-[26px] font-black tabular tighter mt-1">{unread}</p>
              </div>
              <div className="rounded-2xl p-3 backdrop-blur-md" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <p className="text-[9px] uppercase tracking-wider mono opacity-70 font-bold">Total</p><p className="text-[26px] font-black tabular tighter mt-1">{list.length}</p>
              </div>
            </div>
            <button onClick={markAll} className="rounded-2xl px-4 py-2.5 backdrop-blur-md flex items-center justify-center gap-2 cursor-pointer text-[13px] font-bold transition-all hover:translate-y-[-1px]"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <CheckCheck className="w-4 h-4" /> Mark all read
            </button>
          </div>
        </div>
      </div>

      <div className="surface p-3 flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-bold mr-1 uppercase tracking-wider mono" style={{ color: 'var(--text-tertiary)' }}>Type</span>
        {['all', 'danger', 'warning', 'info', 'success'].map(t => (
          <button key={t} onClick={() => setFt(t)}
            className="px-3 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer capitalize transition-all"
            style={{ background: ft === t ? (t === 'danger' ? '#ef4444' : t === 'warning' ? '#f59e0b' : t === 'success' ? 'var(--accent)' : t === 'info' ? '#0ea5e9' : 'var(--text-primary)') : 'var(--bg-sunken)', color: ft === t ? 'white' : 'var(--text-secondary)' }}>
            {t}
          </button>
        ))}
        <div className="w-px h-5 mx-2" style={{ background: 'var(--border)' }} />
        {['all', ...cats].map(c => (
          <button key={c} onClick={() => setFc(c)}
            className="px-3 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer transition-all"
            style={{ background: fc === c ? 'var(--text-primary)' : 'var(--bg-sunken)', color: fc === c ? 'var(--bg-elevated)' : 'var(--text-secondary)' }}>
            {c === 'all' ? 'All' : c}
          </button>
        ))}
      </div>

      <div className="space-y-3 stagger">
        {filtered.length > 0 ? filtered.map(a => (
          <div key={a.id} className="rounded-2xl p-5 surface-hover transition-all"
            style={{ background: accentBg(a.type), border: `1px solid ${accentBd(a.type)}`, opacity: a.read ? 0.7 : 1 }}>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                <Icn t={a.type} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start sm:items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <p className="text-[15px] font-extrabold tight truncate" style={{ color: 'var(--text-primary)' }}>{a.title}</p>
                    {!a.read && <span className="live-dot flex-shrink-0" />}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>{a.timestamp}</span>
                    <span className={`hidden sm:inline chip ${a.type === 'danger' ? 'chip-red' : a.type === 'warning' ? 'chip-amber' : a.type === 'success' ? 'chip-accent' : 'chip-blue'}`}>{a.category}</span>
                  </div>
                </div>
                <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{a.message}</p>
                <div className="flex items-center gap-3 mt-3">
                  {!a.read && <button onClick={() => mark(a.id)} className="flex items-center gap-1 text-[11px] font-bold cursor-pointer" style={{ color: '#0ea5e9' }}><Check className="w-3 h-3" /> Mark read</button>}
                  <button className="text-[11px] font-medium cursor-pointer" style={{ color: 'var(--text-tertiary)' }}>Details</button>
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="surface p-16 text-center">
            <Bell className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-tertiary)' }} />
            <p className="text-[15px] font-bold" style={{ color: 'var(--text-secondary)' }}>No alerts</p>
            <p className="text-[12px] mt-1" style={{ color: 'var(--text-tertiary)' }}>All clear — your farm is in good shape</p>
          </div>
        )}
      </div>
    </div>
  );
}
