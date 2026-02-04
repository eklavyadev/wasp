'use client';

import Navbar from "@/app/components/Navbar";
import { Terminal, Database, ShieldCheck, Code2, Droplets, MapPin, Layers } from "lucide-react";

export default function ApiDocsPage() {
  return (
    <div className="bg-[#020817] min-h-screen text-slate-300">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-24">
        {/* HEADER */}
        <div className="mb-16 space-y-4 pt-10">
          <div className="flex items-center gap-2 text-teal-500 font-mono text-sm tracking-widest uppercase">
            <Terminal size={16} />
            <span>Developer Documentation</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
            WASP <span className="text-teal-500">Public API</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl">
            Access real-time urban water intelligence from Guwahati. Our read-only API provides structured data on flood levels, 
            sewage blockages, and drainage health for civic innovation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* LEFT COLUMN: DOCUMENTATION */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* OVERVIEW */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Database size={20} className="text-teal-500" /> API Overview
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                  <p className="text-white font-bold text-sm mb-1">Method</p>
                  <p className="text-xs font-mono text-teal-400">GET ONLY</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                  <p className="text-white font-bold text-sm mb-1">Auth</p>
                  <p className="text-xs font-mono text-slate-400">Public (No Key Req.)</p>
                </div>
              </div>
            </section>

            {/* ENDPOINT */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Code2 size={20} className="text-teal-500" /> Primary Endpoint
              </h2>
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-teal-500/20 to-transparent rounded-lg blur opacity-25" />
                <div className="relative flex items-center justify-between bg-black p-4 rounded-lg border border-slate-800 font-mono text-sm">
                  <span className="text-emerald-400">GET</span>
                  <span className="text-slate-200">/api/admin/reports</span>
                  <button 
                    onClick={() => navigator.clipboard.writeText('/api/admin/reports')}
                    className="text-[10px] bg-slate-800 px-2 py-1 rounded hover:bg-slate-700 transition-colors uppercase font-bold"
                  >
                    Copy
                  </button>
                </div>
              </div>
              <p className="text-sm text-slate-500">
                Returns an array of verified urban signals. Filter results where <code className="text-teal-400">status === "approved"</code> for active monitoring.
              </p>
            </section>

            {/* RESPONSE FIELDS */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Layers size={20} className="text-teal-500" /> Schema Definitions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 rounded-lg bg-slate-900/30 border border-slate-800 space-y-2">
                  <p><span className="text-teal-500 font-bold">id</span> <span className="text-slate-600">UUID</span></p>
                  <p><span className="text-teal-500 font-bold">type</span> <span className="text-slate-600">Issue Category</span></p>
                  <p><span className="text-teal-500 font-bold">location</span> <span className="text-slate-600">Address String</span></p>
                  <p><span className="text-teal-500 font-bold">image_url</span> <span className="text-slate-600">Supabase Public URL</span></p>
                </div>
                <div className="p-4 rounded-lg bg-slate-900/30 border border-slate-800 space-y-2">
                  <p><span className="text-teal-500 font-bold">lat / lng</span> <span className="text-slate-600">Float Coordinates</span></p>
                  <p><span className="text-teal-500 font-bold">impact_level</span> <span className="text-slate-600">Integer (1-3)</span></p>
                  <p><span className="text-teal-500 font-bold">status</span> <span className="text-slate-600">approved | resolved</span></p>
                  <p><span className="text-teal-500 font-bold">created_at</span> <span className="text-slate-600">ISO Timestamp</span></p>
                </div>
              </div>
            </section>

            {/* IMPACT SEMANTICS */}
            <section className="space-y-6">
              <h2 className="text-xl font-bold text-white">Severity Interpretation</h2>
              <div className="space-y-6 bg-slate-900/30 p-6 rounded-2xl border border-slate-800 shadow-inner">
                <MappingRow 
                  title="Drain Blockage / Sewage" 
                  l1="Slow runoff / Bad odor" 
                  l2="Visible blockage / Overflowing" 
                  l3="Total pipe failure / Hazardous" 
                />
                <MappingRow 
                  title="Flash Flood / Water Logging" 
                  l1="Minor puddles / Accessible" 
                  l2="Ankle deep / Road restricted" 
                  l3="Severe / Waist deep / Road closed" 
                />
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: CODE SAMPLES */}
          <div className="space-y-8">
            <div className="sticky top-24 space-y-6">
              <div className="p-1 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
                <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 rounded-t-2xl">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live API Response</span>
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                    <div className="w-2 h-2 rounded-full bg-amber-500/50" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                  </div>
                </div>
                <pre className="p-4 text-[11px] font-mono overflow-x-auto text-teal-300 leading-relaxed max-h-[400px]">
{`[
  {
    "id": "7429d5fe-4749-...",
    "created_at": "2026-02-02T17:33:32Z",
    "type": "Drain Blockage",
    "impact_level": 2,
    "location": "Jalukbari, Guwahati...",
    "lat": 26.1579,
    "lng": 91.6676,
    "image_url": "https://supabase.co/...",
    "status": "resolved",
    "governing_body": "Guwahati Municipal"
  }
]`}
                </pre>
              </div>

              <div className="p-6 rounded-2xl bg-teal-500/5 border border-teal-500/20">
                <ShieldCheck className="text-teal-500 mb-3" size={24} />
                <h3 className="text-white font-bold mb-2 uppercase text-xs tracking-wider">Public Usage</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Data is provided "as is" for public interest. Please implement caching to avoid hitting rate limits during monsoon peak times.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER AREA */}
        <div className="mt-20 pt-8 border-t border-slate-900 text-center">
          <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">
            WASP Open Intelligence Initiative · Guwahati, Assam · 2026
          </p>
        </div>
      </div>
    </div>
  );
}

function MappingRow({ title, l1, l2, l3 }: { title: string; l1: string; l2: string; l3: string }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-black text-teal-500 uppercase tracking-tighter flex items-center gap-2">
        <Droplets size={14} /> {title}
      </h3>
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 bg-black/40 rounded-lg border border-slate-800">
          <span className="block text-[10px] text-emerald-500 font-bold mb-1 italic tracking-widest">LVL 1</span>
          <p className="text-[11px] leading-tight text-slate-400">{l1}</p>
        </div>
        <div className="p-3 bg-black/40 rounded-lg border border-slate-800">
          <span className="block text-[10px] text-amber-500 font-bold mb-1 italic tracking-widest">LVL 2</span>
          <p className="text-[11px] leading-tight text-slate-400">{l2}</p>
        </div>
        <div className="p-3 bg-black/40 rounded-lg border border-slate-800">
          <span className="block text-[10px] text-red-500 font-bold mb-1 italic tracking-widest">LVL 3</span>
          <p className="text-[11px] leading-tight text-slate-400">{l3}</p>
        </div>
      </div>
    </div>
  );
}