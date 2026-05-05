const API_BASE = 'http://localhost:5000/api';

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(err.error || `API error: ${res.status}`);
  }
  return res.json();
}

function fallbackWeather(): WeatherData {
  return {
    temperature: 28,
    humidity: 65,
    windSpeed: 11,
    rainfall: 0,
    uvIndex: 5,
    condition: 'Clear',
    icon: '☀️',
    forecast: [
      { day: 'Today', high: 31, low: 21, condition: 'Clear', icon: '☀️', rainChance: 5 },
      { day: 'Wed', high: 32, low: 22, condition: 'Clouds', icon: '⛅', rainChance: 12 },
      { day: 'Thu', high: 30, low: 21, condition: 'Clear', icon: '☀️', rainChance: 8 },
      { day: 'Fri', high: 29, low: 20, condition: 'Rain', icon: '🌧️', rainChance: 42 },
      { day: 'Sat', high: 30, low: 21, condition: 'Clouds', icon: '☁️', rainChance: 18 },
      { day: 'Sun', high: 31, low: 22, condition: 'Clear', icon: '☀️', rainChance: 10 },
      { day: 'Mon', high: 32, low: 23, condition: 'Clear', icon: '☀️', rainChance: 6 },
    ],
  };
}

function fallbackSoil(): SoilData {
  return {
    moisture: 42,
    ph: 6.5,
    nitrogen: 180,
    phosphorus: 35,
    potassium: 220,
    organicMatter: 3.8,
    temperature: 24,
    conductivity: 1.2,
  };
}

function fallbackCrops(crop?: string): CropRecommendation[] {
  const selected = crop?.trim() || 'Maize';
  return [
    { id: '1', name: selected, emoji: '🌾', confidence: 94, waterNeed: 'Medium', growthPeriod: '90-120 days', expectedYield: '6.8 tons/ha', resilience: 88, reason: 'Matches current soil and irrigation profile.', season: 'Rabi' },
    { id: '2', name: 'Pearl Millet', emoji: '🌿', confidence: 91, waterNeed: 'Low', growthPeriod: '65-85 days', expectedYield: '3.5 tons/ha', resilience: 96, reason: 'Strong drought tolerance and short growing season.', season: 'Kharif' },
    { id: '3', name: 'Drought-Resistant Maize', emoji: '🌽', confidence: 89, waterNeed: 'Medium', growthPeriod: '90-120 days', expectedYield: '8.1 tons/ha', resilience: 90, reason: 'Good fit for loamy soils and moderate water availability.', season: 'Kharif' },
  ];
}

function fallbackIrrigation(crop?: string): IrrigationZone[] {
  const selected = crop?.trim() || 'Crop';
  return [
    { id: '1', zone: `Field A - ${selected}`, nextWatering: '2:00 PM Today', duration: 45, waterAmount: 12.5, status: 'scheduled', soilMoisture: 35, optimalMoisture: 55 },
    { id: '2', zone: 'Field B', nextWatering: '6:00 AM Tomorrow', duration: 30, waterAmount: 8, status: 'scheduled', soilMoisture: 48, optimalMoisture: 60 },
    { id: '3', zone: 'Field C', nextWatering: 'Now', duration: 25, waterAmount: 10, status: 'active', soilMoisture: 38, optimalMoisture: 52 },
  ];
}

function fallbackFertilizer(): FertilizerRecommendation[] {
  return [
    { id: '1', type: 'Urea', emoji: '🧪', amount: '120 kg/ha', timing: 'Apply in 3 days', frequency: 'Split into 2 applications', priority: 'high', reason: 'Nitrogen support is recommended for vegetative growth.', npkRatio: '46-0-0' },
    { id: '2', type: 'DAP', emoji: '⚗️', amount: '60 kg/ha', timing: 'Apply at sowing', frequency: 'Once per season', priority: 'medium', reason: 'Maintains phosphorus availability for root growth.', npkRatio: '18-46-0' },
    { id: '3', type: 'Organic Compost', emoji: '🌱', amount: '5 tons/ha', timing: 'Before next planting', frequency: 'Once per cycle', priority: 'medium', reason: 'Improves organic matter and soil structure.', npkRatio: 'Variable' },
  ];
}

