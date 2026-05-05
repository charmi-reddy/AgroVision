import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import MapPicker from '../components/MapPicker';
import { Save, MapPin, Play, CheckCircle2, HelpCircle, AlertCircle } from 'lucide-react';

export default function FarmDetailsPage() {
  const { user, updateFarm } = useAuth();
  const { refresh, hasAnalyzedData, error: analysisError } = useData();
  const [saved, setSaved] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const activeFarm = user?.farms?.find(f => f.id === user.activeFarmId);
  const [name, setName] = useState(activeFarm?.name || '');
  const [location, setLocation] = useState(activeFarm?.location || '');
  const [lat, setLat] = useState(activeFarm?.lat || 31.1471);
  const [lon, setLon] = useState(activeFarm?.lon || 75.3412);
  const [soilType, setSoilType] = useState(activeFarm?.soilType || '');
  const [area, setArea] = useState(activeFarm?.area || 0);
  const [crop, setCrop] = useState(activeFarm?.crop || '');
  const [irrigationAmount, setIrrigationAmount] = useState(activeFarm?.irrigationAmount || '');
  const [irrigationSource, setIrrigationSource] = useState(activeFarm?.irrigationSource || '');
  const [fertilizer, setFertilizer] = useState(activeFarm?.fertilizer || '');

  useEffect(() => {
    if (activeFarm) {
      setName(activeFarm.name);
      setLocation(activeFarm.location);
      setLat(activeFarm.lat);
      setLon(activeFarm.lon);
      setSoilType(activeFarm.soilType || '');
      setArea(activeFarm.area || 0);
      setCrop(activeFarm.crop || '');
      setIrrigationAmount(activeFarm.irrigationAmount || '');
      setIrrigationSource(activeFarm.irrigationSource || '');
      setFertilizer(activeFarm.fertilizer || '');
    }
  }, [activeFarm]);

  const getCurrentFarm = () => {
    if (!activeFarm) return null;
    return {
      ...activeFarm,
      name: name.trim(),
      location: location.trim(),
      lat,
      lon,
      soilType,
      area,
      crop: crop.trim(),
      irrigationAmount: irrigationAmount.trim(),
      irrigationSource: irrigationSource.trim(),
      fertilizer: fertilizer.trim(),
    };
  };

  const handleSave = () => {
    if (!activeFarm) return;
    const farm = getCurrentFarm();
    if (!farm) return;
    updateFarm(activeFarm.id, farm);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const isDataComplete = name.trim() && location.trim() && soilType && area > 0;
  // Add crop, irrigation, fertilizer as required fields
  const isFullDataComplete = isDataComplete && crop.trim() && irrigationAmount.trim() && irrigationSource.trim() && fertilizer.trim();

  const handleRunAnalysis = async () => {
    if (!isFullDataComplete) {
      alert('Please fill in all required fields marked with * before running analysis.');
      return;
    }

    setAnalyzing(true);
    try {
      const farm = getCurrentFarm();
      if (!farm || !activeFarm) return;
      updateFarm(activeFarm.id, farm);
      const analyzed = await refresh(farm);
      if (!analyzed) {
        alert(analysisError || 'Analysis could not run. Please make sure the API server is running and try again.');
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  if (!activeFarm) {
    return (
      <div className="p-6">
        <p className="text-center" style={{ color: 'var(--text-secondary)' }}>No active farm selected.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <MapPin className="w-6 h-6" style={{ color: 'var(--accent)' }} />
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Farm Details</h1>
        <button
          onClick={() => setShowGuide(!showGuide)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ml-auto"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
        >
          <HelpCircle className="w-4 h-4" />
          Guide
        </button>
      </div>

      {showGuide && (
        <div className="p-4 rounded-lg border" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)' }}>
          <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>📋 How to Get Farm Analysis</h3>
          <div className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <p><strong>Farm Name:</strong> Enter a descriptive name for your farm</p>
            <p><strong>Location:</strong> Use the map to select your exact farm location (coordinates will auto-fill)</p>
            <p><strong>Soil Type:</strong> Select the predominant soil type on your farm</p>
            <p><strong>Area:</strong> Enter your farm size in acres</p>
            <p className="mt-3 font-medium" style={{ color: 'var(--accent)' }}>
              💡 Once all fields are filled, click "Run Analysis" to get personalized weather, soil, crop, irrigation, and fertilizer recommendations!
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Basic Information</h2>
          <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                            Crop <span style={{ color: 'var(--danger)' }}>*</span>
                          </label>
                          <input
                            type="text"
                            value={crop}
                            onChange={e => setCrop(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border"
                            style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                            placeholder="e.g. Wheat, Rice, Maize"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                            Irrigation Amount (mm/season) <span style={{ color: 'var(--danger)' }}>*</span>
                          </label>
                          <input
                            type="number"
                            value={irrigationAmount}
                            onChange={e => setIrrigationAmount(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border"
                            style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                            placeholder="e.g. 1000"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                            Irrigation Source <span style={{ color: 'var(--danger)' }}>*</span>
                          </label>
                          <input
                            type="text"
                            value={irrigationSource}
                            onChange={e => setIrrigationSource(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border"
                            style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                            placeholder="e.g. Canal, Tube well"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                            Fertilizer Used <span style={{ color: 'var(--danger)' }}>*</span>
                          </label>
                          <input
                            type="text"
                            value={fertilizer}
                            onChange={e => setFertilizer(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border"
                            style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                            placeholder="e.g. Urea, DAP, Compost"
                          />
                        </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                Farm Name <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border"
                style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                placeholder="Enter farm name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                Location <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border"
                style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                placeholder="Select location on map"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                Soil Type <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border"
                style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              >
                <option value="">Select soil type *</option>
                <option value="Clay">Clay</option>
                <option value="Sandy">Sandy</option>
                <option value="Loamy">Loamy</option>
                <option value="Silt">Silt</option>
                <option value="Peat">Peat</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                Area (acres) <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                type="number"
                value={area}
                onChange={(e) => setArea(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border"
                style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                min="0"
                step="0.1"
                placeholder="Enter area in acres"
              />
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Location</h2>
          <MapPicker lat={lat} lon={lon} onLocationChange={(newLat, newLon, newLocation) => { setLat(newLat); setLon(newLon); setLocation(newLocation); }} />
          <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            Coordinates: {lat.toFixed(4)}, {lon.toFixed(4)}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
        {!isFullDataComplete && (
          <div className="flex items-center gap-2 p-3 rounded-lg flex-1" style={{ background: 'var(--warning-bg)', color: 'var(--warning-text)' }}>
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">Please fill in all required fields marked with * to enable analysis.</span>
          </div>
        )}
        <div className="flex gap-4 ml-auto">
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer"
            style={{ background: 'var(--accent)', color: 'white' }}
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
          <button
            type="button"
            onClick={handleRunAnalysis}
            disabled={analyzing}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          >
            <Play className="w-4 h-4" />
            {analyzing ? 'Running Analysis...' : hasAnalyzedData ? 'Re-run Analysis' : 'Run Analysis'}
          </button>
        </div>
      </div>

      {saved && (
        <div className="flex items-center gap-2 p-4 rounded-lg" style={{ background: 'var(--success-bg)', color: 'var(--success-text)' }}>
          <CheckCircle2 className="w-5 h-5" />
          Farm details saved successfully!
        </div>
      )}
    </div>
  );
}
