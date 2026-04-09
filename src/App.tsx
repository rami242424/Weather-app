import { useState } from "react";

type Weather = {
  name : string;
  temp : number;
}
type Props = {
  loading: boolean;
  error: boolean;
  weather : Weather | null;
}
function WeatherContent({loading, error, weather}:Props){
  if(loading) return <div>Loading...</div>;
  if(error) return <div>Error</div>;
  if(weather) return (
    <div>
      <span>도시 : {weather.name}</span>
      <span>온도 : {weather.temp}</span>
    </div>
  );
  return null;
}

function App(){
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [weather, setWeather] = useState<Weather | null>(null);
  
  const inputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  }
  const searchBtn = async() => {
    setLoading(true);
    setError(false);

    const API_KEY = "784ab24ff2ed5d94d4288abed9e25d13";

    try{
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
      if(!response.ok) throw new Error();
      const json = await response.json();
      setWeather({
        name: json.name,
        temp: json.main.temp
      });
    } catch (error) {
      setError(true);
      console.log(error, "에러발생");
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <input value={city} onChange={inputChange} placeholder="도시의 이름을 입력하세요."/>
      <button onClick={searchBtn}>Search</button>
      <WeatherContent
        loading={loading}
        error={error}
        weather={weather}
      />
    </>
  )
}

export default App;