function fallbackAlerts(): Alert[] {
  return [
    { id: '1', type: 'info', title: 'Analysis completed', message: 'Your farm profile has been analyzed using available local recommendations.', timestamp: 'Just now', read: false, category: 'Farm' },
    { id: '2', type: 'warning', title: 'Monitor soil moisture', message: 'Moisture is moderate. Check irrigation timing if temperatures rise.', timestamp: 'Just now', read: false, category: 'Irrigation' },
  ];
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  rainfall: number;
  uvIndex: number;
  condition: string;
  icon: string;
  forecast: ForecastDay[];
}

export interface ForecastDay {
  day: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
  rainChance: number;
}

export interface SoilData {
  moisture: number;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicMatter: number;
  temperature: number;
  conductivity: number;
}

export interface CropRecommendation {
  id: string;
  name: string;
  emoji: string;
  confidence: number;
  waterNeed: 'Low' | 'Medium' | 'High';
  growthPeriod: string;
  expectedYield: string;
  resilience: number;
  reason: string;
  season: string;
}

export interface IrrigationZone {
  id: string;
  zone: string;
  nextWatering: string;
  duration: number;
  waterAmount: number;
  status: 'scheduled' | 'active' | 'completed' | 'skipped';
  soilMoisture: number;
  optimalMoisture: number;
}

export interface FertilizerRecommendation {
  id: string;
  type: string;
  emoji: string;
  amount: string;
  timing: string;
  frequency: string;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  npkRatio: string;
}

export interface Alert {
  id: string;
  type: 'warning' | 'danger' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  category: string;
}

// ─── API Calls ───

export async function fetchWeather(lat?: string, lon?: string): Promise<WeatherData> {
  const params = new URLSearchParams();
  if (lat) params.set('lat', lat);
  if (lon) params.set('lon', lon);
  return fetchJSON<WeatherData>(`${API_BASE}/weather?${params}`).catch(() => fallbackWeather());
}


export async function fetchSoil(paramsObj?: Record<string, string>): Promise<SoilData> {
  const params = new URLSearchParams(paramsObj || {});
  return fetchJSON<SoilData>(`${API_BASE}/soil?${params}`).catch(() => fallbackSoil());
}

export async function fetchCrops(paramsObj?: Record<string, string>): Promise<CropRecommendation[]> {
  const params = new URLSearchParams(paramsObj || {});
  return fetchJSON<CropRecommendation[]>(`${API_BASE}/crops?${params}`).catch(() => fallbackCrops(paramsObj?.crop));
}

export async function fetchIrrigation(paramsObj?: Record<string, string>): Promise<IrrigationZone[]> {
  const params = new URLSearchParams(paramsObj || {});
  return fetchJSON<IrrigationZone[]>(`${API_BASE}/irrigation?${params}`).catch(() => fallbackIrrigation(paramsObj?.crop));
}

export async function fetchFertilizer(paramsObj?: Record<string, string>): Promise<FertilizerRecommendation[]> {
  const params = new URLSearchParams(paramsObj || {});
  return fetchJSON<FertilizerRecommendation[]>(`${API_BASE}/fertilizer?${params}`).catch(() => fallbackFertilizer());
}

export async function fetchInsights(): Promise<Alert[]> {
  return fetchJSON<Alert[]>(`${API_BASE}/insights`).catch(() => fallbackAlerts());
}

export interface AIAnswer {
  answer: string;
}

export async function askAI(question: string): Promise<AIAnswer> {
  const res = await fetch(`${API_BASE}/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  });
  if (!res.ok) throw new Error('Failed to get AI response');
  return res.json();
}

export async function checkHealth() {
  return fetchJSON(`${API_BASE}/health`);
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  farms: Array<Record<string, unknown>>;
  activeFarmId: string | null;
}

async function sendJSON<T>(url: string, body: unknown, method = 'POST'): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(err.error || `API error: ${res.status}`);
  }
  return res.json();
}

export async function apiLogin(email: string, password: string): Promise<AuthUser> {
  const result = await sendJSON<{ user: AuthUser }>(`${API_BASE}/auth/login`, { email, password });
  return result.user;
}

export async function apiSignup(data: { name: string; email: string; password: string }): Promise<AuthUser> {
  const result = await sendJSON<{ user: AuthUser }>(`${API_BASE}/auth/signup`, data);
  return result.user;
}

export async function apiSaveUser(user: AuthUser): Promise<AuthUser> {
  const result = await sendJSON<{ user: AuthUser }>(`${API_BASE}/users/${encodeURIComponent(user.email)}`, { user }, 'PUT');
  return result.user;
}
