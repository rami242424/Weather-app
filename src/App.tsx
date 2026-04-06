import { useReducer } from "react";

type State = {
  city : string;
  loading : boolean;
  weather : any;
  error: string | null;
}
type initialState = {
  city: "";
  loading: true;
  weather: any;
  error: null;
}
type Action =
  | { type: "SET_CITY", payload: string }
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: any }
  | { type: "FETCH_ERROR"; payload: string }

function reducer (state: State, action: Action) : State{
  return State;
}
function App(){
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      <input />
    </>
  );
}