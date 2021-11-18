const KELVIN = 273;
var citydb = [];
let i = 0;

const weather = {
    temperature : {
        value : 100, 
        unit : "celcius"
    },
    description : "weather description is here.",
    iconId : "01d",
    city : "London",
    country : "GB"
};



function showWeather() {
    
    let max = citydb.length;

    setInterval(() => { 
        getWeather(i%max);
        i++;
    }, 3000);
    
}

function getWeather(i) {

    var API_key = "46bceb4cbebb858ccb27e0a40c75ce39";
    var lat = citydb[i].lattitude;
    var lon = citydb[i].longitude; 
    var base = 'api.openweathermap.org/data/2.5/weather';
    var query = '?lat=' + lat + '&lon=' + lon + '&appid=' + API_key;
    
    var endpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=46bceb4cbebb858ccb27e0a40c75ce39`;
    
    fetch(endpoint)
    .then((response) => {
      return response.json();
    })
    .then((results) => {
        console.log("YES!");
        chrome.runtime.sendMessage({
            msg: "weather", 
            data: {
                iconId : results.weather[0].icon,
                temperature : Math.floor(results.main.temp - KELVIN),
                description : results.weather[0].description,
                location : results.name + ', ' + results.sys.country
            }
        });
    })
    .catch(
        chrome.runtime.sendMessage({
            msg: "error", 
            data: {}
        })
    );
}

function displayWeather() {
    document.getElementById("weather_icon_id").src = './icons/' + weather.iconId + '.png';
    document.getElementById("temperature_value").innerHTML = `${weather.temperature.value}°<span>C</span>`;
    document.getElementById("temperature_description").innerHTML = weather.description;
    document.getElementById("location").innerHTML = weather.city + ', ' + weather.country;
}

function FahrenheitToCelcius (value) {
    return value;
}

function celciusToFahrenheit (value) {
    return value;
}

function loadList() {
    chrome.storage.local.get('cityarr', function(results) {

        if(typeof(results['cityarr']) !== 'undefined' && results['cityarr'] instanceof Array) { 
            citydb = results['cityarr']
            console.log("citydb has length of " + citydb.length)
            showWeather();
        } 
        else {
            //notificationElement.style.display = "block";
            //document.getElementById('notificationElement').innerHTML = "<p>No location to search!</p>"
            console.log("NOOOOOOOOO");
            chrome.runtime.sendMessage({
                msg: "no data error", 
                data: {}
            })
        } 
    });
}


loadList();

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) { 
        if (request.msg === "next") {
            getWeather(i%(citydb.length));
            i++;
        }
    }
)    
    

/*
document.getElementById("temperature_value").addEventListener("click", () => {
    if (weather.temperature.value === undefined) return;

    if (weather.temperature.unit === "celcius") {
        let fahren = celciusToFahrenheit(weather.temperature.value);
        fahren = Math.floor(fahren);

        tempVal.innerHTML = '${fahren}<span>F</span>';
        weather.temperature.unit = "fahrenheit"
    }
    else {
        let celcius = FahrenheitToCelcius(weather.temperature.value);
        celcius = Math.floor(celcius);

        tempVal.innerHTML = '${celcius}<span>C</span>';
        weather.temperature.unit = "celcius"
    }
});
*/
