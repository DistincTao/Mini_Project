let books = null;
let search = '';
let numOfRows = 10;
let pageNo = 1;
let totalCount = 0;
let totalPages = 0;

$(function () {
	getMonthlyBook();
	searchingLib();
	searchBooks();
	$('#nextPage').css({ display: 'none' });
	$('#prevPage').css({ display: 'none' });

	// $('.search').on('change', '#listCnt', function (e) {
	// 	numOfRows = e.target.value;
	$('.search').on('click', '#btn', function (e) {
		// console.log('1');
		search = $('input').val();
		pageNo = 1;
		numOfRows = 10;
		searchBooks(search, pageNo, numOfRows);
		$('#nextPage').css({ display: 'inline-block' });
		$('#prevPage').css({ display: 'inline-block' });
	});
	console.log(numOfRows);

	// search = $('input').val();
	// pageNo = 1;
	// searchBooks(search, pageNo, numOfRows);
	// $('#nextPage').css({ display: 'inline-block' });
	// $('#prevPage').css({ display: 'inline-block' });
	// });

	$('#nextPage').click(function () {
		if (numOfRows != 0) {
			if (totalCount % numOfRows == 0) {
				totalPages = Math.ceil(totalCount / numOfRows);
			} else {
				totalPages = Math.ceil(totalCount / numOfRows + 1);
			}
		} else {
			numOfRows = 10;
		}

		if (pageNo < totalPages) {
			page = 1;
			pageNo++;
			search = $('input').val();
			searchBooks(search, pageNo, numOfRows);
		} else if (pageNo == totalPages) {
			$(this).attr('disabled', true);
		}
	});

	$('#prevPage').click(function () {
		if (numOfRows != 0) {
			if (totalCount % numOfRows == 0) {
				totalPages = Math.ceil(totalCount / numOfRows);
			} else {
				totalPages = Math.ceil(totalCount / numOfRows + 1);
			}
		} else {
			numOfRows = 10;
		}

		if (pageNo < totalPages) {
			pageNo--;
			search = $('input').val();
			searchBooks(search, pageNo, numOfRows);
		} else if (pageNo == 1) {
			$(this).css('disabled', true);
		}
	});

	$('#district').change(function (e) {
		console.log($('#seoulLibrary'));
		searchingLib();
	});

	$('.faq').on('click', '.faq-item', function () {
		$(this).toggleClass('faq-active');
	});
});

// 이달의 도서 자료 가져오기
function getMonthlyBook(xml) {
	$.ajax({
		url: 'http://api.kcisa.kr/openapi/service/rest/meta13/getKPEF0101?serviceKey=a236b958-53f7-4b01-8ae6-d6862d54a0d7&numOfRows=10&pageNo=1',
		method: 'GET',
		datatype: 'xml',
		async: false,
	}).done(function (data) {
		// console.log(data);
		parsingMontylyBookData(data);
		// }
	});
}
// 이달의 도서 자료 분석 및 출력
function parsingMontylyBookData(xml) {
	books = xml.getElementsByTagName('item');
	let title = '';
	let description = '';
	let auther = '';
	let imgLink = '';
	let link = '';
	let output = '<div class="row gy-4">';
	$.each(books, function (index, book) {
		title = $(book).children().eq(0).text();
		description = $(book).children().eq(8).text();
		auther = $(book).children().eq(15).text();
		imgLink = $(book).children().eq(14).text().replaceAll('www', 'e');
		link = $(book).children().eq(17).text();

		// console.log(title, description, auther, imgLink, link);
		// console.log(imgLink);
		output += `<div class="col-xl-4 col-md-6 aos-init aos-animate" data-aos="fade-up" data-aos-delay="100">
								<article>
									<div class="post-img">
										<img src="${imgLink}" class="img-fluid" width="400px">
									</div>`;
		output += `<h2 class="title">${title}</h2>
							  <div class="d-flex align-items-center">
									<div class="post-meta">
										<p class="post-author">${auther}</p>
										<div class="like"><i class="fa-regular fa-bookmark"></i></div>
									</div>
								</div>
								</article>
								</div>`;
	});
	output += `</div>`;
	// console.log(xml);
	// console.log(books);
	$('.monthlyBook').html(output);
}

