'use client';

import Navbar from "@/app/components/Navbar";
import { Droplets, ShieldCheck, BarChart3, Users, Zap, Database, MessageSquare } from "lucide-react";

export default function ImpactPage() {
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[#020817] text-white px-6 py-20 mt-10">
                <div className="mx-auto max-w-5xl space-y-24">

                    {/* HERO SECTION */}
                    <section className="text-center max-w-3xl mx-auto space-y-6">
                        <div className="inline-block px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-widest uppercase">
                            Smart City Response Network
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-black tracking-tighter">
                            Solving Urban Floods with <span className="text-cyan-400">WASP</span>
                        </h1>
                        <p className="text-slate-400 text-lg leading-relaxed font-medium">
                            The <span className="text-white">Water Alert System Prototype (WASP)</span> bridges the gap between citizen observations and municipal action. By reporting drainage issues in real-time, we enable rapid, data-driven flood mitigation.
                        </p>
                    </section>

                    {/* WHO BENEFITS GRID */}
                    <section>
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                            <div>
                                <h2 className="text-3xl font-black uppercase tracking-tighter">Stakeholder Impact</h2>
                                <p className="text-slate-500 font-mono text-sm">Targeted benefits for the Guwahati ecosystem</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <ImpactCard
                                icon={<Users className="text-cyan-400" />}
                                title="Citizens & Residents"
                                points={[
                                    'Report water-logging and drain blockages in under 30 seconds',
                                    'View a real-time map of high-risk areas before traveling',
                                    'Directly influence municipal priority through community reporting',
                                ]}
                            />

                            <ImpactCard
                                icon={<MessageSquare className="text-emerald-400" />}
                                title="Municipal Field Officers"
                                points={[
                                    'Receive instant WhatsApp alerts for new critical issues',
                                    'Get precise GPS locations and photo proof on their mobile devices',
                                    'Prioritize repairs based on AI-verified impact levels (1-3)',
                                ]}
                            />

                            <ImpactCard
                                icon={<BarChart3 className="text-amber-400" />}
                                title="GMC Administrators"
                                points={[
                                    'Heatmaps of recurring drainage failures across wards',
                                    'Efficient resource allocation for cleaning teams',
                                    'Data-backed justification for drainage infrastructure upgrades',
                                ]}
                            />

                            <ImpactCard
                                icon={<ShieldCheck className="text-blue-400" />}
                                title="Public Safety"
                                points={[
                                    'Reduced flash-flood occurrence through preventive cleaning',
                                    'Faster emergency response times to blocked sewage lines',
                                    'Increased urban resilience against monsoon-heavy weather',
                                ]}
                            />
                        </div>
                    </section>

                    {/* TIMELINE OF IMPACT */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-slate-800 pt-16">
                        <section className="space-y-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Zap className="text-yellow-500 w-5 h-5" /> Operational Efficiency
                            </h2>
                            <div className="space-y-4">
                                <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-colors">
                                    <p className="text-slate-300 text-sm leading-relaxed">
                                        <span className="text-white font-bold block mb-1">Zero-Latency Dispatch:</span> 
                                        WASP bypasses slow bureaucratic paperwork by sending reports directly to regional officers via WhatsApp.
                                    </p>
                                </div>
                                <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-colors">
                                    <p className="text-slate-300 text-sm leading-relaxed">
                                        <span className="text-white font-bold block mb-1">Visual Evidence:</span> 
                                        Mandatory photo uploads ensure that the reported issue is genuine, eliminating "spam" complaints.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <BarChart3 className="text-cyan-500 w-5 h-5" /> Future Scalability
                            </h2>
                            <div className="space-y-4">
                                <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-colors">
                                    <p className="text-slate-300 text-sm leading-relaxed">
                                        <span className="text-white font-bold block mb-1">Predictive Analytics:</span> 
                                        By mapping historical data, WASP identifies which drains are likely to fail *before* the first rainfall.
                                    </p>
                                </div>
                                <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-colors">
                                    <p className="text-slate-300 text-sm leading-relaxed">
                                        <span className="text-white font-bold block mb-1">Community Awareness:</span> 
                                        The open dashboard promotes transparency, encouraging citizens to keep their surroundings clean.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* CLOSING TAGLINE */}
                    <section className="py-12 border-t border-slate-800 text-center space-y-4">
                        <h2 className="text-2xl font-black tracking-tight text-white uppercase italic">
                            Empowering Guwahati, One Report at a Time
                        </h2>
                        <p className="text-slate-500 max-w-2xl mx-auto italic font-serif">
                            "WASP ensures that the right information reaches the right hands at the right time to stop urban flooding."
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