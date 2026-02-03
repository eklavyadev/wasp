'use client';

import { useEffect, useState, useMemo } from 'react';
// 1. Change the import to avoid SSR issues with the map container
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

// Fix TS error for leaflet.heat
declare module 'leaflet' {
  export function heatLayer(
    latlngs: Array<[number, number, number]>,
    options?: any
  ): any;
}

function HeatLayer({ points }: { points: [number, number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !points.length) return;

    const heat = L.heatLayer(points, {
      radius: 35,
      blur: 20,
      maxZoom: 17,
      max: 1.0,
      minOpacity: 0.4,
      gradient: {
        0.2: '#2b83ba',
        0.4: '#abdda4',
        0.6: '#fdae61',
        0.8: '#d7191c',
        1.0: '#ffffbf'
      }
    }).addTo(map);

    return () => {
      // Safely remove layer to prevent memory leaks in Strict Mode
      map.removeLayer(heat);
    };
  }, [map, points]);

  return null;
}

export default function FloodHeatMap({ reports }: { reports: any[] }) {
  // --- THE FIX STARTS HERE ---
  // We use this state to ensure the component ONLY renders on the client (browser)
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const heatPoints = useMemo(() => {
    return reports.map((r) => [
      r.lat,
      r.lng,
      Math.min(r.impact_level * 0.2, 1.0) 
    ] as [number, number, number]);
  }, [reports]);

  // If we are on the server (not mounted yet), return null to avoid the crash
  if (!isMounted) return <div className="h-[400px] w-full bg-slate-900 animate-pulse rounded-3xl" />;
  // --- THE FIX ENDS HERE ---

  return (
    <div className="relative h-[400px] w-full rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
      <div className="absolute top-4 left-4 z-[1000] bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700 text-xs text-slate-300 font-medium">
        Live Flood Intensity
      </div>

      <MapContainer
        center={[26.1445, 91.7362]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%', background: '#020817' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <HeatLayer points={heatPoints} />
      </MapContainer>
    </div>
  );
}