const API_BASE = 'http://localhost:5000/api';

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(err.error || `API error: ${res.status}`);
  }
  return res.json();
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
  return fetchJSON(`${API_BASE}/weather?${params}`);
}

export async function fetchSoil(): Promise<SoilData> {
  return fetchJSON(`${API_BASE}/soil`);
}

export async function fetchCrops(): Promise<CropRecommendation[]> {
  return fetchJSON(`${API_BASE}/crops`);
}

export async function fetchIrrigation(): Promise<IrrigationZone[]> {
  return fetchJSON(`${API_BASE}/irrigation`);
}

export async function fetchFertilizer(): Promise<FertilizerRecommendation[]> {
  return fetchJSON(`${API_BASE}/fertilizer`);
}

export async function fetchInsights(): Promise<Alert[]> {
  return fetchJSON(`${API_BASE}/insights`);
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
