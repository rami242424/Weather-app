import type { Forecast } from "../types";

interface IForecastSection {
    forecast: Forecast[];
    selectedDate: string|null;
    setSelectedDate: (value:string|null) => void;
}

function ForecastSection({forecast, selectedDate, setSelectedDate}:IForecastSection){
    return(
        <>
            {forecast.length > 0 && (
                <div>
                    {forecast.map((item) => (
                        <button key={item.date} onClick={() => setSelectedDate(item.date)}>
                        {item.date}
                        </button>
                    ))}
                </div>
            )} 
            {selectedDate && (
                <div>
                    {forecast.filter(item => item.date === selectedDate).map(item => (
                        <div key={item.date}>
                        <img src={`https://openweathermap.org/img/wn/${item.icon}@2x.png`} />
                        <p>{item.date}</p>
                        <p>{Math.ceil(item.temp)}°C</p>
                        <p>{item.description}</p>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

export default ForecastSection;