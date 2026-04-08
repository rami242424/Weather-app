// typing -> 입력완료하면 state에 저장해야함
// loading
// success -> weather data
// fail -> error msg
import { useState } from "react";

function App(){
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [weather, setWeather] = useState<string[] | null>(null);
  
  const inputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  }
  const searchBtn = async() => {
    // 기본설정
    setLoading(true);
    setError(false);
    setWeather(null);

    // api요청
    try {
      const response = await fetch(`api주소`);
      const json = await response.json();
      setWeather(json);

    } catch(error) {
      //

    }
  }

  return (
    <>
      <input value={city} onChange={inputChange} placeholder="도시의 이름을 입력하세요."/>
      <button onClick={searchBtn}>Search</button>
      {loading ? "...Loading" 
        : {weather ? {weather} : {error}}
      }
    </>
  )
}

export default App;