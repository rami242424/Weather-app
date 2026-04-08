// SET_CITY
// FETCH_START
// FETCH_SUCCESS
// FETCH_ERROR

import { useReducer } from "react";

type State = {
  city: string;
  weather: Weather | null;

}

type Weather = {
  name: string;
  temp: number;
}

type Action = 
  | { type: "SET_CITY" }

  
const initialState = {
  city: "",
  weather: null
}

function reducer (state:State, action:Action) : State {
  switch(action.type){

  default:
  return state;
}

}

function App(){
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <>
      <input />
      <button>Search</button>
    </>
  );
}


export default App;
