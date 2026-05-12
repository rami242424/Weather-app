import type { Weather } from "../types";
import styles from "./WeatherCard.module.css";

function WeatherCard({icon,description,name,temp,feels_like,humidity,wind}:Weather){
    return(
        <div className={styles.card}>
            <div className={styles.header}>
                <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`} alt={description} />
                <h3 className={styles.cityName}>{name}</h3>
            </div>
            <p className={styles.description}>{description}</p>
            <p className={styles.temp}>{Math.ceil(temp)}°C</p>
            <div className={styles.info}>
                <p>체감온도 : {Math.ceil(feels_like)}°C</p>
                <p>습도 : {humidity}%</p>
                <p>풍속 : {wind}m/s</p>
            </div>
        </div>
    );
}

export default WeatherCard;