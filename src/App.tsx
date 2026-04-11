import { useReducer } from "react";

type Weather = {
  name: string;
  temp: number;
}

type State = {
  loading: boolean;
  error: string | null;
  weather: Weather | null;
  city: string;
}

const initialState = {
  loading: false,
  error: null,
  weather: null,
  city: "",
}

type Action =
  | { type: "INPUT_CHANGE"; payload: string }
  | { type: "SEARCH_START" }
  | { type: "FETCH_SUCCESS"; payload: Weather }
  | { type: "FETCH_FAIL"; payload: string }

function reducer(state: State, action: Action):State{
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
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        error: null,
        //weather: state.weather,
        weather: action.payload
      }
    case "FETCH_FAIL":
      return {
        ...state,
        loading: false,
        //error: state.error,
        error: action.payload,
        weather: null
      }
    default:
      return state;
  }
}


function App(){
  const [state, dispatch] = useReducer(reducer, initialState);
  const searchBtn = async() => {
    if(!state.city.trim()) return;
  
    dispatch({
      type: "SEARCH_START"
    })

    const API_KEY = "784ab24ff2ed5d94d4288abed9e25d13";
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${state.city.trim()}&appid=${API_KEY}&units=metric`);
      if(!response.ok){
        if(response.status === 404){
          throw new Error("도시 이름을 찾을 수 없습니다.");
        } else {
          throw new Error("서버 오류가 발생했습니다.");
        }
      }
      const json = await response.json();

      dispatch({
        type: "FETCH_SUCCESS",
        payload: {
          name: json.name,
          temp: json.main.temp,
        }
      });

    } catch(error) {
      if (error instanceof Error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.message
        });
      }
    } 
  }
  return (
    <>
      <input value={state.city} onChange={(e:React.ChangeEvent<HTMLInputElement>) => dispatch({ type: "INPUT_CHANGE", payload: e.target.value})} placeholder="도시이름을 입력하세요."/>
      <button onClick={searchBtn}>Search</button>
      {state.loading && <div>Loading...</div>}
      {state.error && <div>{state.error}</div>}
      {state.weather && <div>
          <h3>도시이름 : {state.weather.name}</h3>
          <h3>온도 : {Math.ceil(state.weather.temp)}°C</h3>
        </div>
      }
    </>
  );
}

export default App;