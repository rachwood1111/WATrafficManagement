
import React, { useState, useEffect } from 'react';
import { getSimplifiedData, getUhfGuide } from '../data/simplifiedData';
import { SimplifiedGuideData } from '../types';

const SpeedCalculator: React.FC = () => {
  const [speed, setSpeed] = useState<number>(60);
  const [data, setData] = useState<SimplifiedGuideData>(getSimplifiedData(60));

  useEffect(() => {
    setData(getSimplifiedData(speed));
  }, [speed]);

  const speeds = [40, 50, 60, 70, 80, 90, 100, 110];
  const uhfGroups = getUhfGuide();

  return (
    <div className="space-y-8">
      
      {/* 1. Speed Selector */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="bg-orange-100 text-orange-600 p-1.5 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </span>
          Select Posted Speed Limit
        </h2>
        <div className="flex flex-wrap gap-2">
          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`flex-1 min-w-[70px] py-3 rounded-xl font-bold text-lg transition-all duration-200 ${
                speed === s
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 scale-105'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Key Data Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Sign Spacing */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 flex justify-between items-center">
            <h3 className="font-bold text-blue-900">Sign Spacing</h3>
            <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded">AGTTM Pt 3</span>
          </div>
          <div className="p-6">
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <p className="text-sm text-slate-500 mb-1">Base Value</p>
                 <p className="text-4xl font-extrabold text-slate-800">{data.signSpacing.base}<span className="text-xl font-normal text-slate-500">m</span></p>
               </div>
               <div className="border-l border-slate-100 pl-4">
                 <p className="text-sm text-slate-500 mb-1">Tolerance Range</p>
                 <p className="text-lg font-bold text-blue-600">
                   {data.signSpacing.min}m - {data.signSpacing.max}m
                 </p>
                 <p className="text-xs text-slate-400 mt-1">(-10% to +25% or +15m)</p>
                 {data.signSpacingNote && (
                   <p className="text-xs text-blue-600 font-medium mt-1">{data.signSpacingNote}</p>
                 )}
               </div>
             </div>
          </div>
        </div>

        {/* Card 2: Lane Widths */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100 flex justify-between items-center">
            <h3 className="font-bold text-emerald-900">Lane Widths</h3>
            <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-1 rounded">MRWA CoP</span>
          </div>
          <div className="p-6 flex items-end justify-between">
            <div>
              <p className="text-4xl font-extrabold text-slate-800">{data.laneWidth.toFixed(1)}<span className="text-xl font-normal text-slate-500">m</span></p>
              {data.laneWidthNote && (
                <p className="text-sm text-emerald-600 font-medium mt-1">{data.laneWidthNote}</p>
              )}
            </div>
            <div className="h-10 w-24 bg-slate-200 rounded-sm relative overflow-hidden flex items-center justify-center">
               <div className="absolute inset-y-0 left-0 border-l-2 border-dashed border-slate-400"></div>
               <div className="absolute inset-y-0 right-0 border-r-2 border-dashed border-slate-400"></div>
               <span className="text-xs text-slate-500 font-mono">← {data.laneWidth}m →</span>
            </div>
          </div>
        </div>

        {/* Card 3: Taper Lengths */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden md:col-span-2">
          <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100 flex justify-between items-center">
            <h3 className="font-bold text-indigo-900">Taper Lengths</h3>
            <span className="text-xs font-medium bg-indigo-100 text-indigo-700 px-2 py-1 rounded">AGTTM Pt 3 Table 5.7</span>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-xl font-bold text-indigo-600">M</div>
               <div>
                 <p className="text-sm text-slate-500">Merge Taper</p>
                 <p className="text-3xl font-bold text-slate-800">{data.taperMerge}<span className="text-lg font-normal text-slate-500">m</span></p>
               </div>
            </div>
             <div className="flex items-center gap-4">
               <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-xl font-bold text-indigo-600">L</div>
               <div>
                 <p className="text-sm text-slate-500">Lateral Shift Taper</p>
                 <p className="text-3xl font-bold text-slate-800">{data.taperLateral}<span className="text-lg font-normal text-slate-500">m</span></p>
               </div>
            </div>
          </div>
        </div>

        {/* Card 4: UHF Channels Guide */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden md:col-span-2">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">UHF Channel Guide</h3>
            <span className="text-xs font-medium bg-slate-200 text-slate-600 px-2 py-1 rounded">Communications</span>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {uhfGroups.map((group, idx) => (
              <div key={idx} className={`rounded-xl border p-4 ${group.colorClass}`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{group.icon}</span>
                  <h4 className="font-bold text-sm uppercase tracking-wide opacity-90">{group.category}</h4>
                </div>
                <ul className="space-y-2">
                  {group.channels.map((ch, cIdx) => (
                    <li key={cIdx} className="text-sm flex flex-col">
                      <span className="font-bold">CH {ch.id}</span>
                      <span className="text-xs opacity-75">{ch.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SpeedCalculator;
