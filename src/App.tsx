import { useReducer } from "react";

type State = {
  loading: boolean;
  error : string | null;
  weather : Weather | null;
  city : string;
  recentCities : string[];
};

type Weather = {
  name: string;
  temp: number;
  icon: string;
  desc: string;
  feels_like: number;
  humidity: number;
  wind: number;
};

const initialState = {
  loading: false,
  error: null,
  weather: null,
  city: "",
  recentCities: JSON.parse(localStorage.getItem("recentCities") || "[]")
};

type Action = 
  | { type: "INPUT_CHANGE"; payload: string }
  | { type: "SEARCH_START"; payload?: string }
  | { type: "SEARCH_SUCCESS"; payload: Weather }
  | { type: "SEARCH_FAIL"; payload: string }

function reducer(state:State, action:Action):State {
  switch(action.type){
    case "INPUT_CHANGE":
      return { ...state, city: action.payload }
    case "SEARCH_START": {
      const newCity = action.payload || state.city;
      return {
        ...state,
        loading: true,
        error: null,
        weather: null,
        recentCities: [newCity, ...state.recentCities.filter((city) => city !== newCity)].slice(0, 5)
      }
    }
    case "SEARCH_SUCCESS":
      return { ...state, loading: false, error: null, weather: action.payload }
    case "SEARCH_FAIL":
      return { ...state, loading: false, error: action.payload, weather: null }
    default:
      return state;
  }
}

const API_KEY = "784ab24ff2ed5d94d4288abed9e25d13";

function App(){
  const [state, dispatch] = useReducer(reducer, initialState);

  const getWeather = async(cityName?: string) => {
    const targetCity = cityName || state.city;
    if(!targetCity.trim()) return;

    dispatch({ type: "SEARCH_START", payload: targetCity });
    const updated = [targetCity, ...state.recentCities.filter((city) => city !== targetCity)].slice(0, 5);
    localStorage.setItem("recentCities", JSON.stringify(updated));

    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${targetCity.trim()}&appid=${API_KEY}&units=metric`);
      if(!response.ok){
        if(response.status === 404){
          throw new Error("도시 이름을 찾을 수 없습니다.");
        } else {
          throw new Error("서버에 연결 할 수 없습니다.");
        }
      }
      const json = await response.json();
      dispatch({
        type: "SEARCH_SUCCESS",
        payload: {
          name: json.name,
          temp: json.main.temp,
          icon: json.weather[0].icon,
          desc: json.weather[0].description,
          feels_like: json.main.feels_like,
          humidity: json.main.humidity,
          wind: json.wind.speed
        }
      });
    } catch(error){
      if(error instanceof Error){
        dispatch({ type: "SEARCH_FAIL", payload: error.message });
      }
    }
  }

  const getCurrentLocation = () => {
    dispatch({ type: "SEARCH_START" });
    navigator.geolocation.getCurrentPosition(
      async(position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        try {
          const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
          if(!response.ok) throw new Error("위치 기반 날씨 조회 실패");
          const json = await response.json();
          dispatch({
            type: "SEARCH_SUCCESS",
            payload: {
              name: json.name,
              temp: json.main.temp,
              icon: json.weather[0].icon,
              desc: json.weather[0].description,
              feels_like: json.main.feels_like,
              humidity: json.main.humidity,
              wind: json.wind.speed
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
      {state.recentCities.filter(city => city.toLowerCase() !== state.weather?.name.toLowerCase()).length > 0 && (
        <div>
          <p>최근 검색</p>
          {state.recentCities
            .filter(city => city.toLowerCase() !== state.weather?.name.toLowerCase())
            .map((city) => (
              <button key={city} onClick={() => getWeather(city)}>{city}</button>
            ))}
        </div>
      )}
      {state.loading && <div>Loading...</div>}
      {state.error && <div>{state.error}</div>}
      {state.weather && (
        <div>
          <img src={`https://openweathermap.org/img/wn/${state.weather.icon}@2x.png`}/>
          <h3>도시이름 : {state.weather.name}</h3>
          <p>{state.weather.desc}</p>
          <p>{Math.ceil(state.weather.temp)}°C</p>
          <p>체감온도 : {Math.ceil(state.weather.feels_like)}°C</p>
          <p>습도 : {state.weather.humidity}%</p>
          <p>풍속 : {state.weather.wind}m/s</p>
        </div>
      )}
    </>
  );
}

export default App;