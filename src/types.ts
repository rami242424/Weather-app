export type State = {
  loading: boolean;
  error : string | null;
  weather : Weather | null;
  city : string;
  recentCities : string[];
  forecast: Forecast[];
};

export type Weather = {
  name: string;
  temp: number;
  icon: string;
  description:string;
  humidity: number,
  feels_like: number,
  wind: number
};

export type Forecast = {
  date: string;
  temp: number;
  icon: string;
  description: string;
};

export type ForecastItem = {
  dt_txt: string;
  main: { temp: number };
  weather: { icon: string; description: string }[];
};

export type Action = 
  | { type: "INPUT_CHANGE"; payload: string }
  | { type: "SEARCH_START"; payload: string }
  | { type: "SEARCH_SUCCESS"; payload: {weather: Weather; forecast: Forecast[]}}
  | { type: "SEARCH_FAIL"; payload: string }

export type WeatherApiResponse = {
  name: string;
  main: { temp: number; humidity: number; feels_like: number };
  weather: { icon: string; description: string }[];
  wind: { speed: number };
};

export type ForecastApiResponse = {
  list: ForecastItem[];
};