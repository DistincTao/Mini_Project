function registerValid() {
	// form 태그 안에 있는 모든 입력 데이트를 회원강비 조건에 맞는지를 비교해서
	// 모든 조건에 다 부합이 되면 true를 반환
	// 하나라도 조건에 만족하지 않는 데이터가 있다면 false를 반환

	// 아이디 체크
	let idCheck = validUserId($('#userId').val());
	let pwdCheck = validPwd($('#psw1').val(), $('#psw2').val());
	let emailCheck = validEmail($('#email').val());
	let mobileCheck = validMobile($('#mobile').val());
	let genderCheck = vaildGender($('.form-check input'));
	let hobbies = getHobby(); // 문자열로 취미를 대입
	let job = getJob();
	let memo = getMemo($('#comment'));
	let isAgree = false;
	if (document.getElementById('agree').checked) {
		isAgree = true;
	} else {
		outputError('가입 조항에 동의해 주세요', $('#agree'));
	}

	let valid = false;
	if (idCheck && pwdCheck && emailCheck && mobileCheck && genderCheck && job && isAgree) {
		valid = true;
	}
	return valid;
	// console.log($('#userId').val());
	// console.log($('#psw1').val(), $('#psw2').val());
	// console.log($('#email').val());
}

console.log(registerValid());

function validUserId(userId) {
	// 아이디 유효성 검사
	// 아이디는 4자 이상  8자이하, (정규식이 가장 정확)
	// 아이디가 3자 이하이거나, 9자 이상이거나, 아무것도 입력하지 않았을때 =>
	// 정규식 적용해보기!!!!!! ============
	// Error Message를 출력해서 다시 입력하게 하자
	let isValid = false;
	if (userId == '') {
		outputError('ID는 필수항목입니다.', $('#userId'));
	} else if (userId.length < 4 || userId.length > 8) {
		outputError('ID는 4자이상 8자이하로 작성해 주세요.', $('#userId'));
	} else {
		isValid = true;
	}
	return isValid;
}

function validPwd(psw1, psw2) {
	// 비밀 번호는 8자 이상 20자 이하 필수 (비밀 번호 확인과 동일 할 것)
	// 정규식 적용해보기!!!!!! ============
	let isValid = false;
	// let pswRegExp = /^(?=.*[A-Za-z])(?=.*[0-9]).{8,20}$/;
	if (psw1 == '') {
		outputError('비밀번호는 필수항목입니다.', $('#psw1'));
	} else if (psw1.length < 7 || psw1.length > 21) {
		outputError('비밀번호는 8자 이상 20자 이하로 입력해 주세요.', $('#psw1'));
	}
	// else if (!pswRegExp.test(psw1)) {
	// 	outputError('영문 대소문자, 숫자, 기호 (! @ # $ % ^ * + = - ) 만 사용 가능합니다.', $('#psw1'));
	// }
	else if (psw1 != psw2) {
		outputError('비밀번호가 일치하지 않습니다.', $('#psw2'));
	} else {
		isValid = true;
	}
	return isValid;
}

function validEmail(email) {
	// 이메일 주소 형식인지 아닌지 검사
	let emailRegExp = /^[0-9a-z]([-_\.]?[0-9a-z])*@[0-9a-z]([-_\.]?[0-9a-z])*\.[a-z]{2,3}$/;
	let isValid = false;
	// match(Pattern)
	if (!emailRegExp.test(email)) {
		outputError('이메일 형식에 맞게 다시 입력해주세요.', $('#email'));
	} else {
		isValid = true;
	}
	return isValid;
}
function validMobile(mobile) {
	// 이메일 주소 형식인지 아닌지 검사
	let mobileRegExp = /^\d{3}\d{3,4}\d{4}$/;
	let isValid = false;
	if (!mobileRegExp.test(mobile)) {
		outputError('- 를 제외하고 입력해주세요.', $('#mobile'));
	} else {
		isValid = true;
	}
	return isValid;
}

function vaildGender(gender) {
	// 성별은 남성 또는 여성 중에 하나가 반드시 선택 되어야 함
	let isValid = false;
	let radio1 = false;
	let radio2 = false;
	let radio3 = false;

	if (gender[0].checked) {
		radio1 = true;
	}

	if (gender[1].checked) {
		radio2 = true;
	}

	if (gender[2].checked) {
		radio3 = true;
	}

	if (radio1 == false && radio2 == false && radio3 == false) {
		outputError(`<div> 성별은 필수 선택 사항입니다.</div>`, $('#gender'));
	} else {
		isValid = true;
	}
	return isValid;
}

function getHobby() {
	let hobbies = '';
	let hobbyArr = document.getElementsByName('hobby');
	// 	`${$('.form-check input').eq(3).val()},${$('.form-check input')
	// 		.eq(4)
	// 		.val()},${$('.form-check input').eq(5).val()}`,
	// ];
	// console.log(hobbyArr);
	for (let i = 0; i < hobbyArr.length; i++) {
		if (hobbyArr[i].checked == true) {
			hobbies += hobbyArr[i].value + ',';
			// console.log(hobbies);
		}
		// console.log(hobbies.substring(0, hobbies.length - 1));
	}
	return hobbies.substring(0, hobbies.length - 1);
}

function getJob() {
	let isValid = false;
	// console.log(job);
	if (document.getElementById('job').selectedIndex == 0) {
		outputError(`필수 선택 사항입니다.`, $('#job'));
	} else {
		isValid = true;
	}
	return isValid;
}

function getMemo(memo) {
	return memo.value;
}

function outputError(errorMsg, tagObj) {
	// errorMsg를 tagObj 다음 요소에 삽입 시켜 출력
	let err = `<div class='errMsg'> ${errorMsg} </div>`;
	$(err).insertAfter($(tagObj));
	$(tagObj).focus();
	$('.errMsg').css('color', 'red');
	$('.errMsg').hide(5000);
}
