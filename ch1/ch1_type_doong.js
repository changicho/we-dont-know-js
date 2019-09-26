const l = console.log;

// 1.1 타입, 그 실체를 이해하자

// null의 정체.. 대체 왜 object지? 버그지만 하위호환성 때문에 버티는 중!
l(typeof null === "object"); // true

// 그래서
var a = null;
// 이렇게 확인해야함
l(!a); // null은 Falsy한 값이므로 true를 반환
l(!a && typeof a === "object"); // true

// 2.1 내장 타입

/*
    null
    undefined
    boolean
    number
    string
    object
    symbol

    function은 없네?
*/

l(typeof function a() {} === "function"); // true
// 왜?
// 함수는 '호출 가능한 객체(내부 프로퍼티 call로 호출할 수 있는 객체)라고 명시되어 있다.'

function print(msg) {
    console.log(msg);
}

// https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Function/call
print.call(null /* this */, "hello!"); // hello!
// https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Function/apply
print.apply(null /* this */, ["hello!"]); // hello!
// bind는 뭐 ..

l(print.length); // 1 (인자 개수)

/******************************************************************/
// 1.3 값은 타입을 가진다.

var a = 42;
l(typeof a); // "number"

var a = true;
l(typeof a); // "boolean"

// 변수에는 타입이 없다. 그러므로 typeof라는 돋보기를 변수 안을 들여다보며 값의 타입이 뭔지 관찰한다.

// 1.3.2 값이 없는 vs 선언되지 않은
var aasdf;
l(typeof aasdf); // 음 값이 없을 땐 undefined인가?
l(typeof asdfsadf); // 선언안했을때도 undefined? 'asdfsadf is not defined'가 나았을텐데..
// 아쉽지만..하위호환성..

// 하지만 typeof를 이용해서 선언되었는지 확인하는 안전가드로 사용!
(function safeGuard() {
    var printf =
        typeof printf !== "undefined"
            ? printf
            : function printf() {
                  console.log("I am printf");
              };
    printf();
})();

// 1.3.3 선언되지 않은 변수

// ex) Page API는 브라우저마다 프로퍼티 이름이 다르다. 이를 검사하는 예제
var document = { hidden: true };
if (typeof document.hidden !== "undefined") {
    // Opera 12.10 and Firefox 18 and later support
    hidden = "hidden";
    visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
    hidden = "msHidden";
    visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
    hidden = "webkitHidden";
    visibilityChange = "webkitvisibilitychange";
}
