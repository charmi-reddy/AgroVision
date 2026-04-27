import { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Navigation, Crosshair, Loader2 } from 'lucide-react';

interface Props {
  lat: number;
  lon: number;
  onLocationChange: (lat: number, lon: number, locationName: string) => void;
}

const REVERSE_GEO_URL = 'https://nominatim.openstreetmap.org/reverse';

// We'll use a canvas-based map preview since we can't embed Leaflet without npm
// But we CAN embed a static map iframe from OpenStreetMap
function buildMapUrl(lat: number, lon: number): string {
  return `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.02},${lat - 0.02},${lon + 0.02},${lat + 0.02}&layer=mapnik&marker=${lat},${lon}`;
}

export default function MapPicker({ lat, lon, onLocationChange }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLat, setCurrentLat] = useState(lat);
  const [currentLon, setCurrentLon] = useState(lon);
  const [locationName, setLocationName] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const mapKey = useRef(0);

  // Reverse geocode on lat/lon change
  useEffect(() => {
    const fetchName = async () => {
      try {
        const res = await fetch(`${REVERSE_GEO_URL}?format=json&lat=${currentLat}&lon=${currentLon}&zoom=10`);
        const data = await res.json();
        const name = data.display_name?.split(',')?.slice(0, 3)?.join(', ') || `${currentLat.toFixed(4)}, ${currentLon.toFixed(4)}`;
        setLocationName(name);
        onLocationChange(currentLat, currentLon, name);
      } catch {
        const name = `${currentLat.toFixed(4)}, ${currentLon.toFixed(4)}`;
        setLocationName(name);
        onLocationChange(currentLat, currentLon, name);
      }
    };
    fetchName();
  }, [currentLat, currentLon]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`);
      const data = await res.json();
      if (data.length > 0) {
        setCurrentLat(parseFloat(data[0].lat));
        setCurrentLon(parseFloat(data[0].lon));
        mapKey.current += 1;
      }
    } catch {}
    setIsSearching(false);
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrentLat(pos.coords.latitude);
        setCurrentLon(pos.coords.longitude);
        mapKey.current += 1;
        setIsLocating(false);
      },
      () => setIsLocating(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="space-y-3">
      <label className="text-[10px] font-bold uppercase tracking-wider mono" style={{ color: 'var(--text-tertiary)' }}>
        Farm Location <span className="text-red-400">*</span>
      </label>

      {/* Search + Current Location */}
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 px-3.5 py-[9px] rounded-xl"
          style={{ background: 'var(--bg-sunken)', border: '1px solid var(--border)' }}>
          <Search className="w-3.5 h-3.5" style={{ color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search village, city, district..."
            className="bg-transparent outline-none text-[13px] w-full"
            style={{ color: 'var(--text-primary)' }}
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="btn-primary !py-[9px] !px-3 !rounded-xl disabled:opacity-60"
        >
          {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={handleCurrentLocation}
          disabled={isLocating}
          className="btn-icon !w-[38px] !h-[38px]"
          title="Use my current location"
        >
          {isLocating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Crosshair className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Coordinate inputs */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[8px] font-bold uppercase tracking-wider mono" style={{ color: 'var(--text-tertiary)' }}>Latitude</label>
          <input
            type="number"
            step="0.0001"
            value={currentLat}
            onChange={e => { setCurrentLat(parseFloat(e.target.value) || 0); mapKey.current += 1; }}
            className="input-base mt-1 !py-[7px] !text-[12px]"
          />
        </div>
        <div>
          <label className="text-[8px] font-bold uppercase tracking-wider mono" style={{ color: 'var(--text-tertiary)' }}>Longitude</label>
          <input
            type="number"
            step="0.0001"
            value={currentLon}
            onChange={e => { setCurrentLon(parseFloat(e.target.value) || 0); mapKey.current += 1; }}
            className="input-base mt-1 !py-[7px] !text-[12px]"
          />
        </div>
      </div>

      {/* Map iframe */}
      <div className="rounded-2xl overflow-hidden relative group" style={{ border: '1px solid var(--border)' }}>
        <iframe
          key={mapKey.current}
          ref={iframeRef}
          title="Farm Location Map"
          src={buildMapUrl(currentLat, currentLon)}
          width="100%"
          height="220"
          className="block w-full"
          style={{ border: 0, filter: 'brightness(0.95)' }}
          loading="lazy"
          allowFullScreen
        />
        {/* Map pin overlay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
          <div className="relative">
            <MapPin className="w-8 h-8" style={{ color: 'var(--accent)' }} fill="white" strokeWidth={2} />
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
          </div>
        </div>
        {/* Location name badge */}
        {locationName && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl text-[10px] font-semibold whitespace-nowrap z-10 pointer-events-none"
            style={{ background: 'var(--bg-glass-strong)', border: '1px solid var(--border)', color: 'var(--text-primary)', backdropFilter: 'blur(8px)' }}>
            <MapPin className="w-2.5 h-2.5 inline mr-1" style={{ color: 'var(--accent)' }} />
            {locationName}
          </div>
        )}
        {/* Click hint */}
        <div className="absolute top-2 right-2 px-2 py-1 rounded-lg text-[8px] font-bold z-10 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)' }}>
          Drag to reposition · Click pin to center
        </div>
      </div>

      {/* Quick location suggestions */}
      <div className="flex flex-wrap gap-1.5">
        <span className="text-[9px] font-bold uppercase mono" style={{ color: 'var(--text-tertiary)' }}>Quick:</span>
        {[
          { name: 'Punjab', lat: 31.1471, lon: 75.3412 },
          { name: 'Maharashtra', lat: 19.7515, lon: 75.7139 },
          { name: 'Uttar Pradesh', lat: 26.8467, lon: 80.9462 },
          { name: 'Gujarat', lat: 22.2587, lon: 71.1924 },
          { name: 'Tamil Nadu', lat: 11.1271, lon: 78.6569 },
        ].map((loc) => (
          <button
            key={loc.name}
            onClick={() => { setCurrentLat(loc.lat); setCurrentLon(loc.lon); mapKey.current += 1; }}
            className="px-2.5 py-1 rounded-lg text-[10px] font-semibold cursor-pointer transition-all"
            style={{ background: 'var(--bg-sunken)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
          >
            {loc.name}
          </button>
        ))}
      </div>
    </div>
  );
}
