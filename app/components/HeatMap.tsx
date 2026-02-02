'use client';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import 'leaflet.heat';

// This sub-component handles the actual "Heat" drawing
function HeatLayer({ points }: { points: [number, number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !points.length) return;

    // @ts-ignore - Leaflet.heat is a plugin
    const heat = L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      gradient: { 0.4: 'blue', 0.6: 'cyan', 0.7: 'lime', 0.8: 'yellow', 1.0: 'red' }
    }).addTo(map);

    return () => { map.removeLayer(heat); };
  }, [map, points]);

  return null;
}

export default function FloodHeatMap({ reports }: { reports: any[] }) {
  // Convert reports to [lat, lng, intensity]
  const heatPoints: [number, number, number][] = reports.map(r => [
    r.lat,
    r.lng,
    r.impact_level * 0.5 // Higher impact = more "heat"
  ]);

  return (
    <div className="h-[400px] w-full rounded-[2.5rem] overflow-hidden border border-slate-800 z-0">
      <MapContainer 
        center={[26.1445, 91.7362]} // Guwahati Center
        zoom={13} 
        style={{ height: '100%', width: '100%', background: '#020817' }}
      >
<TileLayer
  // Light, clean "Voyager" theme
  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
/>
        <HeatLayer points={heatPoints} />
      </MapContainer>
    </div>
  );
}