import type { Weather } from "../types";

function WeatherCard({icon,description,name,temp,feels_like,humidity,wind}:Weather){
    return(
        <>
            <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`} alt={description} />
            <h3>{name}</h3>
            <p>{description}</p>
            <p>{Math.ceil(temp)}°C</p>
            <p>체감온도 : {Math.ceil(feels_like)}°C</p>
            <p>습도 : {humidity}%</p>
            <p>풍속 : {wind}m/s</p>
        </>
    );
}

export default WeatherCard;