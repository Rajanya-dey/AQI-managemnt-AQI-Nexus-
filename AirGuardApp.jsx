// ------------------ IMPORTS ------------------
import React, { useState, useEffect, useRef } from "react";
import {
  Sun, Moon, Wind, Activity, Shield, MapPin,
  AlertTriangle, User, Heart, Briefcase,
  GraduationCap, Fan, Bike, Lock, Cpu,
  Network, Terminal, ExternalLink,
  MessageCircle, Send, X, Bot,
  Cloud, CloudLightning, ShieldAlert,
  Stethoscope, Smile, Layers,
  Menu, ChevronDown, ArrowLeft,
  Sparkles, Calendar, Volume2,
  Square, Loader2, Construction, TerminalIcon
} from "lucide-react";

/* ------------------ REQUIRED CONSTANTS ------------------ */

const CITIES = [
  { name: "Delhi", baseAQI: 380 },
  { name: "Mumbai", baseAQI: 180 },
  { name: "London", baseAQI: 70 },
  { name: "New York", baseAQI: 90 }
];

const MODES = [
  { id: "user", label: "User", icon: User },
  { id: "dev", label: "Developer", icon: Terminal },
  { id: "gov", label: "Government", icon: Shield }
];

const ROLES = [
  { id: "student", label: "Student", icon: GraduationCap },
  { id: "worker", label: "Worker", icon: Briefcase },
  { id: "other", label: "Other", icon: User }
];

const ROLE_QUESTIONS = {
  student: "Which school or college?",
  worker: "Where do you work?",
  other: "Describe your role"
};

const HEALTH_CONDITIONS = [
  { id: "none", label: "None", icon: Smile },
  { id: "asthma", label: "Asthma", icon: Stethoscope },
  { id: "heart", label: "Heart Disease", icon: Heart },
  { id: "other", label: "Other", icon: AlertTriangle }
];

const getAQIBarColor = (aqi) => {
  if (aqi <= 50) return "bg-green-400";
  if (aqi <= 100) return "bg-yellow-400";
  if (aqi <= 200) return "bg-orange-500";
  return "bg-red-600";
};

// ------------------ APP COMPONENT ------------------
function AirGuardApp() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentMode, setCurrentMode] = useState("user");
  const [currentView, setCurrentView] = useState("input");
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);

  const [userName, setUserName] = useState("");
  const [userAge, setUserAge] = useState("");
  const [userRole, setUserRole] = useState("student");
  const [roleDetail, setRoleDetail] = useState("");
  const [userConditions, setUserConditions] = useState(["none"]);

  const [aqiData, setAqiData] = useState(null);
  const [forecast, setForecast] = useState([]);

  /* ------------------ AQI EFFECT (FIXED) ------------------ */
  useEffect(() => {
    const fluctuation = Math.floor(Math.random() * 40) - 20;
    const aqi = Math.max(20, selectedCity.baseAQI + fluctuation);

    setAqiData({
      aqi,
      pm25: Math.floor(aqi / 2.5),
      pm10: Math.floor(aqi / 1.8),
      temp: 32,
      humidity: 50
    });

    const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const today = new Date().getDay();

    setForecast(
      Array.from({ length: 7 }).map((_, i) => ({
        day: i === 0 ? "Today" : days[(today + i) % 7],
        aqi: Math.max(30, Math.min(500, selectedCity.baseAQI + Math.random() * 120))
      }))
    );
  }, [selectedCity]);

  /* ------------------ UI ------------------ */
  return (
    <div className={`h-screen w-full ${darkMode ? "bg-neutral-950 text-white" : "bg-slate-50 text-slate-900"}`}>
      <header className="flex items-center justify-between p-4 border-b">
        <h1 className="flex items-center gap-2 font-bold text-xl">
          <Wind /> AirGuard
        </h1>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <Sun /> : <Moon />}
        </button>
      </header>

      <main className="p-6">
        {aqiData && (
          <div className="text-center space-y-6">
            <h2 className="text-7xl font-black">{aqiData.aqi}</h2>
            <p className="opacity-70">AQI in {selectedCity.name}</p>

            <div className="flex justify-center gap-4">
              {forecast.map((d, i) => (
                <div key={i} className="text-xs text-center">
                  <div className={`w-4 h-24 mx-auto rounded ${getAQIBarColor(d.aqi)}`} />
                  <div className="mt-1">{d.day}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AirGuardApp;
