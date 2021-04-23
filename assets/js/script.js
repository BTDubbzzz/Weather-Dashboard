var key = '435f7f0c309bb6acd4a2c29f9d54727c';
var weatherURL = 'https://api.openweathermap.org/data/2.5/weather?q=';
var newObject;
var inputCity;
var localStorageArray = [];
if (localStorage.getItem('test')) {
    localStorageArray = JSON.parse(localStorage.getItem('test'));
}
localStorageArray.forEach(element => {
    createNewButton(element)
});

var dayZeroEl = '0'
var dayOneEl = $('#day-1');
var dayTwoEl = $('#day-2');
var dayThreeEl = $('#day-3');
var dayFourEl = $('#day-4');
var dayFiveEl = $('#day-5');
var fiveDayArray = [dayZeroEl, dayOneEl, dayTwoEl, dayThreeEl, dayFourEl, dayFiveEl]

async function getCoords(city) {
	var response = await fetch(weatherURL + city + '&appid=' + key);
	var data = await response.json();
	var newObject = {
		lat: data.coord.lat,
		lon: data.coord.lon,
	};
	var response2 = await fetch(
		'https://api.openweathermap.org/data/2.5/onecall?lat=' +
			newObject.lat +
			'&lon=' +
			newObject.lon +
			'&units=imperial' +
			'&appid=' +
			key
	);
	var data2 = await response2.json();
	var cityConditions = data2;
	render(city, cityConditions);
}

function render(place, current) {
    var iconURL = 'https://openweathermap.org/img/wn/' + current.current.weather[0].icon + '@2x.png'
	$('#weather-header').text(place + '  (' + dayjs.unix(current.current.dt).format('M/DD/YYYY') + ') ');
    $('#main-icon').attr("src", iconURL)
    $('#temp-p').text('Temp: ' + current.current.temp + 'F')
    $('#humidity-p').text('Humidity: ' + current.current.humidity + '%')
    $('#wind-p').text('Wind: ' + current.current.wind_speed + ' mph')
    $('#uv-p').text('UV Index: ' + current.current.uvi)

    populateDailyForecast(fiveDayArray, current)
    $('#five-day-container').show();

}

$('#search-button').click(function (event) {
	inputCity = $('#searchBar').val();
	getCoords(inputCity);
    createNewButton(inputCity);
    localStorageArray.push(inputCity);
    localStorage.setItem('test', JSON.stringify(localStorageArray))
});

$('#five-day-container').hide();
$('#recent-template').hide();

$('.recent-button-color').click(function (event) {
    var current = $(this).text()
    getCoords(current);
})

function createNewButton(city) {
    if (city) {
    $('#recent-template').clone(true).text(city).addClass('recent-button-color').appendTo('#recent-buttons-container').show()
    }
};

function populateDailyForecast(arr, thisCity) {
    for (let i = 1; i < 6; i++) {
        var newIconURL = 'https://openweathermap.org/img/wn/' + thisCity.daily[i].weather[0].icon + '@2x.png'
        arr[i].children('.daily-date').text(dayjs.unix(thisCity.daily[i].dt).format('M/DD/YYYY'))
        arr[i].children('.daily-icon').attr('src', newIconURL)
        arr[i].children('.daily-temp').text('TEMP HIGH: ' + thisCity.daily[i].temp.max + 'F')
        arr[i].children('.daily-wind').text('WIND: ' + thisCity.daily[i].wind_speed + 'mph') 
        arr[i].children('.daily-humidity').text('HUMIDITY :' + thisCity.daily[i].humidity + '%')
        
    }
}
