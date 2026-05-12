import styles from "./RecentCities.module.css";

interface IRecentCitiesProps {
    cityName: string;
    onSearch: (value:string) => void
}
function RecentCities({cityName, onSearch}:IRecentCitiesProps){
    return(
        <>
            <button className={styles.button} onClick={() => onSearch(cityName)}>{cityName}</button>
        </>
    );
}

export default RecentCities;