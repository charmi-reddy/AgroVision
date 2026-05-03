import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import {
  fetchWeather, fetchSoil, fetchCrops, fetchIrrigation,
  fetchFertilizer, fetchInsights,
  type WeatherData, type SoilData, type CropRecommendation,
  type IrrigationZone, type FertilizerRecommendation, type Alert,
} from '../services/api';

interface DataCtx {
  weather: WeatherData | null;
  soil: SoilData | null;
  crops: CropRecommendation[];
  irrigation: IrrigationZone[];
  fertilizer: FertilizerRecommendation[];
  alerts: Alert[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  hasAnalyzedData: boolean;
}

const Ctx = createContext<DataCtx>({
  weather: null, soil: null, crops: [], irrigation: [],
  fertilizer: [], alerts: [], loading: false, error: null,
  refresh: async () => {}, hasAnalyzedData: false,
});

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [soil, setSoil] = useState<SoilData | null>(null);
  const [crops, setCrops] = useState<CropRecommendation[]>([]);
  const [irrigation, setIrrigation] = useState<IrrigationZone[]>([]);
  const [fertilizer, setFertilizer] = useState<FertilizerRecommendation[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAnalyzedData, setHasAnalyzedData] = useState(false);

  const load = useCallback(async () => {
    // Find active farm
    const activeFarm = user?.farms?.find(f => f.id === user.activeFarmId);
    if (!activeFarm) {
      setLoading(false);
      setWeather(null); setSoil(null); setCrops([]);
      setIrrigation([]); setFertilizer([]); setAlerts([]);
      setHasAnalyzedData(false);
      return;
    }

    // Check if farm has required data
    if (!activeFarm.name || !activeFarm.location || !activeFarm.soilType) {
      setLoading(false);
      setWeather(null); setSoil(null); setCrops([]);
      setIrrigation([]); setFertilizer([]); setAlerts([]);
      setHasAnalyzedData(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const lat = activeFarm.lat.toString();
      const lon = activeFarm.lon.toString();
      const farmParams = {
        crop: activeFarm.crop || '',
        soilType: activeFarm.soilType || '',
        irrigationAmount: activeFarm.irrigationAmount || '',
        irrigationSource: activeFarm.irrigationSource || '',
        fertilizer: activeFarm.fertilizer || '',
      };
      const [w, s, c, i, f, a] = await Promise.all([
        fetchWeather(lat, lon),
        fetchSoil(farmParams),
        fetchCrops(farmParams),
        fetchIrrigation(farmParams),
        fetchFertilizer(farmParams),
        fetchInsights(),
      ]);
      setWeather(w);
      setSoil(s);
      setCrops(c);
      setIrrigation(i);
      setFertilizer(f);
      setAlerts(a);
      setHasAnalyzedData(true);
    } catch (err: any) {
      setError(err.message || 'Failed to load farm data');
      console.error('Data load error:', err);
      setHasAnalyzedData(false);
    } finally {
      setLoading(false);
    }
  }, [user?.farms, user?.activeFarmId]);

  // Remove auto-loading - only load when explicitly called
  // useEffect(() => { load(); }, [load]);

  return (
    <Ctx.Provider value={{ weather, soil, crops, irrigation, fertilizer, alerts, loading, error, refresh: load, hasAnalyzedData }}>
      {children}
    </Ctx.Provider>
  );
}

export function useData() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useData must be inside DataProvider');
  return ctx;
}
