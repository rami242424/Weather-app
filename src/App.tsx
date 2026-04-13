import { useReducer } from "react";

type Weather = {
  name: string;
  temp: number;
}

type State = {
  city: string;
  loading: boolean;
  weather: Weather | null;
  error: string | null;
}

type Action =
  | { type: "INPUT_CHANGE", payload: string }
  | { type: "SEARCH_START" }
  | { type: "SEARCH_SUCCESS", payload: Weather}
  | { type: "SEARCH_FAIL", payload: string}

const initialState = {
  city: "",
  loading: false,
  error: null,
  weather: null,
}

function reducer(state:State, action:Action):State{
  switch(action.type){
    case "INPUT_CHANGE":
      return {
        ...state,
        city: action.payload
      }
    case "SEARCH_START":
      return {
        ...state,
        loading: true,
        error: null,
        weather: null
      }
    case "SEARCH_SUCCESS":
      return {
        ...state,
        loading: false,
        error: null,
        weather: action.payload
      }
    case "SEARCH_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
        weather: null
      }
    default:
      return state;
  }
}  


function App(){
  const [state, dispatch] = useReducer(reducer, initialState);
  const getWeather = async() => {
    if(!state.city.trim()){
      dispatch({
        type: "SEARCH_FAIL",
        payload: "도시명을 입력하세요."
      });
      return;
    }

    // 초기화
    dispatch({ type: "SEARCH_START" });

    const API_KEY = "784ab24ff2ed5d94d4288abed9e25d13";

    try{
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${state.city.trim()}&appid=${API_KEY}&units=metric`);
      if(!response.ok){
        if(response.status === 404){
          throw new Error ("도시이름을 찾을 수 없습니다.");
        } else {
          throw new Error ("서버에 에러가 발생했습니다.");
        }
      }
      const json = await response.json();

      dispatch({
        type:"SEARCH_SUCCESS", 
        payload: {
          name: json.name,
          temp: json.main.temp
      }});
    } catch(error) {
      if(error instanceof Error){
        dispatch({
          type: "SEARCH_FAIL",
          payload: error.message
        });
      }
    }
  };
//   1. 버튼 추가 0
// 2. 함수 만들기 0
// 3. geolocation 붙이기0
// 4. lat/lon 콘솔 찍기0
// 5. API 연결
// 6. dispatch 연결
  const getLoationWeather = async() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // 성공
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
      },
      (error) => {
        // 실패
        console.log(error);
      }
    );
  }
  return (
    <>
      <input 
        value={state.city} 
        onChange={(e:React.ChangeEvent<HTMLInputElement>) => dispatch({ type: "INPUT_CHANGE", payload: e.target.value })}
        placeholder="도시명을 입력하세요."
      />
      <button onClick={getWeather} disabled={state.loading}>Search</button>
      <button onClick={getLoationWeather}>Current Location</button>
      {state.loading && <div>Loading...</div>}
      {state.error && <div>{state.error}</div>}
      {state.weather && (
        <div>
          <h3>도시이름 : {state.weather.name}</h3>
          <h3>온도 : {Math.ceil(state.weather.temp)}°C</h3>
        </div>
      )}
    </>
  );
}

export default App;