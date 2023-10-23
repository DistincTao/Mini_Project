let baseUrl = `https://api.openweathermap.org/data/2.5/weather?appid=05047a241a245da121cc197c528b215d&`;
let unit = 'matric';
$(function () {
	getWeatherData('seoul', 'metric');
	$('#selectCity').change(function () {
		console.log($(this).val());

		let unit = '';
		unit = $("input[name='units']:checked").val();

		// let radios = document.getElementsByName('unit');
		// console.log(radios);
		// for (let i = 0; i < radios.length; i++) {
		// 	 if (radios[i].checked == true) {
		// 		 unit = radios[i].value;
		// 	 }
		// }

		getWeatherData($(this).val(), unit);
	});
	// $('#selectUnit').change(function () {
	// 	console.log($(this).children().eq(0).text());
	// 	getWeatherData($(this).val(), 'metric');
	// });
	$("input[name='units']").change(function () {
		getWeatherData($('#selectCity').val(), $(this).val());
	});
});

function getWeatherData(cityName, units) {
	let url = `${baseUrl}q=${cityName}&units=${units}`;
	$.ajax({
		url: url,
		type: 'GET',
		datatype: 'JSON',
		success: function (data) {
			console.log(data);
			parsingJSON(data);
		},
		error: function () {},
		complete: function () {},
	});
}

function parsingJSON(json) {
	let mainWeather = json.main;
	let name = json.name;

	let description = json.weather[0].description;
	let icon = json.weather[0].icon;
	$('.weatherInfo_weather').html(
		`<img src="https://openweathermap.org/img/wn/${icon}@2x.png">${description} `
	);

	let mainOutput = `<ul>`;
	mainOutput += `<li>현재 기온 : ${mainWeather.temp}</li>`;
	mainOutput += `<li>최고 기온 : ${mainWeather.temp_max}</li>`;
	mainOutput += `<li>최저 기온 : ${mainWeather.temp_min}</li>`;
	mainOutput += `<li>체감 온도 : ${mainWeather.feels_like}</li>`;
	mainOutput += `<li>현재 습도 : ${mainWeather.humidity}%</li>`;
	mainOutput += `<li>현재 기압 : ${mainWeather.pressure}hPa</li></ul>`;

	$('.weatherInfo_mainWeather').html(mainOutput);
	$('#cityName').html(name);

	// kakao Map API로 지도를 그리기
	let weatherIcon = `https://openweathermap.org/img/wn/${icon}@2x.png`;
	outputMap(json.coord.lat, json.coord.lon, weatherIcon);
}

function outputMap(lat, lon, icon) {
	let mapContainer = document.getElementById('map'), // 지도를 표시할 div
		mapOption = {
			center: new kakao.maps.LatLng(lat, lon), // 지도의 중심좌표
			level: 10, // 지도의 확대 레벨
		};

	var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

	var imageSrc = icon, // 마커이미지의 주소입니다
		imageSize = new kakao.maps.Size(100, 100), // 마커이미지의 크기입니다
		imageOption = { offset: new kakao.maps.Point(lat, lon) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

	// 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
	var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption),
		markerPosition = new kakao.maps.LatLng(lat, lon); // 마커가 표시될 위치입니다

	// 마커를 생성합니다
	var marker = new kakao.maps.Marker({
		position: markerPosition,
		image: markerImage, // 마커이미지 설정
	});

	// 마커가 지도 위에 표시되도록 설정합니다
	marker.setMap(map);
}
