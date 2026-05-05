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
  description:string;
  humidity: number,
  feels_like: number,
  wind: number
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
  | { type: "SEARCH_START" }
  | { type: "SEARCH_SUCCESS"; payload: Weather }
  | { type: "SEARCH_FAIL"; payload: string }

function reducer(state:State, action:Action):State {
  switch(action.type){
    case "INPUT_CHANGE":
      return { ...state, city: action.payload }
    case "SEARCH_START":
      return { ...state, loading: true, error: null, weather: null }
    case "SEARCH_SUCCESS":
      return { ...state, loading: false, error: null, weather: action.payload, recentCities: [state.city, ...state.recentCities.filter((city) => city !== state.city)].slice(0,5) }
    case "SEARCH_FAIL":
      return { ...state, loading: false, error: action.payload, weather: null }
    default:
      return state;
  }
}

const API_KEY = "784ab24ff2ed5d94d4288abed9e25d13";

function App(){
  const [state, dispatch] = useReducer(reducer, initialState);

  const getWeather = async() => {
    if(!state.city.trim()) return;
    dispatch({ type: "SEARCH_START" });
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${state.city.trim()}&appid=${API_KEY}&units=metric`);
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
          description: json.weather[0].description,
          humidity: json.main.humidity,
          feels_like: json.main.feels_like,
          wind: json.wind.speed,
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
              description: json.weather[0].description,
              humidity: json.main.humidity,
              feels_like: json.main.feels_like,
              wind: json.wind.speed,
            }
          });
          console.log(json)
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
      <button onClick={getWeather} disabled={state.loading}>Search</button>
      <button onClick={getCurrentLocation} disabled={state.loading}>My Current Location</button>
      {state.loading && <div>Loading...</div>}
      {state.error && <div>{state.error}</div>}
      {state.weather && (
        <div>
          <img 
            src={`https://openweathermap.org/img/wn/${state.weather.icon}@2x.png`}
            className="w-400"
          />
          <h3>도시이름 : {state.weather.name}</h3>
          <h3>온도 : {Math.ceil(state.weather.temp)}°C</h3>
          <p>{state.weather.description}</p>
          <p>{state.weather.humidity}</p>
          <p>{state.weather.feels_like}</p>
          <p>{state.weather.wind}</p>
        </div>
      )}
    </>
  );
}

export default App;
