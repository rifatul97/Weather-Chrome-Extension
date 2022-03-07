//document.getElementById("weather_icon_id").src = './icons/' + data.weather[0].icon + '.png';
      //document.getElementById("temperature_value").innerHTML = `${Math.floor(data.main.temp - KELVIN)}°<span>C</span>`;
      //document.getElementById("temperature_description").innerHTML =  data.weather[0].description;
      //document.getElementById("location").innerHTML = data.name + ', ' + data.sys.country;;

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.msg === "weather") {
            document.getElementById("weather_icon_id").src = './icons/' + request.data.iconId + '.png';
            document.getElementById("temperature_value").innerHTML = `${request.data.temperature}°<span>C</span>`
            document.getElementById("temperature_description").innerHTML =  request.data.description;
            document.getElementById("location").innerHTML = request.data.location;
        }
        else if(request.msg === "error") {
            document.getElementById("weather_icon_id").src = './icons/unknown.png';
            document.getElementById("temperature_value").innerHTML = ``
            document.getElementById("temperature_description").innerHTML =  'Loading...';
            document.getElementById("location").innerHTML = '';
        }
        else if(request.msg === "no data error") {
            document.getElementById("temperature_description").innerHTML =  'No location to search!';
        }
        else {
            document.getElementById("weather_icon_id").src = './icons/unknown.png';
            document.getElementById("temperature_value").innerHTML = ``
            document.getElementById("temperature_description").innerHTML =  'Loading...';
            document.getElementById("location").innerHTML = '';
        }

        document.getElementById("location").addEventListener("click", () => {
            chrome.runtime.sendMessage({
                msg: "next",
                data : {}
            });
        })
    }
);

