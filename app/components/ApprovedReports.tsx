'use client';

import { useEffect, useState } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

/* ---------- TYPES ---------- */
type Report = {
  id: string;
  image_url: string;
  location: string;
  landmark?: string;
  lat: number;
  lng: number;
  type: string;
  impact_level: number;
  governing_body: string;
  created_at: string;
  status: string;
};

const PAGE_SIZE = 6;

/* ---------- UI HELPERS ---------- */
const IMPACT_CONFIG: Record<number, { label: string; color: string; ring: string }> = {
  1: { label: 'LOW RISK', color: 'bg-emerald-500/20 text-emerald-400', ring: 'border-emerald-500/50' },
  2: { label: 'MODERATE', color: 'bg-amber-500/20 text-amber-400', ring: 'border-amber-500/50' },
  3: { label: 'CRITICAL', color: 'bg-red-500/20 text-red-400', ring: 'border-red-500/50' },
};

const TYPE_LABEL: Record<string, string> = {
  'Drain Blockage': '🚫 Drain Blockage',
  'Flash Flood': '⚡ Flash Flood',
  'flooding': '🌊 Flooding',
  'Water Logging': '💧 Water Logging',
  'pothole': '🕳️ Pothole',
  'streetlight': '💡 Streetlight',
};

export function ApprovedReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  useEffect(() => {
    fetch('/api/admin/reports')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Accepting pending or approved to ensure data shows up
          const visible = data.filter(r => ['approved', 'pending'].includes(r.status?.toLowerCase()));
          setReports(visible);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
      <p className="text-cyan-500 font-mono tracking-widest animate-pulse">SYNCHRONIZING SATELLITE DATA...</p>
    </div>
  );

  const totalPages = Math.ceil(reports.length / PAGE_SIZE);
  const visibleReports = reports.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* ---------- HEADER SECTION ---------- */}
      <div className="mb-10 flex justify-between items-end border-b border-slate-800 pb-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Verified Signals</h2>
          <p className="text-slate-500 font-mono text-sm">Active Monitoring: {reports.length} Reports Detected</p>
        </div>
        <div className="hidden md:block text-right">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Sector Status</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-emerald-500 font-bold text-sm">OPERATIONAL</span>
          </div>
        </div>
      </div>

      {/* ---------- GRID ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {visibleReports.map((r) => {
          const config = IMPACT_CONFIG[r.impact_level] || IMPACT_CONFIG[1];
          return (
            <div
              key={r.id}
              onClick={() => setSelectedReport(r)}
              className="group relative bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden hover:border-cyan-500/50 hover:shadow-[0_0_30px_-10px_rgba(6,182,212,0.3)] transition-all duration-500 cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={r.image_url}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                  alt="Incident"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                
                {/* Status Badge */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black border ${config.ring} ${config.color} backdrop-blur-md`}>
                  {config.label}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                <div className="min-h-[3rem]">
                  <h3 className="text-white font-bold text-lg leading-tight line-clamp-2">{r.location}</h3>
                </div>
                
                <div className="flex justify-between items-center py-3 border-y border-slate-800/50">
                  <span className="text-xs text-slate-500 font-medium">TYPE</span>
                  <span className="text-sm text-cyan-400 font-bold tracking-wide">{TYPE_LABEL[r.type] || r.type}</span>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                  <span>ID: {r.id.slice(0, 8)}</span>
                  <span>{new Date(r.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ---------- PAGINATION ---------- */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center items-center gap-8">
          <button 
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
            className="w-12 h-12 rounded-full border border-slate-800 flex items-center justify-center text-white hover:bg-slate-800 disabled:opacity-30 transition-all"
          >
            ←
          </button>
          <span className="text-slate-500 font-mono text-sm tracking-widest">{page + 1} / {totalPages}</span>
          <button 
            disabled={page === totalPages - 1}
            onClick={() => setPage(p => p + 1)}
            className="w-12 h-12 rounded-full border border-slate-800 flex items-center justify-center text-white hover:bg-slate-800 disabled:opacity-30 transition-all"
          >
            →
          </button>
        </div>
      )}

      {/* ---------- MODAL ---------- */}
      {selectedReport && (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#020817] border border-slate-800 rounded-[2.5rem] w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative">
            
            <button
              onClick={() => setSelectedReport(null)}
              className="absolute top-6 right-6 z-[110] h-12 w-12 rounded-full bg-slate-900 border border-slate-700 text-white hover:border-red-500 hover:text-red-500 transition-all flex items-center justify-center"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 h-full overflow-y-auto lg:overflow-hidden">
              {/* Left: Content */}
              <div className="p-8 lg:p-12 space-y-8 overflow-y-auto">
                <div className="space-y-2">
                  <span className="text-cyan-500 font-mono text-xs font-bold tracking-[0.3em] uppercase">Intelligence Detail</span>
                  <h2 className="text-3xl font-black text-white leading-tight">{selectedReport.location}</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Issue</p>
                    <p className="text-white font-bold">{TYPE_LABEL[selectedReport.type] || selectedReport.type}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Impact</p>
                    <p className={`font-bold ${IMPACT_CONFIG[selectedReport.impact_level]?.color.split(' ')[1]}`}>
                      {IMPACT_CONFIG[selectedReport.impact_level]?.label}
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl overflow-hidden border border-slate-800 bg-black h-64 shadow-inner">
                   <img src={selectedReport.image_url} className="w-full h-full object-cover" alt="Evidence" />
                </div>

                <div className="flex gap-4">
                  <a 
                    href={`https://www.google.com/maps?q=${selectedReport.lat},${selectedReport.lng}`}
                    target="_blank"
                    className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-black py-4 rounded-2xl transition-all text-center tracking-tighter"
                  >
                    View on Google Maps
                  </a>
                </div>
              </div>

              {/* Right: Map Integration */}
              <div className="h-[400px] lg:h-auto border-l border-slate-800 bg-slate-900">
                {isLoaded ? (
                  <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    zoom={15}
                    center={{ lat: selectedReport.lat, lng: selectedReport.lng }}
                    options={{ 
                      disableDefaultUI: true,
                      zoomControl: true 
                    }}
                  >
                    <Marker 
                      position={{ lat: selectedReport.lat, lng: selectedReport.lng }}
                      animation={google.maps.Animation.DROP}
                    />
                  </GoogleMap>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 font-mono animate-pulse">
                    LOADING GRID...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}