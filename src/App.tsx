import { useState } from "react";

type Weather = {
  name: string;
  temp: number;
}


function App(){
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const [weather, setWeather] = useState<Weather|null>(null);
  const [city, setCity] = useState("");
  const inputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  }
  const searchBtn = async() => {
    if(!city.trim()) return;
    setLoading(true);
    setError(null);
    setWeather(null);

    const API_KEY = "784ab24ff2ed5d94d4288abed9e25d13";
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.trim()}&appid=${API_KEY}&units=metric`);
      if(!response.ok){
        if(response.status === 404){
          throw new Error("도시 이름을 찾을 수 없습니다.");
        } else {
          throw new Error("서버 오류가 발생했습니다.");
        }
      }
      const json = await response.json();
      setWeather({
        name: json.name,
        temp: json.main.temp,
      })
    } catch(error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <input value={city} onChange={inputChange} placeholder="도시이름을 입력하세요."/>
      <button onClick={searchBtn}>Search</button>
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {weather && <div>
          <h3>도시이름 : {weather.name}</h3>
          <h3>온도 : {Math.ceil(weather.temp)}°C</h3>
        </div>
      }
    </>
  );
}

export default App;