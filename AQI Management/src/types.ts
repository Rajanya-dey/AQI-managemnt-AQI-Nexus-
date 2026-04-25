export interface City {
  name: string;
  lat: number;
  lon: number;
  baseAQI: number;
  state: string;
  trend: string;
}

export interface AQIData {
  aqi: number;
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  temp: number;
  humidity: number;
  wind: number;
}

export interface ForecastDay {
  day: string;
  aqi: number;
}

export interface ChatMessage {
  id: number;
  type: 'bot' | 'user';
  text: string;
}
