import React from 'react';
import SpeedCalculator from './components/SpeedCalculator';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">TM Calc & Guide</h1>
              <p className="text-xs text-slate-400">Austroads & MRWA Reference</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Information Banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8 flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-semibold">Data Sources</p>
            <p className="mt-1 text-blue-600">
              Calculator logic based on <strong>AGTTM Part 3</strong> (Sign Spacing, Tapers) and <strong>MRWA Code of Practice</strong> (Lane Widths).
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
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span>AGTTM Part 3: Static Works</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span>MRWA Code of Practice (Lane Widths)</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl p-6 text-white shadow-md">
              <h3 className="font-bold text-lg mb-2">Safety First</h3>
              <p className="text-sm opacity-90">
                Always conduct a risk assessment before implementing any TGS. Site specific conditions may require variations to standard drawings.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;