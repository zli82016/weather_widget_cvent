'use strict'

function getPromise(url){
	return new Promise(function(resolve, reject){
		var xhr = new XMLHttpRequest();

		xhr.onload = function(){
			if(xhr.readyState === 4){
				if(xhr.status === 200){

					resolve( JSON.parse(xhr.responseText).query.results.channel );
				}
				else{
					reject(Error(xhr.statusText));
				}
			}

		};

		xhr.onerror = function(){
			reject(Error("Network Error."));
		}

		xhr.open('GET', url, true);
		xhr.send();		
	});
}

/*
* Send the request to API to get the weather data.
*/
function getDailyWeather(){
	console.log("Function to send request");
	var url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22atlanta%2C%20ga%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithke';
	
	getPromise(url).then(
		function(data){
			console.log("Received response");

			var weatherData = [], currentData = {};

            // Today's weather data
            currentData = {
            	loc: data.location.city + ', ' + data.location.region,
            	temp: data.item.condition.temp,
            	iconCode: data.item.condition.code,
            	des: data.item.condition.text,
            	sunrise: data.astronomy.sunrise,
            	sunset: data.astronomy.sunset
            };

            // Weather forecast for the next five days.
            weatherData = data.item.forecast.slice(0, 5);

			updateCurrentData(currentData);
            updateDailyData(weatherData);
		}	

	)
	.catch(
		function(error){
			console.log(error);
			getDailyWeather();
		}
	);
}

/*
* Update today's weather.
*/
function updateCurrentData(weatherData){
	var pos = document.getElementById('locationId');
	var temp = document.getElementById('tempId');
	var icon = document.getElementById('weatherIconId');
	var des = document.getElementById('desId');
	var sunInfo = document.getElementById('sunInfoId');
	var sunrise = document.getElementById('sunriseId');
	var sunset = document.getElementById('sunsetId');

	var loadingData = document.getElementById('loadingDataId');

	if(!loadingData.className.includes('hidden')){
		loadingData.className += ' hidden';
	}

	pos.innerHTML = weatherData.loc;
	temp.innerHTML = weatherData.temp + '&deg;';
	icon.src = 'http://l.yimg.com/a/i/us/we/52/' + weatherData.iconCode + '.gif';
	des.innerHTML = weatherData.des;

	sunInfo.className = sunInfo.className.replace('hidden', '').trim();
	sunrise.innerHTML = weatherData.sunrise;
	sunset.innerHTML = weatherData.sunset;
}

/*
* Udpate the forcast for the next five days.
*/

function updateDailyData(weatherData){
	for(var i = 0; i < weatherData.length; i++){
		document.getElementById('day' + (i + 1)).innerHTML = weatherData[i].day;
		document.getElementById('tempDay' + (i + 1)).innerHTML = weatherData[i].low
			+ '&deg; / '+ weatherData[i].high + '&deg;';
	}

}

window.onload = function(){
	console.log("onload");
	var oneHour = 1 * 60 * 60 * 1000; // 1 hour
	getDailyWeather();
	// Repeat the request in 1 hour
	setInterval(getDailyWeather, oneHour);
}