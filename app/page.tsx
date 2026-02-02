import Image from "next/image";

export default function Home() {
  return (
    <>
    <div className="min-h-screen bg-zinc-950 text-zinc-200 relative overflow-hidden">

    <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}
      />
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
      </div>
    </>
  );
}
