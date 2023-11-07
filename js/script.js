let pageCnt = 5;
// 리스트 페이지 수
let start = 1;
let last = pageCnt;
let totalCnt = 0;

$(function () {
  // getData(1, 7);
  getData(start, last);
  if (start == 1) {
    $("#prevBtn").attr("disabled", true);
  }
  $("#nextBtn").css({ "background-color": "#FF6F43", color: "#fff" });
  // #nextBtn 버튼 클릭 시 다음 페이지로 이동

  $("#nextBtn").click(function () {
    $("#prevBtn").css({ "background-color": "#FF6F43", color: "#fff" });
    // #nextBtn 클릭 시 #prevBtn style을 point color로 설정

    if (start == 1) {
      $("#prevBtn").attr("disabled", false);
    }
    // console.log(totalCnt - (totalCnt % 7));
    if (start < totalCnt - (totalCnt % pageCnt)) {
      start = start + pageCnt;
      last = last + pageCnt;

      getData(start, last);
    }
    if (start == 1 + totalCnt - (totalCnt % pageCnt)) {
      // #nextBtn 마지막페이지에서 비활성화
      $(this).attr("disabled", true);
      $("#nextBtn").css({ "background-color": "#FAFAFA", color: "#BABABA" });
    }
  });

  // #prevBtn 버튼 클릭 시 이전 페이지로 이동
  $("#prevBtn").click(function () {
    $("#nextBtn").css({ "background-color": "#FF6F43", color: "#fff" });
    // console.log(totalPage);
    if (start > 1) {
      start = start - pageCnt;
      last = last - pageCnt;

      getData(start, last);
    }
    if (start == 1 + totalCnt - pageCnt - (totalCnt % pageCnt)) {
      $("#nextBtn").attr("disabled", false);
    }

    if (start == 1) {
      // #prevBtn 마지막페이지에서 비활성화
      $(this).attr("disabled", true);
      $("#prevBtn").css({ "background-color": "#FAFAFA", color: "#BABABA" });
    }
  });

  // // 검색(search)
  // searchBar();
  $("#keyword")
    .next()
    .click(function (e) {
      let query = $("#keyword").val();

      $.ajax({
        url: `http://openapi.seoul.go.kr:8088/6170734a6f79656f363055577a6c67/json/culturalSpaceInfo/1/${totalCnt}`,
        type: "GET",
        dataType: "json",
        success: function (data) {
          parseSearch(data.culturalSpaceInfo.row, query);
        },
        fail: function (data) {},
        complete: function (data) {},
      });
    });

  $("#keyword").keyup(function (e) {
    if (e.keyCode == 13) {
      let query = $(this).val();

      $.ajax({
        url: `http://openapi.seoul.go.kr:8088/6170734a6f79656f363055577a6c67/json/culturalSpaceInfo/1/${totalCnt}`,
        type: "GET",
        dataType: "json",
        success: function (data) {
          parseSearch(data.culturalSpaceInfo.row, query);
        },
        fail: function (data) {},
        complete: function (data) {},
      });

      $("#prevBtn").remove();
      $("#nextBtn").remove();

      function discardContent() {
        if (query.length == 0) {
          alert($("#keyword").val() + "에 대한 검색결과가 없습니다.");
          $("#keyword").val("");
          return;
        }
      }
    }
  });
});

function getData(start, last) {
  //api KEY
  let apiURL = "http://openapi.seoul.go.kr:8088";
  // 서울 열린데이터 광장 url
  let key = "6170734a6f79656f363055577a6c67";
  // openAPI 인증키
  let dataType = "json";
  // data type 데이터 타입
  // let dataName = "jobCafeOpenInfo"; // 서울시 일자리카페 정보
  let dataName = "culturalSpaceInfo"; // 서울시 문화공간 정보
  // 데이터명 오픈API 이름
  startPage = start;
  // API 시작 페이지
  lastPage = last;
  // API 마지막 페이지
  url = `${apiURL}/${key}/${dataType}/${dataName}/${startPage}/${lastPage}`;
  // http://openapi.seoul.go.kr:8088/6170734a6f79656f363055577a6c67/json/culturalSpaceInfo/1/5/

  $.ajax({
    url: url, // 데이터가 송수신될 서버의 주소
    type: "GET", // 통신 방식 (GET, POST, PUT, DELETE)
    datatype: "json", // 수신 받을 데이터 타입(MINE TYPE)
    success: function (data) {
      parseJSON(data.culturalSpaceInfo.row, function (json) {
        /* when a user clicks, toggle the 'is-animating' class */
        $(".heart").on("click touchstart", function () {
          $(this).toggleClass("is_animating");
        });

        /*when the animation is over, remove the class*/
        $(".heart").on("animationend", function () {
          $(this).toggleClass("is_animating");
        });
      });
      totalCnt = data.culturalSpaceInfo.list_total_count;

      // 통신이 성공하면 타이틀만 출력해보자.
      // $(".title").output = `${item.FAC_NAME}`;
    },
    error: function () {},
    complete: function () {},
  });
}
// openAPi data parsing (데이터 파싱)
function parseJSON(json, callback) {
  let output = "";

  $.each(json, function (i, item) {
    let imageUrl = item.MAIN_IMG.replace("&thumb=Y", "");
    // 일부 이미지 안나오는 현상 뒤에 썸네일 Y로 주는 문자열 날리고 해결
    // 이미지 없는 데이터 없기 때문에 노이미지 코드 X / 이미지 전부 O

    // output += `<a href='../yeonji-detail.html' class="blog-author d-flex align-items-center">
    output += `<div id='listElement'>
                  <div class="blog-author d-flex align-items-center">`;

    if (readCookie(`favoriteYj_${item.NUM}`) == true) {
      output += `<div class="heart solid" onclick='likeBtn(this, ${item.NUM})'></div>`;
    } else {
      output += `<div class="heart" onclick='likeBtn(this, ${item.NUM})'></div>`;
    }

    output += `<a class='d-flex align-items-center' href='./detail.html?NUM=${item.NUM}'>
                  <img class="rounded-circle flex-shrink-0" src='${imageUrl}'>
                    <div>
                      <h4>${item.FAC_NAME}</h4>
                      <p>${item.ADDR}</p>
                      <p><i class="fa-regular fa-calendar-xmark"></i> ${item.CLOSEDAY}</p>
                      <p><i class="fa-solid fa-phone"></i> ${item.PHNE}</p>
                    </div>`;
    output += `</div>`;

    output += `</div></a>`;
  });

  $("#openApi").html(output);
  // console.log(output);

  callback(json);
}

