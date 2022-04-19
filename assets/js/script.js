var searchFormEl = document.querySelector("#search-form");
var textFieldEl = document.querySelector("#text-field");
var searchButtonEl = document.querySelector("#searchBtn");
var currentWeatherEl = document.querySelector("#current-city-weather");
var searchHistoryEl = document.querySelector("#search-history");
var history = JSON.parse(localStorage.getItem("search")) || [];
var fiveDayEl = document.querySelector("#five-day");
var city = [];
var apiKey = "09f252a8b9d0c9071a537e314433b7e1";

var formSubmitHandler = function (event) {
  event.preventDefault();

  var city = textFieldEl.value.trim();
  if (city) {
    searchCity(city);
    textFieldEl.value = "";
  } else {
    alert("Please enter a city");
  }
  saveSearch(city);
  pastSearch(city);
};

var searchCity = function (city) {
  var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
          connectDaily(data);
        })
      }
    })
    .catch(function (error) {
      console.log("failed to connect to OpenWeather");
    });
};

var connectDaily = function (data) {
  var lat = data.coord.lat
    console.log(lat);
  var lon = data.coord.lon
    console.log(lon);

  var apiUrlTwo = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + apiKey;
  fetch(apiUrlTwo)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
          connectFiveDay(data);
          console.log(data.daily)
          displayCurrentWeather(data);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      console.log("failed to connect to URL");
    });
};

var displayCurrentWeather = function (data, city) {
  var currentWeatherEl = document.querySelector("#current-city-weather");
  currentWeatherEl.innerHTML = data.daily
    .map((day, idx) => {
      if (idx <= 0) {
        var dt = new Date(day.dt * 1000);
        return `<div class="col-sm-9 col-md-7 col-lg-9">
          <div class="header-container container header-border">
            <div id="current-city-weather" class="row">
              <div class="col">
                <div class="card border-dark">
                  <h2 class="card-title">${dt.toDateString()}</h2>
                  <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png"  class="card-img-top" alt="${day.weather[0].description}"/>
                  <div class="card-body">
                    <h3 class="card-title">${day.weather[0].main}</h3>
                    <p class="card-text">Temp: ${day.temp.day} \u00B0F</p>
                    <p class="card-text">Humidity: ${day.humidity} %</p>
                    <p class="card-text">Wind: ${day.wind_speed} m/s</p>
                    <p class="card-text">UV index: ${day.uvi}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>`
      }
      console.log(data);
    });
}

var connectFiveDay = function (data) {
  var fiveDayEl = document.querySelector("#five-day");
  fiveDayEl.innerHTML = data.daily
    .map((day, idx) => {
      if (idx <= 4) {
        var dt = new Date(day.dt * 1000);
          return `<div class="col">
            <div class="card five-day-card bg-info text-white" style="width: 10vw">
              <h2 class="card-title">${dt.toDateString()}</h2>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" class="card-img-top"alt=""${day.weather[0].description}"/>
                <div class="card-body">
                  <h3 class="card-title">${day.weather[0].main}</h3>
                  <p class="card-text">Temp: ${day.temp.day} \u00B0F</p>
                  <p class="card-text">Wind: ${day.wind_speed} m/s</p>
                  <p class="card-text">Humidity: ${day.humidity}</p>
                </div>
            </div>
          </div>`
      }
      console.log(data);
    })
    .join("");
  console.log(fiveDayEl);
}

var saveSearch = function (city) {
  var searchText = city;
    if (localStorage.getItem("search", searchText) === null) {
      history.push(searchText);
      localStorage.setItem("search", JSON.stringify(history));
      console.log(searchText);
      pastSearch();
    }
}

var pastSearch = function () {
  searchHistoryEl.innerHTML = "";
  for (var i = 0; i < history.length; i++) {
    var searchList = document.createElement("input");
    searchList.setAttribute("type", "text");
    searchList.setAttribute("readonly", true);
    searchList.setAttribute("class", "form-control d-block bg-gray w-75 mt-1 md-1");
    searchList.setAttribute("value", history[i]);
    searchList.addEventListener("click", function (event) {
      console.log(event.target.value);
      fiveDayEl.innerHTML = "";
      currentWeatherEl.innerHTML = "";
      city = event.target.value;
      searchCity(city);
    })
    searchHistoryEl.appendChild(searchList);
  }
}

searchFormEl.addEventListener("submit", formSubmitHandler);

pastSearch();