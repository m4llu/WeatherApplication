import { API_KEY } from './info.js'
let currentCity = "Lahti";
let velUnit = "km/h"
let tempUnit = "°C"
let theme = 0
const searchInput = document.querySelector('.search');
const checkBox = document.getElementById('checkBox');
const checkBox1 = document.getElementById('checkBox1');

checkBox1.addEventListener('change', function(event) {
  // Update the JavaScript variable based on the checkbox state
  featureEnabled = event.target.checked;
  // You can also perform other actions based on the checkbox state here
  if (featureEnabled) {
    velUnit = "mp/h"
    tempUnit = "°F"
  } else {
    velUnit = "km/h"
    tempUnit = "°C"
  }
});


searchInput.addEventListener('change', function(event) {

  currentCity = event.target.value;
  document.getElementById("date").innerHTML = `${currentCity}`;
  fetch(`http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${currentCity}&days=1&aqi=no&alerts=no`, {
  method: 'GET', 
  headers: {
 
  },
           
}).then(response => {
  if (!response.ok) {
    throw response;
  }
            
  return response.json(); 

}).then(response => {

  let uvIndex = response.current.uv;
  document.getElementById("uv").innerHTML = `${uvIndex}`
  
  let rain = response.current.temp_c;
  document.getElementById("rain").innerHTML = `${rain} %`
  
  let feelsLike = response.current.feelslike_c;
  document.getElementById("feels").innerHTML = `${feelsLike} ${tempUnit}`

  let wind = response.current.wind_kph;
  document.getElementById("wind").innerHTML = `${wind} ${velUnit}`
  
  let date = response.forecast.forecastday[0].date;
  document.getElementById("date").innerHTML = `${currentCity}`;

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
      
  }weatherData(response);


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

