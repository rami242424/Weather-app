# 🌤 WeatherNow

> OpenWeatherMap API 기반 현재 날씨 및 5일 예보 조회 앱

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript) ![CSS_Modules](https://img.shields.io/badge/CSS_Modules-000000?logo=cssmodules) ![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)

---

## 📎 배포 링크

🔗 [WeatherNow 바로가기](https://weather-now-nine-iota.vercel.app/)

---

## 📸 화면 구성

|                       홈                        |                  날씨 검색 결과                   |                    5일 예보 상세                    |
| :---------------------------------------------: | :-----------------------------------------------: | :-------------------------------------------------: |
| <img src="./screenshots/home.png" width="260"/> | <img src="./screenshots/search.png" width="260"/> | <img src="./screenshots/forecast.png" width="260"/> |

---

## 📌 주요 기능

- 도시 이름으로 현재 날씨 검색 (엔터 / 버튼 모두 지원)
- 현재 위치 기반 날씨 자동 조회 (Geolocation API)
- 날씨 아이콘, 온도, 체감온도, 습도, 풍속 표시
- 5일 예보 (낮 12시 기준 대표값) — 날짜 클릭 시 상세 정보 확인
- 최근 검색 도시 목록 저장 (localStorage, 최대 5개)
- 검색 성공 시에만 최근 목록에 추가 (실패 시 저장 안 됨)
- API 실패 / 도시 없음 에러 메시지 처리

---

## 🛠 기술 스택

| 역할   | 기술                    |
| ------ | ----------------------- |
| UI     | React 18                |
| 언어   | TypeScript              |
| 스타일 | CSS Modules             |
| 빌드   | Vite                    |
| API    | OpenWeatherMap REST API |

---

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── SearchBar.tsx         # 검색 입력 + 버튼
│   ├── SearchBar.module.css
│   ├── RecentCities.tsx      # 최근 검색 도시 버튼
│   ├── RecentCities.module.css
│   ├── WeatherCard.tsx       # 현재 날씨 카드
│   ├── WeatherCard.module.css
│   ├── ForecastSection.tsx   # 5일 예보 날짜 버튼 + 상세
│   └── ForecastSection.module.css
├── hooks/
│   └── useWeather.ts         # 날씨 API 호출 및 상태 관리 로직
├── types.ts                  # 공통 타입 정의
└── App.tsx                   # 루트 컴포넌트
```

---

## 🔧 구현 포인트

### useReducer로 복잡한 상태 관리

`loading`, `error`, `weather`, `city`, `recentCities`, `forecast` 6개의 상태가 서로 연관되어 있어 `useState` 대신 `useReducer`를 선택했습니다. `SEARCH_START`, `SEARCH_SUCCESS`, `SEARCH_FAIL` 액션 단위로 상태 전환을 명확하게 표현해 예측 가능한 상태 관리를 구현했습니다.

```ts
type Action =
  | { type: "INPUT_CHANGE"; payload: string }
  | { type: "SEARCH_START"; payload: string }
  | {
      type: "SEARCH_SUCCESS";
      payload: { weather: Weather; forecast: Forecast[] };
    }
  | { type: "SEARCH_FAIL"; payload: string };
```

---

### 커스텀 훅으로 로직과 UI 분리

API 호출, 상태 관리, localStorage 처리 등의 로직을 `useWeather` 커스텀 훅으로 분리했습니다. `App.tsx`는 렌더링에만 집중하고, `dispatch`를 외부에 노출하지 않고 핸들러 함수 형태로만 제공합니다.

```ts
const handleInputChange = (value: string) =>
  dispatch({ type: "INPUT_CHANGE", payload: value });

return {
  state,
  selectedDate,
  setSelectedDate,
  getWeather,
  getCurrentLocation,
  handleInputChange,
};
```

---

### Promise.all로 API 병렬 호출

현재 날씨와 5일 예보 API를 `Promise.all`로 동시에 호출해 로딩 시간을 단축했습니다.

```ts
const [weatherRes, forecastRes] = await Promise.all([
  fetch(`...weather?q=${targetCity}...`),
  fetch(`...forecast?q=${targetCity}...`),
]);
```

---

### 5일 예보 데이터 가공

OpenWeatherMap forecast API는 3시간 간격으로 40개 데이터를 반환합니다. `dt_txt`에서 `"12:00:00"`을 포함하는 데이터만 필터링해 낮 12시 기준 대표값 5개만 추출했습니다.

```ts
forecastJson.list
  .filter((item: ForecastItem) => item.dt_txt.includes("12:00:00"))
  .map((item: ForecastItem) => ({
    date: item.dt_txt.slice(0, 10),
    temp: item.main.temp,
    icon: item.weather[0].icon,
    description: item.weather[0].description,
  }));
```

---

### 최근 검색 도시 관리

검색 성공 시에만 최근 목록에 추가하고, 중복 제거 및 최대 5개 제한을 적용했습니다. localStorage와 React 상태를 동기화해 새로고침 후에도 유지됩니다.

```ts
[newCity, ...state.recentCities.filter((city) => city !== newCity)].slice(0, 5);
```

---

## 🚀 시작하기

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
```

루트에 `.env` 파일 생성 후 아래 내용 추가

```
VITE_API_KEY=your_api_key_here
```

> OpenWeatherMap API 키는 [https://openweathermap.org](https://openweathermap.org) 에서 발급받을 수 있습니다.
