'use strict'

/*
* Send the request to API to get the weather data.
*/
function getDailyWeather(){
	console.log("update");
	var url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22fairfax%2C%20va%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithke';
	
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		var weatherData = [], currentData = {};

		if(xhr.readyState === 4 && xhr.status === 200){
			var response = JSON.parse(xhr.responseText);
            var data = response.query.results.channel;

            // Today's weather data
            currentData = {
            	loc: data.location.city + ', ' + data.location.region,
            	temp: data.item.condition.temp,
            	iconCode: data.item.condition.code,
            	des: data.item.condition.text

            };

            // Weather forecast for the next five days.
            weatherData = data.item.forecast.slice(0, 5);

			updateCurrentData(currentData);
            updateDailyData(weatherData);
		}

	}

	xhr.open('GET', url, true);
	xhr.send();
}

/*
* Update today's weather.
*/
function updateCurrentData(weatherData){
	var pos = document.getElementById('locationId');
	var temp = document.getElementById('tempId');
	var icon = document.getElementById('weatherIconId');
	var des = document.getElementById('desId');

	pos.innerHTML = weatherData.loc;
	temp.innerHTML = weatherData.temp + '&deg;';
	icon.src = 'http://l.yimg.com/a/i/us/we/52/' + weatherData.iconCode + '.gif';
	des.innerHTML = weatherData.des;

}

/*
* Udpate the forcast for the next five days.
*/

function updateDailyData(weatherData){
	var nodes = {
		day1: document.getElementById('day1'),
		tempDay1: document.getElementById('tempDay1'),
		day2: document.getElementById('day2'),
		tempDay2: document.getElementById('tempDay2'),
		day3: document.getElementById('day3'),
		tempDay3: document.getElementById('tempDay3'),
		day4: document.getElementById('day4'),
		tempDay4: document.getElementById('tempDay4'),
		day5: document.getElementById('day5'),
		tempDay5: document.getElementById('tempDay5')
	};

	for(var i = 0; i < weatherData.length; i++){
		console.log("weatherData: " +weatherData[i].day);
		nodes['day' + (i + 1)].innerHTML = weatherData[i].day;
		nodes['tempDay' + (i + 1)].innerHTML = weatherData[i].low
			+ '&deg; / '+ weatherData[i].high + '&deg;';
	}

}

window.onload = function(){
	var interval = 1 * 60 * 60 * 1000; // 1 hour
	getDailyWeather();
	setInterval(getDailyWeather, interval);
}