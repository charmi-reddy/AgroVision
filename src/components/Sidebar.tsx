import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, CloudSun, Sprout, Droplets, FlaskConical,
  Bell, Settings, LogOut, BarChart3, Menu, X, ChevronsLeft, ChevronsRight,
  MapPin,
} from 'lucide-react';
import Logo from './Logo';

const NAV_MAIN = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'farm', label: 'Farm Details', icon: MapPin },
  { id: 'weather', label: 'Weather', icon: CloudSun },
  { id: 'crops', label: 'Crop Advisory', icon: Sprout },
  { id: 'irrigation', label: 'Irrigation', icon: Droplets },
];
const NAV_INSIGHTS = [
  { id: 'soil', label: 'Soil Diagnostics', icon: FlaskConical },
  { id: 'fertilizer', label: 'Nutrient Plan', icon: BarChart3 },
  { id: 'alerts', label: 'Alerts', icon: Bell },
];

export default function Sidebar({ currentPage, onNavigate }: { currentPage: string; onNavigate: (p: string) => void }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  const go = (p: string) => { onNavigate(p); setMobileOpen(false); };
  const expanded = !collapsed || mobileOpen;
  const activeFarm = user?.farms?.find(f => f.id === user?.activeFarmId);

  const NavGroup = ({ items, title }: { items: typeof NAV_MAIN; title: string }) => (
    <div>
      {expanded && (
        <p className="px-3 pt-4 pb-2 text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--text-tertiary)' }}>
          {title}
        </p>
      )}
      {items.map(item => {
        const Icon = item.icon;
        const active = currentPage === item.id;
        return (
          <button key={item.id} onClick={() => go(item.id)}
            className="group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium cursor-pointer mb-0.5"
            style={{ background: active ? 'var(--accent-soft)' : 'transparent', color: active ? 'var(--accent)' : 'var(--text-secondary)' }}>
            {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full" style={{ background: 'var(--accent)', boxShadow: '0 0 12px var(--accent-glow)' }} />}
            <Icon className="w-[18px] h-[18px] flex-shrink-0" strokeWidth={active ? 2.4 : 1.8} />
            {expanded && <span className="truncate flex-1 text-left">{item.label}</span>}
            {active && expanded && <span className="live-dot" />}
            {!expanded && (
              <span className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none -translate-x-2 group-hover:translate-x-0 transition-all duration-200 z-50"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', color: 'var(--text-primary)', boxShadow: 'var(--shadow-md)' }}>
                {item.label}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  const Inner = (
    <>
      <div className="flex items-center gap-3 h-[68px] px-5 flex-shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
        <Logo size={36} />
        {expanded && (
          <div className="min-w-0 anim-fade-in flex-1">
            <p className="text-[15px] font-extrabold tight leading-none" style={{ color: 'var(--text-primary)' }}>AgroVision</p>
            <p className="text-[9px] font-bold tracking-[0.2em] uppercase mt-1 mono" style={{ color: 'var(--accent)' }}>AI · Climate Advisory</p>
          </div>
        )}
        <button onClick={() => setMobileOpen(false)} className="ml-auto lg:hidden btn-icon !w-8 !h-8"><X className="w-4 h-4" /></button>
      </div>

      {/* Active farm indicator */}
      {expanded && activeFarm && (
        <div className="mx-3 mt-3 p-3 rounded-xl flex items-center gap-2.5"
          style={{ background: 'var(--accent-soft)', border: '1px solid var(--border-accent)' }}>
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--accent)' }} />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold truncate" style={{ color: 'var(--text-primary)' }}>{activeFarm.name}</p>
            <p className="text-[9px] truncate" style={{ color: 'var(--text-tertiary)' }}>{activeFarm.location}</p>
          </div>
        </div>
      )}

      <nav className="flex-1 px-3 py-2 overflow-y-auto no-scrollbar">
        <NavGroup items={NAV_MAIN} title="Workspace" />
        <NavGroup items={NAV_INSIGHTS} title="Insights" />
      </nav>

      <div className="px-3 pb-3 pt-2 space-y-0.5 flex-shrink-0" style={{ borderTop: '1px solid var(--border)' }}>
        <button onClick={() => go('settings')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium cursor-pointer"
          style={{ color: currentPage === 'settings' ? 'var(--accent)' : 'var(--text-secondary)', background: currentPage === 'settings' ? 'var(--accent-soft)' : 'transparent' }}>
          <Settings className="w-[18px] h-[18px]" strokeWidth={1.8} />
          {expanded && <span>Settings</span>}
        </button>
        <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium cursor-pointer hover:!bg-red-500/10"
          style={{ color: 'var(--text-secondary)' }}>
          <LogOut className="w-[18px] h-[18px]" strokeWidth={1.8} />
          {expanded && <span>Logout</span>}
        </button>
      </div>

      {user && (
        <div className="px-4 py-3.5 flex-shrink-0" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-extrabold text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, var(--accent), #0ea5e9)', boxShadow: '0 0 0 2px var(--bg-elevated), 0 0 0 3px var(--accent-glow)' }}>
              {user.avatar}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full" style={{ background: '#22c55e', border: '2px solid var(--bg-elevated)' }} />
            </div>
            {expanded && (
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-semibold truncate leading-tight" style={{ color: 'var(--text-primary)' }}>{user.name}</p>
                <p className="text-[10px] truncate leading-tight mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{user.farms.length} farm{user.farms.length !== 1 ? 's' : ''}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      <button onClick={() => setMobileOpen(true)} className="lg:hidden fixed top-4 left-4 z-[60] btn-icon"><Menu className="w-[18px] h-[18px]" /></button>
      {mobileOpen && <div onClick={() => setMobileOpen(false)} className="lg:hidden fixed inset-0 z-[70] anim-fade-in" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }} />}
      <aside className={`lg:hidden fixed left-0 top-0 h-dvh w-[280px] flex flex-col z-[80] transition-transform duration-400 ease-[cubic-bezier(.65,0,.35,1)] ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: 'var(--bg-elevated)' }}>{Inner}</aside>
      <aside className="hidden lg:flex fixed left-0 top-0 h-dvh flex-col z-50 transition-[width] duration-300 ease-out"
        style={{ width: collapsed ? '76px' : '260px', background: 'var(--bg-elevated)', borderRight: '1px solid var(--border)' }}>
        {Inner}
        <button onClick={() => setCollapsed(!collapsed)} className="absolute -right-3 top-[80px] w-6 h-6 rounded-full flex items-center justify-center cursor-pointer z-10"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', color: 'var(--text-secondary)', boxShadow: 'var(--shadow-sm)' }}>
          {collapsed ? <ChevronsRight className="w-3 h-3" /> : <ChevronsLeft className="w-3 h-3" />}
        </button>
      </aside>
    </>
  );
}
