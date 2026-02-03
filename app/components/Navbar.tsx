'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Droplets } from 'lucide-react';

const NAV_LINKS = [
  { name: 'How it Works', href: '/#how-it-works' },
  { name: 'Live Map', href: '/map' },
  { name: 'Impact', href: '/impact' },
  { name: 'API', href: '/api-docs' },
  { name: 'Tech Stack', href: '/tech' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-9 w-9 rounded-xl bg-teal-500 flex items-center justify-center shadow-[0_0_15px_rgba(20,184,166,0.4)] group-hover:scale-105 transition-transform">
              <Droplets className="text-zinc-950 w-5 h-5 fill-current" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-white tracking-tighter leading-none text-lg">
                WASP
              </span>
              <span className="text-[10px] text-teal-500 font-bold tracking-[0.2em] leading-none uppercase">
                Water Alert System Prototype
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 
                    ${isActive 
                      ? 'text-white bg-white/5' 
                      : 'text-zinc-400 hover:text-teal-400 hover:bg-teal-500/5'
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Action Button (Optional) */}
          <div className="flex items-center">
            <Link 
              href="/report"
              className="bg-teal-600 hover:bg-teal-500 text-zinc-950 text-xs font-black px-4 py-2 rounded-full transition-all shadow-lg active:scale-95"
            >
              REPORT ISSUES
            </Link>
          </div>

        </div>
      </div>
      
      {/* Subtle Scanline Animation Effect */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-teal-500/50 to-transparent opacity-30 shadow-[0_1px_10px_rgba(20,184,166,0.2)]" />
    </nav>
  );
}