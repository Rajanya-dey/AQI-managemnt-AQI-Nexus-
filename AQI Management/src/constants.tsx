import {
  GraduationCap, Zap, Truck, Building, Sprout, Info, Heart, Activity, Thermometer, Wind,
  LayoutDashboard, Code, Building2, Smile, Layers, Stethoscope, Fan, Shield, ShieldAlert,
  Navigation, Map as MapIcon, CalendarDays, Factory, Bell, BarChart3, Settings
} from 'lucide-react';

export const CITIES = [
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

export const ROLES = [
  { id: 'student', label: 'Student', icon: GraduationCap },
  { id: 'athlete', label: 'Athlete', icon: Zap },
  { id: 'delivery', label: 'Logistics', icon: Truck },
  { id: 'office', label: 'Office', icon: Building },
  { id: 'farmer', label: 'Farmer', icon: Sprout },
  { id: 'other', label: 'Others', icon: Info },
];

export const ROLE_QUESTIONS: Record<string, string> = {
  student: "Which Institute/College?",
  athlete: "Which Sports Club/Team?",
  delivery: "Which Logistics Company?",
  office: "Which Company/Office?",
  farmer: "Location of your Field?",
  other: "Please specify your profession"
};

export const HEALTH_CONDITIONS = [
  { id: 'none', label: 'Healthy / None', icon: Heart },
  { id: 'copd', label: 'COPD', icon: Activity },
  { id: 'heart', label: 'Heart Disease', icon: Activity },
  { id: 'allergy', label: 'Seasonal Allergy', icon: Sprout },
  { id: 'bronchitis', label: 'Bronchitis', icon: Thermometer },
  { id: 'asthma', label: 'Asthma', icon: Wind },
  { id: 'other', label: 'Others', icon: Info },
];

export const MODES = [
  { id: 'user', label: 'User Dashboard', icon: LayoutDashboard },
  { id: 'dev', label: 'Developer Console', icon: Code },
  { id: 'gov', label: 'Government Portal', icon: Building2 },
];

export const MASK_DATA = [
  { min: 0, max: 50, name: "No Mask Needed", layers: "0 Layers", note: "Enjoy the fresh air.", icon: Smile, status: "Good" },
  { min: 51, max: 100, name: "Cloth Mask", layers: "2-3 Layers", note: "Optional for sensitive groups.", icon: Layers, status: "Moderate" },
  { min: 101, max: 150, name: "Surgical Mask", layers: "3 Layers", note: "Recommended for sensitive groups.", icon: Stethoscope, status: "Unhealthy for Sensitive" },
  { min: 151, max: 200, name: "N95 / KN95", layers: "4 Layers", note: "Recommended for everyone outdoors.", icon: Fan, status: "Unhealthy" },
  { min: 201, max: 300, name: "N95 / FFP2", layers: "5 Layers", note: "Avoid outdoor exertion.", icon: Shield, status: "Very Unhealthy" },
  { min: 301, max: 9999, name: "N99 / P100", layers: "5+ Layers", note: "Emergency conditions. Stay indoors.", icon: ShieldAlert, status: "Hazardous" }
];

export const getMaskRecommendation = (aqi: number) => MASK_DATA.find(m => aqi >= m.min && aqi <= m.max) || MASK_DATA[MASK_DATA.length - 1];

export const getAQIBarColor = (aqi: number) => {
  if (aqi <= 50) return 'bg-emerald-400 border-emerald-200 shadow-[0_0_15px_rgba(52,211,153,0.9)]'; 
  if (aqi <= 100) return 'bg-yellow-400 border-yellow-100 shadow-[0_0_15px_rgba(250,204,21,0.9)]';
  if (aqi <= 200) return 'bg-orange-500 border-orange-200 shadow-[0_0_15px_rgba(249,115,22,0.9)]';
  if (aqi <= 300) return 'bg-fuchsia-500 border-fuchsia-200 shadow-[0_0_15px_rgba(217,70,239,0.9)]';
  return 'bg-rose-600 border-rose-200 shadow-[0_0_15px_rgba(225,29,72,0.9)]';
};

export const GOV_CITIES_DATA: Record<string, string[]> = {
  Delhi: ['Connaught Place', 'Dwarka', 'Karol Bagh', 'Okhla', 'Rohini', 'Vasant Kunj'],
  Kolkata: ['Salt Lake', 'New Town', 'Park Street', 'Ballygunge', 'Jadavpur', 'Howrah'],
  Bangalore: ['Koramangala', 'Indiranagar', 'Whitefield', 'Jayanagar', 'HSR Layout', 'Electronic City'],
  Mumbai: ['Bandra', 'Andheri', 'Colaba', 'Borivali', 'Juhu', 'Powai'],
  Chennai: ['T Nagar', 'Adyar', 'Velachery', 'Mylapore', 'Anna Nagar', 'Guindy'],
  Lucknow: ['Hazratganj', 'Gomti Nagar', 'Alambagh', 'Indira Nagar', 'Aminabad', 'Chowk']
};

export const GOV_TABS = [
  { name: 'Dashboard', icon: Navigation },
  { name: 'AQI Map', icon: MapIcon },
  { name: 'Forecast', icon: CalendarDays },
  { name: 'Pollution Sources', icon: Factory },
  { name: 'Alerts', icon: Bell },
  { name: 'Reports', icon: BarChart3 },
  { name: 'Settings', icon: Settings },
];
