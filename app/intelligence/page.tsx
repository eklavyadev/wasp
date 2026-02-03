'use client';

import { useEffect, useState, useMemo } from 'react';
import Navbar from "@/app/components/Navbar";
import dynamic from 'next/dynamic';
import { 
  AlertTriangle, 
  Droplets, 
  TrendingUp, 
  ShieldCheck, 
  Activity, 
  MapPin, 
  CloudRain, 
  Navigation,
  Thermometer,
  Wind
} from "lucide-react";

// --- Types ---
type Report = {
  id: string;
  type: string;
  impact_level: number;
  location: string;
  status: string;
  created_at: string;
  lat: number;
  lng: number;
};

type WeatherData = {
  rain24h: string | number;
  rainChance: number;
  current: string;
  temp: number;
  humidity: number;
  error?: string;
};

// Dynamic Import for HeatMap
const FloodHeatMap = dynamic(() => import('@/app/components/HeatMap'), { 
  ssr: false, 
  loading: () => <div className="h-[400px] bg-slate-900/50 animate-pulse rounded-[2.5rem] border border-slate-800" />
});

export default function IntelligenceDashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [weather, setWeather] = useState<WeatherData>({ 
    rain24h: 0, 
    rainChance: 0, 
    current: 'Syncing...', 
    temp: 0, 
    humidity: 0 
  });
  const [loading, setLoading] = useState(true);

  // --- Helper: Convert % to Words ---
  const getRainText = (chance: number) => {
    if (chance === 0) return "No Rain";
    if (chance < 30) return "Low Chance";
    if (chance < 60) return "Possible Rain";
    if (chance < 80) return "Likely Rain";
    return "Heavy Rain";
  };

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/reports').then(res => res.json()).catch(() => []),
      fetch('/api/weather').then(res => res.json())
    ]).then(([reportData, weatherData]) => {
      
      if (Array.isArray(reportData)) {
        setReports(reportData.filter((r: any) => r.status === 'approved'));
      }

      if (weatherData && !weatherData.error) {
        setWeather({
          rain24h: weatherData.rain24h || 0,
          rainChance: weatherData.rainChance || 0,
          current: weatherData.current || 'Unavailable',
          temp: weatherData.temp || 0,
          humidity: weatherData.humidity || 0
        });
      }
      setLoading(false);
    }).catch(err => {
      console.error("Dashboard Sync Error:", err);
      setLoading(false);
    });
  }, []);

  const hotspots = useMemo(() => {
    const groups: Record<string, number> = {};
    reports.forEach((r: Report) => {
      const key = `${r.lat.toFixed(3)},${r.lng.toFixed(3)}`;
      groups[key] = (groups[key] || 0) + 1;
    });
    return groups;
  }, [reports]);

  const isRainfallCritical = Number(weather.rain24h) >= 60 || weather.rainChance > 80; 
  const hasDensityCrisis = Object.values(hotspots).some(v => v >= 10);

  return (
    <div className="bg-[#020817] min-h-screen text-white pb-20">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 pt-28 space-y-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter text-white uppercase">
              Flood <span className="text-teal-500 text-glow">Intelligence</span>
            </h1>
            <p className="text-slate-400 font-mono text-xs uppercase tracking-[0.2em]">
              Guwahati Municipal Command Center // Live Signal Analysis
            </p>
          </div>
          
          <div className="flex items-center gap-6 p-4 rounded-3xl bg-slate-900/50 border border-slate-800">
            <div className="flex items-center gap-2">
              <Thermometer size={16} className="text-orange-400" />
              <span className="text-sm font-bold">{weather.temp ? Math.round(weather.temp) : '--'}°C</span>
            </div>
            <div className="flex items-center gap-2">
              <Droplets size={16} className="text-blue-400" />
              <span className="text-sm font-bold">
                {weather.humidity ? `${weather.humidity}%` : '--%'} Humidity
              </span>
            </div>
          </div>
        </div>

        {/* METRICS BAR */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* --- UPDATED CARD: SHOWS WORDS --- */}
          <MetricCard 
            title="Precipitation Probability" 
            // MAIN VALUE: Shows "No Rain" instead of "0%"
            value={getRainText(weather.rainChance)} 
            icon={<CloudRain className={isRainfallCritical ? "text-red-500 animate-bounce" : "text-blue-500"}/>} 
            // SUBTITLE: Keeps the data visible for accuracy
            subtitle={`${weather.rainChance}% Chance / ${weather.rain24h}mm Vol`} 
          />
          
          <MetricCard 
            title="Hotspots Detected" 
            value={Object.values(hotspots).filter(v => v >= 10).length.toString()} 
            icon={<MapPin className="text-teal-500"/>} 
            subtitle="10+ Reports in 500m" 
          />
          <MetricCard 
            title="Active Signals" 
            value={reports.length.toString()} 
            icon={<Activity className="text-emerald-500"/>} 
            subtitle="Verified Citizen Data" 
          />
          <MetricCard 
            title="System Guard" 
            value="Online" 
            icon={<ShieldCheck className="text-blue-500"/>} 
            subtitle="AI Moderation Active" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: LIVE INTELLIGENCE FEED */}
          <div className="lg:col-span-2 space-y-10">
            
            <div className="space-y-6">
              <h2 className="text-xl font-black flex items-center gap-2 uppercase tracking-tight">
                <MapPin className="text-teal-500" size={20} /> Geospatial Risk Heatmap
              </h2>
              <FloodHeatMap reports={reports} />
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-black flex items-center gap-2 uppercase tracking-tight">
                <Activity className="text-teal-500" size={20} /> Signal Stream
              </h2>

              <div className="space-y-4">
                {loading ? (
                  <div className="h-64 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-[3rem] bg-slate-900/20">
                    <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Syncing with Guwahati Grid...</p>
                  </div>
                ) : reports.length === 0 ? (
                  <div className="p-10 text-center border border-slate-800 rounded-[3rem] text-slate-500 italic">
                    No active flood signals detected in the last 24 hours.
                  </div>
                ) : (
                  reports.map((r: Report) => {
                    const isHotspot = hotspots[`${r.lat.toFixed(3)},${r.lng.toFixed(3)}`] >= 10;
                    const getSeverityStyles = (level: number) => {
                      if (level >= 3) return "bg-red-500/20 text-red-500 border-red-500/40";
                      if (level === 2) return "bg-amber-500/20 text-amber-500 border-amber-500/40";
                      return "bg-teal-500/20 text-teal-500 border-teal-500/40";
                    };

                    return (
                      <div 
                        key={r.id} 
                        className={`p-5 rounded-[2.5rem] border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                          isHotspot 
                            ? 'bg-red-500/10 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.1)]' 
                            : 'bg-slate-900/40 border-slate-800 hover:border-teal-500/50'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-2xl ${isHotspot ? 'bg-red-500/20' : 'bg-slate-800'}`}>
                            <Navigation size={20} className={isHotspot ? 'text-red-500' : 'text-slate-400'} />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{r.type}</p>
                            <h3 className="font-bold text-sm text-white">{r.location}</h3>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          {isHotspot && (
                            <span className="bg-red-500 text-[10px] font-black px-3 py-1 rounded-full animate-pulse tracking-tighter">
                              HOTSPOT CLUSTER
                            </span>
                          )}
                          <div className={`px-4 py-2 border rounded-xl text-[10px] font-black uppercase tracking-widest ${getSeverityStyles(r.impact_level)}`}>
                            Severity Lvl {r.impact_level}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: AUTOMATED ACTIONS PANEL */}
          <div className="space-y-6">
            <h2 className="text-xl font-black flex items-center gap-2 uppercase tracking-tight">
              <TrendingUp className="text-teal-500" size={20} /> Decision Matrix
            </h2>
            
            <div className="p-8 rounded-[3rem] bg-gradient-to-b from-slate-900 to-black border border-slate-800 space-y-6 shadow-2xl">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-800 pb-2">
                  Recommended Dispatches
                </p>
                
                {isRainfallCritical ? (
                  <ActionItem 
                    title="CRITICAL EVACUATION" 
                    text="High Rainfall Probability / Volume breached. Triggering alerts." 
                    type="danger" 
                    icon={<AlertTriangle size={18}/>}
                  />
                ) : (
                  <ActionItem 
                    title="ROUTINE MONITORING" 
                    text="Precipitation levels currently within city safety parameters." 
                    type="normal" 
                    icon={<Droplets size={18}/>}
                  />
                )}

                {hasDensityCrisis && (
                  <ActionItem 
                    title="DRAINAGE INTERVENTION" 
                    text="Cluster of 10+ reports detected. Dispatching Municipal clearing team." 
                    type="danger" 
                    icon={<TrendingUp size={18}/>}
                  />
                )}
                
                <ActionItem 
                  title="SIGNAL BROADCAST" 
                  text={`Humidity at ${weather.humidity}%. Pumps on standby.`} 
                  type="normal" 
                  icon={<Wind size={18}/>}
                />
              </div>

              <div className="pt-4 mt-6 border-t border-slate-800 flex justify-between items-center">
                 <div className="flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-teal-500" />
                    <div className="w-1 h-1 rounded-full bg-teal-500 opacity-50" />
                    <div className="w-1 h-1 rounded-full bg-teal-500 opacity-20" />
                 </div>
                 <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">WASP AI Engine</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function MetricCard({ title, value, icon, subtitle }: { title: string; value: string; icon: any; subtitle: string }) {
  return (
    <div className="p-6 rounded-[2rem] bg-slate-900/40 border border-slate-800 hover:border-teal-500/30 transition-all space-y-3 group">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-teal-500 transition-colors">
          {title}
        </span>
        <div className="p-2 bg-slate-800 rounded-xl group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </div>
      <div>
        {/* Adjusted Font Size for Text Labels */}
        <p className="text-2xl font-black tracking-tighter text-white">{value}</p>
        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter">{subtitle}</p>
      </div>
    </div>
  );
}

function ActionItem({ title, text, icon, type }: { title: string, text: string, icon: any, type: 'danger' | 'normal' }) {
  return (
    <div className={`flex gap-4 p-4 rounded-3xl border transition-all ${
      type === 'danger' 
        ? 'bg-red-500/10 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]' 
        : 'bg-slate-800/30 border-slate-800'
    }`}>
      <div className={`mt-1 p-2 h-fit rounded-lg ${
        type === 'danger' ? 'bg-red-500/20 text-red-500' : 'bg-teal-500/20 text-teal-500'
      }`}>
        {icon}
      </div>
      <div className="space-y-1">
        <p className={`text-[10px] font-black uppercase tracking-widest ${
          type === 'danger' ? 'text-red-500' : 'text-teal-500'
        }`}>{title}</p>
        <p className="text-[11px] font-bold text-slate-300 leading-snug">{text}</p>
      </div>
    </div>
  );
}