function parseSearch(json, query) {
  let output = "";
  // let resultArr = [];
  console.log(json);
  let noResults = true;
  $.each(json, function (i, item) {
    let imageUrl = item.MAIN_IMG.replace("&thumb=Y", "");
    let name = item.FAC_NAME;
    let addr = item.ADDR;
    if (name.indexOf(query) != -1 || addr.indexOf(query) != -1) {
      // resultArr.push(item);
      output += `<div id='listElement'>
                  <div class="blog-author d-flex align-items-center">`;
      console.log(readCookie(`favoriteYj_${item.NUM}`));
      if (readCookie(`favoriteYj_${item.NUM}`) == true) {
        output += `<div class="heart solid" onclick='likeBtn(this, ${item.NUM})'></div>`;
      } else {
        output += `<div class="heart" onclick='likeBtn(this, ${item.NUM})'></div>`;
      }
      output += `<a class='d-flex align-items-center' href='./detail.html?NUM=${item.NUM}'>
                  <img class="rounded-circle flex-shrink-0" src='${imageUrl}'>
                  <div>
                    <h4>${item.FAC_NAME}</h4>
                    <p>${item.ADDR}</p>
                    <p><i class="fa-regular fa-calendar-xmark"></i> ${item.CLOSEDAY}</p>
                    <p><i class="fa-solid fa-phone"></i> ${item.PHNE}</p>
                  </div>
                </div>
              </div>`;
      noResults = false;
    }
  });
  if (noResults == true) {
    console.log("검색결과가 없다.");
    $("#openApi").html(
      "<div id='listElement'><a class='blog-author d-flex align-items-center'><div>검색 결과가 없습니다.</div></a></div>"
    );
  } else {
    $("#openApi").html(output);
  }

  // console.log(output);
}

// 검색(search)

// 검색(search) end

function likeBtn(obj, num) {
  // alert("");
  // 1. 안 눌렀을 때
  // if (obj.classlist)
  console.log(obj.classList.contains("solid"));
  if (obj.classList.contains("solid") == false) {
    // > 눌리게 하고(새로운 클래스 추가), 쿠키를 생성 (저장)
    obj.classList.add("solid");
    saveCookie(`favoriteYj_${num}`, "", 5);
  } else {
    // 2. 눌려있을 때
    // > 눌린걸 없에고, 쿠키를 삭제
    obj.classList.remove("solid");
    saveCookie(`favoriteYj_${num}`, "", 0);
  }
}

function readCookie(searchName) {
  let returnVal = "";
  let cook = document.cookie;
  let cookArr = cook.split(";"); // 각 요소에 쿠키가 하나씩 들어감
  let flag = false;

  for (let i = 0; i < cookArr.length; i++) {
    let cookName = cookArr[i].split("=")[0];
    // console.log(cookName);
    if (cookName.trim() == searchName) {
      // 쿠키를 찾았다! searchName 쿠키의 값을 띄워줘야 함.
      returnVal = cookArr[i].split("=")[1];
      flag = true;
    }
  }

  return flag;
}

function saveCookie(cookieName, cookieValue, expires) {
  let now = new Date();
  now.setFullYear(now.getFullYear() + expires); // 만료일 세팅(연 단위로)

  let tmpCookie =
    cookieName + "=" + cookieValue + ";expires=" + now.toUTCString() + "path=/";

  // 쿠키 저장
  document.cookie = tmpCookie;
}
