import React, { useState, useEffect, useMemo } from 'react';
import { Shield, Settings, Database, Lock, Construction, CheckCircle2, AlertTriangle, Info, MoreVertical } from 'lucide-react';
import { GOV_CITIES_DATA, GOV_TABS } from '../constants';

export default function GovernmentPortal() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [selectedCity, setSelectedCity] = useState('Delhi');
  const [selectedArea, setSelectedArea] = useState(GOV_CITIES_DATA['Delhi'][0]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
      setSelectedArea(GOV_CITIES_DATA[selectedCity][0]);
  }, [selectedCity]);

  const dashboardData = useMemo(() => {
      const hashStr = selectedCity + selectedArea;
      const hash = hashStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      
      let baseAqi;
      if (selectedCity === 'Delhi') baseAqi = 220 + (hash % 200); 
      else if (selectedCity === 'Kolkata') baseAqi = 150 + (hash % 150); 
      else if (selectedCity === 'Mumbai') baseAqi = 120 + (hash % 100); 
      else if (selectedCity === 'Bangalore') baseAqi = 60 + (hash % 90); 
      else if (selectedCity === 'Chennai') baseAqi = 80 + (hash % 100); 
      else if (selectedCity === 'Lucknow') baseAqi = 180 + (hash % 170); 
      else baseAqi = 100;
      
      let status, color, textColor;
      if (baseAqi <= 50) { status = 'Good'; color = '#4ade80'; textColor = '#14532d'; }
      else if (baseAqi <= 100) { status = 'Satisfactory'; color = '#a3e635'; textColor = '#3f6212'; }
      else if (baseAqi <= 200) { status = 'Moderate'; color = '#facc15'; textColor = '#713f12'; }
      else if (baseAqi <= 300) { status = 'Poor'; color = '#fb923c'; textColor = '#7c2d12'; }
      else if (baseAqi <= 400) { status = 'Very Poor'; color = '#f87171'; textColor = '#7f1d1d'; }
      else { status = 'Hazardous'; color = '#ef4444'; textColor = '#fff'; }

      const vehicles = 20 + (hash % 35);
      const industry = 15 + (hash % 25);
      const dust = 10 + (hash % 20);
      const others = 100 - (vehicles + industry + dust);

      return {
          aqi: baseAqi,
          status,
          color,
          textColor,
          sources: { vehicles, industry, dust, others }
      };
  }, [selectedCity, selectedArea]);

  return (
      <div className="h-full w-full bg-slate-50 font-sans flex flex-col text-slate-800">
          
          {/* Unified Bar Menu Header */}
          <header className="bg-white border-b border-slate-200 flex flex-col z-20">
              <div className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                          <Shield size={24} />
                      </div>
                      <div>
                          <h1 className="text-xl font-bold tracking-tight text-slate-900">Govt. AQI Portal</h1>
                          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Smart City Monitoring System</p>
                      </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                      {/* Area & City Combined Selectors */}
                      <div className="hidden md:flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-1">
                          <div className="flex items-center px-3 py-1.5 border-r border-slate-200">
                              <span className="text-slate-500 text-xs font-bold uppercase mr-2">City</span>
                              <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="bg-transparent font-bold text-slate-800 text-sm outline-none cursor-pointer appearance-none">
                                  {Object.keys(GOV_CITIES_DATA).map(city => <option key={city} value={city}>{city}</option>)}
                              </select>
                          </div>
                          <div className="flex items-center px-3 py-1.5">
                              <span className="text-slate-500 text-xs font-bold uppercase mr-2">Area</span>
                              <select value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)} className="bg-transparent font-bold text-slate-800 text-sm outline-none cursor-pointer appearance-none max-w-[120px] truncate">
                                  {GOV_CITIES_DATA[selectedCity].map(area => <option key={area} value={area}>{area}</option>)}
                              </select>
                          </div>
                      </div>

                      {/* Structured 3-Dot Menu */}
                      <div className="relative">
                          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer text-slate-600 border border-transparent hover:border-slate-200">
                              <MoreVertical size={20} />
                          </button>
                          {isMenuOpen && (
                              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-2">
                                  <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">Admin Tools</div>
                                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-2"><Settings size={14}/> Portal Settings</button>
                                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-2"><Database size={14}/> Manage Data Sources</button>
                                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600 transition-colors flex items-center gap-2"><Lock size={14}/> Secure Logout</button>
                              </div>
                          )}
                      </div>
                  </div>
              </div>

              {/* Horizontal Tabs */}
              <nav className="flex items-center px-6 gap-6 overflow-x-auto no-scrollbar border-t border-slate-100 bg-slate-50/50">
                  {GOV_TABS.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.name;
                      return (
                          <button 
                              key={item.name} 
                              onClick={() => setActiveTab(item.name)} 
                              className={`flex items-center gap-2 py-3 border-b-2 transition-all whitespace-nowrap ${isActive ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800 font-medium'}`}
                          >
                              <Icon size={16} />
                              <span className="text-sm">{item.name}</span>
                          </button>
                      );
                  })}
              </nav>
          </header>

          <main className="flex-1 p-4 md:p-6 overflow-y-auto w-full relative bg-slate-50/50">
              {activeTab !== 'Dashboard' ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 min-h-[400px]">
                      {React.createElement(GOV_TABS.find(t => t.name === activeTab)?.icon || Construction, { size: 80, className: "mb-4 opacity-50" })}
                      <h2 className="text-2xl font-semibold text-slate-600 mb-2">{activeTab} View</h2>
                      <p>This module is currently active and awaiting detailed data integration.</p>
                      <button onClick={() => setActiveTab('Dashboard')} className="mt-6 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition-colors">Return to Dashboard</button>
                  </div>
              ) : (
                  <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6 transition-all duration-500">
                          <div className="text-white rounded-xl shadow-sm p-4 flex items-center transition-colors duration-500" style={{ backgroundColor: dashboardData.color, color: dashboardData.textColor === '#fff' ? '#fff' : '#1e293b' }}>
                              <span className="text-xl font-bold">AQI: {dashboardData.aqi}</span>
                          </div>
                          <div className="text-white rounded-xl shadow-sm p-4 flex items-center transition-colors duration-500" style={{ backgroundColor: dashboardData.color, color: dashboardData.textColor === '#fff' ? '#fff' : '#1e293b' }}>
                              <span className="text-xl font-bold">Status: {dashboardData.status}</span>
                          </div>
                          <div className="bg-white text-slate-700 border border-slate-200 rounded-xl shadow-sm p-4 flex items-center">
                              <span className="text-lg font-semibold text-slate-500 mr-2">Area:</span>
                              <span className="text-lg font-bold truncate">{selectedArea}</span>
                          </div>
                          <div className="bg-white text-slate-700 border border-slate-200 rounded-xl shadow-sm p-4 flex items-center">
                              <span className="text-lg font-semibold">Time: <span className="font-normal text-slate-500">Live</span></span>
                          </div>
                      </div>

                      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                          <div className="xl:col-span-2 flex flex-col gap-6">
                              <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
                                  <div className="p-4 border-b border-slate-100 font-semibold text-slate-700 flex justify-between items-center">
                                      <span>{selectedCity} AQI Map</span>
                                      <span className="text-xs bg-amber-50 text-amber-600 px-2 py-1 rounded-md font-bold border border-amber-200">Maintenance</span>
                                  </div>
                                  
                                  {/* REPLACED SVG MAP WITH UNDER CONSTRUCTION MESSAGE */}
                                  <div className="p-4 flex-1 flex flex-col items-center justify-center bg-[#f8fafc] relative overflow-hidden rounded-b min-h-[300px]">
                                      <div className="flex flex-col items-center justify-center p-8 text-center bg-white border border-dashed border-slate-300 rounded-2xl w-full max-w-sm shadow-sm">
                                          <Construction size={48} className="text-amber-500 mb-4 opacity-80 animate-pulse" />
                                          <h3 className="text-lg font-bold text-slate-700 mb-2">Map Under Construction</h3>
                                          <p className="text-sm text-slate-500 leading-relaxed">The interactive AQI map visualization is currently being modified. Live geospatial data will be available here soon.</p>
                                      </div>
                                  </div>
                              </div>

                              <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                                  <div className="p-4 border-b border-slate-100 font-semibold text-slate-700">Suggested Actions for {selectedArea}</div>
                                  <div className="p-4 flex flex-col gap-3">
                                      {dashboardData.aqi > 200 ? (
                                          <>
                                              <div className="flex items-center gap-3"><CheckCircle2 size={20} className="text-green-500 flex-shrink-0" /><span className="text-slate-700 font-medium text-sm">Restrict Heavy Diesel Vehicles</span></div>
                                              <hr className="border-slate-100" />
                                              <div className="flex items-center gap-3"><CheckCircle2 size={20} className="text-green-500 flex-shrink-0" /><span className="text-slate-700 font-medium text-sm">Halt Construction Dust Generation</span></div>
                                              <hr className="border-slate-100" />
                                              <div className="flex items-center gap-3"><CheckCircle2 size={20} className="text-green-500 flex-shrink-0" /><span className="text-slate-700 font-medium text-sm">Issue Public Health Warning for Sensitive Groups</span></div>
                                          </>
                                      ) : (
                                          <>
                                              <div className="flex items-center gap-3"><CheckCircle2 size={20} className="text-green-500 flex-shrink-0" /><span className="text-slate-700 font-medium text-sm">Maintain Routine Sweeping Procedures</span></div>
                                              <hr className="border-slate-100" />
                                              <div className="flex items-center gap-3"><CheckCircle2 size={20} className="text-green-500 flex-shrink-0" /><span className="text-slate-700 font-medium text-sm">Conditions Normal - Outdoor Activities Safe</span></div>
                                          </>
                                      )}
                                  </div>
                              </div>
                          </div>

                          <div className="xl:col-span-1 flex flex-col gap-6">
                              <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[260px]">
                                  <div className="p-4 border-b border-slate-100 font-semibold text-slate-700 flex justify-between items-center">
                                      <span>{selectedArea} Trend</span>
                                      <span className="text-xs bg-amber-50 text-amber-600 px-2 py-1 rounded-md font-bold border border-amber-200">Maintenance</span>
                                  </div>
                                  
                                  {/* REPLACED TREND GRAPH WITH UNDER CONSTRUCTION MESSAGE */}
                                  <div className="p-4 flex-1 flex flex-col items-center justify-center bg-[#f8fafc] relative overflow-hidden rounded-b">
                                      <div className="flex flex-col items-center justify-center p-6 text-center bg-white border border-dashed border-slate-300 rounded-2xl w-full shadow-sm">
                                          <Construction size={36} className="text-amber-500 mb-3 opacity-80 animate-pulse" />
                                          <h3 className="text-sm font-bold text-slate-700 mb-2">Trend Data Under Construction</h3>
                                          <p className="text-xs text-slate-500 leading-relaxed">Historical trend analysis is currently being upgraded.</p>
                                      </div>
                                  </div>
                              </div>

                              <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                                  <div className="p-4 border-b border-slate-100 font-semibold text-slate-700">Pollution Sources</div>
                                  <div className="p-4 flex items-center justify-between">
                                      <div className="flex flex-col gap-3 text-sm text-slate-700 font-medium w-1/2">
                                          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#ef4444]"></div><span>Vehicles <strong className="text-slate-800 font-bold ml-1">{dashboardData.sources.vehicles}%</strong></span></div>
                                          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#facc15]"></div><span>Industry <strong className="text-slate-800 font-bold ml-1">{dashboardData.sources.industry}%</strong></span></div>
                                          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#22c55e]"></div><span>Dust <strong className="text-slate-800 font-bold ml-1">{dashboardData.sources.dust}%</strong></span></div>
                                          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#3b82f6]"></div><span>Others <strong className="text-slate-800 font-bold ml-1">{dashboardData.sources.others}%</strong></span></div>
                                      </div>
                                      <div className="relative w-32 h-32 rounded-full drop-shadow-md transition-all duration-1000 flex-shrink-0" 
                                            style={{ background: `conic-gradient(#ef4444 0% ${dashboardData.sources.vehicles}%, #facc15 ${dashboardData.sources.vehicles}% ${dashboardData.sources.vehicles + dashboardData.sources.industry}%, #22c55e ${dashboardData.sources.vehicles + dashboardData.sources.industry}% ${dashboardData.sources.vehicles + dashboardData.sources.industry + dashboardData.sources.dust}%, #3b82f6 ${dashboardData.sources.vehicles + dashboardData.sources.industry + dashboardData.sources.dust}% 100%)` }}>
                                      </div>
                                  </div>
                              </div>

                              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                  <div className="p-3 font-semibold text-sm flex items-center gap-2 text-white transition-colors duration-500" style={{ backgroundColor: dashboardData.aqi > 200 ? '#ef4444' : '#3b82f6' }}>
                                      {dashboardData.aqi > 200 ? <AlertTriangle size={16} /> : <Info size={16} />}
                                      {dashboardData.aqi > 200 ? 'Active Alerts' : 'Status Update'}
                                  </div>
                                  <div className="p-4 flex flex-col gap-2" style={{ backgroundColor: dashboardData.aqi > 200 ? '#fef2f2' : '#eff6ff' }}>
                                      <div className="text-sm">
                                          <span className="font-bold" style={{ color: dashboardData.aqi > 200 ? '#b91c1c' : '#1d4ed8' }}>{dashboardData.aqi > 200 ? 'ALERT:' : 'INFO:'}</span> 
                                          <span className="ml-1" style={{ color: dashboardData.aqi > 200 ? '#991b1b' : '#1e3a8a' }}>{dashboardData.aqi > 200 ? `High AQI detected in ${selectedArea}` : `Conditions stable in ${selectedArea}`}</span>
                                      </div>
                                      <div className="text-sm">
                                          <span className="font-bold" style={{ color: dashboardData.aqi > 200 ? '#b91c1c' : '#1d4ed8' }}>ACTION:</span> 
                                          <span className="ml-1" style={{ color: dashboardData.aqi > 200 ? '#991b1b' : '#1e3a8a' }}>{dashboardData.aqi > 200 ? 'Avoid Outdoor Activity' : 'No restrictions currently required.'}</span>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </>
              )}
          </main>
      </div>
  );
}
