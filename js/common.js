// cookie를 읽어들여 로그가 없을 경우 저장하는 함수
function cookieLog(elem, name, val) {
	let cookArr = document.cookie.split(';');
	let searchName = name;
	// console.log(searchName);
	let isFind = false;
	for (let i = 0; i < cookArr.length; i++) {
		let cookName = cookArr[i].split('=')[0];
		let cookValue = cookArr[i].split('=')[1];
		// console.log(cookName, cookValue);
		if (cookName.trim() != searchName || elem.checked == true) {
			isFind = true;
			saveCookie(name, val);
		} else {
			delCookie(name);
		}
	}
}

// cookie를 저장하는 함수
function saveCookie(name, val, expDate) {
	let now = new Date();
	now.setDate(now.getDate() + Number(expDate));
	let newCookie = name + '=' + val + ';expires=' + now.toUTCString();
	document.cookie = newCookie; // 쿠키 저장
}
// 해당 cookie를 삭제하는 함수
function delCookie(name) {
	// myCooky 쿠키만 삭제
	// 삭제할 쿠키의 expires 값을 현재 날짜 , 시간으로 재설정하여 다시 저장 (overwrite)
	let now = new Date();
	let cookie = name + '=;expires=' + now.toUTCString();
	document.cookie = cookie;
}

// cookie를 읽어들이는 함수
function readCookie(name) {
	let cookArr = document.cookie.split(';');
	let searchName = name;
	// console.log(searchName);
	for (let i = 0; i < cookArr.length; i++) {
		let cookName = cookArr[i].split('=')[0];
		// let cookValue = cookArr[i].split('=')[1];
		// console.log(cookName, cookValue);
		if (cookName.trim() != searchName) {
			return true;
		} else {
			return false;
		}
	}
}

function getParameter(par) {
	let returnVal = null;
	let url = location.href;

	if (url.indexOf('?') != -1) {
		let queryString = url.split('?')[1];
		let queryArr = queryString.split('&');

		// for (let i = 0; i < queryArr.length; i++) {
		// 	returnVal = queryArr[i].split('=');
		// 	for (let i = 0; i < returnVal.length; i++) {
		// 		if (returnVal[i] == par) {
		// 			return returnVal[1];
		// 		}
		// 	}
		// }

		for (let item of queryArr) {
			if (item.split('=')[0] == par) {
				returnVal = item.split('=')[1];
				break; // 파라미터 값을 찾으면 해당 반복문 블록을 빠져 나감
			}
		}
		return returnVal;
	}
}

function calScores(par1, par2, par3, par4) {
	let name = decodeURIComponent(par1);
	let total = Number(par2) + Number(par3) + Number(par4);
	let avg = (total / 3).toFixed(2);
	let grade = 'F';
	switch (Math.floor(avg / 10) + 1) {
		case 10:
		case 9:
			grade = 'A';
			break;
		case 8:
			grade = 'B';
			break;
		case 7:
			grade = 'C';
			break;
		case 6:
			grade = 'D';
			break;
		default:
			grade;
	}
	console.log(name, par2, par3, par4, total, avg, grade);
	let output = `<table><tr><td>이름</td><td>국어</td><td>영어</td><td>수학</td><td>총점</td><td>평균</td><td>학점</td></tr><tr>`;
	output += `<td>${name}</td><td>${par2}</td><td>${par3}</td><td>${par4}</td><td>${total}</td><td>${avg}</td><td>${grade}</td></tr></table>`;
	document.write(output);
}
