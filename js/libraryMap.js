// 도서관 위치 정보 전송 받아 지도 팝업 띄우기
$(function () {
	outputMap();
});

// 지도 띄우는 함수
function outputMap() {
	getParameter();
	var mapContainer = document.getElementById('map'), // 지도를 표시할 div
		mapOption = {
			center: new kakao.maps.LatLng(lat, lon), // 지도의 중심좌표
			level: 4, // 지도의 확대 레벨
		};

	var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

	// 마커가 표시될 위치입니다
	var markerPosition = new kakao.maps.LatLng(lat, lon);

	// 마커를 생성합니다
	var marker = new kakao.maps.Marker({
		position: markerPosition,
	});

	// 마커가 지도 위에 표시되도록 설정합니다
	marker.setMap(map);

	// 아래 코드는 지도 위의 마커를 제거하는 코드입니다
	// marker.setMap(null);
}
// url에서 매개 변수 값 추출하는 함수
function getParameter() {
	let url = location.href;

	if (url.indexOf('?') != -1) {
		let queryString = url.split('?')[1];
		let queryArr = queryString.split('&');

		console.log(queryArr);
		$.each(queryArr, function (index, point) {
			lon = queryArr[0].split('=')[1];
			lat = queryArr[1].split('=')[1];
			// lon = point.split('=');
		});
		console.log(lat, lon);
	}
}