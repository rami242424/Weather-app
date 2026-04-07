import { useReducer } from "react";

type State = {
  city : string;
  loading : boolean;
  weather : Weather | null;
  error: string | null;
}

type Weather = {
  name: string;
  temp: number;
}
const initialState : State = {
  city: "",
  loading: false,
  weather: null,
  error: null
}
type Action =
  | { type: "SET_CITY", payload: string }
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: any }
  | { type: "FETCH_ERROR"; payload: string }

function reducer (state: State, action: Action) : State{
  switch(action.type){
    case "SET_CITY":
      return {
        ...state,
        city: action.payload
      }
    case "FETCH_START":
      return {
        ...state,
        loading: true,
        error: null
      }
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        weather: action.payload
      }
    case "FETCH_ERROR":
      return {
        ...state,
        loading: true,
      }

    default :
    return state;
  }
}
function App(){
  const [state, dispatch] = useReducer(reducer, initialState);
  const fetchWeather = async() => {
    dispatch({ type: "FETCH_START"});

    try {
      const fakeData = {
        name: "Seoul",
        temp: 20
      };

      setTimeout(() => {
        dispatch({ type: "FETCH_SUCCESS", payload: fakeData});
      }, 1000);

    }
    catch (err) {
      dispatch({ type: "FETCH_ERROR", payload: "에러발생"});
    }
  };


  return (
    <>
      <input value={state.city} onChange={(e) => dispatch({ type: "SET_CITY", payload: e.target.value})} />
      <button onClick={fetchWeather}>Search</button>
      {state.loading 
        ? "...loading" 
        : state.weather && (
          <div>
            <h3>{state.weather.name}</h3>
            <p>{state.weather.temp}°C</p>
          </div>
        )
      }
    </>
  );
}

export default App;