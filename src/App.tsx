import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import WeatherPage from './pages/WeatherPage';
import CropAdvisoryPage from './pages/CropAdvisoryPage';
import IrrigationPage from './pages/IrrigationPage';
import SoilPage from './pages/SoilPage';
import FertilizerPage from './pages/FertilizerPage';
import AlertsPage from './pages/AlertsPage';
import SettingsPage from './pages/SettingsPage';
import FarmDetailsPage from './pages/FarmDetailsPage';

const META: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: 'Overview', subtitle: 'Real-time intelligence for your farm' },
  weather: { title: 'Weather Intelligence', subtitle: 'Hyperlocal forecasts powered by AI' },
  crops: { title: 'Crop Advisory', subtitle: 'Climate-resilient planting recommendations' },
  irrigation: { title: 'Smart Irrigation', subtitle: 'Optimized watering schedules' },
  soil: { title: 'Soil Diagnostics', subtitle: 'Deep nutrient & moisture analysis' },
  fertilizer: { title: 'Nutrient Plan', subtitle: 'Precision fertilizer prescriptions' },
  alerts: { title: 'Alerts & Insights', subtitle: 'Real-time field notifications' },
  settings: { title: 'Settings', subtitle: 'Workspace preferences' },
  farm: { title: 'Farm Details', subtitle: 'Manage your farm information and run analysis' },
};

function Shell() {
  const { isAuthenticated } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [page, setPage] = useState('dashboard');
  const [transitionKey, setTransitionKey] = useState(0);

  const navigate = (p: string) => {
    if (p === page) return;
    setPage(p);
    setTransitionKey(k => k + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isAuthenticated) {
    return authMode === 'login'
      ? <LoginPage onToggleAuth={() => setAuthMode('signup')} />
      : <SignupPage onToggleAuth={() => setAuthMode('login')} />;
  }

  const meta = META[page] || META.dashboard;

  const PageContent = () => {
    switch (page) {
      case 'weather': return <WeatherPage />;
      case 'crops': return <CropAdvisoryPage />;
      case 'irrigation': return <IrrigationPage />;
      case 'soil': return <SoilPage />;
      case 'fertilizer': return <FertilizerPage />;
      case 'alerts': return <AlertsPage />;
      case 'settings': return <SettingsPage />;
      case 'farm': return <FarmDetailsPage />;
      default: return <DashboardPage onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-dvh" style={{ background: 'var(--bg-base)' }}>
      <Sidebar currentPage={page} onNavigate={navigate} />
      <div className="lg:ml-[260px] min-h-dvh flex flex-col">
        <Header title={meta.title} subtitle={meta.subtitle} onNavigate={navigate} />
        <main key={transitionKey} className="flex-1 anim-fade-up">
          <PageContent />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <Shell />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
