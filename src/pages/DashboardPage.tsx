import { useState } from 'react';
import { ArrowUpRight, Plus, Leaf, MapPin, Sparkles, Thermometer, Droplets, Wind, CloudRain, TrendingUp, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import MapPicker from '../components/MapPicker';

export default function DashboardPage({ onNavigate }: { onNavigate: (p: string) => void }) {
  const { weather, soil, crops, irrigation, alerts, loading, hasAnalyzedData } = useData();
  const { user, addFarm } = useAuth();
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newLat, setNewLat] = useState(31.1471);
  const [newLon, setNewLon] = useState(75.3412);
  const [newLoc, setNewLoc] = useState('');
  const hasFarms = user?.farms && user.farms.length > 0;
  const activeFarm = user?.farms?.find(f => f.id === user?.activeFarmId);

  const handleAddFarm = () => {
    if (!newName.trim()) return;
    addFarm({ id: 'farm_' + Date.now(), name: newName, location: newLoc || `${newLat.toFixed(4)}, ${newLon.toFixed(4)}`, lat: newLat, lon: newLon });
    setNewName('');
    setShowAdd(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
          <p className="text-[14px] font-medium" style={{ color: 'var(--text-tertiary)' }}>Loading your farm data...</p>
        </div>
      </div>
    );
  }

  // ─── NO FARMS — Clean empty state ───
  if (!hasFarms) {
    return (
      <div className="min-h-[calc(100vh-68px)] flex items-center justify-center px-5 sm:px-8">
        <div className="w-full max-w-md mx-auto anim-fade-up">
          <div
            className="rounded-[28px] p-10 relative overflow-hidden text-center"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            {/* Decorative glow */}
            <div
              className="absolute -top-20 -right-20 w-56 h-56 rounded-full opacity-30"
              style={{ background: 'radial-gradient(circle, var(--accent-glow), transparent 70%)' }}
            />

            <div className="relative z-10">
              {/* Logo icon */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{ background: 'var(--accent-soft)', border: '1px solid var(--border-accent)' }}
              >
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent), #0ea5e9)' }}>
                  <Leaf className="w-4 h-4 text-white" />
                </div>
              </div>

              <h2 className="text-2xl font-black tighter mb-2" style={{ color: 'var(--text-primary)' }}>
                Add farm
              </h2>
              <p className="text-sm mb-8 max-w-xs mx-auto leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
                Your dashboard is empty. Add a farm to start generating weather analysis, crop recommendations, irrigation plans, and soil insights.
              </p>

              {/* Quick steps */}
              <div className="flex items-center justify-center gap-2 mb-8">
                {[
                  { emoji: '1', label: 'Name your farm' },
                  { emoji: '📍', label: 'Pin location' },
                  { emoji: '🤖', label: 'AI activates' },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold"
                      style={{ background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid var(--border-accent)' }}
                    >
                      {step.emoji}
                    </div>
                    <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{step.label}</span>
                    {i < 2 && <div className="w-6 h-px" style={{ background: 'var(--border)' }} />}
                  </div>
                ))}
              </div>

              {!showAdd ? (
                <button
                  onClick={() => setShowAdd(true)}
                  className="btn-primary !py-3 !px-8 !text-[15px] !rounded-2xl"
                >
                  <Plus className="w-5 h-5" /> Add Farm
                </button>
              ) : (
                <div className="space-y-4 text-left anim-fade-up">
                  <div className="h-px w-full" style={{ background: 'var(--border)' }} />
                  <h3 className="text-base font-bold tight" style={{ color: 'var(--text-primary)' }}>New Farm</h3>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider mono" style={{ color: 'var(--text-tertiary)' }}>
                      Farm Name
                    </label>
                    <input
                      type="text"
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      className="input-base mt-1.5"
                      placeholder="Green Valley Farm"
                      autoFocus
                    />
                  </div>

                  <MapPicker
                    lat={newLat}
                    lon={newLon}
                    onLocationChange={(lat, lon, name) => { setNewLat(lat); setNewLon(lon); setNewLoc(name); }}
                  />

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => { setShowAdd(false); setNewName(''); }}
                      className="btn-ghost flex-1 !py-2.5 !text-[14px]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddFarm}
                      disabled={!newName.trim()}
                      className="btn-primary flex-1 !py-2.5 !text-[14px] disabled:opacity-50"
                    >
                      <Leaf className="w-4 h-4" /> Create Farm
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── HAS FARMS — Show analytics ───

  // Check if analysis has been run
  if (!hasAnalyzedData) {
    return (
      <div className="px-5 sm:px-8 lg:px-10 py-6 lg:py-8 space-y-6 max-w-[1480px] mx-auto">
        <div className="hero-mesh px-6 sm:px-10 py-8 sm:py-10 text-white relative">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="chip" style={{ background: 'rgba(255,255,255,0.18)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Sparkles className="w-2.5 h-2.5" /> {activeFarm?.name || 'Farm'}
              </span>
              <span className="text-[11px] font-medium opacity-70 mono flex items-center gap-1">
                <MapPin className="w-3 h-3" />{activeFarm?.location?.split(',')[0] || 'Location'}
              </span>
            </div>
            <h2 className="text-[32px] sm:text-[40px] font-black tighter leading-tight">Ready for Analysis</h2>
            <p className="text-[14px] opacity-80 mt-3 max-w-lg leading-relaxed">Your farm is set up. Run an analysis to get personalized insights.</p>
          </div>
        </div>

        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'var(--accent-soft)', border: '1px solid var(--border-accent)' }}>
            <Sparkles className="w-8 h-8" style={{ color: 'var(--accent)' }} />
          </div>
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Run Your First Analysis</h3>
          <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Get weather forecasts, soil diagnostics, crop recommendations, irrigation plans, and real-time alerts tailored to your farm.
          </p>
          <button
            onClick={() => onNavigate('farm')}
            className="px-8 py-4 rounded-lg font-medium transition-colors text-lg"
            style={{ background: 'var(--accent)', color: 'white' }}
          >
            Go to Farm Details
          </button>
        </div>
      </div>
    );
  }

  const unreadCount = alerts.filter(a => !a.read).length;

  const healthScore = soil ? Math.round(
    Math.min(
      (soil.moisture / 60) * 25 + ((soil.ph - 5.5) / 2.5) * 20 +
      (soil.nitrogen / 300) * 20 + (soil.phosphorus / 80) * 15 +
      (soil.potassium / 350) * 10 + (soil.organicMatter / 6) * 10,
      100
    )
  ) : 78;

  return (
    <div className="px-5 sm:px-8 lg:px-10 py-6 lg:py-8 space-y-6 max-w-[1480px] mx-auto">
      {/* ─── Hero ─── */}
      <div className="hero-mesh px-6 sm:px-10 py-8 sm:py-10 text-white relative">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-4">
              <span className="chip" style={{ background: 'rgba(255,255,255,0.18)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Sparkles className="w-2.5 h-2.5" /> {activeFarm?.name || 'Farm'}
              </span>
              <span className="text-[11px] font-medium opacity-70 mono flex items-center gap-1">
                <MapPin className="w-3 h-3" />{activeFarm?.location?.split(',')[0] || 'Punjab'}
              </span>
            </div>
            <h2 className="text-[28px] sm:text-[36px] font-black tighter leading-[1.08]">
              Your farm at a glance
            </h2>
            <p className="text-[14px] opacity-80 max-w-xl leading-relaxed mt-2">
              Real-time AI monitoring across {irrigation.length} irrigation zones,
              {crops.length} crop recommendations, and {unreadCount} active alerts.
            </p>
          </div>

          {/* Radial score */}
          <div className="flex-shrink-0">
            <div className="relative w-[140px] h-[140px] sm:w-[160px] sm:h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="75%" outerRadius="100%" startAngle={90} endAngle={-270}
                  data={[{ name: 'health', value: Math.min(healthScore, 100), fill: 'url(#rgScore)' }]}>
                  <defs>
                    <linearGradient id="rgScore" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a7f3d0" /><stop offset="100%" stopColor="#ffffff" />
                    </linearGradient>
                  </defs>
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar background={{ fill: 'rgba(255,255,255,0.15)' }} dataKey="value" cornerRadius={20} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-[9px] font-medium opacity-70 mono uppercase tracking-wider">Health</p>
                <p className="text-[28px] sm:text-[32px] font-black tighter tabular leading-none mt-1">{Math.min(healthScore, 100)}</p>
                <p className="text-[10px] mt-1 font-semibold flex items-center gap-1" style={{ color: '#a7f3d0' }}>
                  <TrendingUp className="w-2.5 h-2.5" />{healthScore > 70 ? 'Great' : healthScore > 50 ? 'Good' : 'Fair'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Stats ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 stagger">
        {[
          { label: 'Temperature', val: weather?.temperature ?? '--', unit: '°C', Icon: Thermometer, color: '#f97316' },
          { label: 'Humidity', val: weather?.humidity ?? '--', unit: '%', Icon: Droplets, color: '#0ea5e9' },
          { label: 'Soil Moisture', val: soil?.moisture ?? '--', unit: '%', Icon: CloudRain, color: 'var(--accent)' },
          { label: 'Wind', val: weather?.windSpeed ?? '--', unit: 'km/h', Icon: Wind, color: '#a78bfa' },
        ].map((s, i) => (
          <div key={i} className="surface p-4 relative group cursor-default">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"
                style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}>
                <s.Icon className="w-[16px] h-[16px]" style={{ color: s.color }} />
              </div>
              <span className="live-dot" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider mono" style={{ color: 'var(--text-tertiary)' }}>{s.label}</p>
            <div className="flex items-baseline gap-0.5 mt-0.5">
              <span className="text-[28px] font-black tabular tighter leading-none" style={{ color: 'var(--text-primary)' }}>{s.val}</span>
              <span className="text-[12px] font-medium" style={{ color: 'var(--text-tertiary)' }}>{s.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Forecast + Top Crop ─── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 surface p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[15px] font-bold tight" style={{ color: 'var(--text-primary)' }}>Forecast</p>
              <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>7-day temperature</p>
            </div>
            <button onClick={() => onNavigate('weather')} className="btn-ghost !text-[11px] !px-2.5 !py-1.5">
              Full report <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weather?.forecast?.map((d: any) => ({ day: d.day, high: d.high, low: d.low })) || []} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f97316" stopOpacity={0.25} /><stop offset="100%" stopColor="#f97316" stopOpacity={0} /></linearGradient>
              </defs>
              <XAxis dataKey="day" axisLine={false} tickLine={false} fontSize={10} />
              <YAxis axisLine={false} tickLine={false} fontSize={10} width={24} />
              <Tooltip />
              <Area type="monotone" dataKey="high" stroke="#f97316" strokeWidth={2} fill="url(#tGrad)" name="High °C" dot={{ r: 3, fill: '#f97316', strokeWidth: 2, stroke: 'var(--bg-elevated)' }} />
              <Area type="monotone" dataKey="low" stroke="#0ea5e9" strokeWidth={2} fill="none" name="Low °C" strokeDasharray="3 3" dot={{ r: 2, fill: '#0ea5e9' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="surface p-5 flex flex-col items-center justify-center text-center">
          {crops.length > 0 ? (
            <>
              <div className="text-5xl mb-3">{crops[0].emoji}</div>
              <p className="text-[16px] font-extrabold tight" style={{ color: 'var(--text-primary)' }}>{crops[0].name}</p>
              <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Top recommendation</p>
              <div className="w-full max-w-[160px] mt-4">
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="mono font-bold" style={{ color: 'var(--text-tertiary)' }}>Confidence</span>
                  <span className="font-extrabold tabular" style={{ color: 'var(--accent)' }}>{crops[0].confidence}%</span>
                </div>
                <div className="progress"><div style={{ width: `${crops[0].confidence}%` }} /></div>
              </div>
            </>
          ) : (
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Loading recommendations…</p>
          )}
        </div>
      </div>

      {/* ─── Alerts ─── */}
      {alerts.length > 0 && (
        <div className="surface p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" style={{ color: '#f59e0b' }} />
              <p className="text-[15px] font-bold tight" style={{ color: 'var(--text-primary)' }}>Active Alerts</p>
              <span className="chip chip-amber !text-[9px]">{unreadCount} unread</span>
            </div>
            <button onClick={() => onNavigate('alerts')} className="btn-ghost !text-[11px] !px-2.5 !py-1.5">
              All <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {alerts.slice(0, 4).map(a => (
              <div key={a.id} className="flex items-start gap-2.5 p-3 rounded-xl cursor-default"
                style={{
                  background: a.type === 'danger' ? 'rgba(239,68,68,0.06)' : a.type === 'warning' ? 'rgba(245,158,11,0.06)' : a.type === 'success' ? 'var(--accent-soft)' : 'rgba(56,189,248,0.06)',
                  border: `1px solid ${a.type === 'danger' ? 'rgba(239,68,68,0.2)' : a.type === 'warning' ? 'rgba(245,158,11,0.2)' : a.type === 'success' ? 'var(--border-accent)' : 'rgba(56,189,248,0.2)'}`,
                }}>
                <span className="text-sm mt-0.5 flex-shrink-0">{a.type === 'danger' ? '🔴' : a.type === 'warning' ? '🟡' : a.type === 'success' ? '🟢' : '🔵'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold truncate" style={{ color: 'var(--text-primary)' }}>{a.title}</p>
                  <p className="text-[11px] line-clamp-2 mt-0.5" style={{ color: 'var(--text-secondary)' }}>{a.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Quick links ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 stagger">
        {[
          { label: 'Irrigation', emoji: '💧', sub: `${irrigation.length} zones active`, go: 'irrigation' },
          { label: 'Crops', emoji: '🌾', sub: `${crops.length} recommendations`, go: 'crops' },
          { label: 'Fertilizer', emoji: '⚗️', sub: 'Plans ready', go: 'fertilizer' },
          { label: 'Alerts', emoji: '🔔', sub: `${alerts.length} insights`, go: 'alerts' },
        ].map((q, i) => (
          <button key={i} onClick={() => onNavigate(q.go)}
            className="surface p-4 text-left cursor-pointer group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">{q.emoji}</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-30 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" style={{ color: 'var(--accent)' }} />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-wider mono" style={{ color: 'var(--text-tertiary)' }}>{q.label}</p>
            <p className="text-[12px] font-semibold mt-0.5 truncate" style={{ color: 'var(--text-primary)' }}>{q.sub}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
