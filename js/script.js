// Dom Variables
let input = document.getElementsByTagName("input")[0],

    inputValue,

    currentInfo = document.getElementsByClassName("currentInfo")[0],

    weatherInfo = document.getElementsByClassName("weatherInfo")[0],

    printError = document.getElementsByClassName("printError")[0],

    // Data Variables
    myRequest,

    myData,

    URL;

// Events

window.addEventListener("load", getUserIPData);

input.addEventListener("keypress", isKeyEnter);

/**************************************************************************************************/

// function to grap user ip
function getUserIPData() {

    myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {

            myData = JSON.parse(this.responseText)

            // add user ip to get valid url
            URL = `https://api.worldweatheronline.com/premium/v1/weather.ashx?key=f958ae5897e44c9b87823910210203&q=${myData.ip}&tp=24&num_of_days=5&showlocaltime=yes&format=json`

            // send url to get current weather info
            grapURLInfo()
        }

    }

    myRequest.onerror = function () {
        throw 'Request Failed'
    }

    myRequest.open("GET", 'https://api.myip.com', true)

    myRequest.send()

}

/**************************************************************************************************/

// function to get weather info based on user ip
function grapURLInfo() {

    myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {

            myData = JSON.parse(this.responseText).data

            drawDataInUI(myData, currentInfo, myData['current_condition'], myData['weather'], weatherInfo, printError)

        }

    }

    myRequest.onerror = function () {
        throw 'Request Failed'
    }

    myRequest.open("GET", URL, true)

    myRequest.send()

}

/**************************************************************************************************/

// function to draw weather data in dom
function drawDataInUI(object, whereToDarw, array, array2, whereToDarw2, clearError) {

    // get current info including date, clock
    let checkType = object.request.map((item) => item.type),
        userQuery = object.request.map((item) => item.query),
        userTime = object.time_zone.map((item) => item.localtime),
        userDate = userTime[0].split(" ")[0],
        userClock = userTime[0].split(" ")[1];

    // get current weather info
    array.map((item) => {

        //
        let temp_C = `${item.temp_C}°`,
            weatherIcon = item.weatherIconUrl.map((el) => el.value),
            weatherDesc = item.weatherDesc.map((el) => el.value),
            windspeedKmph = `${item.windspeedKmph} km/h`,
            humidity = `${item.humidity} %`,
            visibility = `${item.visibility} km`,
            pressure = `${item.pressure} mbar`;

        whereToDarw.innerHTML = '';

        whereToDarw.innerHTML = `<div>
${getType(checkType, userQuery)}
<p><b>Today's Date: </b>${userDate}</p>
<p><b>Time Now: </b>${userClock}</p>
<p><b>Temp Now: </b>${temp_C}</p>
<p class="weatherDesc">${weatherDesc} <img src=${weatherIcon} alt='weatherIcon'></p>
<p><b>Wind Speed: </b>${windspeedKmph}</p>
<p><b>Humidity: </b>${humidity}</p>
<p><b>Visibility: </b>${visibility}</p>
<p><b>Pressure: </b>${pressure}</p>
</div>`

        whereToDarw2.innerHTML = '';

        // get next five-day full weather info
        array2.map((item) => {

            let date = item.date,
                mintempC = `${item.mintempC}°`,
                maxtempC = `${item.maxtempC}°`,
                sunrise = item.astronomy.map((item) => item.sunrise),
                sunset = item.astronomy.map((item) => item.sunset),
                moonrise = item.astronomy.map((item) => item.moonrise),
                moonset = item.astronomy.map((item) => item.moonset),
                weatherIcon = item.hourly.map(el => el.weatherIconUrl.map((el) => el.value)[0]),
                weatherDesc = item.hourly.map(el => el.weatherDesc.map((el) => el.value)[0]),
                windspeedKmph = item.hourly.map((item) => `${item.windspeedKmph} km/h`),
                humidity = item.hourly.map((item) => `${item.humidity} %`),
                visibility = item.hourly.map((item) => `${item.visibility} km`),
                pressure = item.hourly.map((item) => `${item.pressure} mbar`);

            whereToDarw2.innerHTML +=
                `<div>
<h4>${date}</h4>
<p><b>Min: </b>${mintempC}</p>
<p><b>Max: </b>${maxtempC}</p>
<p><b>Sunrise: </b>${sunrise}</p>
<p><b>Sunset: </b>${sunset}</p>
<p><b>Moonrise: </b>${moonrise}</p>
<p><b>Moonset: </b>${moonset}</p>
<p class="weatherDesc">${weatherDesc} <img src=${weatherIcon} alt='weatherIcon'></p>
<p><b>Wind Speed: </b>${windspeedKmph}</p>
<p><b>Humidity: </b>${humidity}</p>
<p><b>Visibility: </b>${visibility}</p>
<p><b>Pressure: </b>${pressure}</p>
</div>`

        })

    })

    clearError.innerHTML = '';

}

/**************************************************************************************************/

// function to get type of location
function getType(type, printThis) {

    // if type is 'IP' display it
    if (type == "IP") return `<h3>Weather Now Based On IP: <span>${printThis}</span></h3>`

    // if type is 'City' display it
    if (type == "City") return `<h3>Weather Now Based On City: <span>${printThis}</span></h3>`

    // if type isn't 'ip, city' display it
    else return `<h3>Weather Now Based On Search: <span>${printThis}</span></h3>`

}

/**************************************************************************************************/

// function to get weather data based on user search
function isKeyEnter(event) {

    inputValue = input.value.trim().replaceAll(" ", "+");

    // if input box is empty do nothing
    if (input.value.trim() == '') return false

    // if not empty
    else {

        // if key pressed is 'Enter'
        // run the search function
        if (event.keyCode == 13) getSearchResult()

        //
        else return false

    }

}

/**************************************************************************************************/

// function to update url based on user search value
function getSearchResult() {

    // add user words to get valid url
    URL = `https://api.worldweatheronline.com/premium/v1/weather.ashx?key=f958ae5897e44c9b87823910210203&q=${inputValue}&tp=24&num_of_days=5&showlocaltime=yes&format=json`

    searchResult()

}

/**************************************************************************************************/

// function to get new weather data
function searchResult() {

    myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {

            myData = JSON.parse(this.responseText).data

            // if data length is '1', means no data found
            if (Object.keys(myData).length == 1) drawError(myData.error, weatherInfo, currentInfo, printError)

            //
            else drawDataInUI(myData, currentInfo, myData['current_condition'], myData['weather'], weatherInfo, printError)

        }

    }

    myRequest.onerror = function () {
        throw 'Request Failed'
    }

    myRequest.open("GET", URL, true)

    myRequest.send()

}

/**************************************************************************************************/

// function to print error msg if there is no data to draw
function drawError(array, clearDiv1, clearDiv2, printWarn) {

    // get error msg from data
    let msg = array.map((item) => item.msg)

    clearDiv1.innerHTML = '';

    clearDiv2.innerHTML = '';

    // display it
    printWarn.innerHTML = `<center>${msg}</center>`

}

/**************************************************************************************************/