const l = console.log;

// To Number
var a = {
    valueOf: function() {
        return "42";
        // return "x";
    }
};

l(Number(a));

// Falsy
var a = new Boolean(false);
var b = new Number(0);
var c = new String("");

var d = Boolean(a && b && c);
l(d); // true

// Truthy
// 문자열은 모두 true다. (배열, 오브젝트도 마찬가지다.)
var a = "false";
var b = "0";
var c = "' '";

var d = Boolean(a && b && c);
l(d);

// 명시적 강제변환
var a = 42;
var b = String(a);

l(typeof b);
l(b);

var a = 42;
var b = a.toString(); // 명시적으로, 암시적인 작동

l(typeof b);
l(b);

var a = "42";
var b = +a; // 명시적 강제변환 (개발자에 따라 혼란스러울 수 있음)

l(typeof b);
l(b);

var c = "3.14";
var d = 5 + +c; // confusing
l(d);

var d = new Date("Mon, 18 Aug 2014 08:53:06 CDT");
l(+d); // show millisecond
l(d.getTime()); // better

l(Date.now()); // best (ES5)

var a = "42";
var b = "42px";
l(Number(a)); // 42
l(parseInt(a)); // 42

l(Number(b)); // NaN
l(parseInt(b)); // 42

// 암시적 변환
var a = [1, 2];
var b = [3, 4];

l(a + b); // "1,23,4"

var a = 42;
var b = a + "";

l(b); // "42"

var a = {
    valueOf: function() {
        return 42;
    },
    toString: function() {
        return 4;
    }
};

l(a + ""); // 42
l(String(a)); // "4"

var a = "3.14";
var b = a - 0;

l(b); // 3.14

var a = 42;
var b = "abc";
var c = null;

l(a || b); // 42
l(a && b); // abc
l(c || b); // abc
l(c && b); // null
l({} && 1);

// a ? a : b => a가 두번 평가됨
// a || b => a가 한번만 평가됨

// 느슨한, 엄격한 동등비교
l(42 == [42]);

var a = "abc";
var b = Object(a);

l(a === b); // false
l(a == b); // true

l([] == ![]); // -> [] == false
l(2 == [2]);
"" == [null];

// 추상 관계 비교
l([42] < ["43"]);
l(["43"] < [42]);

l(["42"] < ["043"]);

var a = { b: 42 };
var b = { b: 42 };

var c = a;
var d = a;
l(a == b);
l(a === b);
l(c == d);
l(c === d);
