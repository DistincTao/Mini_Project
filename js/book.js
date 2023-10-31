let books = null;
let search = '';
let numOfRows = 10;
let pageNo = 1;
let totalCount = 0;
let totalPages = 0;
let bookCookies = [];

$(function () {
	getMonthlyBook();
	searchingLib();
	searchBooks();
	// 이전 다음 페이지 버튼 숨기기
	$('#nextPage').css({ display: 'none' });
	$('#prevPage').css({ display: 'none' });
	// 도서 검색
	$('.search').on('click', '#btn', function (e) {
		$('.search').on('change', '#listCnt', function (e) {
			numOfRows = e.target.value;
		});
		// console.log('1');
		search = $('input').val();
		pageNo = 1;
		// numOfRows = 10;

		// console.log('1');
		// 이전 다음 페이지 버튼 보이기
		searchBooks(search, pageNo, numOfRows);
		$('#nextPage').css({ display: 'inline-block' });
		$('#prevPage').css({ display: 'inline-block' });

		// console.log(numOfRows);
	});
	// 다음페이지
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
	// 이전 페이지
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
	// 지역별 도서관 검색
	$('#district').change(function (e) {
		// console.log($('#seoulLibrary'));
		searchingLib();
	});
	// 도서관 목록 열기 닫기
	$('.faq').on('click', '.faq-item', function () {
		$(this).toggleClass('faq-active');
	});
	// 좋아요 동작
	$('.like').on('click', '.fa-regular', function (e) {
		console.log('1');
		$(this).toggleClass('fa-solid');
	});
	// 모달창 열기
	$('.bookSearchResult').on('click', '.title', function (e) {
		openModal(this.id);
		console.log(this.id);
	});
	// 모달창 닫기
	$('.bookSearchResult').on('click', '.closeArea', function (e) {
		closeModal(this.id);
		console.log(this.id);
	});
	// 카카오톡 피드 공유하기
	$('.shareBtn').on('click', function (e) {
		console.log('1');
		window.navigator.share({
			title: '오늘도 책을 읽지 않는 당신에게...', // 공유될 제목
			text: '자신도 읽지 않는 책을 궂이 남에게 권하는 모순적인 페이지!', // 공유될 설명
			url: '', // 공유될 URL
		});
	});
	Kakao.Share.createDefaultButton({
		container: '#kakaotalk-sharing-btn',
		objectType: 'feed',
		content: {
			title: $('#pageName').html(),
			description: $('.mb-0').html(),
			imageUrl:
				'http://k.kakaocdn.net/dn/Q2iNx/btqgeRgV54P/VLdBs9cvyn8BJXB3o7N8UK/kakaolink40_original.png',
			link: {
				// [내 애플리케이션] > [플랫폼] 에서 등록한 사이트 도메인과 일치해야 함
				mobileWebUrl: location.href,
				webUrl: location.href,
			},
		},
		social: {
			likeCount: 286,
			commentCount: 45,
			sharedCount: 845,
		},
		buttons: [
			{
				title: '웹으로 보기',
				link: {
					mobileWebUrl: location.href,
					webUrl: location.href,
				},
			},
			{
				title: '앱으로 보기',
				link: {
					mobileWebUrl: location.href,
					webUrl: location.href,
				},
			},
		],
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

		output += `<div class="col-xl-4 col-md-6 aos-init aos-animate" data-aos="fade-up" data-aos-delay="100">
								<article><div class="post-img"><img src="${imgLink}" class="img-fluid" width="400px"></div>`;
		output += `<h2 class="title">${title}</h2><div class="d-flex align-items-center"><div class="post-meta">
								<p class="post-author">${auther}</p>`;
		output += `</div></div></article></div>`;
	});
	output += `</div>`;
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
		printBookData(data);
	});
}

