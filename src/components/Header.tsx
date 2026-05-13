import { Bell, Search, Sun, Moon, Sparkles, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { useState, useRef, useEffect } from 'react';

export default function Header({ title, subtitle, onNavigate }: { title: string; subtitle?: string; onNavigate: (p: string) => void }) {
  const { user, setActiveFarm } = useAuth();
  const { theme, toggle } = useTheme();
  const { alerts } = useData();
  const { language, setLanguage, t } = useLanguage();
  const [farmOpen, setFarmOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const unread = alerts.filter(a => !a.read).length;

  const activeFarm = user?.farms?.find(f => f.id === user.activeFarmId);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setFarmOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-40 glass" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="flex items-center justify-between h-[68px] px-5 sm:px-8 lg:px-10">
        <div className="pl-12 lg:pl-0 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-[18px] sm:text-[20px] font-extrabold tight truncate" style={{ color: 'var(--text-primary)' }}>{title}</h1>
            <span className="hidden sm:inline-flex chip chip-accent !text-[9px] !px-2">
              <Sparkles className="w-2.5 h-2.5" /> {t('AI')}
            </span>
          </div>
          {subtitle && (
            <p className="text-[12px] truncate mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {user && user.farms.length > 0 && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setFarmOpen(!farmOpen)}
                className="hidden md:flex items-center gap-1.5 px-3 py-[7px] rounded-xl text-[12px] font-bold cursor-pointer"
                style={{ background: 'var(--bg-sunken)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              >
                {activeFarm?.name || t('Select Farm')}
                <ChevronDown className="w-3 h-3" style={{ color: 'var(--text-tertiary)' }} />
              </button>
              {farmOpen && (
                <div className="absolute top-full right-0 mt-1 w-56 rounded-xl z-50 anim-scale-up overflow-hidden"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}>
                  {user.farms.map(farm => (
                    <button
                      key={farm.id}
                      onClick={() => { setActiveFarm(farm.id); setFarmOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-[12px] font-semibold cursor-pointer transition-colors"
                      style={{
                        background: farm.id === user.activeFarmId ? 'var(--accent-soft)' : 'transparent',
                        color: farm.id === user.activeFarmId ? 'var(--accent)' : 'var(--text-primary)',
                      }}
                    >
                      <span className="text-lg">{farm.id === user.activeFarmId ? '\u{1f4cd}' : '\u{1f3e1}'}</span>
                      <div className="min-w-0">
                        <p className="truncate">{farm.name}</p>
                        <p className="text-[10px] font-normal truncate" style={{ color: 'var(--text-tertiary)' }}>{farm.location}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="hidden md:flex items-center gap-2 px-3.5 py-[9px] rounded-xl w-52 lg:w-72 transition-all"
            style={{ background: 'var(--bg-sunken)', border: '1px solid var(--border)' }}>
            <Search className="w-3.5 h-3.5" style={{ color: 'var(--text-tertiary)' }} />
            <input type="text" placeholder={t('Search insights, fields...')}
              className="bg-transparent outline-none text-[13px] w-full"
              style={{ color: 'var(--text-primary)' }} />
            <kbd className="hidden lg:inline text-[9px] px-1.5 py-px rounded font-mono"
              style={{ background: 'var(--bg-elevated)', color: 'var(--text-tertiary)', border: '1px solid var(--border)' }}>Ctrl K</kbd>
          </div>

          <div className="hidden sm:flex items-center gap-1 rounded-xl p-1"
            style={{ background: 'var(--bg-sunken)', border: '1px solid var(--border)' }}
            aria-label={t('Language')}>
            {[
              { id: 'en' as const, label: 'English' },
              { id: 'hi' as const, label: '\u0939\u093f\u0902\u0926\u0940' },
              { id: 'te' as const, label: '\u0c24\u0c46\u0c32\u0c41\u0c17\u0c41' },
            ].map(option => (
              <button
                key={option.id}
                type="button"
                onClick={() => setLanguage(option.id)}
                className="px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold cursor-pointer transition-all"
                style={{
                  background: language === option.id ? 'var(--accent)' : 'transparent',
                  color: language === option.id ? 'white' : 'var(--text-secondary)',
                }}
              >
                {option.label}
              </button>
            ))}
          </div>

          <button onClick={toggle} className="theme-toggle-track" aria-label={t('Toggle theme')}>
            <span className="theme-toggle-thumb">
              {theme === 'dark' ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
            </span>
            <span className="absolute top-1/2 -translate-y-1/2 left-2 transition-opacity duration-300"
              style={{ opacity: theme === 'dark' ? 0.4 : 0, color: 'var(--text-tertiary)' }}><Sun className="w-3 h-3" /></span>
            <span className="absolute top-1/2 -translate-y-1/2 right-2 transition-opacity duration-300"
              style={{ opacity: theme === 'dark' ? 0 : 0.4, color: 'var(--text-tertiary)' }}><Moon className="w-3 h-3" /></span>
          </button>

          <button onClick={() => onNavigate('alerts')} className="btn-icon relative">
            <Bell className="w-4 h-4" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-[9px] font-bold text-white rounded-full px-1"
                style={{ background: '#ef4444', boxShadow: '0 0 0 2px var(--bg-elevated), 0 4px 12px rgba(239,68,68,0.4)' }}>
                {unread}
              </span>
            )}
          </button>

          <div className="hidden sm:block w-px h-7 mx-1" style={{ background: 'var(--border-strong)' }} />
          <div className="flex items-center gap-2.5 cursor-pointer group">
            <div className="relative w-9 h-9 rounded-full flex items-center justify-center text-white text-[11px] font-extrabold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, var(--accent), #0ea5e9)', boxShadow: '0 0 0 2px var(--bg-elevated), 0 0 0 3px var(--accent-glow)' }}>
              {user?.avatar}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
