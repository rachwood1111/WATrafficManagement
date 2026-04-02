import React from 'react';
import SpeedCalculator from './components/SpeedCalculator';
import PWAInstallPrompt from './components/PWAInstallPrompt';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <PWAInstallPrompt />
      {/* Header */}
      <header className="bg-white text-[#1A1A1A] shadow-md border-b-2 border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 bg-gray-50 p-2 rounded-xl border border-gray-100 shadow-sm">
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Base */}
                <path d="M2 20H22V23H2V20Z" fill="#1A1A1A" />
                {/* Orange Body */}
                <path d="M5 20L12 2L19 20H5Z" fill="#F27D26" />
                {/* Reflective Strip 1 */}
                <path d="M8.5 10.5L15.5 10.5L16.5 13.5H7.5L8.5 10.5Z" fill="#FFFFFF" fillOpacity="0.95" />
                {/* Reflective Strip 2 (closer to top) */}
                <path d="M10.2 6L13.8 6L14.5 8H9.5L10.2 6Z" fill="#FFFFFF" fillOpacity="0.95" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight uppercase leading-none">
                <span className="text-[#F27D26]">TTM</span>
                <span className="ml-2 text-[#1A1A1A]">WA Cheat Sheet</span>
              </h1>
              <p className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase mt-1">Western Australia Standards</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Information Banner */}
        <div className="bg-slate-100 border-l-4 border-[#F27D26] rounded-r-lg p-4 mb-8 flex items-start gap-3 shadow-sm">
          <svg className="w-5 h-5 text-[#F27D26] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-slate-700">
            <p className="font-bold uppercase tracking-tight text-[#1A1A1A]">Data Sources</p>
            <p className="mt-0.5">
              Calculator logic based on <strong className="text-[#F27D26]">AGTTM Part 3</strong> and <strong className="text-[#F27D26]">MRWA Code of Practice</strong>.
            </p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SpeedCalculator />
          </div>

          {/* Sidebar / Quick Links (Visual Filler) */}
          <div className="hidden lg:block space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">Loaded Standards</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#F27D26]"></span>
                  <span>AGTTM Part 3: Static Works</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#F27D26]"></span>
                  <span>MRWA Code of Practice (Lane Widths)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-16 pt-8 border-t border-slate-200 text-center">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-3">Disclaimer</p>
          <p className="text-sm text-slate-500 max-w-3xl mx-auto leading-relaxed">
            This application is for informational purposes only. It is intended as a quick reference guide and does not replace professional judgment or official documentation. All traffic management must be implemented in accordance with an approved Traffic Guidance Scheme (TGS).
          </p>
        </div>
      </main>
    </div>
  );
};

export default App;