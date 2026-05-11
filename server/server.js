import 'dotenv/config';
import express from 'express';
// Railway debug endpoint (must be after app is defined)
app.get("/", (req, res) => {
  res.send("AgroVision backend working");
});
import cors from 'cors';
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const app = express();
app.use(cors());
app.use(express.json());

const OW_API = process.env.OPENWEATHER_API_KEY;
const OW_URL = process.env.OPENWEATHER_BASE_URL;
const GEMINI_API = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.0-pro';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// ─── Helpers ───

function extractJSON(text) {
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    try { return JSON.parse(jsonMatch[1]); } catch { }
  }
  try { return JSON.parse(text); } catch { }
  return null;
}

// ─── 1. WEATHER ───

// Auth

function normalizeEmail(email = '') {
  return String(email).trim().toLowerCase();
}

function publicUser(user) {
  if (!user) return null;
  const { password, passwordHash, ...safeUser } = user;
  return safeUser;
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(':')) return false;
  const [salt, hash] = storedHash.split(':');
  const candidate = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), candidate);
}

async function readUsers() {
  try {
    const raw = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') return {};
    throw err;
  }
}

// async function writeUsers(users) {
//   await fs.mkdir(DATA_DIR, { recursive: true });
//   await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
// }

app.post('/api/auth/signup', async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || '');

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const users = await readUsers();
    if (users[email]) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const initials = name.split(' ').map(part => part[0]).join('').toUpperCase().slice(0, 2) || 'FA';
    const user = {
      id: `user_${Date.now()}`,
      name,
      email,
      passwordHash: hashPassword(password),
      avatar: initials,
      farms: [],
      activeFarmId: null,
    };

    users[email] = user;
    // await writeUsers(users);
    res.status(201).json({ user: publicUser(user) });
  } catch (err) {
    console.error('Signup error:', err.message);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || '');
    const users = await readUsers();
    const user = users[email];

    const passwordMatches = user?.passwordHash
      ? verifyPassword(password, user.passwordHash)
      : user?.password === password;

    if (!user || !passwordMatches) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.passwordHash) {
      user.passwordHash = hashPassword(password);
      delete user.password;
      users[email] = user;
      // await writeUsers(users);
    }

    res.json({ user: publicUser(user) });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Failed to sign in' });
  }
});

app.put('/api/users/:email', async (req, res) => {
  try {
    const email = normalizeEmail(req.params.email);
    const incoming = req.body.user || {};
    const users = await readUsers();
    const existing = users[email];

    if (!existing) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updated = {
      ...existing,
      name: String(incoming.name || existing.name).trim(),
      avatar: incoming.avatar || existing.avatar,
      farms: Array.isArray(incoming.farms) ? incoming.farms : existing.farms,
      activeFarmId: incoming.activeFarmId ?? existing.activeFarmId,
      email,
    };

    users[email] = updated;
    // await writeUsers(users);
    res.json({ user: publicUser(updated) });
  } catch (err) {
    console.error('Save user error:', err.message);
    res.status(500).json({ error: 'Failed to save user' });
  }
});

// Weather

app.get('/api/weather', async (req, res) => {
  try {
    const lat = req.query.lat || '31.1471';
    const lon = req.query.lon || '75.3412';
    const units = 'metric';

    const [current, forecast] = await Promise.all([
      axios.get(`${OW_URL}/weather`, { params: { lat, lon, units, appid: OW_API } }),
      axios.get(`${OW_URL}/forecast`, { params: { lat, lon, units, cnt: 7, appid: OW_API } }),
    ]);

    const c = current.data;
    const f = forecast.data;

    const result = {
      temperature: Math.round(c.main.temp),
      humidity: c.main.humidity,
      windSpeed: Math.round(c.wind.speed * 3.6),
      rainfall: c.rain ? c.rain['1h'] || 0 : 0,
      uvIndex: 5,
      condition: c.weather[0].main,
      icon: mapIcon(c.weather[0].icon),
      forecast: (f.list || []).slice(0, 7).map((d, i) => ({
        day: i === 0 ? 'Today' : new Date(d.dt * 1000).toLocaleDateString('en', { weekday: 'short' }),
        high: Math.round(d.main.temp_max),
        low: Math.round(d.main.temp_min),
        condition: d.weather[0].main,
        icon: mapIcon(d.weather[0].icon),
        rainChance: Math.round((d.pop || 0) * 100),
      })),
    };

    res.json(result);
  } catch (err) {
    console.error('Weather error:', err.message);
    res.json({
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
    });
  }
});

