var citydb = [];

// Create a "close" button and append it to each list item
var myNodeList = document.getElementsByTagName("LI");
var i;
for (i = 0; i < myNodeList.length; i++) {
    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    myNodeList[i].appendChild(span);
}


function myFunction() {
    
    var searchName = document.getElementById("name").value;  
    document.getElementById('cityname').innerHTML = '';

    if ( searchName.length >= 3) {
        const API_KEY = '4MdOdx8jntN5UMl7aulCf1ArHlSePocv'
        const base = 'http://dataservice.accuweather.com/locations/v1/cities/autocomplete';
        const query = '?apikey=' + API_KEY + '&q=' + searchName;
        
        fetch(base + query)
            .then(function(response) {
                let data = response.json();
                return data; })
            .then(function(data){
                var optiondatas = [];
                for(let i = 0; i < data.length; i++) {

                    const cityName = data[i].LocalizedName;
                    const countryName = data[i].Country.LocalizedName;
                    const optionName = cityName + ', ' + countryName;
                    
                        var newOptionElement = document.createElement("option");
                        optiondatas.push(optionName);
                        newOptionElement.textContent = optionName;
                        
                        var idElement = document.createElement('div');
                        idElement.id = "optionId";
                        newOptionElement.appendChild(idElement)

                        var listNameElement = document.getElementById("cityname"); 
                        listNameElement.appendChild(newOptionElement);
                      
                }
            })
            .catch((err) => console.log(searchName + " was not found"));
            
    }
    
}

document.getElementById('addbtn').addEventListener("click", function(event) {
    newElement();
})

document.getElementById('name').addEventListener("keyup", event => {
    myFunction();
});


// Create a new list item when clicking on the "Add" button
function newElement() {
    var li = document.createElement("LI");
    var inputValue = document.getElementById("name").value;
    
    var valueInfo = inputValue.split(", ");

    getPositions(valueInfo[0], valueInfo[1]).then(data => 
    adddata(inputValue, data[0], data[1]))    
    
    var t = document.createTextNode(inputValue);
    li.appendChild(t);

    document.getElementById("locationList").appendChild(li);
        
    document.getElementById("name").value = "";

    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    li.appendChild(span);

    for (i = 0; i < close.length; i++) {
        close[i].onclick = function() {
          var div = this.parentElement;
          div.style.display = "none";
        }
    }

    document.getElementById("name").focus();
}

function adddata(cityname, lat, lon) {

    const newData =  {
        cityname : cityname,  
        lattitude : lat,
        longitude : lon
    }

    citydb.push(newData);

    chrome.storage.local.set({'cityarr':citydb}) 
    
    console.log("adddata is used and has a length of so far =" + citydb.length)
}

const getPositions = async(cityname, countryName) => {
    const API_KEY = '4MdOdx8jntN5UMl7aulCf1ArHlSePocv'
    const base = 'http://dataservice.accuweather.com/locations/v1/cities/search';
    const query = '?apikey=' + API_KEY + '&q=' + cityname;

    const response = await fetch(base + query);
    const data = await response.json();
    
    for (let i=0; i<data.length; i++) {
        if (data[i].LocalizedName === cityname && 
            data[i].Country.LocalizedName === countryName) 
        {
                lat = Math.round(data[i].GeoPosition.Latitude);
                lon = Math.round(data[i].GeoPosition.Longitude);
                return [lat, lon];
        }
    }
    return [200, 300];
}


// load data
function loadData() {
  
    chrome.storage.local.get('cityarr', function(results) {

        if(typeof(results['cityarr']) !== 'undefined' && results['cityarr'] instanceof Array) { 
            citydb = results['cityarr']
        } 
        else {
            citydb = [];
            chrome.storage.local.set({'cityarr':citydb})  
        }

        console.log(citydb.length)

        for(let i=0; i<citydb.length; i++) {
            cityName = citydb[i].cityname;

            var li = document.createElement("LI");
            var t = document.createTextNode(cityName)
            li.appendChild(t);

            var span = document.createElement("SPAN");
            var txt = document.createTextNode("\u00D7");
            span.className = "close";
            span.id = "id" + citydb.length;
            span.appendChild(txt);
            li.appendChild(span);

            document.getElementById("locationList").appendChild(li);
        }

        var close = document.getElementsByClassName("close");
        var j;  
        for (j = 0; j < close.length; j++) {
            close[j].onclick = function() {
                console.log("x is clicked.")
                deleteData(this.parentElement.textContent);
                var div = this.parentElement;
                div.style.display = "none";
          }
      }

    });

    }

loadData();


function deleteData(textContent) {
    console.log(textContent + " is in deleteData.")
    for (let i=0; i<citydb.length; i++) {
        console.log(textContent + "    " + citydb[i].cityname)
        if (textContent.startsWith(citydb[i].cityname) === true) {
            citydb.splice(i, 1);
            console.log("deleted.")
        }
    }
    console.log(citydb);
    chrome.storage.local.set({'cityarr':citydb}); 
}

function reset() {

}