// 카카오 도서 검색 자료 가져오기
function searchBooks(input) {
	$.ajax({
		method: 'GET',
		url: `https://dapi.kakao.com/v3/search/book?target=title&page=${pageNo}&size=${numOfRows}&`,
		data: {
			query: input,
		},
		headers: {
			Authorization: 'KakaoAK 0f7acd5ca96b1d76578d02adc4161263',
		},
	}).done(function (data) {
		parsingBookData(data);
	});

	let output = '';
	function parsingBookData(json) {
		totalCount = Number(json.meta.total_count);
		let items = json.documents;
		// console.log(totalCount);
		output = `<div class="row gy-4">`;
		$.each(items, function (index, item) {
			output += `<div class="col-xl-4 col-md-6" data-aos="fade-up" data-aos-delay="100"><article>`;
			if (item.thumbnail == '') {
				output += `<div class="post-img">
                <img src="img/noimage.png" class="img-fluid" width="400px">
              </div>`;
			} else {
				output += `<div class="post-img">
                <img src="${item.thumbnail}" class="img-fluid" width="400px">
              </div>`;
			}
			output += `<h2 class="title"><a href="#">${item.title}</a></h2>`;
			output += `<div class="d-flex align-items-center"><div class="post-meta">`;
			if (item.translators != '') {
				output += `<p class="post-author">${item.authors} / ${item.translators}</p>`;
			} else {
				output += `<p class="post-author">${item.authors}</p>`;
			}

			// output += `<p>${item.status}</p>`;
			// <li>${item.title}</li>
			// <li>${item.url}</li>
			// <li>${item.contents}</li>
			output += `<p>${item.price}원</p></div></div></article></div>`;
		});
		output += `</div>`;
		$('.bookSearchResult').html(output);
	}
}

// 서울 시 도서관 자료 가저오기
function searchingLib() {
	$.ajax({
		url: 'http://openapi.seoul.go.kr:8088/6645514d4664697336355956525956/json/SeoulPublicLibraryInfo/1/300',
		method: 'GET',
		datatype: 'JSON',
		async: false,
	}).done(function (data) {
		// console.log(data);
		parsingLibData(data.SeoulPublicLibraryInfo.row);
	});
}

let district = '';
let libraryName = '';
let libraryAddr = '';
let operation = '';
let libraryTel = '';
let homePage = '';
let holiday = '';
let lat = '';
let lon = '';
let output = '';

// 세부 자료 분석 및 출력
function parsingLibData(json) {
	let output = `<div class="faq-container">`;
	$.each(json, function (index, item) {
		district = json[index].CODE_VALUE;
		libraryName = json[index].LBRRY_NAME;
		libraryAddr = json[index].ADRES;
		operation = json[index].OP_TIME;
		libraryTel = json[index].TEL_NO;
		homePage = json[index].HMPG_URL;
		holiday = json[index].FDRM_CLOSE_DATE;
		lat = json[index].YDNTS;
		lon = json[index].XCNTS;

		// list 출력하기
		// output += ``;
		if ($('#district').val() == district) {
			console.log(libraryName);
			output += `<div class="faq-item" width="100%">
			<h3>
			<span class="num">${libraryName}</span>
			</h3>`;
			output += `<div class="faq-content">
			<p>주 소 : ${libraryAddr}</p>
			<p>전화번호 : ${libraryTel}</p>
			<p>운영시간 : ${operation}</p>
			<p>휴무일 : ${holiday}</p>
			</div>`;
			output += `<i class="faq-toggle bi bi-chevron-right"></i>
			</div>`;
		}
	});
	output += `</div>`;

	$('#bookSe').html(output);

	// kakao Map API로 지도를 그리기
	// outputMap(lat, lon);
}

function outputMap(lat, lon) {
	var mapContainer = document.getElementById('map'), // 지도를 표시할 div
		mapOption = {
			center: new kakao.maps.LatLng(lat, lon), // 지도의 중심좌표
			level: 2, // 지도의 확대 레벨
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
}
