//declare array to hold search history to be stored in local storage
var cityList = [];

$(document).ready(function(){
  //dynamically create elements to hold weather data
    var currentBox = $("<div>").addClass("card text-center border m-4 border-dark border-3")
    var ccBody = $("<div>").addClass("card-body p-3")
    var theCity = $("<p>").addClass("theCity myH1 h4");
    var theDate = $("<p>").addClass("theDate")
     var icon = $("<img>").addClass("theIcon");
    var temperature = $("<p>").addClass("theTemp");
    var humidity = $("<p>").addClass("theHum");
    var windSpeed = $("<p>").addClass("theWind");
    var uvIndex = $("<p>").addClass("uV");
    var uvIndicator = $("<span>").addClass("uvIndicator")
    //append weather data to card, append card to webpage
    ccBody.append(theCity, theDate, icon, temperature, humidity, windSpeed, uvIndex, uvIndicator)
    currentBox.append(ccBody)
    $("#cityCurrent").append(currentBox)

    var forecastHeading = $("<p>").addClass("h3 myH1 text-center mt-2 forecastHeading");
    $("#fHeading").append(forecastHeading);
    
    //Check to see if search history exists in local storage, retrieve if it exists
    if(localStorage ["cityList"]) {
      cityList = JSON.parse(localStorage.getItem("cityList"))
    }
    //display past searches on webpage, make displayed list clickable
    if(cityList.length){
      for (i=0; i < cityList.length; i++) {
      var pastCities = $("<a>").addClass("list-group-item list-group-item-action");
      pastCities.text(cityList[i]);
      pastCities.click(function(event) {
        event.preventDefault()
        $(".cityForecast").empty();
        $(".uvIndicator").removeClass("lowUv moderateUv highUv")
        var cityName = event.target.text
        getWeather(cityName);
      })
      $("#savedList").append(pastCities);
      }
    }

//add click event to button
$("#searchButton").click(function(event){
    event.preventDefault()
    //if function to check if input field empty or not.Else statement to clear previous data from elements
    if($("#cityNameInput").val() === '') {
      alert("You must enter a city name to proceed!")
      return
    } else {
    $(".cityForecast").empty();
    $(".uvIndicator").removeClass("lowUv moderateUv highUv")
    var cityName = $("#cityNameInput").val()
    getWeather(cityName);
    }
})
    
});

function getWeather(cityName) {
    //Call function to save city name to local storage
    savedSearch(cityName);
   
    console.log(cityName)
    var baseUrl = "https://api.openweathermap.org/data/2.5/weather?q="
    var apiKey = "&appid=cd6b6224a3720446eb55826fcfd4a40a"
    var completeUrl = baseUrl+cityName+"&units=imperial"+apiKey

    //fetch function to retrieve weather data from openweather
    fetch(completeUrl)  
    .then(function(response) {
      if (response.ok) {
        response.json()
        .then (function(data) {
          console.log(data);
          displayWeather(data, cityName);
        })
      } else {
        alert("City not found, please try again");
      }
    }) 

      var displayWeather = function (data, cityName) {
    // get UNIX date from API and convert to readable date format
     var dataDate = data.dt*1000;
     var date = new Date(dataDate);

     var day = date.getDate();
     var month = date.getMonth() + 1;
     var year = date.getFullYear();
     var formattedDate = '(' + month + '/' + day + '/' + year + ')'
     
     $("#cityCurrent").removeClass("hidden")
    //retrieve weather icon from API and set to webpage
    var iconcode = data.weather[0].icon;
    $(".theIcon").attr("src", "https://openweathermap.org/img/w/"+iconcode+".png")
    $(".theCity").text(cityName)
    $(".theDate").text(formattedDate)

    //retrieve temperature, humidity and windspeed data and display on webpage
    $(".theTemp").text("temperature: " + data.main.temp + " F")
    $(".theHum").text("Humidity: " + data.main.humidity)
    $(".theWind").text("Wind Speed: " + data.wind.speed)

   //declare variables to hold city longitude and lattitude values
    var cityLong = data.coord.lon
    var cityLat = data.coord.lat
    //create url to retrieve uv index + forecasts
    var uvUrl= "https://api.openweathermap.org/data/2.5/onecall?lat="+cityLat+"&lon="+cityLong+"&units=imperial&appid=cd6b6224a3720446eb55826fcfd4a40a"
    //fetch function for getting UV index info + forecast
    fetch(uvUrl)
    .then(function(response) { 
      // Convert data to json
      return response.json() 
   }) 
  .then(function(data) {
    console.log(data);
    //display uv index to webpage
    $(".uV").text("UV Index: " + data.current.uvi)
//if function to display different color for low, moderate or high risk UV index
    if (data.current.uvi <= 2) {
      $(".uvIndicator").addClass("lowUv")
      $(".uvIndicator").text(" (UV index is at Low risk)")
    } else if (data.current.uvi > 2 && data.current.uvi < 8) {
      $(".uvIndicator").addClass("moderateUv")
      $(".uvIndicator").text(" (UV Index is at Moderate risk)")
    } else if (data.current.uvi > 8) {
      $(".uvIndicator").addClass("highUv")
      $(".uvIndicator").text(" (UV Index is at High risk)")
    }
    

    $(".forecastHeading").text("5-Day Forecast");

    console.log(data.daily)

    //for loop to loop through daily forecast data and display temperature, date, humidity + icon
      for(i=1; i<6; i++){
        dateUNIX = data.daily[i].dt*1000
        var date = new Date(dateUNIX);
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        var forecastDate = '(' + month + '/' + day + '/' + year + ')'

        var newIconcode = data.daily[i].weather[0].icon

        var newDate = $("<h5>");
        var newIcon = $("<img>");
        var newTemp = $("<p>");
        var newHumidity = $("<p>");

        newDate.text(forecastDate);
        newIcon.attr("src", "https://openweathermap.org/img/w/"+newIconcode+".png");
        newTemp.text('Temperature: ' + data.daily[i].temp.day + ' F');
        newHumidity.text('Humidity: ' + data.daily[i].humidity);

        //Create cards to hold 5 day forecast data, append cards to forecast section
        var forecastCard = $("<div>").addClass("card m-2 text-center border border-dark border-3")
        var cardBody = $("<div>").addClass("card-body p-3")

        cardBody.append(newDate, newIcon, newTemp, newHumidity);
        forecastCard.append(cardBody);
        $(".cityForecast").append(forecastCard);

    }
    
  })

  }
}

//Function to save searched cities to local storage. Made max length of stored cities
//6 for styling purposes, + added code to not save searched city of it already exists in storage
function savedSearch(cityName) {
  if (cityName !== "") {
  if (cityList.indexOf(cityName) == -1) {
    cityList.unshift(cityName);
    if(cityList.length > 6) {
      cityList.pop();
    }
    localStorage["cityList"] = JSON.stringify(cityList);
  }
}
}

