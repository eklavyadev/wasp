'use client'; // Required for the script injection logic

import "./globals.css";
import { Inter } from "next/font/google";
import { useEffect } from "react";

const inter = Inter({
  subsets: ["latin"],
  display: "swap"
});

// Adding types for the window object to prevent TypeScript errors
declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {

  useEffect(() => {
    // 1. Define the initialization function for the Google Translate widget
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement({
        pageLanguage: 'en',
        // We include Assamese (as) and Hindi (hi) specifically for Guwahati context
        includedLanguages: 'en,as,hi', 
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false,
      }, 'google_translate_element');
    };

    // 2. Inject the official Google Translate script
    const addScript = document.createElement('script');
    addScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    addScript.async = true;
    document.body.appendChild(addScript);

    return () => {
      // Cleanup script on unmount if necessary
      document.body.removeChild(addScript);
    };
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        {/* This ID is where the language selector will appear. 
            You can move this div inside your Navbar for a cleaner look. */}
        <div className="fixed bottom-4 right-4 z-[9999] bg-slate-900 border border-teal-500/30 rounded-lg p-1 shadow-2xl">
          <div id="google_translate_element"></div>
        </div>

        {children}

        {/* Custom CSS to hide the Google Translate top bar for a cleaner UI */}
        <style jsx global>{`
          .goog-te-banner-frame.skiptranslate { display: none !important; }
          body { top: 0px !important; }
          .goog-te-gadget-simple {
            background-color: transparent !important;
            border: none !important;
            padding: 8px !important;
            font-family: inherit !important;
          }
          .goog-te-gadget-simple span {
            color: #14b8a6 !important; /* teal-500 */
            font-weight: bold;
          }
        `}</style>
      </body>
    </html>
  );
}