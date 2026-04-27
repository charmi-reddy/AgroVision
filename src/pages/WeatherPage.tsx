import { Thermometer, Droplets, Wind, Sun, Eye, Gauge, CloudRain, Sunrise, Sunset, Sparkles, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line } from 'recharts';
import { useData } from '../context/DataContext';

const hourly = [{ t: '6AM', v: 22 }, { t: '9AM', v: 25 }, { t: '12PM', v: 30 }, { t: '3PM', v: 32 }, { t: '6PM', v: 28 }, { t: '9PM', v: 24 }, { t: '12AM', v: 21 }];

export default function WeatherPage() {
  const { weather, hasAnalyzedData } = useData();

  if (!hasAnalyzedData) {
    return (
      <div className="px-5 sm:px-8 lg:px-10 py-6 lg:py-8 space-y-6 max-w-[1480px] mx-auto">
        <div className="hero-mesh px-6 sm:px-10 py-8 sm:py-10 text-white relative">
          <div className="relative z-10">
            <span className="chip mb-4 inline-flex" style={{ background: 'rgba(255,255,255,0.18)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
              <Sparkles className="w-2.5 h-2.5" /> Live · Real-Time
            </span>
            <h2 className="text-[32px] sm:text-[40px] font-black tighter leading-tight">Weather Intelligence</h2>
            <p className="text-[14px] opacity-80 mt-3 max-w-lg leading-relaxed">Hyperlocal forecasts powered by AI.</p>
          </div>
        </div>

        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} />
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No Weather Data Available</h3>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            Please go to <strong>Farm Details</strong> and run an analysis to get weather forecasts for your location.
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

  const details = [
    { Icon: Droplets, l: 'Humidity', v: `${weather?.humidity ?? '--'}%`, c: '#0ea5e9' },
    { Icon: Wind, l: 'Wind', v: `${weather?.windSpeed ?? '--'} km/h`, c: '#a78bfa' },
    { Icon: CloudRain, l: 'Rainfall', v: `${weather?.rainfall ?? '--'} mm`, c: '#3b82f6' },
    { Icon: Sun, l: 'UV Index', v: `${weather?.uvIndex ?? '-'}`, c: '#f59e0b' },
    { Icon: Eye, l: 'Visibility', v: '10 km', c: '#06b6d4' },
    { Icon: Gauge, l: 'Pressure', v: '1013', c: '#8b5cf6' },
  ];

  return (
    <div className="px-5 sm:px-8 lg:px-10 py-6 lg:py-8 space-y-6 max-w-[1480px] mx-auto">
      <div className="hero-mesh px-6 sm:px-10 py-8 sm:py-10 text-white relative">
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <span className="chip mb-4 inline-flex" style={{ background: 'rgba(255,255,255,0.18)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Sparkles className="w-2.5 h-2.5" /> Live · Real-Time
              </span>
              <div className="flex items-end gap-5">
                <span className="text-[88px] leading-none">{weather?.icon ?? '🌤️'}</span>
                <div>
                  <p className="text-[72px] sm:text-[88px] font-black tighter leading-none tabular">{weather?.temperature ?? '--'}°</p>
                  <p className="text-[18px] opacity-80 font-medium mt-2">{weather?.condition ?? 'Loading...'} · feels like {weather?.temperature ? weather.temperature + 2 : '--'}°</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 max-w-[420px]">
              {details.map((d, i) => (
                <div key={i} className="rounded-2xl p-3 backdrop-blur-md"
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <d.Icon className="w-3.5 h-3.5 mb-2 opacity-70" />
                  <p className="text-[9px] font-bold uppercase tracking-wider opacity-70 mono">{d.l}</p>
                  <p className="text-[15px] font-extrabold tabular tight mt-0.5">{d.v}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 mt-8 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
            {[
              { I: Sunrise, l: 'Sunrise', v: '5:42 AM' },
              { I: Sunset, l: 'Sunset', v: '7:18 PM' },
              { I: Thermometer, l: 'Dew Point', v: '20°C' },
              { I: Wind, l: 'Direction', v: 'NE' },
            ].map((x, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <x.I className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider mono opacity-70">{x.l}</p>
                  <p className="text-[13px] font-bold tabular">{x.v}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="surface p-6 sm:p-7">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-[16px] font-bold tight" style={{ color: 'var(--text-primary)' }}>7-Day Forecast</h3>
            <p className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>AI-powered hyperlocal predictions</p>
          </div>
          <span className="chip chip-blue">94% accuracy</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5 stagger">
          {weather?.forecast?.length ? weather.forecast.map((d, i) => (
            <div key={i} className="rounded-2xl p-4 text-center cursor-pointer transition-all hover:translate-y-[-2px]"
              style={{
                background: i === 0 ? 'linear-gradient(180deg, var(--accent-soft), transparent)' : 'var(--bg-sunken)',
                border: i === 0 ? '1px solid var(--border-accent)' : '1px solid var(--border)',
              }}>
              <p className="text-[9px] font-bold uppercase tracking-wider mono"
                style={{ color: i === 0 ? 'var(--accent)' : 'var(--text-tertiary)' }}>{d.day}</p>
              <span className="text-[28px] block my-3">{d.icon}</span>
              <p className="text-[18px] font-extrabold tabular tighter" style={{ color: 'var(--text-primary)' }}>{d.high}°</p>
              <p className="text-[11px] tabular" style={{ color: 'var(--text-tertiary)' }}>{d.low}°</p>
              <div className="mt-2 pt-2 flex items-center justify-center gap-1" style={{ borderTop: '1px solid var(--border)' }}>
                <Droplets className="w-2.5 h-2.5" style={{ color: '#0ea5e9' }} />
                <span className="text-[10px] font-bold tabular mono" style={{ color: '#0ea5e9' }}>{d.rainChance}%</span>
              </div>
            </div>
          )) : <p className="col-span-7 text-center py-12" style={{ color: 'var(--text-tertiary)' }}>Loading forecast...</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="surface p-6 sm:p-7">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[16px] font-bold tight" style={{ color: 'var(--text-primary)' }}>Hourly Temperature</h3>
              <p className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>Today's evolution</p>
            </div>
            <span className="chip chip-amber">Peak {weather?.temperature ?? '--'}°C</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={hourly} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="t" axisLine={false} tickLine={false} fontSize={11} />
              <YAxis axisLine={false} tickLine={false} fontSize={11} width={28} />
              <Tooltip />
              <Line type="monotone" dataKey="v" stroke="#f97316" strokeWidth={3}
                dot={{ fill: '#f97316', r: 4, strokeWidth: 2, stroke: 'var(--bg-elevated)' }}
                activeDot={{ r: 7, strokeWidth: 3 }} name="Temperature °C" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="surface p-6 sm:p-7">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[16px] font-bold tight" style={{ color: 'var(--text-primary)' }}>Rainfall Forecast</h3>
              <p className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>Precipitation outlook</p>
            </div>
            <span className="chip chip-blue">
              {weather?.forecast ? `${weather.forecast.reduce((a: number, d: any) => a + (d.rainChance >= 50 ? 1 : 0), 0)} rainy days` : '--'}
            </span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={weather?.forecast?.map((d: any) => ({ name: d.day, rainfall: d.rainChance })) || []} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs><linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.4} /><stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} /></linearGradient></defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={11} />
              <YAxis axisLine={false} tickLine={false} fontSize={11} width={28} />
              <Tooltip />
              <Area type="monotone" dataKey="rainfall" stroke="#0ea5e9" strokeWidth={2.5} fill="url(#rg)" name="Rain probability %"
                dot={{ r: 4, fill: '#0ea5e9', strokeWidth: 2, stroke: 'var(--bg-elevated)' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
