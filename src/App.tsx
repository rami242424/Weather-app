import { useState } from "react";

type Weather = {
  name: string;
  temp: number;
}

type Props = {
  weather : Weather | null
}

function App(){
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<Weather|null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  }
  const searchBtn = async() => {
    setLoading(true);
    setError(false);
    setWeather(null);
    try{
      const API_KEY = "784ab24ff2ed5d94d4288abed9e25d13";
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
      if(!response.ok) throw new Error();
      const json = await response.json();
      setWeather({
        name: json.name,
        temp: json.main.temp,
      });

    } catch(error) {
      setError(true);
      console.log(error, "catch error 발생")
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <input placeholder="도시이름을 입력하세요." value={city} onChange={inputChange}/>
      <button onClick={searchBtn}>Search</button>
    </>
  );
}

export default App;