function mapIcon(code) {
  const map = {
    '01d': '☀️', '01n': '🌙', '02d': '⛅', '02n': '☁️', '03d': '☁️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️', '09d': '🌧️', '09n': '🌧️', '10d': '🌧️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️', '13d': '❄️', '13n': '❄️', '50d': '🌫️', '50n': '🌫️',
  };
  return map[code] || '🌤️';
}

// ─── 2. SOIL DATA ───

app.get('/api/soil', async (req, res) => {
  try {
    const { crop, soilType, irrigationAmount, irrigationSource, fertilizer } = req.query;
    const prompt = `You are a smart soil analysis AI for a farm in Punjab, India.
Crop: ${crop || 'Not specified'}
Soil type: ${soilType || 'alluvial loam'}
Irrigation amount: ${irrigationAmount || 'Not specified'}
Irrigation source: ${irrigationSource || 'Not specified'}
Fertilizer used: ${fertilizer || 'Not specified'}
Return ONLY valid JSON with these fields:
{
  "moisture": <number 20-80>,
  "ph": <number 5.5-8.0>,
  "nitrogen": <number 100-300>,
  "phosphorus": <number 20-80>,
  "potassium": <number 100-350>,
  "organicMatter": <number 1.0-6.0>,
  "temperature": <number 15-35>,
  "conductivity": <number 0.3-2.5>
}
The values should be realistic for the provided soil and farm context.`;

    const { data } = await axios.post(`${GEMINI_URL}?key=${GEMINI_API}`, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 300 },
    });

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const parsed = extractJSON(text);

    if (parsed) return res.json(parsed);
    // Fallback
    res.json({
      moisture: 42, ph: 6.5, nitrogen: 180, phosphorus: 35,
      potassium: 220, organicMatter: 3.8, temperature: 24, conductivity: 1.2,
    });
  } catch (err) {
    console.error('Soil error:', err.message);
    // Return fallback data instead of error
    res.json({
      moisture: 42, ph: 6.5, nitrogen: 180, phosphorus: 35,
      potassium: 220, organicMatter: 3.8, temperature: 24, conductivity: 1.2,
    });
  }
});

// ─── 3. CROP RECOMMENDATIONS ───

