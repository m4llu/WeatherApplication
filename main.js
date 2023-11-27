import { API_KEY } from './info.js'
let currentCity = "Lahti";
var velUnit = "km/h"
var tempUnit = "°C"
var rain;
var feelsLike_c;
var feelsLike_f;
var wind_mph;
var wind_kph;
let theme = 0
let time = 0
let lang = 0;
const searchInput = document.querySelector('.search');
const checkBox = document.getElementById('checkBox');
const checkBox1 = document.getElementById('checkBox1');
const checkBox3 = document.getElementById('checkBox3');

searchInput.addEventListener('change', function(event) {
  currentCity = event.target.value;
  document.getElementById("date").innerHTML = `${currentCity}`;
  // getting data from API
  fetch(`http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${currentCity}&days=1&aqi=no&alerts=no`, {
    method: 'GET', 
    headers: {}
  }).then(response => {
    if (!response.ok) {
      throw response;
    }
    return response.json(); 
    // displaying data in site
  }).then(response => {
    let uvIndex = response.current.uv;
    document.getElementById("uv").innerHTML = `${uvIndex}`
  
    rain = response.current.temp_c;
    document.getElementById("rain").innerHTML = `${rain} %`
  
    feelsLike_c = response.current.feelslike_c;
    document.getElementById("feels").innerHTML = `${feelsLike_c} ${tempUnit}`

    feelsLike_f = response.current.feelslike_f;

    wind_kph = response.current.wind_kph;
    document.getElementById("wind").innerHTML = `${wind_kph} ${velUnit}`

    wind_mph = response.current.wind_mph;
    // displaying icons for every hour
    let temperatureData = new Array(24).fill(0); 
    response.forecast.forecastday[0].hour.forEach(hourData => {
      let hour = parseInt(hourData.time.split(' ')[1].split(':')[0]); 
      temperatureData[hour] = hourData.temp_c;  
      let iconUrl = hourData.condition.icon;  
      let imgElement = document.getElementById('icon' + (hour < 10 ? '0' + hour : hour) + ':00');
      if (imgElement) {
        imgElement.src = iconUrl;  
      }
    });
  
    for (let i = 0; i < temperatureData.length; i++) {
      let hour = (i < 10 ? '0' + i : i) + ':00';  
      let temperature = temperatureData[i];  
      let element = document.getElementById(hour); 
      if (element) {
        element.innerHTML = temperature + '°C'; 
      }
    }
    weatherData(response);
  }).catch((errorResponse) => {
    if (errorResponse.text) { 
      errorResponse.text().then( errorMessage => {
      })
    } else {
    } 
  });
});
// searching for city when enter is presse
searchInput.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    searchInput.blur();
  }
});
// saves settings to localStorage
function saveCheckboxStatesToLocalStorage() {
  localStorage.setItem('theme', theme);
  localStorage.setItem('velUnit', velUnit);
  localStorage.setItem('tempUnit', tempUnit);
  localStorage.setItem('time', time);
}

// getting settings from localStorage
function getCheckboxStatesFromLocalStorage() {
  if (localStorage.getItem('theme')) {
    theme = parseInt(localStorage.getItem('theme'));
    updateTheme();
    checkBox.checked = theme === 1;
  }

  if (localStorage.getItem('velUnit')) {
    velUnit = localStorage.getItem('velUnit');
    tempUnit = localStorage.getItem('tempUnit');
    updateUnitsOnScreen(feelsLike_c, feelsLike_f, wind_kph, wind_mph);
    checkBox1.checked = velUnit === "mp/h";
  }

  if (localStorage.getItem('time')) {
    time = parseInt(localStorage.getItem('time'));
    updateTime();
    checkBox3.checked = time === 1;
  }
}

// getting saved settings when site is loaded
document.addEventListener('DOMContentLoaded', function() {
  getCheckboxStatesFromLocalStorage();
});

// change settings when checkboxes are toggled
checkBox.addEventListener('change', function(event) {
  if (event.target.checked) {
    theme = 1;
  } else {
    theme = 0;
  }
  updateTheme();
  saveCheckboxStatesToLocalStorage();
});

