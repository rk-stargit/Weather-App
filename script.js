const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(
  ".grant-location-container"
);
const searchForm = document.querySelector("[data-searchForm]");

const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

let oldTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(newTab) {
  if (newTab != oldTab) {
    oldTab.classList.remove("current-tab");
    oldTab = newTab;
    oldTab.classList.add("current-tab");

    document.querySelector(".fahren").style.backgroundColor =
      "rgba(219, 226, 239, 0.5)";
    document.querySelector(".cel").style.backgroundColor = "rgb(4, 119, 4)";

    if (!searchForm.classList.contains("active")) {
      //kya search form wala container is invisible, if yes then make it visible
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      searchForm.classList.add("active");
    } else {
      //main pehle search wale tab pr tha, ab your weather tab visible karna h
      searchForm.classList.remove("active");
      userInfoContainer.classList.remove("active");
      //ab main your weather tab me aagya hu, toh weather bhi display karna poadega, so let's check local storage first
      //for coordinates, if we haved saved them there.
      getfromSessionStorage();
    }
  }
}

userTab.addEventListener("click", () => {
  //pass clicked tab as input paramter
  switchTab(userTab);
});

searchTab.addEventListener("click", () => {
  //pass clicked tab as input paramter
  switchTab(searchTab);
});

//check if cordinates are already present in session storage
function getfromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if (!localCoordinates) {
    //agar local coordinates nahi mile
    grantAccessContainer.classList.add("active");
  } else {
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

async function fetchUserWeatherInfo(coordinates) {
  const {lat, lon} = coordinates;
  // make grantcontainer invisible
  grantAccessContainer.classList.remove("active");
  //make loader visible
  loadingScreen.classList.add("active");

  //API CALL
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();

    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {
    loadingScreen.classList.remove("active");
    //HW
  }
}
var tempp = "";
let temp = document.querySelector("[data-temp]");
function renderWeatherInfo(weatherInfo) {
  //fistly, we have to fethc the elements

  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const desc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");

  const windspeed = document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-cloudiness]");

  console.log(weatherInfo);

  //fetch values from weatherINfo object and put it UI elements
  let cityy = weatherInfo?.name;
  cityName.innerText = cityy;
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  desc.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  tempp = `${weatherInfo?.main?.temp}`;
  temp.innerText = `${tempp}°C`;

  windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
  humidity.innerText = `${weatherInfo?.main?.humidity}%`;
  cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

document.querySelector(".fahren").style.backgroundColor =
  "rgba(219, 226, 239, 0.5)";
document.querySelector(".cel").style.backgroundColor = "rgb(4, 119, 4)";

function tempf() {
  document.querySelector(".cel").style.backgroundColor =
    "rgba(219, 226, 239, 0.5)";
  document.querySelector(".fahren").style.backgroundColor = "rgb(4, 119, 4)";
  let tempf = (tempp * 9) / 5 + 32;
  temp.innerText = `${tempf}°F`;
  return;
}
function tempc() {
  document.querySelector(".fahren").style.backgroundColor =
    "rgba(219, 226, 239, 0.5)";
  document.querySelector(".cel").style.backgroundColor = "rgb(4, 119, 4)";
  temp.innerText = `${tempp}°C`;
  return;
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    //HW - show an alert for no gelolocation support available
  }
}

function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };

  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let cityName = searchInput.value;

  if (cityName === "") return;
  else fetchSearchWeatherInfo(cityName);
});

async function fetchSearchWeatherInfo(city) {
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAccessContainer.classList.remove("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    loadingScreen.classList.remove("active");

    if (response.ok && data.cod === 200) {
      userInfoContainer.classList.add("active");
      renderWeatherInfo(data);
    } else {
      // Handle API errors and display appropriate error messages
      if (data.cod === "404") {
        displayErrorMessage(
          "Location not found. Please check the city name and try again."
        );
      } else {
        displayErrorMessage(
          "An error occurred while fetching weather data. Please try again later."
        );
      }
    }
  } catch (err) {
    displayErrorMessage(
      "An error occurred. Please check your network connection and try again."
    );
  }
}
function displayErrorMessage(message) {
  const errorMessageElement = document.getElementById("error-message");
  errorMessageElement.textContent = message;
  errorMessageElement.style.display = "block";

  // Hide the error message after a few seconds (e.g., 5 seconds)
  setTimeout(() => {
    errorMessageElement.style.display = "none";
  }, 5000);
}
