import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Logo from '../components/Logo';
import { Eye, EyeOff, ArrowRight, Loader2, AlertCircle, Sparkles, Sun, Moon } from 'lucide-react';

export default function SignupPage({ onToggleAuth }: { onToggleAuth: () => void }) {
  const { signup, isLoading } = useAuth();
  const { theme, toggle } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) { setError('Fill all fields'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    const ok = await signup({ name, email, password });
    if (!ok) setError('An account with this email already exists. Please sign in.');
  };

  const str = password.length === 0 ? 0 : password.length < 8 ? 1 : password.length < 12 ? 2 : 3;

  return (
    <div className="min-h-dvh relative overflow-hidden flex items-center justify-center px-4 py-8" style={{ background: 'var(--bg-base)' }}>
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full anim-mesh-shift"
        style={{ background: 'radial-gradient(circle, var(--accent-glow), transparent 70%)', filter: 'blur(80px)' }} />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full anim-mesh-shift"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.18), transparent 70%)', filter: 'blur(80px)', animationDelay: '5s' }} />

      <button onClick={toggle} className="absolute top-6 right-6 btn-icon z-20">{theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}</button>

      <div className="relative z-10 w-full max-w-[1080px] grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="hidden lg:block anim-slide-right pr-4">
          <div className="flex items-center gap-3 mb-10">
            <Logo size={44} /><div><p className="text-[20px] font-extrabold tight" style={{ color: 'var(--text-primary)' }}>AgroVision</p><p className="text-[10px] font-bold tracking-[0.2em] uppercase mono" style={{ color: 'var(--accent)' }}>AI Climate Advisory</p></div>
          </div>
          <h1 className="text-[52px] font-black leading-[1.05] tighter mb-5" style={{ color: 'var(--text-primary)' }}>Welcome to the<br /><span className="glow-text">future of farming.</span></h1>
          <p className="text-[15px] leading-relaxed max-w-[440px] mb-12" style={{ color: 'var(--text-secondary)' }}>Create your account in seconds. Your dashboard will stay empty until you add a farm from inside the app.</p>
          <div className="space-y-4 max-w-[400px]">
            {[
              { icon: '🔒', t: 'Secure account', d: 'Name, email, and password only' },
              { icon: '🌱', t: 'Clean dashboard', d: 'No farm analytics until you add a farm' },
              { icon: '🛰️', t: 'Live farm intelligence', d: 'Weather and crop analysis after setup' },
            ].map(s => (
              <div key={s.t} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[18px] flex-shrink-0 transition-all"
                  style={{ background: 'var(--bg-sunken)', border: '1px solid var(--border)' }}>
                  {s.icon}
                </div>
                <div><p className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>{s.t}</p><p className="text-[12px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{s.d}</p></div>
              </div>
            ))}
          </div>
        </div>

        <div className="anim-fade-up">
          <div className="glass rounded-[28px] p-8 sm:p-10 relative overflow-hidden" style={{ boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-strong)' }}>
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-40" style={{ background: 'radial-gradient(circle, var(--accent-glow), transparent 70%)' }} />
            <div className="lg:hidden flex items-center gap-2.5 mb-8">
              <Logo size={36} /><div><p className="text-[16px] font-extrabold tight" style={{ color: 'var(--text-primary)' }}>AgroVision</p><p className="text-[9px] font-bold tracking-widest uppercase mono" style={{ color: 'var(--accent)' }}>AI Climate Advisory</p></div>
            </div>
            <span className="chip chip-accent inline-flex mb-4"><Sparkles className="w-2.5 h-2.5" /> Create Account</span>
            <h2 className="text-[28px] font-black tighter mb-2" style={{ color: 'var(--text-primary)' }}>Get started</h2>
            <p className="text-[13px] mb-7" style={{ color: 'var(--text-tertiary)' }}>Farm setup happens later inside your dashboard.</p>

            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl text-[13px] font-medium anim-scale-up flex items-start gap-2"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#dc2626' }}>
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /><span>{error}</span>
              </div>
            )}

            <form onSubmit={submit} className="space-y-4 anim-fade-up">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider mono" style={{ color: 'var(--text-tertiary)' }}>Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="input-base mt-1.5" placeholder="Amit Singh" />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider mono" style={{ color: 'var(--text-tertiary)' }}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-base mt-1.5" placeholder="amit@farm.com" />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider mono" style={{ color: 'var(--text-tertiary)' }}>Password</label>
                <div className="relative mt-1.5">
                  <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="input-base pr-12" placeholder="Min 8 characters" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer" style={{ color: 'var(--text-tertiary)' }}>
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {password.length > 0 && (
                  <div className="flex items-center gap-1.5 mt-2">
                    {[1, 2, 3].map(l => (
                      <div key={l} className="h-1 flex-1 rounded-full transition-colors duration-300"
                        style={{ background: str >= l ? (l === 1 ? '#ef4444' : l === 2 ? '#f59e0b' : 'var(--accent)') : 'var(--bg-sunken)' }} />
                    ))}
                    <span className="text-[10px] mono ml-1 font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                      {['', 'Weak', 'Good', 'Strong'][str]}
                    </span>
                  </div>
                )}
              </div>
              <button type="submit" disabled={isLoading} className="btn-primary w-full !py-3 !text-[14px] !rounded-xl mt-1 disabled:opacity-60">
                {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account…</> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>

            <p className="text-center text-[13px] mt-7" style={{ color: 'var(--text-tertiary)' }}>
              Have an account?{' '}
              <button onClick={onToggleAuth} className="font-bold cursor-pointer" style={{ color: 'var(--accent)' }}>
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
