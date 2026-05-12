import styles from "./SearchBar.module.css";

interface ISearchBarProps {
    city: string;
    loading: boolean;
    onSearch: (cityName?:string) => void;
    onCurrentLocation: () => void;
    onInputChange: (value:string) => void;
}

function SearchBar({city, onSearch, loading, onCurrentLocation, onInputChange}:ISearchBarProps){
    return(
        <div className={styles.container}>
            <div className={styles.searchRow}>
                <input 
                    value={city} 
                    placeholder="도시이름을 입력해주세요." 
                    onChange={(e) => onInputChange(e.target.value)}
                    onKeyDown={(e) => {if(e.key === "Enter") onSearch()}}
                    />
                <button onClick={() => onSearch()} disabled={loading}>Search</button>
            </div>
            <button onClick={onCurrentLocation} disabled={loading}>My Current Location</button>
        </div>
    );
}

export default SearchBar;