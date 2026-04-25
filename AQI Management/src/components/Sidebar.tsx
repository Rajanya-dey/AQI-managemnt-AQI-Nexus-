import React from 'react';
import { Wind, Menu, Activity, Sun, Moon } from 'lucide-react';
import { MODES, CITIES, getMaskRecommendation } from '../constants';

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  currentMode,
  setCurrentMode,
  setCurrentView,
  darkMode,
  setDarkMode,
  theme
}: any) {
  return (
    <aside className={`flex-shrink-0 transition-all duration-300 flex flex-col z-30 
        ${sidebarOpen ? 'w-64' : 'w-20'} 
        ${theme.immersive ? 'bg-black/10 backdrop-blur-lg border-r border-white/10' : (darkMode ? 'bg-neutral-900 border-r border-neutral-800' : 'bg-white border-r border-slate-200')}
    `}>
        <div className={`h-16 flex items-center justify-between px-4 border-b ${theme.immersive ? 'border-white/10' : 'border-inherit'}`}>
        {sidebarOpen && <div className="font-bold text-xl tracking-tight flex items-center gap-2"><Wind className={theme.immersive ? 'text-white' : 'text-blue-500'} /> AirGuard</div>}
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 ${!sidebarOpen && 'mx-auto'}`}>
            <Menu size={20} />
        </button>
        </div>

        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        {MODES.map(mode => (
            <button
            key={mode.id}
            onClick={() => {setCurrentMode(mode.id); if(mode.id !== 'user') setCurrentView('input');}}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all font-medium text-sm
                ${currentMode === mode.id 
                ? (theme.immersive ? 'bg-white/20 text-white shadow-lg' : 'bg-blue-600 text-white shadow-lg shadow-blue-500/20') 
                : `hover:bg-black/5 dark:hover:bg-white/10 opacity-80 hover:opacity-100`
                } ${!sidebarOpen && 'justify-center'}`}
            >
            <mode.icon size={20} />
            {sidebarOpen && <span>{mode.label}</span>}
            </button>
        ))}
        
        {sidebarOpen && (
            <div className={`mt-8 pt-6 border-t ${theme.immersive ? 'border-white/10' : 'border-inherit'}`}>
                <div className="px-3 mb-3 flex items-center justify-between">
                    <span className={`text-xs font-bold uppercase tracking-wider opacity-70`}>Live Ranking</span>
                    <Activity size={12} />
                </div>
                <div className="space-y-2">
                    {CITIES.sort((a,b) => b.baseAQI - a.baseAQI).slice(0, 5).map((city, idx) => {
                        const mask = getMaskRecommendation(city.baseAQI);
                        return (
                            <div key={idx} className={`mx-2 p-2 rounded-lg flex items-center justify-between text-xs hover:bg-white/5 transition-colors`}>
                                <div className="flex items-center gap-2">
                                    <span className="w-5 text-center font-mono opacity-50">{idx+1}</span>
                                    <span className="font-medium">{city.name}</span>
                                </div>
                                <div className={`px-2 py-0.5 rounded font-bold ${theme.immersive ? 'bg-white/20 text-white' : (mask.status === 'Good' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}`}>
                                    {city.baseAQI}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        )}
        </nav>

        <div className={`p-4 border-t ${theme.immersive ? 'border-white/10' : 'border-inherit'}`}>
        <button onClick={() => setDarkMode(!darkMode)} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${theme.immersive ? 'bg-white/10 hover:bg-white/20' : (darkMode ? 'bg-neutral-800 text-yellow-400' : 'bg-slate-100 text-slate-600')} ${!sidebarOpen && 'justify-center'}`}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            {sidebarOpen && <span className="text-sm font-medium">Toggle Theme</span>}
        </button>
        </div>
    </aside>
  );
}
