// --- 1. Icon Adapter System ---
const Icons = Object.keys(lucide.icons).reduce((acc, key) => {
    const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);

    acc[pascalKey] = ({ color = "currentColor", size = 24, strokeWidth = 2, className = "", ...rest }) => {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`lucide lucide-${key} ${className}`}
                {...rest}
            >
                {lucide.icons[key].map((child, index) => {
                    const [tag, attrs] = child;
                    return React.createElement(tag, { ...attrs, key: index });
                })}
            </svg>
        );
    };
    return acc;
}, {});

/* -----------------------------
   EVERYTHING BELOW THIS LINE
   IS COPIED 1:1 FROM YOUR CODE
   NO EDITS. NO OPTIMIZATION.
------------------------------ */

const {
    Sun, Moon, Wind, Activity, Shield, MapPin,
    AlertTriangle, Info, Thermometer, User, Heart,
    Briefcase, GraduationCap, Zap, Key, Menu,
    ChevronDown, Stethoscope, Terminal: TerminalIcon, Building2,
    Calendar, Clock, CheckCircle, Settings, Hammer,
    FileText, PenTool, LayoutDashboard, ChevronLeft, ChevronRight,
    School, Truck, Sprout, Building, Bike, ArrowLeft, Sparkles,
    Globe, Server, Database, Code, Lock, AlertOctagon,
    BarChart3, CheckSquare, XCircle, Map: MapIcon, Construction,
    ExternalLink, MessageCircle, Send, X, Bot, Search,
    Smile, Layers, Fan, ShieldAlert, HardHat, Frown,
    Droplets, Home, Cloud, CloudRain, CloudLightning, Volume2,
    Cpu, Network, GitBranch, Square, Loader2
} = Icons;

const { useState, useEffect, useRef } = React;

