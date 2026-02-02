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
  Search 
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
            A specialized stack engineered for high-precision water logging detection, 
            automated drainage moderation, and real-time civic geospatial analysis.
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
              desc="High-performance React framework handling SSR for SEO-friendly reports and client-side hydration for interactive maps."
            />
            <TechCard 
              icon={<Database className="text-teal-500" />}
              title="Supabase & PostgreSQL"
              desc="Cloud-native database storing complex geospatial coordinates, high-res evidence, and real-time signal status."
            />
            <TechCard 
              icon={<ShieldCheck className="text-teal-500" />}
              title="Tailwind CSS & Framer"
              desc="Utility-first styling paired with motion APIs for a responsive, high-contrast 'Control Center' interface."
            />
            <TechCard 
              icon={<Cloud className="text-teal-500" />}
              title="Vercel Edge Network"
              desc="Global distribution layer ensuring low-latency access to the public API and static map assets."
            />
          </div>
        </section>

        {/* AI MODERATION LAYER */}
        <section className="space-y-8">
          <div className="flex items-center gap-3 border-l-4 border-teal-500 pl-4">
            <h2 className="text-2xl font-black uppercase tracking-tight">AI & Signal Verification</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TechCard 
              icon={<Search className="text-teal-500" />}
              title="Hugging Face Vision Transformers"
              desc="Custom-trained models used to verify 'Water Depth' and 'Drain Blockage' images, filtering out 98% of spam uploads."
            />
            <TechCard 
              icon={<Cpu className="text-teal-500" />}
              title="Node.js Microservice (Render)"
              desc="A dedicated compute layer that processes incoming reports asynchronously to prevent UI blocking during peak monsoons."
            />
          </div>
        </section>

        {/* GOOGLE CLOUD INTEGRATION */}
        <section className="p-8 rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-black border border-teal-500/30 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
            <Globe size={120} />
          </div>
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl font-black text-white flex items-center gap-3">
              <MapIcon className="text-teal-400" /> Google Maps Platform
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-slate-300">
              <div className="space-y-2">
                <p className="font-bold text-teal-400">Advanced Markers API</p>
                <p className="text-sm leading-relaxed">Dynamic rendering of impact-level colored pins with custom SVG scaling for critical infrastructure visualization.</p>
              </div>
              <div className="space-y-2">
                <p className="font-bold text-teal-400">Reverse Geocoding</p>
                <p className="text-sm leading-relaxed">Converting raw GPS data into human-readable locations like "G.S. Road, Guwahati" automatically upon user upload.</p>
              </div>
            </div>
          </div>
        </section>

        {/* DATA FLOW DIAGRAM */}
        <section className="space-y-8">
          <div className="flex items-center gap-3 border-l-4 border-teal-500 pl-4">
            <h2 className="text-2xl font-black uppercase tracking-tight">System Data Flow</h2>
          </div>
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 font-mono text-xs md:text-sm text-teal-500 space-y-4 leading-relaxed">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded bg-teal-500/20 flex items-center justify-center">01</div>
              <p className="text-slate-300">Client captures <span className="text-white">Camera + Geo-Location</span> data via Browser APIs.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded bg-teal-500/20 flex items-center justify-center">02</div>
              <p className="text-slate-300">Payload sent to <span className="text-white">Supabase Auth-Protected</span> storage and DB.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded bg-teal-500/20 flex items-center justify-center">03</div>
              <p className="text-slate-300">Webhook triggers <span className="text-white">Vision AI</span> to classify and approve the report.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded bg-teal-500/20 flex items-center justify-center">04</div>
              <p className="text-slate-300">Global <span className="text-white">WASP Public API</span> and Map UI are updated in real-time.</p>
            </div>
          </div>
          
        </section>

        {/* FOOTER */}
        <div className="text-center pb-20">
          <p className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.3em]">
            WASP Tech Stack · Version 2.4.0 · Open Infrastructure
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------- HELPER COMPONENT ---------- */
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