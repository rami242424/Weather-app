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
| { type: "INPUT_CHANGE" };

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
      <input/>
      <button>Search</button>
    </>
  );
}

export default App;