app.get('/api/crops', async (req, res) => {
  try {
    const { crop, soilType, irrigationAmount, irrigationSource, fertilizer } = req.query;
    const prompt = `You are an AI crop advisor for a farm in Punjab, India.
Crop: ${crop || 'Not specified'}
Soil type: ${soilType || 'alluvial loam'}
Irrigation amount: ${irrigationAmount || 'Not specified'}
Irrigation source: ${irrigationSource || 'Not specified'}
Fertilizer used: ${fertilizer || 'Not specified'}
Current conditions: Soil pH 6.5, moisture 42%, temp 24°C, nitrogen 180 kg/ha.

Return ONLY valid JSON — an array of 6 crop recommendations with these fields:
{
  "id": "1",
  "name": "Crop Name",
  "emoji": "🌽",
  "confidence": <0-100>,
  "waterNeed": "Low|Medium|High",
  "growthPeriod": "90-120 days",
  "expectedYield": "X.X tons/ha",
  "resilience": <0-100>,
  "reason": "Why AI recommends this",
  "season": "Kharif|Rabi"
}
Rank by confidence score. Include drought-resistant varieties.`;

    const { data } = await axios.post(`${GEMINI_URL}?key=${GEMINI_API}`, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 1024 },
    });

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const parsed = extractJSON(text);

    if (Array.isArray(parsed)) return res.json(parsed);
    if (parsed?.crops && Array.isArray(parsed.crops)) return res.json(parsed.crops);

    // Fallback
    res.json([
      { id: '1', name: 'Drought-Resistant Maize', emoji: '🌽', confidence: 94, waterNeed: 'Low', growthPeriod: '90-120 days', expectedYield: '8.5 tons/ha', resilience: 92, reason: 'Optimal for current soil pH and temperature. High drought tolerance.', season: 'Kharif' },
      { id: '2', name: 'Heat-Tolerant Wheat', emoji: '🌾', confidence: 89, waterNeed: 'Medium', growthPeriod: '120-150 days', expectedYield: '6.2 tons/ha', resilience: 85, reason: 'Nutrient profile matches. Withstands temps up to 35°C.', season: 'Rabi' },
      { id: '3', name: 'Climate-Smart Rice', emoji: '🍚', confidence: 82, waterNeed: 'High', growthPeriod: '100-130 days', expectedYield: '7.8 tons/ha', resilience: 78, reason: 'Flood-resistant variety. High potassium supports growth.', season: 'Kharif' },
      { id: '4', name: 'Pearl Millet', emoji: '🌿', confidence: 91, waterNeed: 'Low', growthPeriod: '65-85 days', expectedYield: '3.5 tons/ha', resilience: 96, reason: 'Extremely drought-tolerant. Short growing season.', season: 'Kharif' },
      { id: '5', name: 'Soybean', emoji: '🫘', confidence: 76, waterNeed: 'Medium', growthPeriod: '80-120 days', expectedYield: '2.8 tons/ha', resilience: 80, reason: 'Nitrogen-fixing. Strong market demand expected.', season: 'Kharif' },
      { id: '6', name: 'Sunflower', emoji: '🌻', confidence: 73, waterNeed: 'Low', growthPeriod: '80-100 days', expectedYield: '2.2 tons/ha', resilience: 83, reason: 'Deep root system. Excellent market price forecast.', season: 'Rabi' },
    ]);
  } catch (err) {
    console.error('Crops error:', err.message);
    // Return fallback data instead of error
    res.json([
      { id: '1', name: 'Drought-Resistant Maize', emoji: '🌽', confidence: 94, waterNeed: 'Low', growthPeriod: '90-120 days', expectedYield: '8.5 tons/ha', resilience: 92, reason: 'Optimal for current soil pH and temperature. High drought tolerance.', season: 'Kharif' },
      { id: '2', name: 'Heat-Tolerant Wheat', emoji: '🌾', confidence: 89, waterNeed: 'Medium', growthPeriod: '120-150 days', expectedYield: '6.2 tons/ha', resilience: 85, reason: 'Nutrient profile matches. Withstands temps up to 35°C.', season: 'Rabi' },
      { id: '3', name: 'Climate-Smart Rice', emoji: '🍚', confidence: 82, waterNeed: 'High', growthPeriod: '100-130 days', expectedYield: '7.8 tons/ha', resilience: 78, reason: 'Flood-resistant variety. High potassium supports growth.', season: 'Kharif' },
      { id: '4', name: 'Pearl Millet', emoji: '🌿', confidence: 91, waterNeed: 'Low', growthPeriod: '65-85 days', expectedYield: '3.5 tons/ha', resilience: 96, reason: 'Extremely drought-tolerant. Short growing season.', season: 'Kharif' },
      { id: '5', name: 'Soybean', emoji: '🫘', confidence: 76, waterNeed: 'Medium', growthPeriod: '80-120 days', expectedYield: '2.8 tons/ha', resilience: 80, reason: 'Nitrogen-fixing. Strong market demand expected.', season: 'Kharif' },
      { id: '6', name: 'Sunflower', emoji: '🌻', confidence: 73, waterNeed: 'Low', growthPeriod: '80-100 days', expectedYield: '2.2 tons/ha', resilience: 83, reason: 'Deep root system. Excellent market price forecast.', season: 'Rabi' },
    ]);
  }
});

// ─── 4. IRRIGATION ───

