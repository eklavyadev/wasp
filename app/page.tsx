import Image from "next/image";
import Link from "next/link";
import HowItWorks from "./components/HowItWorks";
import { ApprovedReports } from "./components/ApprovedReports";


export default function Home() {
  return (
    <>
    <div className="min-h-screen bg-zinc-950 text-zinc-200 relative overflow-hidden">

    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-zinc-950/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-teal-600 flex items-center justify-center">
                <span className="text-sm font-bold text-black">W</span>
              </div>
              <span className="font-semibold text-white tracking-wide">
                WASP
              </span>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
              <a href="#how-it-works" className="hover:text-white transition">
                How it Works
              </a>
              <a href="#map" className="hover:text-white transition">
                Map
              </a>
              <a href="#api" className="hover:text-white transition">
                API
              </a>
              <a href="#tech" className="hover:text-white transition">
                Tech Stack
              </a>
              <a href="#impact" className="hover:text-white transition">
                Impact
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        {/* HERO */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-sm text-zinc-400 mb-6">
            <span className="h-2 w-2 rounded-full bg-teal-500 mr-2 animate-pulse" />
            A Validation-First Flood Intelligence Platform
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-white">
            <span className="block">Smart Flood Alerting</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">
              for Urban Resilience
            </span>
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-zinc-400 leading-relaxed">
            WASP is a prototype system that validates citizen inputs into reliable flood/drain alerts under municipal oversight
          </p>
        </div>


        {/* ACTION CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* REPORT ISSUE CARD */}
          <Link href="/report" className="group">
            <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 transition hover:border-teal-500/50 hover:bg-zinc-900 cursor-pointer">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                <svg
                  className="w-24 h-24 text-teal-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
              </div>

              <div className="h-12 w-12 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center mb-6 group-hover:bg-teal-600 group-hover:text-black transition">
                ⚠️
              </div>

              <h3 className="text-2xl font-semibold text-white mb-3">
                Report Issue
              </h3>

              <p className="text-zinc-400 mb-8 leading-relaxed">
                Report flash flooding/drain blockage reports. Submissions are geo-tagged
                and verified using AI, then sent to Municipality for resolving.
              </p>

              <div className="flex items-center text-teal-400 font-medium group-hover:text-teal-300 transition">
                Submit Report
                <span className="ml-2 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </div>
          </Link>

          {/* DASHBOARD CARD */}
          <Link href="/dashboard" className="group">
            <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 transition hover:border-cyan-500/50 hover:bg-zinc-900 cursor-pointer">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                <svg
                  className="w-24 h-24 text-cyan-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                </svg>
              </div>

              <div className="h-12 w-12 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-6 group-hover:bg-cyan-600 group-hover:text-black transition">
                📊
              </div>

              <h3 className="text-2xl font-semibold text-white mb-3">
                Flood Intelligence Dashboard
              </h3>

              <p className="text-zinc-400 mb-8 leading-relaxed">
                View validated flood signals with confidence scores,
                prioritization, and spatial insights designed for
                action-oriented decisions.
              </p>

              <div className="flex items-center text-cyan-400 font-medium group-hover:text-cyan-300 transition">
                View Dashboard
                <span className="ml-2 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </div>
          </Link>
        </div>
        </main>
    <HowItWorks/>

    <ApprovedReports/>
    </div>
    </>
  );
}
