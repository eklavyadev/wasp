'use client';

import { useEffect, useState, useCallback } from 'react';
import { GoogleMap, Marker, InfoWindow, useLoadScript } from '@react-google-maps/api';
import Navbar from "@/app/components/Navbar";

/* ---------- TYPES ---------- */
type Report = {
  id: string;
  lat: number;
  lng: number;
  location: string;
  type: string;
  impact_level: number;
  status: string;
};

/* ---------- CLEAN LIGHT MAP STYLE ---------- */
const LIGHT_MAP_OPTIONS = {
  styles: [
    {
      // Hides all shop, restaurant, and business icons/names
      featureType: "poi",
      elementType: "all",
      stylers: [{ visibility: "off" }],
    },
    {
      // Hides transit station icons
      featureType: "transit",
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }],
    },
    { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#e9e9e9" }] },
  ],
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false, 
  streetViewControl: false, 
};

export default function FullScreenMapPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [active, setActive] = useState<Report | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  /* ---------- DATA FETCHING ---------- */
  useEffect(() => {
    fetch('/api/admin/reports')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Filter to show only verified/pending urban signals
          const visible = data.filter(r => ['approved'].includes(r.status?.toLowerCase()));
          setReports(visible);
        }
      })
      .catch((err) => console.error("Map Data Error:", err));
  }, []);

  /* ---------- MARKER COLOR LOGIC ---------- */
  const getMarkerColor = (level: number) => {
    if (level === 1) return "#22c55e"; // Green for Level 1
    if (level === 2) return "#eab308"; // Yellow for Level 2
    if (level === 3) return "#ef4444"; // Red for Level 3
    return "#94a3b8"; // Default Slate
  };

  /* ---------- MAP ACTIONS ---------- */
  const onMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  if (!isLoaded) return (
    <div className="h-screen w-full bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="font-mono text-zinc-500 text-sm tracking-widest uppercase">Initializing Satellite Grid...</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />

      {/* Main Map Area - Full Screen below Navbar */}
      <main className="flex-1 relative mt-16"> 
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          zoom={13}
          center={reports.length > 0 ? { lat: reports[0].lat, lng: reports[0].lng } : { lat: 26.1445, lng: 91.7362 }}
          options={LIGHT_MAP_OPTIONS}
          onLoad={onMapLoad}
        >
          {reports.map((r) => (
            <Marker
              key={r.id}
              position={{ lat: r.lat, lng: r.lng }}
              onClick={() => setActive(r)}
              icon={{
                // Custom bold pin SVG
                path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                fillColor: getMarkerColor(r.impact_level),
                fillOpacity: 1,
                strokeWeight: 2.5,
                strokeColor: "#ffffff",
                scale: 2.5, // Increased size as requested
                anchor: new google.maps.Point(12, 22),
              }}
            />
          ))}

          {active && (
            <InfoWindow
              position={{ lat: active.lat, lng: active.lng }}
              onCloseClick={() => setActive(null)}
            >
              <div className="p-2 min-w-[200px] text-zinc-900 bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-2.5 h-2.5 rounded-full animate-pulse" 
                    style={{ backgroundColor: getMarkerColor(active.impact_level) }} 
                  />
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                    Impact Level {active.impact_level}
                  </span>
                </div>
                <h4 className="font-bold text-sm leading-tight text-zinc-800 mb-1">{active.location}</h4>
                <p className="text-[10px] text-teal-600 font-bold uppercase mb-3">{active.type}</p>
                
                <button 
                  onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${active.lat},${active.lng}`)}
                  className="w-full py-2.5 bg-zinc-900 text-white text-[10px] font-black rounded-lg uppercase tracking-tighter hover:bg-teal-600 transition-all shadow-md active:scale-95"
                >
                  Navigate to Site
                </button>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>

        {/* Legend Overlay - Positioned Bottom Left */}
        <div className="absolute bottom-10 left-6 bg-white/80 backdrop-blur-xl p-5 rounded-[2rem] border border-white shadow-2xl z-10 pointer-events-auto">
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4">Signal Key</p>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-3.5 h-3.5 rounded-full bg-green-500 ring-4 ring-green-500/20" />
              <span className="text-xs font-bold text-zinc-600 tracking-tight">Level 1: Minor</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-3.5 h-3.5 rounded-full bg-yellow-500 ring-4 ring-yellow-500/20" />
              <span className="text-xs font-bold text-zinc-600 tracking-tight">Level 2: Moderate</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-3.5 h-3.5 rounded-full bg-red-500 ring-4 ring-red-500/20" />
              <span className="text-xs font-bold text-zinc-600 tracking-tight">Level 3: Critical</span>
            </div>
          </div>
        </div>

        {/* Floating Top Right Signal Count */}
        <div className="absolute top-6 right-6 bg-zinc-900 text-white px-5 py-3 rounded-2xl shadow-2xl z-10 hidden sm:block border border-zinc-800">
          <p className="text-[9px] font-black text-teal-500 uppercase tracking-widest">Active Reports</p>
          <p className="text-2xl font-black">{reports.length}</p>
        </div>
      </main>
    </div>
  );
}