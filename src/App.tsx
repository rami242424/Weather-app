import { useState } from "react";

function App(){
  const [inputValue, setInputValue] = useState("");
  const inputChange = () => {
    
  }
  return (
    <>
      <input value={inputValue} onChange={inputChange} placeholder="도시의 이름을 입력하세요"/>
      <button>Search</button>
    </>
  )
}

export default App;