import { useState } from "react";

type Weather = {
  name: string;
  temp: number;
}

type Props = {
  weather : Weather | null;
  error : string | null;
  loading : boolean;
}

function WeatherContent ({weather,error,loading}:Props) {
  if(loading) return <div>...Loading</div>;
  if(error) return <div>{error}</div>;
  if(weather) return <div>
    <h3>도시이름 : {weather.name}</h3>
    <h3>온도 : {Math.ceil(weather.temp)}°C</h3>
  </div>
  return <div>도시를 검색하세요.</div>;
}

function App(){
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<Weather|null>(null);
  const [error, setError] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);
  const inputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  }
  const searchBtn = async() => {
    if(!city.trim()) return;
    setLoading(true);
    setError(null);
    //2️⃣ setWeather(null) 이전 데이터를 제거해서 👉 새로운 상태가 UI에 제대로 반영되게 만드는 코드
    setWeather(null);
    try{
      const API_KEY = "784ab24ff2ed5d94d4288abed9e25d13";
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.trim()}&appid=${API_KEY}&units=metric`);
      const data = await response.json();
      //1️⃣ response.ok 서버가 에러를 줬을 때 👉 우리가 직접 throw 해서 catch로 보내는 코드
      if(!response.ok) {
        throw new Error(data.message);
      }
      setWeather({
        name: data.name,
        temp: data.main.temp,
      });

    } catch(error) {
      if(error instanceof Error){
          if(error.message === "Failed to fetch"){
            setError("네트워크 연결을 확인하세요.");
          } else {
            setError(error.message || "요청 실패");
          }
        } else {
          setError("확인 할 수 없는 에러 발생")
        }
      } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <input placeholder="도시이름을 입력하세요." value={city} onChange={inputChange}/>
      <button onClick={searchBtn}>Search</button>
      <WeatherContent 
        weather = {weather}
        error = {error}
        loading = {loading}
      />
    </>
  );
}

export default App;