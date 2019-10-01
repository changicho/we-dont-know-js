const l = console.log;
// 2.1 배열
// 혼란스럽다. Java가 그리워진다.
var a = [];
a[0] = 1;
a[1] = "2";
a[2] = [3];
l(a);

var a = [];
a[0] = 1;
a[2] = [3];
l(a.length); // 두 개만 넣었지만 length가 가장 큰 '숫자' 키에 따라 변한다.

var a = [];
a[0] = 1;
a["foobar"] = 2;

l(a.length); // 1,
// '문자' 키의 요소는 length에 반영되지 않음, 배열은 단순하게 숫자 키만 사용하자!

var a = [];
a["13"] = 42;
l(a.length); // 14
// 이건 또 왜 이럴까? 문자열 "13"이 array 객체 내부에서 숫자로 강제변환되어 들어갔다. 헷갈리지 않도록 확실히 '숫자'만 쓰자!

// 2.1.1 유사 배열
function foo(s1, s2) {
    // l(arguments.concat("hihi")); // error! 배열 내장 함수는 사용할 수 없다.
    l(arguments.length); // length는 지원한다. 배열과 유사하지만 배열은 아니다.
    var arr = Array.prototype.slice.call(arguments);
    arr.push("bam");
    console.log(arr);
}

foo("aaa", "bbb");

// 2.2 문자열
// 문자열은 배열이 아니고, 내장 타입도 다르다. object(array), string
// length를 지원하긴 하지만 배열의 메서드는 통하지 않는다.
var a = "abc";
// a.map(); // errror!

// 문자열의 순서를 거꾸로 뒤집자 (js 관련 면접시 자주 출제)
var b = a
    .split("") // 문자를 하나씩 잘라서 배열을 만든다.
    .reverse(); // 배열의 순서를 뒤집는다.
l(b.join("")); // 배열 요소들을 모두 이어 붙인다. cba

// 2.3.1 숫자 구문
var a = 0.42;
l(a); // 0.42
var a = 42;
l(a); // 42

// 불가
// 42.toFixed(3); // error! '42.'을 하나로 취급한다!

// 가능
l((42).toFixed(3)); // 명확하게 42라는 Number 개체를 인지 가능
l((0.42).toFixed(3)); // 0.42.toFixed는 당연히 된다.
l((42).toFixed(3)); // 42..toFied(3)도 된다! '42.'이 42를 나타내기 때문에 (42).toFixed와 다름없다.
l((42).toFixed(3)); // 42 .toFixed(3) 이것도 된다. '42 '는 공란이 숫자리터럴을 대체하고 42로 인식된다.

l(0o363); // 0O363으로 쓰지 말자!

// 2.3.2 작은 소수 값

// 부동 소수점 숫자의 부작용, 가깝다고해도 같은 것은 아니다!
function numberCloseEnoughToEqual(n1, n2) {
    return Math.abs(n1 - n2) < Number.EPSILON;
}
// 안전한 정수 범위 확인
l(Number.MAX_SAFE_INTEGER); // 9007199254740991
l(Number.MIN_SAFE_INTEGER); // -9007199254740991

// undefined = 2; // node에선 read만 가능
var undefined = 2; // 헐... 절대 쓰면 안됌!
l(undefined);

// void는 무효!
var a = 10;
l(void a); // undefined

// 1
// return void setTimeout(doSomething, 100);

// 2
// setTimeout(doSomething, 100);
// return;

// 글쎄.. 읽기도 어렵고 안쓰는 편이 좋을 듯

// 2.4.3 특수 숫자
var a = 2 / "foo"; // NaN
l(typeof a === "number"); // true, 알 수 없는 숫자인 NaN은 숫자다!

// 그리고 NaN은 자기 자신과도 동등하지 않다.
l(a == NaN); // false
l(a === NaN); // false

// Number.isNaN을 사용하여 체크할 수 있다!
l(Number.isNaN(a)); // true

// 0, -0, +Infinity, -Infinity, 부호는 방향을 나타낸다. (애니메이션 프레임 넘김 방향)

// 2.4.4 특이한 동등비교
Object.is(a, NaN);
Object.is(b, -0);
Object.is(b, 0);
// 하지만 ==, === 를 권장 (더 뛰어난 효율, 일반적)

//2.5 값 vs 레퍼런스
// 원시값(문자열, 숫자 등)은 값 복사가, 레퍼런스(객체, 배열, 함수)는 레퍼런스 복사가 일어난다.
// 전적으로 값의 타입을 보고 결정된다. (포인터 개념 없음)
