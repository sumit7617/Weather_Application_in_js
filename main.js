// Your weather tab
const userTab = document.querySelector("[data-userWeather]");
// Search weather tab
const searchTab = document.querySelector("[data-searchWeather]");
// current tab
let currentTab = userTab;
currentTab.classList.add("current-tab");
// -----------------------------------------------------------------------

// weather container -----------------------------------------------------
const weatherContainer = document.querySelector(".weather-container");
// grant access container
const grantAccessContainer = document.querySelector(".grant-location-container")

// -----------------------------------------------------------------------

// search form ------------------------------------------------------------
const searchForm = document.querySelector("[data-searchForm]");

// search button
const searchButton = document.querySelector("[data-searchButton]");

// loading container-------------------------------------------------------
const loadingContainer = document.querySelector(".loading-container");
// ------------------------------------------------------------------------

// user info container-----------------------------------------------------
const userinfoContainer = document.querySelector(".user-info-container");
// city name

// ----------------------------------------------------------------------
// API key
const API_key = "ba3a310bdbdcf996a4d13b3eaa4e6992"; 
getfromSessionStorage();

// ek kaam pending

function switchTab(clickedTab) {
    if (clickedTab != currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab")

        if (!searchForm.classList.contains("active")) {
            userinfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
            
        }else{
            userinfoContainer.classList.remove("active");
            searchForm.classList.remove("active");
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click", () =>{
    // pass clicked tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener("click", () =>{
    // pass clicked tab as input parameter
    switchTab(searchTab);
});

// check if cordinates are already present in session storage
function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates) {
        grantAccessContainer.classList.add("active");
    }else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates;
    // make grantcontainer  invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingContainer.classList.add("active");

    //API CALL
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`
        );
        const data = await response.json();

        loadingContainer.classList.remove("active");
        userinfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } catch (err) {
        loadingContainer.classList.remove("active");
    }
    
}

function renderWeatherInfo(weatherInfo) {
    //firstly, we have to fatch the elements
    const cityName = document.querySelector("[data-cityName]");
    // city flag icon
    const countryIcon = document.querySelector("[data-countryIcon]");
    // weather description
    const desc = document.querySelector("[data-weatherDesc]");
    // weather icon
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    // temprature
    const temp = document.querySelector("[data-temp]");
    // windspeed
    const windSpeed = document.querySelector("[data-windspeed]");
    // humidity
    const humidity = document.querySelector("[data-humidity]");
    // cloudiness
    const cloudiness = document.querySelector("[data-cloudiness]");

    //fetch values form weatherinfo 
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp.toFixed(2)} °C`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText =`${weatherInfo?.clouds?.all} %` ;
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPositon);
    }
    else{
        // show an alert for no geolocation support available
    }
}

function showPositon(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

// grant access button
const grantAccess = document.querySelector("[data-grantAccess]");
grantAccess.addEventListener("click", getLocation);

// search input
const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e) =>{
    e.preventDefault();
    let cityName = searchInput.value;

    if (cityName === "") {
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }
});

async function fetchSearchWeatherInfo(cityName) {
    loadingContainer.classList.add("active");
    userinfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_key}&units=metric`
            );
        const data = await response.json();
        loadingContainer.classList.remove("active");
        userinfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } catch (err) {
        
    }
}
