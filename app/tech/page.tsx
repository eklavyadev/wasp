'use client';

import Navbar from "@/app/components/Navbar";
import { 
  Cpu, 
  Cloud, 
  Database, 
  Globe, 
  Camera, 
  Map as MapIcon, 
  Zap, 
  ShieldCheck, 
  Search,
  MessageSquare // Added for Twilio
} from "lucide-react";

export default function TechStackPage() {
  return (
    <div className="bg-[#020817] min-h-screen text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-24 mt-10 space-y-20">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-500 text-xs font-bold tracking-widest uppercase">
            <Cpu size={14} /> System Architecture
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
            The WASP <span className="text-teal-500">Engine</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            A specialized stack engineered for high-precision flood detection, 
            automated municipal alerting, and real-time civic geospatial analysis.
          </p>
        </div>

        {/* CORE INFRASTRUCTURE */}
        <section className="space-y-8">
          <div className="flex items-center gap-3 border-l-4 border-teal-500 pl-4">
            <h2 className="text-2xl font-black uppercase tracking-tight">Core Infrastructure</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TechCard 
              icon={<Zap className="text-teal-500" />}
              title="Next.js 14 (App Router)"
              desc="Optimized server actions for seamless data submission and high-performance server-side rendering of incident maps."
            />
            <TechCard 
              icon={<Database className="text-teal-500" />}
              title="Supabase & PostGIS"
              desc="Using PostgreSQL with geospatial extensions to calculate duplicate reports within a 50m radius automatically."
            />
            <TechCard 
              icon={<MessageSquare className="text-teal-500" />}
              title="Twilio WhatsApp API"
              desc="Instant dispatch system routing verified flood reports directly to regional municipal officers' mobile devices."
            />
            <TechCard 
              icon={<Cloud className="text-teal-500" />}
              title="Vercel Edge Network"
              desc="Global distribution layer ensuring low-latency access to the public API and real-time dashboard updates."
            />
          </div>
        </section>

        {/* AI & VERIFICATION LAYER */}
        <section className="space-y-8">
          <div className="flex items-center gap-3 border-l-4 border-teal-500 pl-4">
            <h2 className="text-2xl font-black uppercase tracking-tight">AI & Report Moderation</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TechCard 
              icon={<Search className="text-teal-500" />}
              title="Groq Llama-4-Scout Vision"
              desc="Edge-speed Vision AI verifying if uploaded images contain actual flooding or drainage blockages before public broadcast."
            />
            <TechCard 
              icon={<ShieldCheck className="text-teal-500" />}
              title="Automated Impact Scoring"
              desc="A categorical severity engine that ranks incidents (Low, Medium, High) to prioritize municipal response teams."
            />
          </div>
        </section>

        {/* UPDATED DATA FLOW DIAGRAM */}
        <section className="space-y-8">
          <div className="flex items-center gap-3 border-l-4 border-teal-500 pl-4">
            <h2 className="text-2xl font-black uppercase tracking-tight">Real-Time Alert Pipeline</h2>
          </div>
          
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 font-mono text-xs md:text-sm text-teal-500 space-y-4 leading-relaxed">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded bg-teal-500/20 flex items-center justify-center">01</div>
              <p className="text-slate-300">Citizen captures <span className="text-white">Image + GPS</span>; frontend handles duplicate prevention.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded bg-teal-500/20 flex items-center justify-center">02</div>
              <p className="text-slate-300">Groq <span className="text-white">Llama-4-Scout</span> verifies the image pixels for water-logging signatures.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded bg-teal-500/20 flex items-center justify-center">03</div>
              <p className="text-slate-300">Twilio API dispatches a <span className="text-white">Priority WhatsApp Alert</span> to the Regional Zone Officer.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded bg-teal-500/20 flex items-center justify-center">04</div>
              <p className="text-slate-300">The central <span className="text-white">Municipal Dashboard</span> updates the geospatial heatmap instantly.</p>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <div className="text-center pb-20">
          <p className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.3em]">
            WASP Engine · Guwahati SIH · Production-Ready API
          </p>
        </div>
      </div>
    </div>
  );
}

function TechCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-teal-500/50 transition-all group">
      <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-lg font-black text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}