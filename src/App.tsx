import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import WeatherPage from './pages/WeatherPage';
import CropAdvisoryPage from './pages/CropAdvisoryPage';
import IrrigationPage from './pages/IrrigationPage';
import FertilizerPage from './pages/FertilizerPage';
import AlertsPage from './pages/AlertsPage';
import SettingsPage from './pages/SettingsPage';
import FarmDetailsPage from './pages/FarmDetailsPage';

const META: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: 'Overview', subtitle: 'Real-time intelligence for your farm' },
  weather: { title: 'Weather Intelligence', subtitle: 'Hyperlocal forecasts powered by AI' },
  crops: { title: 'Crop Advisory', subtitle: 'Climate-resilient planting recommendations' },
  irrigation: { title: 'Smart Irrigation', subtitle: 'Optimized watering schedules' },
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
  const { t } = useLanguage();

  const navigate = (p: string) => {
    if (p === page) return;
    setPage(p);
    setTransitionKey(k => k + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isAuthenticated) {
    return (
      <ErrorBoundary>
        {authMode === 'login'
          ? <LoginPage onToggleAuth={() => setAuthMode('signup')} />
          : <SignupPage onToggleAuth={() => setAuthMode('login')} />}
      </ErrorBoundary>
    );
  }

  const rawMeta = META[page] || META.dashboard;
  const meta = { title: t(rawMeta.title), subtitle: t(rawMeta.subtitle) };

  const PageContent = () => {
    switch (page) {
      case 'weather': return <WeatherPage />;
      case 'crops': return <CropAdvisoryPage />;
      case 'irrigation': return <IrrigationPage />;
      case 'fertilizer': return <FertilizerPage />;
      case 'alerts': return <AlertsPage />;
      case 'settings': return <SettingsPage />;
      case 'farm': return <FarmDetailsPage />;
      default: return <DashboardPage onNavigate={navigate} />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-dvh" style={{ background: 'var(--bg-base)' }}>
        <Sidebar currentPage={page} onNavigate={navigate} />
        <div className="lg:ml-[260px] min-h-dvh flex flex-col">
          <Header title={meta.title} subtitle={meta.subtitle} onNavigate={navigate} />
          <main key={transitionKey} className="flex-1 anim-fade-up">
            <ErrorBoundary>
              <PageContent />
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <DataProvider>
              <Shell />
            </DataProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