let searchOutput = '';
function printBookData(json) {
	totalCount = Number(json.meta.total_count);
	let items = json.documents;
	searchOutput = `<div class="row gy-4">`;

	$.each(items, function (index, item) {
		searchOutput += `<div class="col-xl-4 col-md-6" data-aos="fade-up" data-aos-delay="100"><article>`;

		if (item.thumbnail == '') {
			searchOutput += `<div class="post-img"><img src="img/noimage.png" class="img-fluid" width="400px"></div>`;
		} else {
			searchOutput += `<div class="post-img"><img src="${item.thumbnail}" class="img-fluid" width="400px"></div>`;
		}

		searchOutput += `<h2 class="title" id="${index}" ><a>${item.title}</a></h2>`;
		searchOutput += `<div class="d-flex align-items-center"><div class="post-meta">`;

		if (item.translators != '') {
			searchOutput += `<p class="post-author">${item.authors} / ${item.translators}</p>`;
		} else {
			searchOutput += `<p class="post-author">${item.authors}</p>`;
		}

		searchOutput += `<p>${item.price}원</p>`;

		if (!getCookie(item.isbn)) {
			searchOutput += `<div class="like"><i class="fa-regular fa-bookmark" id="${item.isbn}"></i></div>`;
		} else {
			searchOutput += `<div class="like"><i class="fa-regular fa-solid fa-bookmark" id="${item.isbn}"></i></div>`;
		}

		searchOutput += `</div></div></article>`;
		searchOutput += `<div class="modal-content" id='${index}'><h2>${item.title}</h2>`;
		searchOutput += `<p>${item.contents}</p>`;
		searchOutput += `<p>출판사 : ${item.publisher}</p>`;
		searchOutput += `<p>저자 : ${item.authors}</p>`;

		if (item.translators != '') {
			searchOutput += `<p>역자 : ${item.translators}</p>`;
		}

		searchOutput += `<p><a target="_blank" href="${item.url}">더보기</a></p>`;
		searchOutput += `<div class="closeArea" id="${index}"><span><b>닫기</b></span></div></div></div>`;
	});
	searchOutput += `</div>`;
	$('.bookSearchResult').html(searchOutput);
	$('.like').on('click', '.fa-bookmark', function (e) {
		if (!getCookie(this.id)) {
			saveCookie(this.id, `BookMark${this.id}`, 30);
			$(this).toggleClass('fa-solid');
		} else {
			delCookie(this.id, `BookMark${this.id}`);
			$(this).toggleClass('fa-solid');
		}
	});
}

// 쿠키 관련 함수
function saveCookie(name, val, expDate) {
	let now = new Date();
	now.setDate(now.getDate() + Number(expDate));
	let newCookie = name + '=' + val + ';expires=' + now.toUTCString();
	document.cookie = newCookie; // 쿠키 저장
}

// 해당 cookie를 삭제하는 함수
function delCookie(name, val) {
	// 쿠키 삭제
	let now = new Date();
	let cookie = name + '=' + val + ';expires=' + now.toUTCString();
	document.cookie = cookie;
}
//쿠키를 읽어와 해당 내용이 있는지 없는지를 확인하는 함수
let cookName = [];
function getCookie(name) {
	if (document.cookie != '') {
		let cookArr = document.cookie.split('; ');
		console.log(cookArr);
		console.log(document.cookie);
		$.each(cookArr, function (index, cookie) {
			cookName[index] = `${cookie.replace(`=BookMark${name}`, '')}`;
		});
		for (let i in cookName) {
			console.log(cookName[i].indexOf(name), name);
			if (cookName[i].indexOf(name) > -1) {
				return true;
			}
		}
	} else {
		return false;
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
		if ($('#district').val() == district) {
			output += `<div class="faq-item" width="100%"><h3><span class="num" >${libraryName}</span></h3>`;
			output += `<div class="faq-content">
			<p>주 소 : ${libraryAddr}</p>
			<p>전화번호 : ${libraryTel}</p>
			<p>운영시간 : ${operation} / 휴무일 : ${holiday}</p></div>`;
			// output += `<div id="staticMap" style="width:600px;height:350px;"></div>`;
			output += `<i class="faq-toggle bi bi-chevron-right"></i></div>`;
			// outputMap(lat, lon);
		}
	});
	output += `</div>`;
	$('#bookSe').html(output);
}

// function outputMap(lat, lon) {
// 	var staticMapContainer = document.getElementById('staticMap'), // 이미지 지도를 표시할 div
// 		staticMapOption = {
// 			center: new kakao.maps.LatLng(lat, lon), // 이미지 지도의 중심좌표
// 			level: 3, // 이미지 지도의 확대 레벨
// 		};

// 	// 이미지 지도를 표시할 div와 옵션으로 이미지 지도를 생성합니다
// 	var staticMap = new kakao.maps.StaticMap(staticMapContainer, staticMapOption);
// }

// 모달 창 띄우기
function openModal(num) {
	// alert("!");
	document.getElementsByClassName('modal-content')[Number(num)].style.display = 'block';
}
// 모달 창 닫기
function closeModal(num) {
	document.getElementsByClassName('modal-content')[Number(num)].style.display = 'none';
}
