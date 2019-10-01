const l = console.log;

// 3.1 내부 [[Class]]
// typeof가 'object'인 값에는 [[Class]] 내부 프로퍼티가 추가로 붙는다.
l(Object.prototype.toString.call([1, 2, 3]));
// "[object Array]"

l(Object.prototype.toString.call(/regex-literal/i));
// "[object RegExp]"

// 단순 원시 값은 이른바 '박싱(Boxing)' 과정을 거친다.
l(Object.prototype.toString.call(null));
// "[object Null]"

l(Object.prototype.toString.call(undefined));
// "[object Undefined]"

// 3.2 래퍼 박싱하기
// 원시값은 알아서 박싱된다.
var a = "abc";
l(a.length); // 3
l(a.toUpperCase()); // "ABC"

// 브라우저가 스스로 최적화하기 때문에 그냥 원시 값으로 쓰자. (선최적화는 더 느려질 수 있다.)
var a = new String("abc");

var a = new Boolean(false);
l(a); // [Boolean: false] => 객체이며 객체는 truthy다. (Falsy => null, undefined ...)
if (!a) {
    l("Oops");
}

// 3.3 언박싱
var a = new String("abc");
l(a.valueOf()); /// a

// 3.4 네이티브, 나는 생성자다
var a = new Array(1, 2, 3);
// var a = [ 1, 2, 3]
a.length; // 3
l(a);

a = new Array(3); // array의 사이즈만 정한다
l(a.length);
l(a);

// Symbol
var mysum = Symbol("my own symbol");
var mysum2 = Symbol("my own symbol");
l(mysum); // Symbol(my own symbol) 실제 값 볼 수 없음
l(mysum.toString());
l(typeof mysum);

var a = {};
a[mysum] = "foobar";

l(Object.getOwnPropertySymbols(a));
l(a[mysum]); // foobar
l(a[mysum2]); // same as mysum, but undefined

// default prototype
function isThisCool(vals, fn, rx) {
    vals = vals || Array.prototype;
    fn = fn || Function.prototype;
    rx = rx || RegExp.prototype;

    return rx.test(vals.map(fn).join(""));
}

// l(isThisCool()); // Oops! error:  Method RegExp.prototype.exec called on incompatible receiver
l(
    isThisCool(
        ["a", "b", "c"],
        function(v) {
            return v.toUpperCase();
        },
        /D/
    )
);
