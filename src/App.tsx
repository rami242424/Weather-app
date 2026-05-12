import SearchBar from "./components/SearchBar";
import RecentCities from "./components/RecentCities";
import WeatherCard from "./components/WeatherCard";
import ForecastSection from "./components/ForecastSection";
import { useWeather } from "./hooks/useWeather";
import styles from "./App.module.css";


function App(){
  const {getWeather, getCurrentLocation, state, selectedDate, setSelectedDate, handleInputChange } = useWeather();
  return (
    <div className={styles.wrapper}>
      <SearchBar 
        city={state.city}
        onInputChange={handleInputChange}
        onSearch={getWeather} 
        loading={state.loading} 
        onCurrentLocation={getCurrentLocation}
      />
      <div className={styles.recentCities}>
        {state.recentCities.length > 0 && state.recentCities.map((cityName) => (
          <RecentCities key={cityName} cityName={cityName} onSearch={getWeather} />
        ))}
      </div>
      {state.loading && <div>Loading...</div>}
      {state.error && <div>{state.error}</div>}
      {state.weather && <WeatherCard {...state.weather}/>}
      <ForecastSection forecast={state.forecast} selectedDate={selectedDate} setSelectedDate={setSelectedDate}/>
    </div>
  );
}

export default App;
