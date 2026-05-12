import type { Forecast } from "../types";
import styles from "./ForecastSection.module.css";

interface IForecastSection {
    forecast: Forecast[];
    selectedDate: string|null;
    setSelectedDate: (value:string|null) => void;
}

function ForecastSection({forecast, selectedDate, setSelectedDate}:IForecastSection){
    return(
        <div className={styles.container}>
            {forecast.length > 0 && (
                <div className={styles.card}>
                    <p className={styles.forecastLabel}>5일 예보 (낮 12시 기준)</p>
                    <div className={styles.dateList}>
                        {forecast.map((item) => (
                            <button 
                                className={item.date === selectedDate ? styles.activeDateBtn : styles.dateBtn}
                                key={item.date} 
                                onClick={() => setSelectedDate(item.date)}>
                                {item.date}
                            </button>
                        ))}
                    </div>
                    {selectedDate && (
                        <div className={styles.detailCard}>
                            {forecast.filter(item => item.date === selectedDate).map(item => (
                                <div key={item.date}>
                                    <img src={`https://openweathermap.org/img/wn/${item.icon}@2x.png`} />
                                    <p>{item.date}</p>
                                    <p className={styles.detailTemp}>{Math.ceil(item.temp)}°C</p>
                                    <p>{item.description}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default ForecastSection;