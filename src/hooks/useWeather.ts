import { useReducer, useState } from "react";
import type { Action, ForecastItem, State } from "../types";

const API_KEY = import.meta.env.VITE_API_KEY;

export const initialState = {
    loading: false,
    error: null,
    weather: null,
    city: "",
    recentCities: JSON.parse(localStorage.getItem("recentCities") || "[]"),
    forecast: [],
    };
export function reducer(state:State, action:Action):State {
    switch(action.type){
        case "INPUT_CHANGE":
        return { ...state, city: action.payload }
        case "SEARCH_START":{
            const newCity = action.payload;
            if(!newCity.trim()) return { ...state, loading: true, error: null, weather: null }
            return { ...state, loading: true, error: null, weather: null, city: action.payload }}
        case "SEARCH_SUCCESS":
        return { ...state, loading: false, error: null, weather: action.payload.weather, forecast: action.payload.forecast, recentCities: [state.city, ...state.recentCities.filter((city) => city !== state.city)].slice(0,5)}

        case "SEARCH_FAIL":
        return { ...state, loading: false, error: action.payload, weather: null,  recentCities: state.recentCities.filter((city) => city !== state.city) }
        default:
        return state;
    }
}

export function useWeather() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [selectedDate, setSelectedDate] = useState<string|null>(null);
    const handleInputChange = (value:string) => dispatch({ type: "INPUT_CHANGE", payload: value })

    const getWeather = async(cityName?: string) => {
        const targetCity = cityName || state.city;
        if(!targetCity.trim()) return;
        dispatch({ type: "SEARCH_START" , payload: targetCity});
        setSelectedDate(null);
        try {
        const [weatherRes, forecastRes] = await Promise.all([
            fetch(`https://api.openweathermap.org/data/2.5/weather?q=${targetCity.trim()}&appid=${API_KEY}&units=metric`),
            fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${targetCity.trim()}&appid=${API_KEY}&units=metric`)
        ]);
        if(!weatherRes.ok){
            if(weatherRes.status === 404){
            throw new Error("도시 이름을 찾을 수 없습니다.");
            } else {
            throw new Error("서버에 연결 할 수 없습니다.");
            }
        }
        const weatherJson = await weatherRes.json();
        const forecastJson = await forecastRes.json();
        dispatch({
            type: "SEARCH_SUCCESS",
            payload: {
            weather: {
                name: weatherJson.name,
                temp: weatherJson.main.temp,
                icon: weatherJson.weather[0].icon,
                description: weatherJson.weather[0].description,
                humidity: weatherJson.main.humidity,
                feels_like: weatherJson.main.feels_like,
                wind: weatherJson.wind.speed,
            },
            forecast: forecastJson.list.filter((item:ForecastItem) => item.dt_txt.includes("12:00:00")).map((item:ForecastItem) => ({
                date: item.dt_txt.slice(0,10),
                temp: item.main.temp,
                icon: item.weather[0].icon,
                description: item.weather[0].description,
            }))
            }
        });
        const updated = [targetCity, ...state.recentCities.filter((city) => city !== targetCity)].slice(0,5);
        localStorage.setItem("recentCities", JSON.stringify(updated));
        } catch(error){
        if(error instanceof Error){
            dispatch({ type: "SEARCH_FAIL", payload: error.message });
        }
        }
    }

    const getCurrentLocation = () => {
        dispatch({ type: "SEARCH_START", payload: "" });
        setSelectedDate(null);
        navigator.geolocation.getCurrentPosition(
        async(position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            try {
            const [weatherRes, forecastRes] = await Promise.all([
                fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`),
                fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
            ]);
            if(!weatherRes.ok) throw new Error("위치 기반 날씨 조회 실패");
            const weatherJson = await weatherRes.json();
            const forecastJson = await forecastRes.json();
            dispatch({
            type: "SEARCH_SUCCESS",
            payload: {
                weather: {
                name: weatherJson.name,
                temp: weatherJson.main.temp,
                icon: weatherJson.weather[0].icon,
                description: weatherJson.weather[0].description,
                humidity: weatherJson.main.humidity,
                feels_like: weatherJson.main.feels_like,
                wind: weatherJson.wind.speed,
                },
                forecast: forecastJson.list.filter((item:ForecastItem) => item.dt_txt.includes("12:00:00")).map((item:ForecastItem) => ({
                date: item.dt_txt.slice(0,10),
                temp: item.main.temp,
                icon: item.weather[0].icon,
                description: item.weather[0].description,
                }))
            }
            });
            } catch(error){
            if(error instanceof Error){
                dispatch({ type: "SEARCH_FAIL", payload: error.message });
            }
            }
        },
        (error) => {
            dispatch({ type: "SEARCH_FAIL", payload: error.message });
        }
        );
    }

    return { getWeather, getCurrentLocation, state,   selectedDate, setSelectedDate, handleInputChange }
}