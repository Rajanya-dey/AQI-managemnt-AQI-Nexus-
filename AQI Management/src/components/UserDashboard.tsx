import React from 'react';
import { Shield, Bike, Fan, Calendar, Loader2, Square, Volume2, AlertTriangle } from 'lucide-react';
import { getAQIBarColor, ROLES } from '../constants';
import type { ForecastDay } from '../types';

export default function UserDashboard({
  aqiData,
  selectedCity,
  userName,
  userRole,
  userConditions,
  roleDetail,
  customCondition,
  forecast,
  isGeneratingAudio,
  isPlayingAudio,
  handleGenerateAudio,
  theme,
  getMaskRecommendation,
  getRoleDisplay,
  getConditionDisplay,
  WeatherIcon,
  recs
}: any) {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-700 w-full">
        
        {/* --- HERO SECTION --- */}
        <div className="flex flex-col items-center text-center justify-center py-10 relative">
            <div className="animate-bounce" style={{ animationDuration: '3s' }}>
            {WeatherIcon && <WeatherIcon size={120} strokeWidth={1} className="drop-shadow-2xl opacity-90" />}
            </div>
            
            <div className="mt-4 relative">
                <h1 className="text-9xl font-black tracking-tighter drop-shadow-lg leading-none">
                    {aqiData.aqi}
                </h1>
                <span className="absolute -top-4 -right-8 text-2xl font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">AQI</span>
            </div>
            
            <h2 className="text-3xl font-medium mt-2 drop-shadow-md">{getMaskRecommendation(aqiData.aqi).status}</h2>
            <p className="opacity-80 mt-1 max-w-md text-lg font-light leading-relaxed">{getMaskRecommendation(aqiData.aqi).note}</p>

            <div className="flex gap-8 mt-8">
                <div className="text-center">
                    <div className="text-sm opacity-70 uppercase tracking-widest font-bold">Temp</div>
                    <div className="text-2xl font-medium">{aqiData.temp}°</div>
                </div>
                <div className="w-px bg-white/30"></div>
                <div className="text-center">
                    <div className="text-sm opacity-70 uppercase tracking-widest font-bold">PM2.5</div>
                    <div className="text-2xl font-medium">{aqiData.pm25}</div>
                </div>
                <div className="w-px bg-white/30"></div>
                <div className="text-center">
                    <div className="text-sm opacity-70 uppercase tracking-widest font-bold">Humidity</div>
                    <div className="text-2xl font-medium">{aqiData.humidity}%</div>
                </div>
            </div>
        </div>

        {/* --- GLASS CARDS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Mask Recommendation Card */}
            <div className={`col-span-1 md:col-span-2 rounded-[2.5rem] p-8 flex items-center justify-between relative overflow-hidden ${theme.card}`}>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2 opacity-70 text-sm font-bold uppercase tracking-wider">
                        <Shield size={16} /> Recommendation
                    </div>
                    <h3 className="text-3xl font-bold mb-2">{getMaskRecommendation(aqiData.aqi).name}</h3>
                    <div className="inline-block px-3 py-1 bg-white/20 rounded-lg text-sm font-medium mb-4">
                        {getMaskRecommendation(aqiData.aqi).layers}
                    </div>
                    <p className="text-sm opacity-80 max-w-xs leading-relaxed">
                        Based on current PM2.5 levels in {selectedCity.name}.
                    </p>
                </div>
                <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-4 translate-y-4">
                    {React.createElement(getMaskRecommendation(aqiData.aqi).icon, { size: 180 })}
                </div>
            </div>

            {/* Quick Stats Cards */}
            <div className={`rounded-[2.5rem] p-6 flex flex-col items-center justify-center text-center gap-2 ${theme.card}`}>
                <div className={`p-4 rounded-full ${recs.sport.allowed ? 'bg-green-400/20' : 'bg-red-400/20'} mb-2`}>
                    <Bike size={32} />
                </div>
                <div className="font-bold text-lg">{recs.sport.text}</div>
            </div>
            <div className={`rounded-[2.5rem] p-6 flex flex-col items-center justify-center text-center gap-2 ${theme.card}`}>
                <div className={`p-4 rounded-full ${!recs.purifier.allowed ? 'bg-blue-400/20' : 'bg-orange-400/20'} mb-2`}>
                    <Fan size={32} />
                </div>
                <div className="font-bold text-lg">{recs.purifier.text}</div>
            </div>
        </div>

        {/* --- FORECAST & ROLE ADVICE --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={`lg:col-span-2 rounded-[2.5rem] p-8 ${theme.card}`}>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-white/20 rounded-2xl">
                        {React.createElement(ROLES.find(r => r.id === userRole)?.icon || Shield, { size: 24 })}
                    </div>
                    <div>
                        <h3 className="font-bold text-xl">Advisor: {getRoleDisplay()}</h3>
                        <p className="text-sm opacity-60">Personalized for {userName} {getConditionDisplay()}</p>
                    </div>
                </div>
                <div className="space-y-4 bg-black/10 rounded-3xl p-6">
                    <p className="leading-relaxed font-medium">
                        {aqiData.aqi > 200 
                            ? "⚠️ Critical Action: Suspend all outdoor operations. Ensure all indoor environments have active air filtration. Commute only in sealed vehicles." 
                            : "✅ Safe to proceed with normal routine, but keep a mask handy if you are traveling through high-traffic zones."}
                    </p>
                    {userConditions.length > 0 && !userConditions.includes('none') && (
                        <div className="mt-2 p-3 bg-rose-500/20 border border-rose-500/30 rounded-xl text-sm font-bold text-rose-100 flex items-center gap-2">
                            <AlertTriangle size={16} />
                            Special Alert: Monitor your symptoms closely today due to {getConditionDisplay()}.
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-6">
                
                {/* 7-Day Trend Card */}
                <div className={`rounded-[2.5rem] p-8 ${theme.card} bg-black/40 backdrop-blur-md border-white/10 flex flex-col min-h-[300px]`}>
                    <h3 className="font-bold mb-6 opacity-80 flex items-center gap-2"><Calendar size={16}/> 7-Day Trend</h3>
                    
                    <div className="flex-1 flex items-end justify-between gap-1 h-48">
                        {forecast.slice(0, 7).map((day: ForecastDay, i: number) => {
                            const heightPercent = Math.min(100, Math.max(5, (day.aqi / 500) * 100));
                            const barColor = getAQIBarColor(day.aqi);
                            
                            return (
                                <div key={i} className="flex flex-col items-center justify-end h-full w-full gap-1 group">
                                    <span className="text-[11px] font-bold text-white drop-shadow-md mb-1">{day.aqi}</span>
                                    <div className="flex-1 w-full flex justify-center relative min-h-[100px]">
                                        <div className="w-2 md:w-3 h-full bg-black/40 rounded-full absolute top-0"></div>
                                        <div 
                                            className={`w-2 md:w-3 rounded-full absolute bottom-0 transition-all duration-700 ease-out border-t border-white/50 ${barColor}`}
                                            style={{ height: `${heightPercent}%` }}
                                        >
                                        </div>
                                    </div>
                                    <span className="text-[10px] uppercase font-bold text-white/80 mt-2 tracking-wider">{day.day}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <button 
                    onClick={handleGenerateAudio} 
                    disabled={isGeneratingAudio}
                    className={`rounded-[2.5rem] p-6 ${theme.card} flex items-center justify-between group cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden`}
                >
                    <div className="text-left z-10">
                        <h4 className="font-bold text-lg">
                            {isPlayingAudio ? "Playing Report..." : "Audio Report"}
                        </h4>
                        <p className="text-xs opacity-70 mt-1">
                            {isPlayingAudio ? "Click to stop" : "Listen to summary"}
                        </p>
                    </div>
                    <div className={`p-4 rounded-full z-10 ${theme.immersive ? 'bg-white/20' : 'bg-blue-600 text-white'}`}>
                        {isGeneratingAudio ? (
                            <Loader2 size={24} className="animate-spin" />
                        ) : isPlayingAudio ? (
                            <Square size={24} className="fill-current" />
                        ) : (
                            <Volume2 size={24} className="group-hover:animate-pulse" />
                        )}
                    </div>
                    {isPlayingAudio && (
                        <div className="absolute inset-0 bg-white/10 animate-pulse z-0" style={{ animationDuration: '1s' }}></div>
                    )}
                </button>

            </div>
        </div>

    </div>
  );
}