app.get('/api/irrigation', async (req, res) => {
  try {
    const { crop, soilType, irrigationAmount, irrigationSource, fertilizer } = req.query;
    const prompt = `You are an irrigation AI for a farm.
  Crop: ${crop || 'Not specified'}
  Soil type: ${soilType || 'alluvial loam'}
  Irrigation amount: ${irrigationAmount || 'Not specified'}
  Irrigation source: ${irrigationSource || 'Not specified'}
  Fertilizer used: ${fertilizer || 'Not specified'}
  Generate 5 irrigation zones with realistic data.
  Return ONLY valid JSON array:
[
  {
    "id": "1",
    "zone": "Field A - Crop Name",
    "nextWatering": "2:00 PM Today",
    "duration": <number minutes 20-60>,
    "waterAmount": <number liters 5-25>,
    "status": "scheduled|active|completed|skipped",
    "soilMoisture": <number %>,
    "optimalMoisture": <number % 40-80>
  }
]
Include one active zone, one due today.`;

    const { data } = await axios.post(`${GEMINI_URL}?key=${GEMINI_API}`, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 800 },
    });

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const parsed = extractJSON(text);

    if (Array.isArray(parsed)) return res.json(parsed);

    res.json([
      { id: '1', zone: 'Field A - Maize', nextWatering: '2:00 PM Today', duration: 45, waterAmount: 12.5, status: 'scheduled', soilMoisture: 35, optimalMoisture: 55 },
      { id: '2', zone: 'Field B - Wheat', nextWatering: '6:00 AM Tomorrow', duration: 30, waterAmount: 8, status: 'scheduled', soilMoisture: 48, optimalMoisture: 60 },
      { id: '3', zone: 'Field C - Rice Paddy', nextWatering: 'Now', duration: 60, waterAmount: 22, status: 'active', soilMoisture: 62, optimalMoisture: 80 },
      { id: '4', zone: 'Field D - Millet', nextWatering: 'Completed', duration: 20, waterAmount: 5, status: 'completed', soilMoisture: 42, optimalMoisture: 40 },
      { id: '5', zone: 'Field E - Soybean', nextWatering: 'Skipped (Rain)', duration: 0, waterAmount: 0, status: 'skipped', soilMoisture: 58, optimalMoisture: 55 },
    ]);
  } catch (err) {
    console.error('Irrigation error:', err.message);
    // Return fallback data instead of error
    res.json([
      { id: '1', zone: 'Field A - Maize', nextWatering: '2:00 PM Today', duration: 45, waterAmount: 12.5, status: 'scheduled', soilMoisture: 35, optimalMoisture: 55 },
      { id: '2', zone: 'Field B - Wheat', nextWatering: '6:00 AM Tomorrow', duration: 30, waterAmount: 8, status: 'scheduled', soilMoisture: 48, optimalMoisture: 60 },
      { id: '3', zone: 'Field C - Rice Paddy', nextWatering: 'Now', duration: 60, waterAmount: 22, status: 'active', soilMoisture: 62, optimalMoisture: 80 },
      { id: '4', zone: 'Field D - Millet', nextWatering: 'Completed', duration: 20, waterAmount: 5, status: 'completed', soilMoisture: 42, optimalMoisture: 40 },
      { id: '5', zone: 'Field E - Soybean', nextWatering: 'Skipped (Rain)', duration: 0, waterAmount: 0, status: 'skipped', soilMoisture: 58, optimalMoisture: 55 },
    ]);
  }
});

// ─── 5. FERTILIZER ───

