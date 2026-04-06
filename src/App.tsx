import { useReducer } from "react";

type State = {
  city : string;
  loading : boolean;
  weather : any;
  error: string | null;
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
    default :
    return state;
  }
}
function App(){
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      <input />
    </>
  );
}

export default App;