/* 
--------------------------------
PASTE YOUR FULL ORIGINAL LOGIC
FROM pcmToWav() UNTIL
root.render(<AirGuardApp />);

UNCHANGED.
--------------------------------
*/
        // --- 2. Helper Functions ---
        
        // PCM to WAV Converter
        const pcmToWav = (pcmData, sampleRate = 24000) => {
            const numChannels = 1;
            const byteRate = sampleRate * numChannels * 2;
            const blockAlign = numChannels * 2;
            const dataSize = pcmData.length;
            const buffer = new ArrayBuffer(44 + dataSize);
            const view = new DataView(buffer);

            const writeString = (view, offset, string) => {
                for (let i = 0; i < string.length; i++) {
                    view.setUint8(offset + i, string.charCodeAt(i));
                }
            };

            // RIFF chunk descriptor
            writeString(view, 0, 'RIFF');
            view.setUint32(4, 36 + dataSize, true);
            writeString(view, 8, 'WAVE');

            // fmt sub-chunk
            writeString(view, 12, 'fmt ');
            view.setUint32(16, 16, true); 
            view.setUint16(20, 1, true); 
            view.setUint16(22, numChannels, true); 
            view.setUint32(24, sampleRate, true); 
            view.setUint32(28, byteRate, true); 
            view.setUint16(32, blockAlign, true); 
            view.setUint16(34, 16, true); 

            // data sub-chunk
            writeString(view, 36, 'data');
            view.setUint32(40, dataSize, true);

            // Write PCM data
            const pcmView = new Uint8Array(pcmData);
            const dataView = new Uint8Array(buffer, 44);
            dataView.set(pcmView);

            return new Blob([buffer], { type: 'audio/wav' });
        };

        // --- 3. Constants & Data ---
        const CITIES = [
            { name: 'Delhi', lat: 28.6139, lon: 77.2090, baseAQI: 380, state: 'Delhi', trend: 'up' },
            { name: 'Kolkata', lat: 22.5726, lon: 88.3639, baseAQI: 220, state: 'West Bengal', trend: 'down' },
            { name: 'Mumbai', lat: 19.0760, lon: 72.8777, baseAQI: 150, state: 'Maharashtra', trend: 'stable' },
            { name: 'Chennai', lat: 13.0827, lon: 80.2707, baseAQI: 95, state: 'Tamil Nadu', trend: 'down' },
            { name: 'Ahmedabad', lat: 23.0225, lon: 72.5714, baseAQI: 180, state: 'Gujarat', trend: 'up' },
            { name: 'Bangalore', lat: 12.9716, lon: 77.5946, baseAQI: 85, state: 'Karnataka', trend: 'stable' },
            { name: 'Lucknow', lat: 26.8467, lon: 80.9462, baseAQI: 310, state: 'Uttar Pradesh', trend: 'up' },
            { name: 'Hyderabad', lat: 17.3850, lon: 78.4867, baseAQI: 110, state: 'Telangana', trend: 'down' },
            { name: 'Pune', lat: 18.5204, lon: 73.8567, baseAQI: 130, state: 'Maharashtra', trend: 'up' },
        ];

        const ROLES = [
            { id: 'student', label: 'Student', icon: GraduationCap },
            { id: 'athlete', label: 'Athlete', icon: Zap },
            { id: 'delivery', label: 'Logistics', icon: Truck },
            { id: 'office', label: 'Office', icon: Building },
            { id: 'farmer', label: 'Farmer', icon: Sprout },
            { id: 'other', label: 'Others', icon: Info },
        ];

        const ROLE_QUESTIONS = {
            student: "Which Institute/College?",
            athlete: "Which Sports Club/Team?",
            delivery: "Which Logistics Company?",
            office: "Which Company/Office?",
            farmer: "Location of your Field?",
            other: "Please specify your profession"
        };

        const HEALTH_CONDITIONS = [
            { id: 'none', label: 'Healthy / None', icon: Heart },
            { id: 'copd', label: 'COPD', icon: Activity },
            { id: 'heart', label: 'Heart Disease', icon: Activity },
            { id: 'allergy', label: 'Seasonal Allergy', icon: Sprout },
            { id: 'bronchitis', label: 'Bronchitis', icon: Thermometer },
            { id: 'asthma', label: 'Asthma', icon: Wind },
            { id: 'other', label: 'Others', icon: Info },
        ];

        const MODES = [
            { id: 'user', label: 'User Dashboard', icon: LayoutDashboard },
            { id: 'dev', label: 'Developer Console', icon: Code },
            { id: 'gov', label: 'Government Portal', icon: Building2 },
        ];

        const MASK_DATA = [
            { min: 0, max: 50, name: "No Mask Needed", layers: "0 Layers", note: "Enjoy the fresh air.", icon: Smile, status: "Good" },
            { min: 51, max: 100, name: "Cloth Mask", layers: "2-3 Layers", note: "Optional for sensitive groups.", icon: Layers, status: "Moderate" },
            { min: 101, max: 150, name: "Surgical Mask", layers: "3 Layers", note: "Recommended for sensitive groups.", icon: Stethoscope, status: "Unhealthy for Sensitive" },
            { min: 151, max: 200, name: "N95 / KN95", layers: "4 Layers", note: "Recommended for everyone outdoors.", icon: Fan, status: "Unhealthy" },
            { min: 201, max: 300, name: "N95 / FFP2", layers: "5 Layers", note: "Avoid outdoor exertion.", icon: Shield, status: "Very Unhealthy" },
            { min: 301, max: 9999, name: "N99 / P100", layers: "5+ Layers", note: "Emergency conditions. Stay indoors.", icon: ShieldAlert, status: "Hazardous" }
        ];

        const getMaskRecommendation = (aqi) => MASK_DATA.find(m => aqi >= m.min && aqi <= m.max) || MASK_DATA[MASK_DATA.length - 1];

        const getAQIBarColor = (aqi) => {
            if (aqi <= 50) return 'bg-emerald-400 border-emerald-200 shadow-[0_0_15px_rgba(52,211,153,0.9)]'; 
            if (aqi <= 100) return 'bg-yellow-400 border-yellow-100 shadow-[0_0_15px_rgba(250,204,21,0.9)]';
            if (aqi <= 200) return 'bg-orange-500 border-orange-200 shadow-[0_0_15px_rgba(249,115,22,0.9)]';
            if (aqi <= 300) return 'bg-fuchsia-500 border-fuchsia-200 shadow-[0_0_15px_rgba(217,70,239,0.9)]';
            return 'bg-rose-600 border-rose-200 shadow-[0_0_15px_rgba(225,29,72,0.9)]';
        };

        // --- 4. Main Component ---
        function AirGuardApp() {
            const [darkMode, setDarkMode] = useState(false);
            const [currentMode, setCurrentMode] = useState('user');
            const [currentView, setCurrentView] = useState('input');
            const [selectedCity, setSelectedCity] = useState(CITIES[0]);
            const [sidebarOpen, setSidebarOpen] = useState(true);
            
            const [devPassword, setDevPassword] = useState('');
            const [isDevAuthenticated, setIsDevAuthenticated] = useState(false);
            const [devError, setDevError] = useState('');
            
            const [userName, setUserName] = useState('');
            const [userAge, setUserAge] = useState('');
            const [userRole, setUserRole] = useState('student');
            const [roleDetail, setRoleDetail] = useState(''); 
            const [userConditions, setUserConditions] = useState(['none']);
            const [customCondition, setCustomCondition] = useState(''); 
            const [loading, setLoading] = useState(false);

            const [chatOpen, setChatOpen] = useState(false);
            const [chatMessages, setChatMessages] = useState([
                { id: 1, type: 'bot', text: 'Hi! I am AirGuard. How can I help you today?' }
            ]);
            const [chatInput, setChatInput] = useState('');
            const [isBotTyping, setIsBotTyping] = useState(false);
            const chatEndRef = useRef(null);

            const [aqiData, setAqiData] = useState(null);
            const [forecast, setForecast] = useState([]);

            // --- AUDIO STATES ---
            const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
            const [isPlayingAudio, setIsPlayingAudio] = useState(false);
            const audioRef = useRef(null);

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

            useEffect(() => {
                chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, [chatMessages, isBotTyping, chatOpen]);

            const handleAgeChange = (e) => {
                const val = parseInt(e.target.value);
                if (e.target.value === '') {
                    setUserAge('');
                } else if (!isNaN(val) && val > 0) {
                    setUserAge(val);
                }
            };

            const handleConditionToggle = (id) => {
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

            // --- AUDIO GENERATION LOGIC ---
            const handleGenerateAudio = async () => {
                // If already playing, stop it
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
                const apiKey = ""; // API Key (User must fill this)
                
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

                    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: promptText }] }],
                            generationConfig: {
                                responseModalities: ["AUDIO"],
                                speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } } }
                            }
                        })
                    });

                    if (!response.ok) throw new Error('TTS API Failed');

                    const result = await response.json();
                    const base64Audio = result.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

                    if (base64Audio) {
                        // Convert base64 to Uint8Array
                        const binaryString = window.atob(base64Audio);
                        const len = binaryString.length;
                        const bytes = new Uint8Array(len);
                        for (let i = 0; i < len; i++) {
                            bytes[i] = binaryString.charCodeAt(i);
                        }

                        // Convert raw PCM to WAV
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
                    alert("Could not generate audio report. Please add a valid API Key in the code.");
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
                    if (aqiData?.aqi > 150) {
                    botResponse = `With an AQI of ${aqiData?.aqi}, outdoor exercise is NOT recommended. Please stick to indoor workouts today.`;
                    } else {
                    botResponse = `Outdoor activities are generally okay right now, but listen to your body and take breaks if needed.`;
                    }
                } else if (lowerInput.includes('window') || lowerInput.includes('air') || lowerInput.includes('ventilation')) {
                    if (aqiData?.aqi > 200) {
                    botResponse = `Keep windows closed! The outside air is toxic. Use an air purifier if possible.`;
                    } else {
                    botResponse = `It's safe to open windows for ventilation right now.`;
                    }
                } else if (lowerInput.includes('school') || lowerInput.includes('college')) {
                    botResponse = aqiData?.aqi > 300 ? "AQI is severe. Schools might be closed or restricting outdoor activities." : "Schools should operate normally, but masks are advised for the commute.";
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
                if (!aqiData) return {};
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
                {/* Hidden Audio Element */}
                <audio ref={audioRef} className="hidden" />

                {/* --- SIDEBAR --- */}
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

                {/* --- MAIN CONTENT --- */}
                <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
                    
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

                    <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth no-scrollbar">
                        
                        {/* 1. HOME / SETUP VIEW */}
                        {currentMode === 'user' && currentView === 'input' && (
                            <div className="max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pt-10">
                                <div className="text-center space-y-4">
                                    <div className={`inline-flex items-center justify-center p-4 rounded-3xl mb-2 shadow-2xl shadow-blue-500/30 bg-gradient-to-tr from-blue-600 to-cyan-400 text-white transform transition hover:scale-110 duration-300`}>
                                        <Shield size={40} strokeWidth={1.5} />
                                    </div>
                                    <h2 className="text-4xl font-black tracking-tight">
                                    {userName ? `${userName}'s Air Shield` : "Setup Your Air Shield"}
                                    </h2>
                                    <p className={`${theme.textMuted} text-lg`}>Personalized health defense system active.</p>
                                </div>

                                <div className={`p-8 rounded-[2rem] border shadow-xl space-y-8 ${theme.card}`}>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 opacity-50 font-bold text-xs uppercase tracking-widest">
                                            <User size={12} /> Identity
                                        </div>
                                        <div className="grid grid-cols-5 gap-4">
                                            <div className="col-span-3">
                                                <input value={userName} onChange={e => setUserName(e.target.value)} placeholder="Your Name" className={`w-full p-4 rounded-2xl border bg-transparent outline-none focus:ring-2 ring-blue-500/50 transition-all font-medium text-lg ${darkMode ? 'border-neutral-700 placeholder:text-neutral-600' : 'border-slate-200 placeholder:text-slate-300'}`} />
                                            </div>
                                            <div className="col-span-2">
                                                <input 
                                                    type="number" 
                                                    min="1"
                                                    value={userAge} 
                                                    onChange={handleAgeChange} 
                                                    placeholder="Age" 
                                                    className={`w-full p-4 rounded-2xl border bg-transparent outline-none focus:ring-2 ring-blue-500/50 transition-all font-medium text-lg ${darkMode ? 'border-neutral-700 placeholder:text-neutral-600' : 'border-slate-200 placeholder:text-slate-300'}`} 
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 opacity-50 font-bold text-xs uppercase tracking-widest">
                                            <Briefcase size={12} /> Role
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            {ROLES.map(role => (
                                                <button key={role.id} onClick={() => setUserRole(role.id)} className={`p-3 rounded-2xl border text-sm font-medium transition-all flex flex-col items-center gap-2 hover:scale-105 active:scale-95 ${userRole === role.id ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30' : `${darkMode ? 'border-neutral-700 hover:bg-neutral-800' : 'border-slate-200 hover:bg-slate-50'}`}`}>
                                                    <role.icon size={20} strokeWidth={1.5} />
                                                    {role.label}
                                                </button>
                                            ))}
                                        </div>
                                        
                                        {userRole && (
                                            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                                <input 
                                                    value={roleDetail}
                                                    onChange={e => setRoleDetail(e.target.value)}
                                                    placeholder={ROLE_QUESTIONS[userRole]}
                                                    className={`w-full p-4 rounded-2xl border bg-transparent outline-none focus:ring-2 ring-blue-500/50 transition-all text-sm ${darkMode ? 'border-neutral-700 placeholder:text-neutral-600' : 'border-slate-200 placeholder:text-slate-400'}`}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 opacity-50 font-bold text-xs uppercase tracking-widest">
                                            <Heart size={12} /> Health Status
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {HEALTH_CONDITIONS.map(cond => {
                                                const isSelected = userConditions.includes(cond.id);
                                                return (
                                                    <button 
                                                        key={cond.id} 
                                                        onClick={() => handleConditionToggle(cond.id)} 
                                                        className={`px-4 py-2 rounded-full border text-sm font-bold transition-all flex items-center gap-2 hover:scale-105 active:scale-95 ${isSelected ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/30' : `${darkMode ? 'border-neutral-700 hover:bg-neutral-800' : 'border-slate-200 hover:bg-slate-50'}`}`}
                                                    >
                                                        <cond.icon size={16} />
                                                        {cond.label}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {userConditions.includes('other') && (
                                            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                                <input 
                                                    value={customCondition}
                                                    onChange={e => setCustomCondition(e.target.value)}
                                                    placeholder="Please specify your health condition(s)..."
                                                    className={`w-full p-4 rounded-2xl border bg-transparent outline-none focus:ring-2 ring-rose-500/50 transition-all text-sm ${darkMode ? 'border-neutral-700 placeholder:text-neutral-600' : 'border-slate-200 placeholder:text-slate-400'}`}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <button onClick={handleGenerate} disabled={loading} className={`w-full py-5 rounded-2xl font-bold text-xl shadow-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] ${theme.button}`}>
                                        {loading ? <Activity className="animate-spin" /> : <Sparkles className="fill-current" />}
                                        {loading ? 'Analyzing...' : 'Generate Report'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* 2. SAMSUNG GALAXY STYLE DASHBOARD (Immersive) */}
                        {currentMode === 'user' && currentView === 'report' && aqiData && (
                            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-700">
                                
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
                                                {React.createElement(ROLES.find(r => r.id === userRole).icon, { size: 24 })}
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
                                                {forecast.slice(0, 7).map((day, i) => {
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

                                        {/* UPDATED Audio Report Box with TTS Logic */}
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
                                            {/* Visualizer background effect when playing */}
                                            {isPlayingAudio && (
                                                <div className="absolute inset-0 bg-white/10 animate-pulse z-0" style={{ animationDuration: '1s' }}></div>
                                            )}
                                        </button>

                                    </div>
                                </div>

                            </div>
                        )}

                        {/* ---------------- DEVELOPER CONSOLE ---------------- */}
                        {(currentMode === 'dev') && (
                            <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto animate-in fade-in duration-500 p-4">
                                {!isDevAuthenticated ? (
                                    <div className="flex flex-col items-center gap-6 w-full max-w-md">
                                        <div className="text-center space-y-3 opacity-80 mb-4">
                                            <Construction size={80} className="mx-auto text-amber-500 animate-pulse" />
                                            <h2 className="text-3xl font-black tracking-tight">Under Construction</h2>
                                            <p className="font-medium opacity-70">This module is actively being built. Some features may be unstable.</p>
                                        </div>

                                        <div className={`p-8 rounded-[2rem] w-full text-center space-y-6 shadow-2xl border ${darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200'}`}>
                                            <div className="flex items-center justify-center gap-2 mb-2 opacity-50 text-xs font-bold uppercase tracking-widest">
                                                <Lock size={12}/> Developer Access
                                            </div>
                                            
                                            <div className="space-y-4">
                                                <input 
                                                type="password" 
                                                placeholder="Enter Access Token"
                                                value={devPassword}
                                                onChange={(e) => setDevPassword(e.target.value)}
                                                className={`w-full p-4 rounded-xl text-center font-mono text-sm tracking-widest outline-none border focus:ring-2 ring-blue-500/50 transition-all ${darkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                                />
                                                {devError && <div className="text-red-500 text-xs font-bold animate-pulse">{devError}</div>}
                                                
                                                <button 
                                                    onClick={handleDevAuth}
                                                    className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-transform active:scale-95 shadow-lg shadow-blue-500/30"
                                                >
                                                    Authenticate to Preview
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={`w-full h-full flex flex-col items-center justify-center space-y-8 animate-in zoom-in-95 duration-500`}>
                                        <div className="text-center space-y-2">
                                            <h2 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">System Internals</h2>
                                            <p className="opacity-60 font-mono text-xs">v2.4.0-stable • Connected to Neural Backend</p>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4 w-full">
                                            <div className={`p-6 rounded-3xl border flex items-center gap-4 ${darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200'}`}>
                                                <div className="p-3 bg-green-500/10 text-green-500 rounded-xl"><Cpu size={24} /></div>
                                                <div>
                                                    <div className="text-sm font-bold opacity-50">Core Logic</div>
                                                    <div className="font-mono text-lg font-bold text-green-500">Active</div>
                                                </div>
                                            </div>
                                            <div className={`p-6 rounded-3xl border flex items-center gap-4 ${darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200'}`}>
                                                <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl"><Network size={24} /></div>
                                                <div>
                                                    <div className="text-sm font-bold opacity-50">API Latency</div>
                                                    <div className="font-mono text-lg font-bold text-purple-500">24ms</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`w-full p-6 rounded-3xl border space-y-4 font-mono text-xs relative overflow-hidden ${darkMode ? 'bg-black border-neutral-800 text-green-400' : 'bg-slate-900 border-slate-800 text-green-400'}`}>
                                            <div className="absolute top-0 left-0 w-full h-1 bg-green-500/50"></div>
                                            <div className="flex items-center gap-2 opacity-50 border-b border-white/10 pb-2 mb-2">
                                                <TerminalIcon size={12} /> Console Output
                                            </div>
                                            <div className="space-y-1 opacity-80">
                                                <div>[INFO] Initializing AirGuard Core...</div>
                                                <div>[INFO] Loading MASK_DATA parameters... OK</div>
                                                <div>[INFO] Connecting to CITIES database... OK</div>
                                                <div>[AUTH] User authentication bypassed (HACK_THE_GALAXY)</div>
                                                <div>[READY] System fully operational.</div>
                                            </div>
                                        </div>

                                        <a href="#" onClick={(e) => { e.preventDefault(); alert("Redirecting to external documentation..."); }} className="flex items-center gap-2 text-blue-500 font-bold hover:underline">
                                            <ExternalLink size={16} /> View Full Documentation
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ---------------- GOVERNMENT PORTAL (Placeholder) ---------------- */}
                        {(currentMode === 'gov') && (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-60">
                                <Construction size={80} className="animate-pulse opacity-50" />
                                <div>
                                    <h2 className="text-3xl font-bold">Module Offline</h2>
                                    <p>This section is currently under development.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </main>

                {/* --- CHATBOT WIDGET --- */}
                {currentMode === 'user' && (
                    <div className="fixed bottom-6 right-6 z-50">
                    {chatOpen ? (
                        <div className={`w-80 h-[500px] rounded-[2rem] shadow-2xl flex flex-col border overflow-hidden animate-in slide-in-from-bottom-10 fade-in bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800`}>
                            <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Bot size={20} /> <span className="font-bold">AirGuard AI</span>
                                </div>
                                <button onClick={() => setChatOpen(false)}><X size={20} /></button>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-neutral-900 text-slate-800 dark:text-slate-200">
                                {chatMessages.map(msg => (
                                    <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm 
                                            ${msg.type === 'user' 
                                                ? 'bg-blue-600 text-white rounded-br-none' 
                                                : 'bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-700 rounded-bl-none text-slate-800 dark:text-slate-200'
                                            }`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                {isBotTyping && <div className="text-xs opacity-50 ml-4 animate-pulse text-slate-500 dark:text-slate-400">Thinking...</div>}
                                <div ref={chatEndRef}></div>
                            </div>

                            <div className="p-3 border-t border-slate-200 dark:border-neutral-800 flex gap-2 bg-white dark:bg-neutral-900">
                                <input 
                                    value={chatInput} 
                                    onChange={e => setChatInput(e.target.value)} 
                                    onKeyDown={e => e.key === 'Enter' && handleSendMessage()} 
                                    placeholder="Ask anything..." 
                                    className={`flex-1 p-3 rounded-xl text-sm outline-none bg-slate-100 dark:bg-neutral-800 text-slate-900 dark:text-white focus:ring-2 ring-blue-500/50 transition-all`} 
                                />
                                <button onClick={handleSendMessage} className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"><Send size={18} /></button>
                            </div>
                        </div>
                    ) : (
                        <button onClick={() => setChatOpen(true)} className="p-4 rounded-full bg-blue-600 text-white shadow-xl hover:scale-110 transition-transform">
                            <MessageCircle size={28} />
                        </button>
                    )}
                    </div>
                )}
                </div>
            );
        }


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AirGuardApp />);
