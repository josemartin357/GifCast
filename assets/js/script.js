// Declaring variables
var button = document.querySelector('.searchButton')
var inputValue = document.querySelector('.searchInput')

var cityValue = document.querySelector('.city')
var tempValue = document.querySelector('.temp')
var humidValue = document.querySelector('.humidity')
var descValue = document.querySelector('.desc')
var windValue = document.querySelector('.wind')
var uvIndexValue = document.querySelector('.uvIndex')
    // vars to hide and display weather and Gif boxes
var weatherDisplayBox = document.querySelector('.weatherDisplayBox')

var weatherRating = 50;
var category;
var fullForecast = [];


function getGif(category) { // promise 
    var userInput = document.getElementById("input").value
    console.log(userInput)
        //the variable giphyApiKey is actually not used 
        //var giphyApiKey = "c44438D7l3N66PdiRNPzhTnWRjsJkBaw" // recieved api through GIPHY Developers
    var giphyApiURL = 'https://api.giphy.com/v1/gifs/search?q=' + category + '&api_key=c44438D7l3N66PdiRNPzhTnWRjsJkBaw'
        //this will allow user to enter in word/name to pull GIFs from api 

    // api URL: https://api.giphy.com/v1/gifs/search?q=${userInput}&rating=g&api_key${giphyApiKey}

    // breakdown to api URL: 
    // q= (specifying what we're going to look for)
    // $ (endpoint)
    // & (separating)
    // ${giphyApiKey} (references api key)



    fetch(giphyApiURL).then(function(data) { // pulling data from GIPHY 
            return data.json() // returns data 
        })
        .then(function(json) {
            console.log(json.data[0].images.fixed_height.url) // this will alow us to filter down to what we're looking for from the GIPHY api: images, normal height and url to display GIF to browser
            var imgPath = json.data[0].images.fixed_height.url // associated to the how the GIF is dislayed in the browser
            var img = document.createElement("img")

            img.setAttribute("src", imgPath)
            document.body.appendChild(img) // appends image to the browser 
        })
        // chris's code
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                //console.log(response);
                // JSON parse
                response.json().then(function(data) {
                    console.log(data);
                    // your code goes here

                })
            } else {
                alert('Error: ' + response.statusText);
            }
        }).catch(function(error) {
            alert('Unable to getGif: Invalid Connection');
        });
}

function weatherRatingCheck() {
    // Code to do weather rating check goes here
    // Weather rating to start at 50

}

function gifCategory() {
    // Code to decide what category to use goes here 
    // Aiming for 5 categories 
    // Mad, Sad , Relaxed, Happy, Excited (subject to change)

    if (weatherRating < 25) {
        //mad  category
        category = 'mad';
    } else if (weatherRating < 50) {
        //sad category
        category = 'sad'
    } else if (weatherRating < 75) {
        //relaxed category
        category = 'relaxed';
    } else if (weatherRating < 100) {
        // happy category
        category = 'happy';
    } else {
        //Excited category
        category = 'excited';
    }

}

//  WEATHER LOGIC BELOW //
//  WEATHER LOGIC BELOW //
function getWeather(city) {
    // fetching current conditions

    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=a3be7588e2f22d761077e844f13fff0c&units=imperial';
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                console.log(response);
                // JSON parse
                response.json().then(function(data) {
                    console.log(data);
                    // more refinement needs to happen here, should create a function that "displays"
                    cityValue.innerHTML = data.name + " today";
                    tempValue.innerHTML = "Temp: " + data.main.temp + "°F";
                    humidValue.innerHTML = "HUM: " + data.main.humidity + " %";
                    windValue.innerHTML = "Wind: " + data.wind.speed + " MPH";
                    getUvi(data.coord.lat, data.coord.lon)


                    //icon property
                    var weathericon = data.weather[0].icon;
                    var iconurl = "https://openweathermap.org/img/wn/" + weathericon + "@2x.png";
                    $(descValue).html("<img src=" + iconurl + ">");

                    // showing weather box and current weather box after click
                    weatherDisplayBox.style.display = "block";
                })
            } else {
                alert('Error: ' + response.statusText);
            }
        }).catch(function(error) {
            alert('Unable to getWeather: Invalid Connection');
        });
}
// function to establish latitude and longitude to pull uvi data
function getUvi(lat, lon) {
    //probably best to rename this 
    var getUviUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&appid=a3be7588e2f22d761077e844f13fff0c" + "&units=imperial"
        //     // fetching one call
        // Changing to catch errors
    fetch(getUviUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    // innerhtml for index value
                    uvIndexValue.innerHTML = "UVI: " + data.current.uvi;
                    Nextdaysforecast(data.daily);
                })
            } else {
                alert('Error: ' + response.statusText);
            }
        }).catch(function(error) {
            alert('Unable to getUvi: Invalid Connection');
        });
}


function Nextdaysforecast(NextDays) {
    // console.log(NextDays)
    // we should use the one call api here
    var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + inputValue.value + '&appid=a3be7588e2f22d761077e844f13fff0c&units=imperial';
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    //code goes here for next days forecast
                    // loop to run through next days
                    for (let i = 1; i < 6; i++) {
                        console.log("this is day", NextDays[i])
                        var day = moment.unix(NextDays[i].dt).format("MM/DD/YYYY")
                        var temp = "Temp: " + data.list[i + 1].main.temp;
                        var clouds = "Clouds: " + data.list[i + 1].clouds.all;
                        var wind = "Winds: " + data.list[i + 1].wind.speed;
                        var humidity = "HUM: " + data.list[i + 1].main.humidity;
                        // /icon property
                        var weathericon = data.list[i + 1].weather[0].icon;
                        var iconurl = "https://openweathermap.org/img/wn/" + weathericon + "@2x.png";
                        // temp object to store info 
                        var forecastObj = {
                                day: 'day' + i,
                                temp: data.list[i + 1].main.temp,
                                wind: data.list[i + 1].wind.speed,
                                humidity: data.list[i + 1].main.humidity
                            }
                            //adding the forecastObj to the fullForecast array for use.
                        fullForecast.push(forecastObj);
                        console.log(fullForecast);
                        // editing inner html 
                        $("#day-" + i).html(day);
                        $("#desc-" + i).html("<img src=" + iconurl + ">");
                        $("#temp-" + i).html(temp + "°F");
                        $("#clouds-" + i).html(clouds + " %");
                        $("#wind-" + i).html(wind + " MPH");
                        $("#humidity-" + i).html(humidity + " %");
                    }
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        }).catch(function(error) {
            alert('Unable to getWeather: Invalid Connection');
        });
}

button.addEventListener('click', function() {
    var city = inputValue.value;
    getWeather(city);
})