checkBox1.addEventListener('change', function(event) {
  if (event.target.checked) {
    velUnit = "mp/h";
    tempUnit = "°F";
  } else {
    velUnit = "km/h";
    tempUnit = "°C";
  }
  updateUnitsOnScreen(feelsLike_c, feelsLike_f, wind_kph, wind_mph);
  saveCheckboxStatesToLocalStorage();
});

checkBox3.addEventListener('change', function(event) {
  if (event.target.checked) {
    time = 1;
  } else {
    time = 0;
  }
  updateTime();
  saveCheckboxStatesToLocalStorage();
});
// updating units when toggled
function updateUnitsOnScreen(feelsLike_c, feelslike_f, wind_kph, wind_mph) {
  if (velUnit == "mp/h") {
    document.getElementById("wind").innerHTML = `${wind_mph} ${velUnit}`
  } else {
    document.getElementById("wind").innerHTML = `${wind_kph} ${velUnit}`
  }

  if (tempUnit == "°F") {
    document.getElementById("feels").innerHTML = `${feelsLike_f} ${tempUnit}`
  } else {
    document.getElementById("feels").innerHTML = `${feelsLike_c} ${tempUnit}`
  }

}
// updating root colors when theme is changed
function updateTheme()  {
  if (theme == 0) {
    document.documentElement.style.setProperty('--bg', '#14131C');
    document.documentElement.style.setProperty('--div', '#221F28');
    document.documentElement.style.setProperty('--detail', '#d3dce0');
    document.documentElement.style.setProperty('--hover', '#2f2d41');
    document.documentElement.style.setProperty('--cb1', '#f19999');
    document.documentElement.style.setProperty('--cb2', '#1e4a6e');
    document.documentElement.style.setProperty('--wp', '#14131C');
  }
  else  {
    document.documentElement.style.setProperty('--bg', '#bdbbca');
    document.documentElement.style.setProperty('--div', '#a097b3');
    document.documentElement.style.setProperty('--detail', '#FFF');
    document.documentElement.style.setProperty('--hover', '#807baa');
    document.documentElement.style.setProperty('--cb1', 'rgb(142, 176, 197)');
    document.documentElement.style.setProperty('--cb2', '#4d7ea7');
    document.documentElement.style.setProperty('--wp', '#14131C');
  }
}
// display time in 12h or 24h format
function updateTime() {
  if (time == 0)  {
    document.getElementById("time1").innerHTML = `1.00`;
    document.getElementById("time3").innerHTML = `3.00`;
    document.getElementById("time5").innerHTML = `5.00`;
    document.getElementById("time7").innerHTML = `7.00`;
    document.getElementById("time9").innerHTML = `9.00`;
    document.getElementById("time11").innerHTML = `11.00`;
    document.getElementById("time13").innerHTML = `13.00`;
    document.getElementById("time15").innerHTML = `15.00`;
    document.getElementById("time17").innerHTML = `17.00`;
    document.getElementById("time19").innerHTML = `19.00`;
    document.getElementById("time21").innerHTML = `21.00`;
    document.getElementById("time23").innerHTML = `23.00`;
  }
  else {
    document.getElementById("time1").innerHTML = `1 AM`;
    document.getElementById("time3").innerHTML = `3 AM`;
    document.getElementById("time5").innerHTML = `5 AM`;
    document.getElementById("time7").innerHTML = `7 AM`;
    document.getElementById("time9").innerHTML = `9 AM`;
    document.getElementById("time11").innerHTML = `11 AM`;
    document.getElementById("time13").innerHTML = `1 PM`;
    document.getElementById("time15").innerHTML = `3 PM`;
    document.getElementById("time17").innerHTML = `5 PM`;
    document.getElementById("time19").innerHTML = `7 PM`;
    document.getElementById("time21").innerHTML = `9 PM`;
    document.getElementById("time23").innerHTML = `11 PM`;

  }
}