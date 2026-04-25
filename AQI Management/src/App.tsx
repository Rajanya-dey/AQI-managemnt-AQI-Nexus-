import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, MapPin, ChevronDown, Sun, Cloud, CloudLightning, ShieldAlert, Activity } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import Sidebar from './components/Sidebar';
import ChatBot from './components/ChatBot';
import DevConsole from './components/DevConsole';
import UserSetup from './components/UserSetup';
import UserDashboard from './components/UserDashboard';
import GovernmentPortal from './components/GovernmentPortal';
import { CITIES, ROLES, HEALTH_CONDITIONS, getMaskRecommendation, MODES } from './constants';
import { pcmToWav } from './utils/audio';
import type { City, AQIData, ForecastDay, ChatMessage } from './types';

export default function App() {
    const [darkMode, setDarkMode] = useState(false);
    const [currentMode, setCurrentMode] = useState('user');
    const [currentView, setCurrentView] = useState('input');
    const [selectedCity, setSelectedCity] = useState<City>(CITIES[0]);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    
    const [devPassword, setDevPassword] = useState('');
    const [isDevAuthenticated, setIsDevAuthenticated] = useState(false);
    const [devError, setDevError] = useState('');
    
    const [userName, setUserName] = useState('');
    const [userAge, setUserAge] = useState<number | ''>('');
    const [userRole, setUserRole] = useState('student');
    const [roleDetail, setRoleDetail] = useState(''); 
    const [userConditions, setUserConditions] = useState<string[]>(['none']);
    const [customCondition, setCustomCondition] = useState(''); 
    const [loading, setLoading] = useState(false);

    const [chatOpen, setChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        { id: 1, type: 'bot', text: 'Hi! I am AirGuard. How can I help you today?' }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [isBotTyping, setIsBotTyping] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const [aqiData, setAqiData] = useState<AQIData | null>(null);
    const [forecast, setForecast] = useState<ForecastDay[]>([]);

    const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const randomFluctuation = Math.floor(Math.random() * 40) - 20;
        const currentAQI = Math.max(20, selectedCity.baseAQI + randomFluctuation);
        
        setAqiData({
            aqi: currentAQI,
            pm25: Math.floor(currentAQI / 2.5),
            pm10: Math.floor(currentAQI / 1.8),
            o3: Math.floor(Math.random() * 50),
            no2: Math.floor(Math.random() * 40),
            temp: Math.floor(32 + (Math.random() * 4 - 2)),
            humidity: Math.floor(40 + Math.random() * 20),
            wind: Math.floor(5 + Math.random() * 10)
        });

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const todayIndex = new Date().getDay();
        const next7Days = Array.from({ length: 7 }).map((_, i) => {
            const dayFluctuation = Math.floor(Math.random() * 150) - 50; 
            return {
                day: i === 0 ? 'Today' : days[(todayIndex + i) % 7],
                aqi: Math.max(30, Math.min(500, selectedCity.baseAQI + dayFluctuation)),
            };
        });
        setForecast(next7Days);
    }, [selectedCity]);

    const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        if (e.target.value === '') {
            setUserAge('');
        } else if (!isNaN(val) && val > 0) {
            setUserAge(val);
        }
    };

    const handleConditionToggle = (id: string) => {
        if (id === 'none') {
            setUserConditions(['none']);
        } else {
            let newConditions = userConditions.filter(c => c !== 'none');
            if (newConditions.includes(id)) {
                newConditions = newConditions.filter(c => c !== id);
            } else {
                newConditions.push(id);
            }
            if (newConditions.length === 0) newConditions = ['none'];
            setUserConditions(newConditions);
        }
    };

    const handleGenerate = () => {
        if (!userName || !userAge) {
            alert("Please enter your Name and Age to continue.");
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setCurrentView('report');
            setLoading(false);
        }, 1500);
    };
    
    const handleDevAuth = () => {
        if (devPassword === "HACK_THE_GALAXY@45321") {
            setIsDevAuthenticated(true);
            setDevError('');
        } else {
            setDevError('Access Denied: Invalid Authentication Token');
        }
    };

    const handleGenerateAudio = async () => {
        if (isPlayingAudio) {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
            setIsPlayingAudio(false);
            return;
        }

        if (!aqiData) return;

        setIsGeneratingAudio(true);
        const apiKey = process.env.GEMINI_API_KEY; 
        
        if (!apiKey) {
            alert("Please add your GEMINI_API_KEY to the environment variables to use this feature.");
            setIsGeneratingAudio(false);
            return;
        }
        
        try {
            const maskInfo = getMaskRecommendation(aqiData.aqi);
            const conditionText = userConditions.includes('none') ? "no major health conditions" : `conditions including ${userConditions.map(c => HEALTH_CONDITIONS.find(h => h.id === c)?.label).join(' and ')}`;
            
            const promptText = `
                Act as a personal health assistant named AirGuard. 
                Provide a concise, friendly 2-3 sentence audio summary for ${userName}, a ${userRole}. 
                Current location: ${selectedCity.name}. 
                AQI is ${aqiData.aqi} which is ${maskInfo.status}. 
                Recommendation: ${maskInfo.name}. 
                User has ${conditionText}. 
                Speak cheerfully but seriously about health.
            `;

            const ai = new GoogleGenAI({ apiKey });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: promptText,
                config: {
                    responseModalities: ["AUDIO"],
                    speechConfig: {
                        voiceConfig: {
                            prebuiltVoiceConfig: {
                                voiceName: "Aoede",
                            }
                        }
                    }
                }
            });

            const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

            if (base64Audio) {
                const binaryString = window.atob(base64Audio);
                const len = binaryString.length;
                const bytes = new Uint8Array(len);
                for (let i = 0; i < len; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }

                const wavBlob = pcmToWav(bytes, 24000); 
                const audioUrl = URL.createObjectURL(wavBlob);

                if (audioRef.current) {
                    audioRef.current.src = audioUrl;
                    audioRef.current.play();
                    setIsPlayingAudio(true);
                    
                    audioRef.current.onended = () => {
                        setIsPlayingAudio(false);
                    };
                }
            }
        } catch (error) {
            console.error("Audio generation failed:", error);
            alert("Could not generate audio report. Please add a valid API Key to your environment variables.");
        } finally {
            setIsGeneratingAudio(false);
        }
    };

    const handleSendMessage = () => {
        if (!chatInput.trim()) return;
        const userText = chatInput;
        setChatMessages(prev => [...prev, { id: Date.now(), type: 'user', text: userText }]);
        setChatInput('');
        setIsBotTyping(true);

        setTimeout(() => {
            const maskInfo = getMaskRecommendation(aqiData?.aqi || 0);
            const lowerInput = userText.toLowerCase();
            let botResponse = '';

            if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
                botResponse = `Hello ${userName || 'there'}! I'm monitoring the air in ${selectedCity.name}. Ask me about masks, sports, or health risks.`;
            } else if (lowerInput.includes('mask') || lowerInput.includes('wear') || lowerInput.includes('face')) {
                botResponse = `For the current AQI of ${aqiData?.aqi}, I recommend using a **${maskInfo.name}** (${maskInfo.layers}). ${maskInfo.note}`;
            } else if (lowerInput.includes('sport') || lowerInput.includes('run') || lowerInput.includes('exercise') || lowerInput.includes('outside')) {
                if ((aqiData?.aqi || 0) > 150) {
                    botResponse = `With an AQI of ${aqiData?.aqi}, outdoor exercise is NOT recommended. Please stick to indoor workouts today.`;
                } else {
                    botResponse = `Outdoor activities are generally okay right now, but listen to your body and take breaks if needed.`;
                }
            } else if (lowerInput.includes('window') || lowerInput.includes('air') || lowerInput.includes('ventilation')) {
                if ((aqiData?.aqi || 0) > 200) {
                    botResponse = `Keep windows closed! The outside air is toxic. Use an air purifier if possible.`;
                } else {
                    botResponse = `It's safe to open windows for ventilation right now.`;
                }
            } else if (lowerInput.includes('school') || lowerInput.includes('college')) {
                botResponse = (aqiData?.aqi || 0) > 300 ? "AQI is severe. Schools might be closed or restricting outdoor activities." : "Schools should operate normally, but masks are advised for the commute.";
            } else {
                botResponse = `Current AQI in ${selectedCity.name} is ${aqiData?.aqi} (${maskInfo.status}). My top recommendation is: ${maskInfo.name}.`;
            }

            setChatMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: botResponse }]);
            setIsBotTyping(false);
        }, 1000);
    };

    const getHeaderTitle = () => {
        if (currentMode === 'user') return currentView === 'input' ? 'Home' : 'Dashboard';
        if (currentMode === 'dev') return 'Developer Console';
        if (currentMode === 'gov') return 'Government Portal';
        return 'AirGuard';
    };

    const getConditionDisplay = () => {
        if (userConditions.includes('none') && userConditions.length === 1) return '';
        const labels = userConditions.map(id => {
            if (id === 'other') return customCondition || 'Custom Condition';
            return HEALTH_CONDITIONS.find(c => c.id === id)?.label;
        });
        return `(${labels.join(', ')})`;
    };

    const getRoleDisplay = () => {
        const roleLabel = ROLES.find(r => r.id === userRole)?.label;
        if (roleDetail) return `${roleLabel} at ${roleDetail}`;
        if (userRole === 'other' && roleDetail) return roleDetail;
        return roleLabel;
    };

    const getThemeStyles = () => {
        if (currentView === 'input' || currentMode !== 'user') {
            return {
                wrapper: darkMode ? 'bg-neutral-950 text-white' : 'bg-slate-50 text-slate-900',
                card: darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-sm',
                textMuted: darkMode ? 'text-neutral-400' : 'text-slate-500',
                button: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30'
            };
        }

        const aqi = aqiData?.aqi || 0;
        let gradient = '';
        let icon = Sun;

        if (aqi <= 50) { 
            gradient = 'bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-600';
            icon = Sun;
        } else if (aqi <= 100) { 
            gradient = 'bg-gradient-to-br from-blue-500 via-indigo-400 to-amber-300';
            icon = Cloud;
        } else if (aqi <= 200) { 
            gradient = 'bg-gradient-to-br from-orange-400 via-amber-500 to-slate-500';
            icon = CloudLightning;
        } else { 
            gradient = 'bg-gradient-to-br from-purple-700 via-rose-600 to-orange-500';
            icon = ShieldAlert;
        }

        return {
            wrapper: `${gradient} text-white selection:bg-white/30`,
            card: 'bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl text-white',
            textMuted: 'text-white/70',
            button: 'bg-white/20 hover:bg-white/30 text-white border border-white/30',
            immersive: true,
            weatherIcon: icon
        };
    };

    const theme = getThemeStyles();
    const WeatherIcon = theme.weatherIcon;

    const getRecs = () => {
        if (!aqiData) return { sport: { allowed: true, text: "" }, purifier: { allowed: false, text: "" }};
        const aqi = aqiData.aqi;
        return {
            sport: aqi > 150 ? { allowed: false, text: "No Outdoor Sports" } : { allowed: true, text: "Outdoor Sports OK" },
            window: aqi > 200 ? { allowed: false, text: "Close Windows" } : { allowed: true, text: "Ventilation OK" },
            mask: aqi > 100 ? { allowed: true, text: "Mask Required" } : { allowed: false, text: "No Mask Needed" },
            purifier: aqi > 150 ? { allowed: true, text: "Use Purifier" } : { allowed: false, text: "Purifier Optional" },
        };
    };
    const recs = getRecs();

    return (
        <div className={`flex h-screen w-full transition-all duration-700 font-sans ${theme.wrapper} overflow-hidden`}>
            <audio ref={audioRef} className="hidden" />

            <Sidebar 
              sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}
              currentMode={currentMode} setCurrentMode={setCurrentMode} setCurrentView={setCurrentView}
              darkMode={darkMode} setDarkMode={setDarkMode} theme={theme}
            />

            <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
                {currentMode !== 'gov' && (
                    <header className={`h-16 flex items-center justify-between px-6 z-20 ${theme.immersive ? '' : 'border-b ' + (darkMode ? 'border-neutral-800 bg-neutral-950/80' : 'border-slate-200 bg-white/80')} backdrop-blur-md`}>
                        <div className="flex items-center gap-4">
                            {currentView === 'report' && currentMode === 'user' && (
                                <button onClick={() => setCurrentView('input')} className={`p-2 rounded-full transition-colors ${theme.immersive ? 'bg-white/20 hover:bg-white/30 text-white' : 'hover:bg-slate-100'}`}>
                                    <ArrowLeft size={20} />
                                </button>
                            )}
                            <h1 className="font-bold text-lg flex items-center gap-2">
                                {getHeaderTitle()}
                            </h1>
                        </div>

                        <div className="relative group">
                            <button className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold transition-all ${theme.immersive ? 'bg-white/20 border-transparent hover:bg-white/30 text-white' : (darkMode ? 'border-neutral-700 hover:bg-neutral-800' : 'border-slate-200 hover:bg-slate-50')}`}>
                                <MapPin size={16} className={theme.immersive ? 'text-white' : 'text-blue-500'} />
                                {selectedCity.name}
                                <ChevronDown size={14} className="opacity-70" />
                            </button>
                            <div className={`absolute right-0 top-full mt-2 w-48 rounded-xl border shadow-xl overflow-hidden hidden group-hover:block z-50 ${theme.immersive ? 'bg-black/40 backdrop-blur-xl border-white/20 text-white' : theme.card}`}>
                                {CITIES.map(city => (
                                    <button key={city.name} onClick={() => setSelectedCity(city)} className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-blue-500 hover:text-white`}>
                                        {city.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </header>
                )}

                <div className={`flex-1 flex flex-col scroll-smooth no-scrollbar ${currentMode === 'gov' ? 'p-0 overflow-hidden' : 'p-4 md:p-8 overflow-y-auto'}`}>
                    
                    {currentMode === 'user' && currentView === 'input' && (
                        <UserSetup 
                            userName={userName} setUserName={setUserName}
                            userAge={userAge} handleAgeChange={handleAgeChange}
                            userRole={userRole} setUserRole={setUserRole}
                            roleDetail={roleDetail} setRoleDetail={setRoleDetail}
                            userConditions={userConditions} handleConditionToggle={handleConditionToggle}
                            customCondition={customCondition} setCustomCondition={setCustomCondition}
                            loading={loading} handleGenerate={handleGenerate}
                            darkMode={darkMode} theme={theme}
                        />
                    )}

                    {currentMode === 'user' && currentView === 'report' && aqiData && (
                        <UserDashboard 
                            aqiData={aqiData} selectedCity={selectedCity}
                            userName={userName} userRole={userRole}
                            userConditions={userConditions} roleDetail={roleDetail}
                            customCondition={customCondition} forecast={forecast}
                            isGeneratingAudio={isGeneratingAudio} isPlayingAudio={isPlayingAudio}
                            handleGenerateAudio={handleGenerateAudio} theme={theme}
                            getMaskRecommendation={getMaskRecommendation} getRoleDisplay={getRoleDisplay}
                            getConditionDisplay={getConditionDisplay} WeatherIcon={WeatherIcon} recs={recs}
                        />
                    )}

                    {currentMode === 'dev' && (
                        <DevConsole 
                            devPassword={devPassword} setDevPassword={setDevPassword}
                            isDevAuthenticated={isDevAuthenticated} handleDevAuth={handleDevAuth}
                            devError={devError} darkMode={darkMode}
                        />
                    )}

                    {currentMode === 'gov' && (
                        <div className="h-full w-full animate-in fade-in duration-500">
                            <GovernmentPortal />
                        </div>
                    )}
                </div>
            </main>

            {currentMode === 'user' && (
                <ChatBot 
                    chatOpen={chatOpen} setChatOpen={setChatOpen}
                    chatMessages={chatMessages} chatInput={chatInput} setChatInput={setChatInput}
                    handleSendMessage={handleSendMessage} isBotTyping={isBotTyping} chatEndRef={chatEndRef}
                />
            )}
        </div>
    );
}
