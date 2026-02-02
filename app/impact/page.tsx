'use client';

import Navbar from "@/app/components/Navbar";
import { Droplets, ShieldCheck, BarChart3, Users, Zap, Database } from "lucide-react";

export default function ImpactPage() {
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[#020817] text-white px-6 py-20 mt-10">
                <div className="mx-auto max-w-5xl space-y-24">

                    {/* HERO SECTION */}
                    <section className="text-center max-w-3xl mx-auto space-y-6">
                        <div className="inline-block px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-widest uppercase">
                            Urban Resilience Intelligence
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-black tracking-tighter">
                            Mitigating Urban Floods with <span className="text-cyan-400">WASP</span>
                        </h1>
                        <p className="text-slate-400 text-lg leading-relaxed font-medium">
                            The Water, Analytics, and Sewage Platform (WASP) transforms citizen-led reports into verified data, helping cities combat flash floods, drain blockages, and water-logging through real-time intelligence.
                        </p>
                    </section>

                    {/* WHO BENEFITS GRID */}
                    <section>
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                            <div>
                                <h2 className="text-3xl font-black uppercase tracking-tighter">Stakeholder Impact</h2>
                                <p className="text-slate-500 font-mono text-sm">Targeted benefits across the urban ecosystem</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <ImpactCard
                                icon={<Users className="text-cyan-400" />}
                                title="The Community"
                                points={[
                                    'Real-time alerts for flood-prone routes',
                                    'Direct channel to report drain blockages with photo proof',
                                    'Accountability through public tracking of sewage issues',
                                ]}
                            />

                            <ImpactCard
                                icon={<ShieldCheck className="text-emerald-400" />}
                                title="Municipal Authorities"
                                points={[
                                    'Verified visual evidence reduces "ghost" complaints',
                                    'Automatic geo-tagging identifies exact blockage points',
                                    'Rapid response deployment during monsoon surges',
                                ]}
                            />

                            <ImpactCard
                                icon={<BarChart3 className="text-amber-400" />}
                                title="City Administrators"
                                points={[
                                    'Heatmaps of recurring water-logging zones',
                                    'Budget allocation based on infrastructure severity',
                                    'Data-backed justification for new drainage projects',
                                ]}
                            />

                            <ImpactCard
                                icon={<Database className="text-blue-400" />}
                                title="Environmental Researchers"
                                points={[
                                    'Open-access historical data on urban runoff',
                                    'Correlation analysis between rainfall and flood depth',
                                    'Independent monitoring of civic maintenance efficacy',
                                ]}
                            />
                        </div>
                    </section>

                    {/* TIMELINE OF IMPACT */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-slate-800 pt-16">
                        <section className="space-y-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Zap className="text-yellow-500 w-5 h-5" /> Immediate Operations
                            </h2>
                            <div className="space-y-4">
                                <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-colors">
                                    <p className="text-slate-300 text-sm leading-relaxed">
                                        <span className="text-white font-bold block mb-1">Crisis Response:</span> 
                                        Enables emergency crews to prioritize life-threatening flash floods over minor street puddles based on verified Impact Levels.
                                    </p>
                                </div>
                                <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-colors">
                                    <p className="text-slate-300 text-sm leading-relaxed">
                                        <span className="text-white font-bold block mb-1">Visual Verification:</span> 
                                        Removes ambiguity by requiring on-site photos, ensuring maintenance teams bring the right equipment for specific blockages.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <BarChart3 className="text-cyan-500 w-5 h-5" /> Long-Term Scalability
                            </h2>
                            <div className="space-y-4">
                                <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-colors">
                                    <p className="text-slate-300 text-sm leading-relaxed">
                                        <span className="text-white font-bold block mb-1">Predictive Maintenance:</span> 
                                        By analyzing where drains block repeatedly, WASP helps cities clean pipes *before* the rainy season starts.
                                    </p>
                                </div>
                                <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-colors">
                                    <p className="text-slate-300 text-sm leading-relaxed">
                                        <span className="text-white font-bold block mb-1">Smart-City Synergy:</span> 
                                        WASP’s Public API is ready to plug into city-wide dashboards and IoT sensors for a fully automated flood-warning system.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* CLOSING TAGLINE */}
                    <section className="py-12 border-t border-slate-800 text-center space-y-4">
                        <h2 className="text-2xl font-black tracking-tight text-white uppercase italic">
                            Building a Flood-Resilient Future
                        </h2>
                        <p className="text-slate-500 max-w-2xl mx-auto italic font-serif">
                            "Data is the most effective dam against urban chaos. WASP ensures that every drop of information counts."
                        </p>
                    </section>

                </div>
            </div>
        </>
    );
}

/* ---------- REUSABLE COMPONENTS ---------- */

function ImpactCard({ 
    title, 
    points, 
    icon 
}: { 
    title: string; 
    points: string[]; 
    icon: React.ReactNode 
}) {
    return (
        <div className="relative group p-8 rounded-[2rem] bg-slate-900/50 border border-slate-800 hover:border-cyan-500/50 transition-all duration-500 shadow-xl">
            <div className="mb-6 p-3 w-fit rounded-xl bg-slate-800 group-hover:bg-cyan-500/10 transition-colors">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-4 text-white group-hover:text-cyan-400 transition-colors">
                {title}
            </h3>
            <ul className="space-y-3">
                {points.map((p, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-400 leading-relaxed">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
                        {p}
                    </li>
                ))}
            </ul>
        </div>
    );
}