import { API_KEY } from './info.js'
let currentCity = "Lahti";
var velUnit = "km/h"
var tempUnit = "°C"
var rain = " "
var feelsLike = " "
var wind = " "
let theme = 0
const searchInput = document.querySelector('.search');
const checkBox = document.getElementById('checkBox');
const checkBox1 = document.getElementById('checkBox1');

searchInput.addEventListener('change', function(event) {
  currentCity = event.target.value;
  document.getElementById("date").innerHTML = `${currentCity}`;
  fetch(`http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${currentCity}&days=1&aqi=no&alerts=no`, {
    method: 'GET', 
    headers: {}
  }).then(response => {
    if (!response.ok) {
      throw response;
    }
    return response.json(); 
  }).then(response => {
    let uvIndex = response.current.uv;
    document.getElementById("uv").innerHTML = `${uvIndex}`
  
    rain = response.current.temp_c;
    document.getElementById("rain").innerHTML = `${rain} %`
  
    feelsLike = response.current.feelslike_c;
    document.getElementById("feels").innerHTML = `${feelsLike} ${tempUnit}`

    wind = response.current.wind_kph;
    document.getElementById("wind").innerHTML = `${wind} ${velUnit}`
  

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

searchInput.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    searchInput.blur();
  }
});

checkBox.addEventListener('change', function(event) {
  if (event.target.checked) {
    theme = 1;
    // Päivitä teema checkboxin tilan perusteella
  } else {
    theme = 0;
    // Päivitä teema checkboxin tilan perusteella
  }
  updateTheme();
});

checkBox1.addEventListener('change', function(event) {
  if (event.target.checked) {
    velUnit = "mp/h";
    tempUnit = "°F";
    // Päivitä nopeuden ja lämpötilan yksiköt checkboxin tilan perusteella
  } else {
    velUnit = "km/h";
    tempUnit = "°C";
    // Päivitä nopeuden ja lämpötilan yksiköt checkboxin tilan perusteella
  }
  updateUnitsOnScreen(feelsLike, wind);
});

function updateUnitsOnScreen(feelsLike, wind) {
  document.getElementById("feels").innerHTML = `${feelsLike} ${tempUnit}`

  document.getElementById("wind").innerHTML = `${wind} ${velUnit}`
  // Päivitä muut sään tiedot vastaavasti
}

function updateTheme()  {
  if (theme == 0) {
    document.documentElement.style.setProperty('--bg', '#14131C');
    document.documentElement.style.setProperty('--div', '#221F28');
    document.documentElement.style.setProperty('--detail', '#666F74');
    document.documentElement.style.setProperty('--hover', '#2f2d41');
    document.documentElement.style.setProperty('--cb1', '#f19999');
    document.documentElement.style.setProperty('--cb2', '#3292e1');
  }
  else  {
    document.documentElement.style.setProperty('--bg', '#bdbbca');
    document.documentElement.style.setProperty('--div', '#a097b3');
    document.documentElement.style.setProperty('--detail', '#FFF');
    document.documentElement.style.setProperty('--hover', '#807baa');
    document.documentElement.style.setProperty('--cb1', 'rgb(142, 176, 197)');
    document.documentElement.style.setProperty('--cb2', '#4d7ea7');
  }
}

