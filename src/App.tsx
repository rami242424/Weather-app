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
    setLoading(true);
    setError(null);
    setWeather(null);

    const API_KEY = "784ab24ff2ed5d94d4288abed9e25d13";
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.trim()}&appid=${API_KEY}&units=metric`);
      if(!response.ok) throw new Error();
      const json = await response.json();
      setWeather({
        name: json.name,
        temp: json.main.temp,
      })
    } catch(error:any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <input value={city} onChange={inputChange} placeholder="도시이름을 입력하세요."/>
      <button onClick={searchBtn}>Search</button>
    </>
  );
}

export default App;