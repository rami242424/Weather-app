import { useState } from "react";


function App(){
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("");
  const inputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  }
  return (
    <>
      <input value={city} onChange={inputChange} placeholder="도시이름을 입력하세요."/>
      <button>Search</button>
    </>
  );
}

export default App;