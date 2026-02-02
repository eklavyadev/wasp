'use client';

import { useEffect, useState, useMemo } from 'react';
import Navbar from "@/app/components/Navbar";
import { 
  AlertTriangle, 
  Droplets, 
  TrendingUp, 
  ShieldCheck, 
  Activity,
  Navigation,
  CloudRain,
  MapPin
} from "lucide-react";

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

export default function IntelligenceDashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [rainfall, setRainfall] = useState(65); // Mocked 6.5cm (65mm) for demo

  useEffect(() => {
    fetch('/api/admin/reports')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setReports(data.filter(r => r.status !== 'rejected'));
        }
        setLoading(false);
      });
  }, []);

  // AGGREGATION LOGIC: Grouping by 500m (Simulated for Frontend)
  const hotspots = useMemo(() => {
    const groups: Record<string, number> = {};
    reports.forEach(r => {
      // Round to 3 decimal places (~110m precision) to group nearby reports
      const key = `${r.lat.toFixed(3)},${r.lng.toFixed(3)}`;
      groups[key] = (groups[key] || 0) + 1;
    });
    return groups;
  }, [reports]);

  const calculateConfidence = (report: Report) => {
    let score = report.impact_level * 20; 
    const isRecent = new Date().getTime() - new Date(report.created_at).getTime() < 86400000;
    
    // Density Bonus: Check if this report is in a hotspot (10+ reports)
    const key = `${report.lat.toFixed(3)},${report.lng.toFixed(3)}`;
    if (hotspots[key] >= 10) score += 30;
    if (isRecent) score += 10;
    
    return Math.min(score, 99);
  };

  const isRainfallCritical = rainfall >= 60; // 6cm threshold

  return (
    <div className="bg-[#020817] min-h-screen text-white pb-20">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-28 space-y-10">
        
        {/* TOP METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard 
            title="Density Triggers" 
            value={Object.values(hotspots).filter(v => v >= 10).length.toString()} 
            icon={<MapPin className="text-teal-500"/>} 
            subtitle="10+ Reports in 500m" 
          />
          <MetricCard 
            title="System Confidence" 
            value="High" 
            icon={<ShieldCheck className="text-emerald-500"/>} 
            subtitle="Cross-Verified Data" 
          />
          <MetricCard 
            title="Rainfall (24h)" 
            value={`${rainfall}mm`} 
            icon={<CloudRain className={isRainfallCritical ? "text-red-500 animate-bounce" : "text-blue-500"}/>} 
            subtitle={isRainfallCritical ? "EXCEEDS 6CM LIMIT" : "Under Threshold"} 
          />
          <MetricCard 
            title="Active Alerts" 
            value={reports.filter(r => r.impact_level === 3).length.toString()} 
            icon={<AlertTriangle className="text-amber-500"/>} 
            subtitle="Priority level 3" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: SIGNAL FEED & HEATMAP INDICATORS */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2 text-slate-100">
                <Activity className="text-teal-500" size={20} /> Real-Time Intelligence Feed
              </h2>
              <div className="flex gap-2">
                 <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                    <span className="text-[9px] font-bold text-slate-400">HEATMAP ACTIVE</span>
                 </div>
              </div>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="h-64 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-[3rem]">
                  <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Compiling Geospatial Data...</p>
                </div>
              ) : (
                reports.map((r) => {
                  const confidence = calculateConfidence(r);
                  const isHotspot = hotspots[`${r.lat.toFixed(3)},${r.lng.toFixed(3)}`] >= 10;
                  
                  return (
                    <div key={r.id} className={`p-5 rounded-[2.5rem] bg-slate-900/40 border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${isHotspot ? 'border-red-500/40 bg-red-500/5' : 'border-slate-800 hover:border-teal-500/50'}`}>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${isHotspot ? 'bg-red-500 animate-ping' : 'bg-teal-500'}`} />
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">
                            {r.type} {isHotspot && "• DENSITY TRIGGER"}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-white line-clamp-1 flex items-center gap-2">
                          {r.location}
                          {isHotspot && <span className="text-[9px] bg-red-500/20 text-red-500 px-2 py-0.5 rounded-full border border-red-500/30">CRITICAL RADIUS</span>}
                        </h3>
                        <p className="text-[10px] text-slate-500 font-mono tracking-tight">Signal Lat: {r.lat.toFixed(4)} | Lng: {r.lng.toFixed(4)}</p>
                      </div>

                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Confidence Score</p>
                          <p className={`text-xl font-black ${confidence > 80 ? 'text-teal-400' : 'text-slate-300'}`}>{confidence}%</p>
                        </div>
                        <button className="h-12 w-12 flex items-center justify-center bg-white text-black rounded-2xl hover:bg-teal-500 hover:text-white transition-all transform hover:rotate-12 group">
                          <Navigation size={18} className="group-hover:animate-pulse" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT: PREDICTIVE LOGIC & COMMUNITY ACTION */}
          <div className="space-y-6">
            <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2 text-slate-100">
              <TrendingUp className="text-teal-500" size={20} /> Decision Matrix
            </h2>
            
            <div className="p-8 rounded-[3rem] bg-gradient-to-br from-slate-900 via-slate-900 to-black border border-slate-800 shadow-2xl space-y-8">
              {/* RAINFALL PROGRESS BAR */}
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <p className="text-[10px] font-black text-teal-500 uppercase tracking-[0.2em]">Guwahati Rain Gauge</p>
                  <span className={`text-xs font-mono ${isRainfallCritical ? 'text-red-500 animate-pulse font-bold' : 'text-slate-400'}`}>
                    {isRainfallCritical ? 'THRESHOLD BREACHED (6cm+)' : 'Normal Levels'}
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                  <div 
                    className={`h-full transition-all duration-1000 ${isRainfallCritical ? 'bg-red-500' : 'bg-teal-500'}`} 
                    style={{ width: `${Math.min((rainfall / 100) * 100, 100)}%` }} 
                  />
                </div>
              </div>

              {/* ACTIONABLE INSIGHTS */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Command Suggestions</h4>
                
                {isRainfallCritical && (
                  <ActionItem 
                    icon={<Navigation size={14}/>}
                    title="Traffic Diversion"
                    text="Emergency: Divert all heavy vehicles from G.S. Road immediately." 
                    type="danger"
                  />
                )}
                
                <ActionItem 
                  icon={<Droplets size={14}/>}
                  title="Maintenance"
                  text="Dispatch cleaning team to Jalukbari. Blockage cluster detected." 
                  type="normal"
                />

                <ActionItem 
                  icon={<Activity size={14}/>}
                  title="Public Broadcast"
                  text="Auto-trigger SMS alerts to Zoo Road residents (1.2km radius)." 
                  type="normal"
                />
              </div>

              

              <div className="pt-6 border-t border-slate-800/50 text-[10px] text-slate-500 leading-relaxed font-mono">
                // ALERT_ENGINE_LOGIC:<br/>
                IF (reports_500m &gt; 10 AND rain_gauge &gt; 60mm)<br/>
                THEN BROADCAST_CRITICAL_ALERT(LOC_ID)
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

function MetricCard({ title, value, icon, subtitle }: { title: string; value: string; icon: any; subtitle: string }) {
  return (
    <div className="p-6 rounded-[2rem] bg-slate-900/40 border border-slate-800 hover:border-teal-500/30 transition-all space-y-3 group">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-teal-500 transition-colors">{title}</span>
        <div className="p-2 bg-slate-800 rounded-xl">{icon}</div>
      </div>
      <div>
        <p className="text-3xl font-black tracking-tighter">{value}</p>
        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter">{subtitle}</p>
      </div>
    </div>
  );
}

function ActionItem({ title, text, icon, type }: { title: string, text: string, icon: any, type: 'danger' | 'normal' }) {
  return (
    <div className={`flex gap-4 p-4 rounded-3xl border transition-all ${type === 'danger' ? 'bg-red-500/10 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'bg-slate-800/30 border-slate-800'}`}>
      <div className={`mt-1 p-2 rounded-lg ${type === 'danger' ? 'bg-red-500/20 text-red-500' : 'bg-teal-500/20 text-teal-500'}`}>
        {icon}
      </div>
      <div>
        <p className={`text-[10px] font-black uppercase tracking-widest ${type === 'danger' ? 'text-red-500' : 'text-teal-500'}`}>{title}</p>
        <p className="text-[11px] font-bold text-slate-300 leading-snug">{text}</p>
      </div>
    </div>
  );
}