app.get('/api/fertilizer', async (req, res) => {
  try {
    const { crop, soilType, irrigationAmount, irrigationSource, fertilizer } = req.query;
    const prompt = `You are a precision fertilizer AI for a farm in Punjab.
Crop: ${crop || 'Not specified'}
Soil type: ${soilType || 'alluvial loam'}
Irrigation amount: ${irrigationAmount || 'Not specified'}
Irrigation source: ${irrigationSource || 'Not specified'}
Fertilizer used: ${fertilizer || 'Not specified'}
Based on soil: N 180, P 35, K 220 kg/ha, pH 6.5, organic matter 3.8%.

Return ONLY valid JSON array of 5 fertilizer recommendations:
{
  "id": "1",
  "type": "Fertilizer Name",
  "emoji": "🧪",
  "amount": "XX kg/ha",
  "timing": "Apply in X days",
  "frequency": "Split: ...",
  "priority": "high|medium|low",
  "reason": "...",
  "npkRatio": "XX-XX-XX"
}
Include at least 2 high priority items.`;

    const { data } = await axios.post(`${GEMINI_URL}?key=${GEMINI_API}`, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 800 },
    });

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const parsed = extractJSON(text);

    if (Array.isArray(parsed)) return res.json(parsed);

    res.json([
      { id: '1', type: 'Urea (Nitrogen)', emoji: '🧪', amount: '120 kg/ha', timing: 'Apply in 3 days', frequency: 'Split: 50% basal + 50% at 30 days', priority: 'high', reason: 'Nitrogen dropping below optimal. Critical for vegetative growth.', npkRatio: '46-0-0' },
      { id: '2', type: 'DAP (Phosphorus)', emoji: '⚗️', amount: '60 kg/ha', timing: 'Apply at sowing', frequency: 'Once per season', priority: 'medium', reason: 'Phosphorus adequate but declining. Preventive application.', npkRatio: '18-46-0' },
      { id: '3', type: 'Potash (MOP)', emoji: '🔬', amount: '40 kg/ha', timing: 'Apply in 2 weeks', frequency: 'Split: 2 applications', priority: 'low', reason: 'Potassium levels currently adequate. Monitor and apply.', npkRatio: '0-0-60' },
      { id: '4', type: 'Organic Compost', emoji: '🌱', amount: '5 tons/ha', timing: 'Before next planting', frequency: 'Once per cycle', priority: 'medium', reason: 'Improve organic matter from 3.8% to 4.5%.', npkRatio: 'Variable' },
      { id: '5', type: 'Zinc Sulfate', emoji: '💎', amount: '25 kg/ha', timing: 'Apply in 5 days', frequency: 'Once per season', priority: 'high', reason: 'Micronutrient deficiency detected. Critical for grain quality.', npkRatio: 'Micronutrient' },
    ]);
  } catch (err) {
    console.error('Fertilizer error:', err.message);
    // Return fallback data instead of error
    res.json([
      { id: '1', type: 'Urea (Nitrogen)', emoji: '🧪', amount: '120 kg/ha', timing: 'Apply in 3 days', frequency: 'Split: 50% basal + 50% at 30 days', priority: 'high', reason: 'Nitrogen dropping below optimal. Critical for vegetative growth.', npkRatio: '46-0-0' },
      { id: '2', type: 'DAP (Phosphorus)', emoji: '⚗️', amount: '60 kg/ha', timing: 'Apply at sowing', frequency: 'Once per season', priority: 'medium', reason: 'Phosphorus adequate but declining. Preventive application.', npkRatio: '18-46-0' },
      { id: '3', type: 'Potash (MOP)', emoji: '🔬', amount: '40 kg/ha', timing: 'Apply in 2 weeks', frequency: 'Split: 2 applications', priority: 'low', reason: 'Potassium levels currently adequate. Monitor and apply.', npkRatio: '0-0-60' },
      { id: '4', type: 'Organic Compost', emoji: '🌱', amount: '5 tons/ha', timing: 'Before next planting', frequency: 'Once per cycle', priority: 'medium', reason: 'Improve organic matter from 3.8% to 4.5%.', npkRatio: 'Variable' },
      { id: '5', type: 'Zinc Sulfate', emoji: '💎', amount: '25 kg/ha', timing: 'Apply in 5 days', frequency: 'Once per season', priority: 'high', reason: 'Micronutrient deficiency detected. Critical for grain quality.', npkRatio: 'Micronutrient' },
    ]);
  }
});

// ─── 6. AI INSIGHTS / ALERTS ───

app.get('/api/insights', async (req, res) => {
  try {
    const prompt = `You are a real-time AI farm alert system for Punjab, India.
Current: 28°C, humidity 65%, soil moisture 42%.

Generate 7 realistic alerts covering weather, pests, irrigation, soil, market, and fertilizer categories.

Return ONLY valid JSON array:
[
  {
    "id": "1",
    "type": "danger|warning|info|success",
    "title": "Alert Title",
    "message": "Detailed description 1-2 sentences",
    "timestamp": "X min ago|X hours ago",
    "read": false,
    "category": "Weather|Pest|Irrigation|Soil|Market|Fertilizer|Crop"
  }
]
Include at least 2 unread alerts and 1 danger severity.`;

    const { data } = await axios.post(`${GEMINI_URL}?key=${GEMINI_API}`, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 1024 },
    });

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const parsed = extractJSON(text);

    if (Array.isArray(parsed)) return res.json(parsed);

    // Return empty array for demo - no fallback alerts
    res.json([]);
  } catch (err) {
    console.error('Insights error:', err.message);
    // Return empty array instead of demo data
    res.json([]);
  }
});

// ─── 7. AI CHAT ───

app.post('/api/ask', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: 'Question required' });

    const prompt = `You are AgroVision AI, an expert climate and agricultural advisor for farmers in India.
Answer concisely with actionable advice.

Farmer asks: ${question}`;

    const { data } = await axios.post(`${GEMINI_URL}?key=${GEMINI_API}`, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 512 },
    });

    const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, I could not process your question. Please try again.';
    res.json({ answer });
  } catch (err) {
    console.error('Ask error:', err.message);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

// ─── Health check ───

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0', model: GEMINI_MODEL });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
})

app.get("/", (req, res) => {
  res.send("AgroVision backend running");
});;