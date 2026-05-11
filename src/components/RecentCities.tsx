interface IRecentCitiesProps {
    cityName: string;
    onSearch: (value:string) => void
}
function RecentCities({cityName, onSearch}:IRecentCitiesProps){
    return(
        <>
            <button onClick={() => onSearch(cityName)}>{cityName}</button>
        </>
    );
}

export default RecentCities;