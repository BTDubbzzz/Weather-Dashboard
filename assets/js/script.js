var key = '435f7f0c309bb6acd4a2c29f9d54727c';
var weatherURL = 'https://api.openweathermap.org/data/2.5/weather?q=';
var newObject;
var inputCity;

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
	console.log('cityConditions :>> ', cityConditions);
	render(city, cityConditions);
}

function render(place, current) {
	$('#weather-header').text(place + ' / ' + current.current.dew_point);
}

$('#search-button').click(function (event) {
	inputCity = $('#searchBar').val();
	getCoords(inputCity);
});

$('#five-day-container').empty();

$('.recent-button-color').click(function (event) {
    console.log($(this).text())
    var current = $(this).text()
    getCoords(current);
})