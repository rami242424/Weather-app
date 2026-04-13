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
  | { type: "START_SEARCH" }

const initialState = {
  city: "",
  loading: true,
  error: null,
  weather: null,
}

function reducer(state:State, action:Action):State{
  switch(action.type){
    default:
      return state;
  }
}  


function App(){
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      <input 
        value={state.city} 
        onChange={(e:React.ChangeEvent<HTMLInputElement>) => dispatch({ type: "INPUT_CHANGE", payload: e.target.value })}
      />
      <button onClick={() => dispatch({ type: "START_SEARCH" })}>Search</button>
      {state.loading && <div>Loading...</div>}
      {state.error && <div>Error:{error}</div>}
      {state.weather && <div>
          <h3>도시이름 : {state.weather.name}</h3>
          <h3>온도 : {Math.ceil(state.weather.temp)}°C</h3>
        </div>
      }
    </>
  );
}

export default App;