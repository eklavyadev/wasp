'use client';

import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, useMap, Polygon, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- TS Fix for Leaflet.heat ---
// We extend the L namespace to include the heatLayer function
declare module 'leaflet' {
  export function heatLayer(
    latlngs: Array<[number, number, number]>,
    options?: any
  ): any;
}

// --- 1. COORDINATES FOR BRAHMAPUTRA BANKS (GUWAHATI STRETCH) ---
// Explicitly typed as LatLngExpression[] to satisfy the Polygon component
const BRAHMAPUTRA_BANKS: L.LatLngExpression[] = [
  // North Bank Line (running West to East)
  [26.150, 91.600], // Near Deepor Beel / Azara outflow
  [26.190, 91.680], // North Guwahati Start
  [26.200, 91.750], // Behind IIT Guwahati
  [26.195, 91.820], // Noonmati/Refinery Side (East End)

  // South Bank Line (running East to West)
  [26.180, 91.820], // Narengi Area
  [26.170, 91.780], // Chandmari/Bamunimaidan Riverfront
  [26.160, 91.740], // Fancy Bazar / Uzan Bazar Ghats
  [26.155, 91.690], // Pandu / Maligaon
  [26.130, 91.600]  // Back to Azara West
];

// Visual Style for the River Zone
const RIVER_STYLE = { 
  color: '#3b82f6',       // Blue outline
  weight: 2,
  fillColor: '#ef4444',   // Red fill
  fillOpacity: 0.2,       // See-through
  dashArray: '10, 10'     // Dashed line
};

// --- HeatLayer Sub-Component ---
function HeatLayer({ points }: { points: [number, number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !points.length) return;

    // FIX: Dynamically require leaflet.heat to ensure 'L' is defined and window exists
    // This prevents "L is not defined" or "window is not defined" errors
    require('leaflet.heat');

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
      map.removeLayer(heat);
    };
  }, [map, points]);

  return null;
}

// --- Main Component ---
export default function FloodHeatMap({ reports }: { reports: any[] }) {
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

  // Prevent SSR crash
  if (!isMounted) return <div className="h-[400px] w-full bg-slate-900 animate-pulse rounded-3xl" />;

  return (
    <div className="relative h-[400px] w-full rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
      
      {/* Legend / Overlay */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
        <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700 text-xs text-slate-300 font-medium">
          Live Intensity
        </div>
        <div className="bg-blue-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-blue-500/30 text-xs text-blue-200 font-medium flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"/>
          Brahmaputra Flood Banks
        </div>
      </div>

      <MapContainer
        center={[26.165, 91.720]} // Centered nicely on the river bend
        zoom={12} 
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%', background: '#020817' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* --- BRAHMAPUTRA BANKS POLYGON --- */}
        <Polygon positions={BRAHMAPUTRA_BANKS} pathOptions={RIVER_STYLE}>
           <Tooltip sticky direction="top" className="bg-transparent border-none text-red-400 font-bold text-sm">
             🌊 BRAHMAPUTRA HIGH RISK ZONE
           </Tooltip>
        </Polygon>

        {/* Live User Reports Heatmap */}
        <HeatLayer points={heatPoints} />
        
      </MapContainer>
    </div>
  );
}