interface ISearchBarProps {
    city: string;
    loading: boolean;
    onSearch: (cityName?:string) => void;
    onCurrentLocation: () => void;
    onInputChange: (value:string) => void;
}

function SearchBar({city, onSearch, loading, onCurrentLocation, onInputChange}:ISearchBarProps){
    return(
        <>
            <input 
                value={city} 
                placeholder="도시이름을 입력해주세요." 
                onChange={(e) => onInputChange(e.target.value)}
                onKeyDown={(e) => {if(e.key === "Enter") onSearch()}}
            />
            <button onClick={() => onSearch()} disabled={loading}>Search</button>
            <button onClick={onCurrentLocation} disabled={loading}>My Current Location</button>
        </>
    );
}

export default SearchBar;