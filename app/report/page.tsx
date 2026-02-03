'use client';

import { useEffect, useState } from 'react';
import imageCompression from 'browser-image-compression';
import Navbar from '../components/Navbar';

/* ---------- IMAGE COMPRESSION ---------- */
async function compressImage(file: File) {
  return await imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 1280,
    useWebWorker: true,
    initialQuality: 0.7,
    fileType: 'image/jpeg',
  });
}

/* ---------- CONSTANTS ---------- */
const MAX_SIZE_MB = 10;
const MAX_GPS_ACCURACY = 200; 

const IMPACT_LABELS: Record<string, { value: number; label: string }[]> = {
  flooding: [
    { value: 1, label: 'Water accumulation (Ankle deep)' },
    { value: 2, label: 'Flash flooding (Knee deep)' },
    { value: 3, label: 'Severe flooding (Property damage risk)' },
  ],
  drainage_blockage: [
    { value: 1, label: 'Minor debris / Partial blockage' },
    { value: 2, label: 'Full blockage / Stagnant water' },
    { value: 3, label: 'Drain overflow / Hazardous open drain' },
  ],
};

export default function ReportWaspIssuePage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [image, setImage] = useState<File | null>(null);
  const [autoLocation, setAutoLocation] = useState('Location not fetched');
  const [landmark, setLandmark] = useState('');

  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);

  const [issueType, setIssueType] = useState('flooding');
  const [impactLevel, setImpactLevel] = useState(2);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const locationResolved = lat !== null && lng !== null;

  /* ---------- GET LOCATION & REVERSE GEOCoding ---------- */
  const getLocation = () => {
    setError('');
    setAutoLocation('Fetching exact address...');

    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;
        setLat(latitude);
        setLng(longitude);
        setAccuracy(Math.round(pos.coords.accuracy));

        // Use the Google Maps API Key from your .env
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

        try {
          const res = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
          );
          const data = await res.json();

          if (data.status === 'OK' && data.results?.length > 0) {
            // Take the first formatted address returned by Google
            setAutoLocation(data.results[0].formatted_address);
          } else {
            setAutoLocation(`Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`);
          }
        } catch (err) {
          console.error("Geocoding error:", err);
          setAutoLocation("Address fetch failed (Check API Key)");
        }
      },
      (err) => {
        setError('Location permission denied. Please enable GPS.');
        setAutoLocation('Location not fetched');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  /* ---------- SUBMIT ---------- */
  const submitReport = async () => {
    setError('');
    if (!image) { setError('Please provide a photo of the issue'); return; }
    if (!locationResolved) { setError('Location is required for flood alerts'); return; }

    setLoading(true);
    setSuccess(false);

    const finalLocation = landmark.trim() ? `${landmark.trim()}, ${autoLocation}` : autoLocation;

    // Inside your submitReport function in page.tsx
    const formData = new FormData();
    formData.append('image', image);
    formData.append('location', autoLocation); // This is the address from Google
    formData.append('landmark', landmark.trim()); // Ensure this matches the API key
    formData.append('lat', String(lat));
    formData.append('lng', String(lng));
    formData.append('type', issueType === 'flooding' ? 'Flash Flood' : 'Drain Blockage');
    formData.append('impact_level', String(impactLevel));

    try {
  setLoading(true);
  setError(''); // Clear previous errors

  const res = await fetch('/api/report/create', {
    method: 'POST',
    body: formData,
  });

  // Parse the JSON body once
  const data = await res.json();

  /* --- 1. HANDLE DUPLICATES (409) --- */
  if (res.status === 409) {
    setError('Duplicate detected: This area is already under surveillance.');
    return;
  }

  /* --- 2. HANDLE AI REJECTION --- */
  if (data.status === 'rejected') {
    setError(`Verification Failed: ${data.message || 'The image does not show a flood.'}`);
    return;
  }

  /* --- 3. HANDLE OTHER ERRORS (500, etc) --- */
  if (!res.ok) {
    throw new Error(data.error || 'Network response was not ok');
  }

  /* --- 4. SUCCESS STATE --- */
  setSuccess(true);
  
  // LOG the AI reasoning to console (or you can set it to a state to show on screen)
  console.log("AI Verification Logic:", data.status);

  // Clear Form
  setImage(null);
  setLandmark('');
  setLat(null);
  setLng(null);
  setAutoLocation('Location not fetched');

} catch (err) {
  console.error("Submission Error:", err);
  setError(err instanceof Error ? err.message : 'Submission failed. Please try again.');
} finally {
  setLoading(false);
}
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#020817] text-white px-6 py-20">
      <Navbar />
      <div className="mx-auto max-w-xl bg-[#0f172a] p-8 rounded-2xl border border-slate-700 shadow-2xl">
        <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl font-bold">Report Issue</h1>
        </div>
        <p className="text-gray-400 text-sm mb-8">Reporting system for localized flood and drainage intelligence.</p>

        {success && (
          <div className="mb-6 rounded-lg bg-teal-500/10 border border-teal-500 p-4 text-sm text-teal-400 font-medium">
            ✅ Submission successful. Data sent to WASP Intelligence Dashboard.
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg bg-red-600/10 border border-red-600 p-4 text-sm text-red-400">
            ⚠️ {error}
          </div>
        )}

        {/* Image Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Evidence Photo</label>
          <div 
            onClick={() => document.getElementById('fileInput')?.click()}
            className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-teal-500 transition cursor-pointer bg-[#020817]"
          >
            {image ? (
                <img src={URL.createObjectURL(image)} className="max-h-48 mx-auto rounded-lg shadow-lg" />
            ) : (
                <div className="text-gray-500">
                    <span className="text-3xl block mb-2">📷</span>
                    <p className="text-xs font-medium">Capture flooding or drain blockage</p>
                </div>
            )}
          </div>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) setImage(await compressImage(file));
            }}
          />
        </div>

        {/* Issue Toggles */}
        <div className="grid grid-cols-2 gap-4 mb-6">
            <button 
                onClick={() => setIssueType('flooding')}
                className={`py-3 rounded-lg border font-bold transition-all ${issueType === 'flooding' ? 'border-teal-500 bg-teal-500/10 text-teal-400' : 'border-slate-700 bg-slate-800 text-gray-400'}`}
            >
                Flash Flood
            </button>
            <button 
                onClick={() => setIssueType('drainage_blockage')}
                className={`py-3 rounded-lg border font-bold transition-all ${issueType === 'drainage_blockage' ? 'border-teal-500 bg-teal-500/10 text-teal-400' : 'border-slate-700 bg-slate-800 text-gray-400'}`}
            >
                Drain Blockage
            </button>
        </div>

        {/* Severity */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Impact Level</label>
          <select
            value={impactLevel}
            onChange={(e) => setImpactLevel(Number(e.target.value))}
            className="w-full bg-[#020817] border border-slate-600 p-3 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm"
          >
            {IMPACT_LABELS[issueType].map((opt) => (
              <option key={opt.value} value={opt.value}>Level {opt.value}: {opt.label}</option>
            ))}
          </select>
        </div>

        {/* Location Section */}
        <div className="bg-[#020817] border border-slate-700 rounded-xl p-5 mb-8">
            <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold text-gray-200">Detect Location</span>
                <button 
                    onClick={getLocation} 
                    className="bg-teal-500 text-black px-3 py-1.5 rounded-md text-[11px] font-black uppercase tracking-wider hover:bg-teal-400 transition"
                >
                    {locationResolved ? 'Update GPS' : 'Fetch GPS'}
                </button>
            </div>
            
            <p className="text-xs text-teal-500 mb-3 font-mono truncate">{autoLocation}</p>
            
            <input
                type="text"
                placeholder="Nearest Landmark (Optional)"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                className="w-full bg-[#0f172a] border border-slate-600 p-3 rounded-lg text-sm mb-3 focus:border-teal-500 outline-none"
            />

            {locationResolved && (
                <div className="flex gap-4 text-[10px] text-gray-500 font-mono">
                    <span>Lat: {lat?.toFixed(5)}</span>
                    <span>Lng: {lng?.toFixed(5)}</span>
                    <span>±{accuracy}m</span>
                </div>
            )}
        </div>

        <button
          onClick={submitReport}
          disabled={loading || !locationResolved}
          className="w-full bg-white text-black py-4 rounded-xl font-black text-lg hover:bg-zinc-200 disabled:opacity-40 transition-all shadow-xl"
        >
          {loading ? 'Processing...' : 'Submit'}
        </button>

        <p className="text-[10px] text-gray-500 mt-6 text-center leading-relaxed">
          WASP Rule Engine will correlate this report with live weather data.<br/>
          Verified Issues will appear on the Urban Resilience Dashboard.
        </p>
      </div>
    </div>
  );
}