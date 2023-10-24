let books = null;
let search = '';
$(function () {
	getMonthlyBook();
	searchingLib();
	$('#inputTitle').on('change', function () {
		search = $('input').val();
		searchBooks(search);
	});
});

function getMonthlyBook(xml) {
	$.ajax({
		url: 'http://api.kcisa.kr/openapi/service/rest/meta13/getKPEF0101?serviceKey=a236b958-53f7-4b01-8ae6-d6862d54a0d7&numOfRows=10&pageNo=1',
		method: 'GET',
		datatype: 'xml',
	}).done(function (data) {
		// console.log(data);
		parsingData(data);
		// }
	});
}
function parsingData(xml) {
	books = xml.getElementsByTagName('item');
	let title = '';
	let description = '';
	let auther = '';
	let imgLink = '';
	let link = '';
	let output = '';
	$.each(books, function (index, book) {
		title = $(book).children().eq(0).text();
		description = $(book).children().eq(8).text();
		auther = $(book).children().eq(15).text();
		imgLink = $(book).children().eq(14).text().replaceAll('www', 'e');
		link = $(book).children().eq(17).text();
		console.log(title, description, auther, imgLink, link);
		console.log(imgLink);
		output += `<div class="monthlyBook-cnt">`;
		output += `<div><img src="${imgLink}" alt="사진" class="monthlyBook-thumbNail" /></div>
							<div class="monthlyBook-title">${title}</div>
						</div>`;
	});
	console.log(xml);
	console.log(books);
	$('.monthlyBook').html(output);
}

function searchingLib() {
	$.ajax({
		url: 'http://openapi.seoul.go.kr:8088/6645514d4664697336355956525956/json/SeoulPublicLibraryInfo/1/300',
		method: 'GET',
		datatype: 'JSON',
	}).done(function (data) {
		console.log(data);
		parsingData(data.SeoulPublicLibraryInfo.row);
		// }
	});

	function parsingData(json) {
		$.each(json, function (index, item) {
			let district = json[index].CODE_VALUE;
			let libraryName = json[index].LBRRY_NAME;
			let libraryAddr = json[index].ADRES;
			let operation = json[index].OP_TIME;
			let libraryTel = json[index].TEL_NO;
			let homePage = json[index].HMPG_URL;
			let holiday = json[index].FDRM_CLOSE_DATE;
			let lat = json[index].YDNTS;
			let lon = json[index].XCNTS;
			// let title = $(items).eq(0).children().eq(0).val();
			// console.log(libraryName);
		});
	}
}
function searchBooks(input) {
	$.ajax({
		method: 'GET',
		url: 'https://dapi.kakao.com/v3/search/book?target=title&',
		data: {
			query: input,
		},
		headers: {
			Authorization: 'KakaoAK 0f7acd5ca96b1d76578d02adc4161263',
		},
	}).done(function (data) {
		parsingData(data);
	});
	let output = `<ul class="searchBook-result">`;
	function parsingData(json) {
		$(json).each(function (index, item) {
			let title = json.documents[index].title;
			let thumbNail = json.documents[index].thumbnail;
			let description = json.documents[index].contents;

			output += `<li id="thumbnail"><img src="${thumbNail}"/></li>
						<li>${title}</li>
						<li>${description}</li>`;

			// $('li')[1].append(data.documents[0].title);
			// $('li')[2].append(data.documents[0].contents);
			// $('.thumbnail').append('<img src="' + data.documents[0].thumbnail + '"/>');
			// $('.thumbnail').children().css('width', '300px');
			console.log(title);
		});
		output += `</ul>`;

		$('.searchBook').append(output);
	}
}
