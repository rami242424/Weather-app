import { useReducer, useState } from "react";

type State = {
  loading: boolean;
  error : string | null;
  weather : Weather | null;
  city : string;
  recentCities : string[];
  forecast: Forecast[];
};

type Weather = {
  name: string;
  temp: number;
  icon: string;
  description:string;
  humidity: number,
  feels_like: number,
  wind: number
};

type Forecast = {
  date: string;
  temp: number;
  icon: string;
  description: string;
}

type ForecastItem = {
  dt_txt: string;
  main: { temp: number };
  weather: { icon: string; description: string }[];
}

const initialState = {
  loading: false,
  error: null,
  weather: null,
  city: "",
  recentCities: JSON.parse(localStorage.getItem("recentCities") || "[]"),
  forecast: [],
};

type Action = 
  | { type: "INPUT_CHANGE"; payload: string }
  | { type: "SEARCH_START"; payload: string }
  | { type: "SEARCH_SUCCESS"; payload: {weather: Weather; forecast: Forecast[]}}
  | { type: "SEARCH_FAIL"; payload: string }

function reducer(state:State, action:Action):State {
  switch(action.type){
    case "INPUT_CHANGE":
      return { ...state, city: action.payload }
    case "SEARCH_START":
      return { ...state, loading: true, error: null, weather: null, city: action.payload }
    case "SEARCH_SUCCESS":
      return { ...state, loading: false, error: null, weather: action.payload.weather, forecast:action.payload.forecast, recentCities: [state.city, ...state.recentCities.filter((city) => city !== state.city)].slice(0,5) }
    case "SEARCH_FAIL":
      return { ...state, loading: false, error: action.payload, weather: null }
    default:
      return state;
  }
}

const API_KEY = "784ab24ff2ed5d94d4288abed9e25d13";

function App(){
  const [state, dispatch] = useReducer(reducer, initialState);
  const [selectedDate, setSelectedDate] = useState<string|null>(null);

  const getWeather = async(cityName?: string) => {
    const targetCity = cityName || state.city;
    if(!targetCity.trim()) return;
    dispatch({ type: "SEARCH_START" , payload: targetCity});
    setSelectedDate(null);
    try {
      const [weatherRes, forecastRes] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${targetCity.trim()}&appid=${API_KEY}&units=metric`),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${targetCity.trim()}&appid=${API_KEY}&units=metric`)
      ]);
      if(!weatherRes.ok){
        if(weatherRes.status === 404){
          throw new Error("도시 이름을 찾을 수 없습니다.");
        } else {
          throw new Error("서버에 연결 할 수 없습니다.");
        }
      }
      const weatherJson = await weatherRes.json();
      const forecastJson = await forecastRes.json();
      dispatch({
        type: "SEARCH_SUCCESS",
        payload: {
          weather: {
            name: weatherJson.name,
            temp: weatherJson.main.temp,
            icon: weatherJson.weather[0].icon,
            description: weatherJson.weather[0].description,
            humidity: weatherJson.main.humidity,
            feels_like: weatherJson.main.feels_like,
            wind: weatherJson.wind.speed,
          },
          forecast: forecastJson.list.filter((item:ForecastItem) => item.dt_txt.includes("12:00:00")).map((item:ForecastItem) => ({
            date: item.dt_txt.slice(0,10),
            temp: item.main.temp,
            icon: item.weather[0].icon,
            description: item.weather[0].description,
          }))
        }
      });
      const updated = [targetCity, ...state.recentCities.filter((city) => city !== targetCity)].slice(0,5);
      localStorage.setItem("recentCities", JSON.stringify(updated));
    } catch(error){
      if(error instanceof Error){
        dispatch({ type: "SEARCH_FAIL", payload: error.message });
      }
    }
  }

  const getCurrentLocation = () => {
    dispatch({ type: "SEARCH_START", payload: "" });
    setSelectedDate(null);
    navigator.geolocation.getCurrentPosition(
      async(position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        try {
          const [weatherRes, forecastRes] = await Promise.all([
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`),
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
          ]);
          if(!weatherRes.ok) throw new Error("위치 기반 날씨 조회 실패");
          const weatherJson = await weatherRes.json();
          const forecastJson = await forecastRes.json();
          dispatch({
          type: "SEARCH_SUCCESS",
          payload: {
            weather: {
              name: weatherJson.name,
              temp: weatherJson.main.temp,
              icon: weatherJson.weather[0].icon,
              description: weatherJson.weather[0].description,
              humidity: weatherJson.main.humidity,
              feels_like: weatherJson.main.feels_like,
              wind: weatherJson.wind.speed,
            },
            forecast: forecastJson.list.filter((item:ForecastItem) => item.dt_txt.includes("12:00:00")).map((item:ForecastItem) => ({
              date: item.dt_txt.slice(0,10),
              temp: item.main.temp,
              icon: item.weather[0].icon,
              description: item.weather[0].description,
            }))
          }
        });
        } catch(error){
          if(error instanceof Error){
            dispatch({ type: "SEARCH_FAIL", payload: error.message });
          }
        }
      },
      (error) => {
        dispatch({ type: "SEARCH_FAIL", payload: error.message });
      }
    );
  }
  return (
    <>
      <input 
        value={state.city} 
        placeholder="도시이름을 입력해주세요." 
        onChange={(e:React.ChangeEvent<HTMLInputElement>) => dispatch({ type: "INPUT_CHANGE", payload: e.target.value})}
        onKeyDown={(e) => {if(e.key === "Enter") getWeather()}}
      />
      <button onClick={() => getWeather()} disabled={state.loading}>Search</button>
      <button onClick={getCurrentLocation} disabled={state.loading}>My Current Location</button>

      {state.recentCities.length > 0 && state.recentCities.map((city) => (
        <button key={city} onClick={() => getWeather(city)}>{city}</button>
      ))}
      {state.loading && <div>Loading...</div>}
      {state.error && <div>{state.error}</div>}
      {state.weather && (
      <div>
        <img src={`https://openweathermap.org/img/wn/${state.weather.icon}@2x.png`} alt={state.weather.description} />
        <h3>{state.weather.name}</h3>
        <p>{state.weather.description}</p>
        <p>{Math.ceil(state.weather.temp)}°C</p>
        <p>체감온도 : {Math.ceil(state.weather.feels_like)}°C</p>
        <p>습도 : {state.weather.humidity}%</p>
        <p>풍속 : {state.weather.wind}m/s</p>
      </div>
      )}
      {state.forecast.length > 0 && (
        <div>
          {state.forecast.map((item) => (
            <button key={item.date} onClick={() => setSelectedDate(item.date)}>
              {item.date}
            </button>
          ))}
        </div>
      )}
      {selectedDate && (
        <div>
          {state.forecast.filter(item => item.date === selectedDate).map(item => (
            <div key={item.date}>
              <img src={`https://openweathermap.org/img/wn/${item.icon}@2x.png`} />
              <p>{item.date}</p>
              <p>{Math.ceil(item.temp)}°C</p>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default App;
