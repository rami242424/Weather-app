import { useState } from "react";

type Props = {
  loading: boolean;
  error:  string|null;
  weather: Weather;
}

type Weather = {
  name: string;
  temp: number;
}

function WeatherContent ({loading,error,weather}:Props) {
  if(loading) return <div>Loading...</div>
  if(error) return <div>{error}</div>
  if(weather) return <div>
      <h3>도시이름 : {weather.name}</h3>
      <h3>온도 : {Math.ceil(weather.temp)} °C</h3>
  </div>
  return null;
}

function App(){
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [weather, setWeather] = useState<Weather|null>(null);
  const inputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value)
  }
  const searchBtn = async() => {
    if(!city.trim()) return;
    setLoading(true);
    setError(null);
    setWeather(null);

    try {
      const API_KEY = "784ab24ff2ed5d94d4288abed9e25d13";
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.trim()}&appid=${API_KEY}&units=metric`);
      if(!response.ok) throw new Error();
      const json = await response.json();
      setWeather({
        name : json.name,
        temp : json.main.temp,
      })

    } catch(error:any) {
      setError(error.message || "에러 발생");
      
    } finally {
      setLoading(false);
    }
  }
  return(
    <>
      <input value={city} onChange={inputChange} placeholder="도시이름을 입력하세요."/>
      <button onClick={searchBtn}>Search</button>
      <WeatherContent 
        loading = {loading}
        error = {error}
        weather = {weather}
      />
    </>
  )
}

export default App;