import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import MapPicker from '../components/MapPicker';
import { Save, Bell, Globe, Shield, Database, Cpu, CheckCircle2, Sun, Moon, Monitor, MapPin, Plus, Trash2, RefreshCw } from 'lucide-react';

export default function SettingsPage() {
  const { user, addFarm, removeFarm, setActiveFarm } = useAuth();
  const { theme, setTheme } = useTheme();
  const [saved, setSaved] = useState(false);
  const [notif, setNotif] = useState({ weather: true, pest: true, irrigation: true, market: false, soil: true, voice: false });

  const [showAddFarm, setShowAddFarm] = useState(false);
  const [newFarmName, setNewFarmName] = useState('');
  const [newLat, setNewLat] = useState(31.1471);
  const [newLon, setNewLon] = useState(75.3412);
  const [newLocName, setNewLocName] = useState('');

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const handleAddFarm = () => {
    if (!newFarmName.trim()) return;
    addFarm({
      id: 'farm_' + Date.now(),
      name: newFarmName,
      location: newLocName || `${newLat.toFixed(4)}, ${newLon.toFixed(4)}`,
      lat: newLat,
      lon: newLon,
    });
    setNewFarmName('');
    setShowAddFarm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const handleRemoveFarm = (farmId: string, farmName: string) => {
    if (confirm(`Remove "${farmName}"? This cannot be undone.`)) {
      removeFarm(farmId);
    }
  };

  const Toggle = ({ on, fn }: { on: boolean; fn: () => void }) => (
    <button onClick={fn} className="relative w-11 h-6 rounded-full cursor-pointer flex-shrink-0 transition-colors duration-300"
      style={{ background: on ? 'var(--accent)' : 'var(--border-strong)', boxShadow: on ? '0 0 12px var(--accent-glow)' : 'none' }}>
      <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-300"
        style={{ transform: on ? 'translateX(22px)' : 'translateX(2px)', boxShadow: 'var(--shadow-sm)' }} />
    </button>
  );

  return (
    <div className="px-5 sm:px-8 lg:px-10 py-6 lg:py-8 space-y-5 max-w-3xl mx-auto">
      {saved && (
        <div className="fixed top-6 right-6 px-5 py-3 rounded-xl flex items-center gap-2 z-[100] anim-scale-up"
          style={{ background: 'var(--accent)', color: 'white', boxShadow: '0 12px 40px var(--accent-glow)' }}>
          <CheckCircle2 className="w-4 h-4" />
          <span className="text-[13px] font-bold">Saved!</span>
        </div>
      )}

      {/* Theme */}
      <section className="surface p-6 sm:p-7">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent-soft)', border: '1px solid var(--border-accent)' }}>
            <Sun className="w-4 h-4" style={{ color: 'var(--accent)' }} />
          </div>
          <div><p className="text-[15px] font-bold tight" style={{ color: 'var(--text-primary)' }}>Appearance</p><p className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>Choose your theme</p></div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'light', label: 'Light', Icon: Sun, preview: 'linear-gradient(135deg,#ffffff 0%,#f5f7fb 100%)' },
            { id: 'dark', label: 'Dark', Icon: Moon, preview: 'linear-gradient(135deg,#0d111c 0%,#06080f 100%)' },
            { id: 'system', label: 'System', Icon: Monitor, preview: 'linear-gradient(135deg,#ffffff 0%,#0d111c 100%)' },
          ].map(t => {
            const active = theme === t.id;
            return (
              <button key={t.id} onClick={() => t.id !== 'system' && setTheme(t.id as any)}
                className="rounded-2xl p-4 cursor-pointer transition-all hover:translate-y-[-2px]"
                style={{ background: active ? 'var(--accent-soft)' : 'var(--bg-sunken)', border: active ? '2px solid var(--accent)' : '2px solid var(--border)', boxShadow: active ? 'var(--shadow-glow)' : 'none' }}>
                <div className="h-16 rounded-xl mb-3" style={{ background: t.preview, border: '1px solid var(--border-strong)' }} />
                <div className="flex items-center justify-center gap-1.5">
                  <t.Icon className="w-3.5 h-3.5" style={{ color: active ? 'var(--accent)' : 'var(--text-secondary)' }} />
                  <span className="text-[12px] font-bold" style={{ color: active ? 'var(--accent)' : 'var(--text-primary)' }}>{t.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Profile */}
      <section className="surface p-6 sm:p-7">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent-soft)', border: '1px solid var(--border-accent)' }}>
            <Shield className="w-4 h-4" style={{ color: 'var(--accent)' }} />
          </div>
          <div><p className="text-[15px] font-bold tight" style={{ color: 'var(--text-primary)' }}>Profile</p><p className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>Your account information</p></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="text-[10px] font-bold uppercase tracking-wider mono" style={{ color: 'var(--text-tertiary)' }}>Name</label><input defaultValue={user?.name} className="input-base mt-1.5" /></div>
          <div><label className="text-[10px] font-bold uppercase tracking-wider mono" style={{ color: 'var(--text-tertiary)' }}>Email</label><input defaultValue={user?.email} className="input-base mt-1.5" /></div>
        </div>
      </section>

      {/* Farms */}
      <section className="surface p-6 sm:p-7">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent-soft)', border: '1px solid var(--border-accent)' }}>
              <Globe className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            </div>
            <div><p className="text-[15px] font-bold tight" style={{ color: 'var(--text-primary)' }}>My Farms</p><p className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>{user?.farms.length || 0} farm{(user?.farms.length || 0) !== 1 ? 's' : ''}</p></div>
          </div>
          <button onClick={() => setShowAddFarm(true)} className="btn-primary !py-2 !px-3.5 !text-[11px]">
            <Plus className="w-3.5 h-3.5" /> Add Farm
          </button>
        </div>

        {/* Add farm form */}
        {showAddFarm && (
          <div className="mb-5 p-5 rounded-2xl anim-fade-up" style={{ background: 'var(--bg-sunken)', border: '1px solid var(--border)' }}>
            <p className="text-[14px] font-bold mb-3" style={{ color: 'var(--text-primary)' }}>New Farm</p>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider mono" style={{ color: 'var(--text-tertiary)' }}>Farm Name</label>
                <input type="text" value={newFarmName} onChange={e => setNewFarmName(e.target.value)} className="input-base mt-1" placeholder="Green Valley Farm" />
              </div>
              <MapPicker lat={newLat} lon={newLon} onLocationChange={(lat, lon, name) => { setNewLat(lat); setNewLon(lon); setNewLocName(name); }} />
              <div className="flex gap-2">
                <button onClick={() => setShowAddFarm(false)} className="btn-ghost flex-1 !py-2.5">Cancel</button>
                <button onClick={handleAddFarm} className="btn-primary flex-1 !py-2.5">Add Farm</button>
              </div>
            </div>
          </div>
        )}

        {/* Farm list */}
        <div className="space-y-2">
          {user?.farms && user.farms.length > 0 ? user.farms.map(farm => {
            const isActive = farm.id === user.activeFarmId;
            return (
              <div key={farm.id} className="p-4 rounded-xl flex items-start gap-3 transition-all"
                style={{ background: isActive ? 'var(--accent-soft)' : 'var(--bg-sunken)', border: isActive ? '1px solid var(--border-accent)' : '1px solid var(--border)' }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                  {isActive ? '📍' : '🏡'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-bold truncate" style={{ color: 'var(--text-primary)' }}>{farm.name}</p>
                    {isActive && <span className="chip chip-accent !text-[8px]">Active</span>}
                  </div>
                  <p className="text-[11px] mt-0.5 flex items-center gap-1" style={{ color: 'var(--text-tertiary)' }}>
                    <MapPin className="w-3 h-3" />{farm.location}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {!isActive && (
                      <button onClick={() => setActiveFarm(farm.id)} className="text-[10px] font-bold cursor-pointer flex items-center gap-0.5"
                        style={{ color: 'var(--accent)' }}>
                        <RefreshCw className="w-3 h-3" /> Switch
                      </button>
                    )}
                    <button onClick={() => handleRemoveFarm(farm.id, farm.name)} className="text-[10px] font-bold cursor-pointer flex items-center gap-0.5"
                      style={{ color: '#ef4444' }}>
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="text-center py-8">
              <p className="text-[13px] font-bold" style={{ color: 'var(--text-tertiary)' }}>No farms yet</p>
              <p className="text-[11px] mt-1" style={{ color: 'var(--text-quaternary)' }}>Click "Add Farm" to get started</p>
            </div>
          )}
        </div>
      </section>

      {/* Notifications */}
      <section className="surface p-6 sm:p-7">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <Bell className="w-4 h-4" style={{ color: '#f59e0b' }} />
          </div>
          <div><p className="text-[15px] font-bold tight" style={{ color: 'var(--text-primary)' }}>Notifications</p><p className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>Manage alerts</p></div>
        </div>
        <div className="space-y-1">
          {Object.entries(notif).map(([k, v]) => (
            <div key={k} className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="min-w-0 mr-4">
                <p className="text-[13px] font-bold capitalize" style={{ color: 'var(--text-primary)' }}>{k} alerts</p>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{
                  k === 'weather' ? 'Weather warnings' : k === 'pest' ? 'Pest predictions' : k === 'irrigation' ? 'Irrigation reminders' : k === 'market' ? 'Price trends' : k === 'soil' ? 'Soil health' : 'Voice notifications'
                }</p>
              </div>
              <Toggle on={v} fn={() => setNotif({ ...notif, [k]: !v })} />
            </div>
          ))}
        </div>
      </section>

      {/* AI */}
      <section className="surface p-6 sm:p-7">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)' }}>
            <Cpu className="w-4 h-4" style={{ color: '#a78bfa' }} />
          </div>
          <div><p className="text-[15px] font-bold tight" style={{ color: 'var(--text-primary)' }}>AI & Data</p><p className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>ML preferences</p></div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <div><p className="text-[13px] font-bold" style={{ color: 'var(--text-primary)' }}>Auto ML Updates</p><p className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Retrain with new data</p></div>
            <Toggle on={true} fn={() => {}} />
          </div>
          <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <div><p className="text-[13px] font-bold" style={{ color: 'var(--text-primary)' }}>Data Sharing</p><p className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Anonymized community</p></div>
            <Toggle on={false} fn={() => {}} />
          </div>
          <div className="flex items-center justify-between py-3">
            <div><p className="text-[13px] font-bold" style={{ color: 'var(--text-primary)' }}>IoT Sync</p><p className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Sensor frequency</p></div>
            <select className="input-base !w-auto !py-2 !text-[12px]"><option>15 min</option><option>30 min</option><option>1 hour</option></select>
          </div>
        </div>
      </section>

      {/* System */}
      <section className="rounded-2xl p-6" style={{ background: 'var(--bg-sunken)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
          <p className="text-[15px] font-bold tight" style={{ color: 'var(--text-primary)' }}>System</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[{ k: 'Version', v: 'v3.1.0' }, { k: 'ML Models', v: '3 Active' }, { k: 'Farms', v: user?.farms.length || 0 }, { k: 'API', v: '● Online' }].map(s => (
            <div key={s.k}><p className="text-[9px] font-bold uppercase tracking-wider mono" style={{ color: 'var(--text-tertiary)' }}>{s.k}</p><p className="text-[14px] font-extrabold mt-1" style={{ color: 'var(--text-primary)' }}>{s.v}</p></div>
          ))}
        </div>
      </section>

      <div className="flex justify-end pb-4">
        <button onClick={save} className="btn-primary"><Save className="w-4 h-4" /> Save settings</button>
      </div>
    </div>
  );
}
