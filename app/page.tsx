import Image from "next/image";

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
            WASP is a prototype system that validates citizen inputs into reliable flood alerts under municipal oversight
          </p>
        </div>
        </main>



    </div>
    </>
  );
}
