import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Logo from '../components/Logo';
import { Eye, EyeOff, ArrowRight, Loader2, ShieldCheck, Sun, Moon, Sparkles, Mail, Lock, AlertCircle } from 'lucide-react';

export default function LoginPage({ onToggleAuth }: { onToggleAuth: () => void }) {
  const { login, isLoading } = useAuth();
  const { theme, toggle } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields'); return; }
    const ok = await login(email, password);
    if (!ok) setError('No account found with this email. Please sign up first.');
  };

  return (
    <div className="min-h-dvh relative overflow-hidden flex items-center justify-center px-4 py-8" style={{ background: 'var(--bg-base)' }}>
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full anim-mesh-shift"
        style={{ background: 'radial-gradient(circle, var(--accent-glow), transparent 70%)', filter: 'blur(80px)' }} />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full anim-mesh-shift"
        style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.2), transparent 70%)', filter: 'blur(80px)', animationDelay: '5s' }} />

      <button onClick={toggle} className="absolute top-6 right-6 btn-icon z-20">
        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>

      <div className="relative z-10 w-full max-w-[1080px] grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="hidden lg:block anim-slide-right pr-4">
          <div className="flex items-center gap-3 mb-10">
            <Logo size={44} /><div><p className="text-[20px] font-extrabold tight" style={{ color: 'var(--text-primary)' }}>AgroVision</p><p className="text-[10px] font-bold tracking-[0.2em] uppercase mono" style={{ color: 'var(--accent)' }}>AI Climate Advisory</p></div>
          </div>
          <h1 className="text-[52px] font-black leading-[1.05] tighter mb-5" style={{ color: 'var(--text-primary)' }}>See your farm<br /><span className="glow-text">like never before.</span></h1>
          <p className="text-[15px] leading-relaxed max-w-[440px] mb-10" style={{ color: 'var(--text-secondary)' }}>AI-driven climate intelligence that turns weather, soil, and crop data into clear, actionable decisions — delivered in real time.</p>
          <div className="space-y-3 max-w-[440px]">
            {[
              { stat: '+ 38%', label: 'Average yield improvement', sub: 'Across 12,000 farms', icon: '📈' },
              { stat: '— 42%', label: 'Water consumption reduced', sub: 'Smart irrigation enabled', icon: '💧' },
              { stat: '24/7', label: 'AI monitoring & alerts', sub: 'Hyperlocal precision', icon: '🛰️' },
            ].map((s, i) => (
              <div key={i} className="glass rounded-2xl p-4 flex items-center gap-4 surface-hover anim-fade-up" style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
                <div className="text-2xl">{s.icon}</div>
                <div className="flex-1"><p className="text-[11px] font-medium" style={{ color: 'var(--text-tertiary)' }}>{s.label}</p><div className="flex items-baseline gap-2"><span className="text-[22px] font-extrabold tabular tight glow-text">{s.stat}</span><span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{s.sub}</span></div></div>
              </div>
            ))}
          </div>
          <div className="mt-10 flex items-center gap-3">
            <div className="flex -space-x-2">{['AS','PK','RJ','MP','SG'].map((s,i) => <div key={i} className="w-8 h-8 rounded-full flex items-center justify-center text-[9px] font-extrabold text-white" style={{ background: `hsl(${140 + i * 30}, 60%, 50%)`, border: '2px solid var(--bg-base)' }}>{s}</div>)}</div>
            <p className="text-[12px]" style={{ color: 'var(--text-secondary)' }}><span className="font-bold" style={{ color: 'var(--text-primary)' }}>12,847+ farmers</span> growing smarter</p>
          </div>
        </div>

        <div className="anim-fade-up">
          <div className="glass rounded-[28px] p-8 sm:p-10 relative overflow-hidden" style={{ boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-strong)' }}>
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-40" style={{ background: 'radial-gradient(circle, var(--accent-glow), transparent 70%)' }} />
            <div className="lg:hidden flex items-center gap-2.5 mb-8">
              <Logo size={36} /><div><p className="text-[16px] font-extrabold tight" style={{ color: 'var(--text-primary)' }}>AgroVision</p><p className="text-[9px] font-bold tracking-widest uppercase mono" style={{ color: 'var(--accent)' }}>AI Climate Advisory</p></div>
            </div>
            <span className="chip chip-accent inline-flex mb-4"><Sparkles className="w-2.5 h-2.5" /> Welcome</span>
            <h2 className="text-[28px] font-black tighter mb-2" style={{ color: 'var(--text-primary)' }}>Sign in to continue</h2>
            <p className="text-[13px] mb-8" style={{ color: 'var(--text-tertiary)' }}>Access your personalized AI farm dashboard.</p>

            <form onSubmit={submit} className="space-y-4 relative">
              {error && (
                <div className="px-4 py-3 rounded-xl text-[13px] font-medium anim-scale-up flex items-start gap-2"
                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#dc2626' }}>
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider mono" style={{ color: 'var(--text-tertiary)' }}>Email</label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-base !pl-10" placeholder="you@farm.com" />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider mono" style={{ color: 'var(--text-tertiary)' }}>Password</label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                  <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="input-base !pl-10 pr-12" placeholder="Enter password" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer" style={{ color: 'var(--text-tertiary)' }}>
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-[12px]" style={{ color: 'var(--text-secondary)' }}><input type="checkbox" defaultChecked className="w-3.5 h-3.5 rounded accent-emerald-500" />Remember me</label>
                <button type="button" className="text-[12px] font-semibold cursor-pointer" style={{ color: 'var(--accent)' }}>Forgot password?</button>
              </div>
              <button type="submit" disabled={isLoading} className="btn-primary w-full !py-3 !text-[14px] !rounded-xl mt-2 disabled:opacity-60">
                {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>

            <div className="flex items-center justify-center gap-1.5 mt-6 text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
              <ShieldCheck className="w-3 h-3" />
              <span>End-to-end encrypted · SOC 2 compliant</span>
            </div>

            <p className="text-center text-[13px] mt-5" style={{ color: 'var(--text-tertiary)' }}>
              No account?{' '}
              <button onClick={onToggleAuth} className="font-bold cursor-pointer" style={{ color: 'var(--accent)' }}>
                Create one — it's free
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
