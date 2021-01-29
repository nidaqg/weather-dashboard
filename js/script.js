
  //var cityList = []


$(document).ready(function(){
  //dynamically create elements to hold weather data
    var theCity = $("<p>").addClass("theCity myH1 h4");
    $("#cityCurrent").append(theCity);

    var theDate = $("<p>").addClass("theDate")
    $("#cityCurrent").append(theDate);

     var icon = $("<img>").addClass("theIcon");
    $("#cityCurrent").append(icon);

    var temperature = $("<p>").addClass("theTemp");
    $("#cityCurrent").append(temperature);

    var humidity = $("<p>").addClass("theHum");
    $("#cityCurrent").append(humidity);

    var windSpeed = $("<p>").addClass("theWind");
    $("#cityCurrent").append(windSpeed);

    var uvIndex = $("<p>").addClass("uV");
    $("#cityCurrent").append(uvIndex);

    var forecastHeading = $("<p>").addClass("h3 myH1 text-center mt-2 forecastHeading");
    $("#fHeading").append(forecastHeading);
    
    
    //var pastSearch = JSON.parse(localStorage.getItem("cityList"))
    //console.log(pastSearch)

//add click event to button
$("#searchButton").click(function(event){
    event.preventDefault()
    //if function to check if iput field empty or not.Else statement to clear previous data from elements
    if($("#cityNameInput").val() === '') {
      alert("You must enter a city name to proceed!")
      return
    } else {
    $(".cityForecast").empty();
    getWeather()
    }
})
    
});

function getWeather(cityName) {
    //declare variables for city name from user input
    var cityName = $("#cityNameInput").val()
    //cityList.push(cityName)
   // localStorage.setItem("cityList", JSON.stringify(cityList))

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
    //.then(function(data) {
    //  console.log(data);
      var displayWeather = function (data, cityName) {
    // get UNIX date from API and convert to readable date format
     var dataDate = data.dt*1000;
     var date = new Date(dataDate);

     var day = date.getDate();
     var month = date.getMonth() + 1;
     var year = date.getFullYear();
     var formattedDate = '(' + month + '/' + day + '/' + year + ')'
     
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


        var forecastCard = $("<div>").addClass("card m-2 text-center")
        var cardBody = $("<div>").addClass("card-body p-3")

        cardBody.append(newDate, newIcon, newTemp, newHumidity);
        forecastCard.append(cardBody);
        $(".cityForecast").append(forecastCard);

 
    }
    
  })

  }
}




