# 타입과 문법, 스코프와 클로저
- 네이티브와 강제 형변환 정리 못함

# 목차
- [타입](#타입과-값)
- [네이티브](#네이티브)
- [강제변환](#강제변환)
- [문과 표현식](#문과-표현식)
- [Scope](#Scope)
- [Lexical Scope](#Lexical-Scope)

# 내용

## 타입과 값
### 개요
- 타입의 정의: `42`와 `"42"`처럼, 기계(JS Engine) 뿐만 아니라 사람(Developer)이 `사용 의도`에 맞게 처리하게 만드는 고유한 내부 특성의 집합 
- Strong Type 언어와 달리, 타입 강제가 없는 점때문에 타입이 없다는 주장이 있다.
    - 변수에 타입이 존재하진 않지만 값에는 타입이 존재한다.
        - typeof 연산자는 변수의 타입이 아닌 변수가 가지고 있는 값의 타입을 반환하는 것이다.
    - ES5에서 ECMAScript 언어를 사용해 직접 조작하는 값들을 `언어 타입`이라고 명세되어있다.


### 내장 타입
- Object를 제외한 타입들을 Primitive Type이라고 한다.

#### null
- `typeof null`은 null이 아닌 Object
- 초기 설계 버그지만, 고쳤을 경우 기존의 웹 동작에 문제를 유발시키기 때문에 해결하지 못한다.
- null 타입 체크 코드
```js
if(!a && typeof a === "object")
```

#### undefined
- undefined의 종류
    1. undefined
        ```js
        const a;
        console.log(typeof a)// undefined
        ```
        - 스코프내에 존재하는 변수지만 값이 `할당`되지 않은 상태
    2. undeclared
        ```js
        console.log(typeof b); // undefined
        console.log(b) // Refernce error
        ```
        - 스코프내에 변수가 `선언`되지 않은 상태
        - typeof 연산자외로 접근하면 에러가 발생한다.
            - 이런 점을 이용해 typeof는 Safety Guard 역할(변수 접근에서 발생하는 에러의 조기에 판별)을 할 수 있다.
            - 존재하지 않는 기능을 추가하는 로직(Polyfill)을 작성할 수 있다.
                ```js
                if(Array.prototype.isNaN === undefined){
                    Array.prototype.isNaN = (target) => {
                        return ((typeof isNaN) === "number" && isNaN(target));
                    }
                }
                ```
    - 분명히 다른 상황이지만 같은 타입으로 정의되어 있어, 따로 분별해야하는 수고가 발생한다.

#### boolean

#### number
- IEEE 754 표준에 따라 Double(64비트) 형태이다.
- 정수는 부동 소숫점 값이 없다. `42.0 === 42`
- 큰 값은 `지수형(Exponent Form)`으로 나타내며, toExponential() 메서드로 변환할 수 있다.
    ```js
    const num = 500;
    console.log(num.toExponential()); // 5e+2
    ```
- toFixed()를 사용해 `소숫점 자리표기`도 지정해줄 수 있다.
    - 인자값 만큼 소수점을 나타내며 아래 자리수는 반올림되어 문자열형태로 반환한다.
    ```js
    const num = 42.59;
    console.log(num.toFixed(0)) // 43
    console.log(num.toFixed(1)) // 42.6
    console.log(num.toFixed(3)) // 42.590
    ```
- toPrecision()를 사용해 `유효 숫자 개수`를 지정해줄 수 있다.
    - 인자값 만큼 유효 숫자를 지정해주며 그 아래 자리수에서 반올림되어 문자열 형태로 반환한다.
    ```js
    const num = 42.59;
    console.log(num.toPrecision(1)) // 4e+1
    console.log(num.toPrecision(2)) // 43
    ```
- 이런 메서드들을 숫자 리터럴에서 바로 사용할 수 있지만 Property Accessor와 소숫점을 분별해줘야 한다.
    ```js
    console.log(42.toExponential()) // Error!
    console.log(42..toExponential()) // 4.2e+1
    console.log(42 .toExponential()) // 4.2e+1 
    ```
- 진수 표현: 소문자를 사용해 가독성을 높인다.
    - 16진수: 0xf3
    - 8진수: 0o363
    - 2진수: 0b11110011

- 수학 연산시, 피연산자 중 숫자가 아닌 것이 있으면 NaN값을 반환한다.
    - `NaN === NaN`는 false
    - `typeof NaN === "number"`
    - `isNaN("foo") === true` -> 숫자가 아닌값은 모두 true이다.
    - `Number.isNaN("foo") === false` -> ES6의 Number.isNaN 메서드가 NaN판별을 정확하게 한다.

- JS는 Infinity라는 값이 존재해 divide by zero 에러가 발생하지 않는다.
    - `console.log(1/0) // Infinity`
    - 분자가 음수이면 -Infinity값을 가진다.

- JS는 곱셈과 나눗셈으로 음수 0(-0)이 나올 수 있다.
    - 음수 0을 문자열하면 양수 0이 된다.
    - `0 === -0`
    - 음수 0은 "애니메이션 프레임당 넘김 속도"같은 정보에서 갑자기 부호가 바뀌면서 발생하는 잠재적인 정보(ex.이동방향) 소실을 방지하려고 존재한다.

- 이렇듯 NaN이나 -0처럼 예외적인 비교 결과가 발생하지만, Object.is()를 사용하면 정확한 비교를 할 수 있다.
    - Object.is()의 Polyfill
        ```js
        if(!Object.is){
            Object.is = (v1, v2) => {
                if(v1 === 0 && v2 === 0) return 1/v1 === 1/v2; // -0
                if(v1!==v1) return v2!==v2; // NaN
                return v1===v2;
            }
        }
        ```

#### string
##### 문자배열와의 공통점
- 문자열은 Immutable한 배열 메서드를 사용할 수 있다.
    - ex) indexOf, concat, length
    ```js
    const origin = "foo";
    const modified = Array.prototype.map.call(origin, (v) => {
        return v.toUpperCase() + ".";
    })
    console.log(modified) // F.O.O
    ```
##### 문자배열와의 차이점
- 문자열은 Immutable하지만 배열은 Mutable하다.
    ```js
    const str = "hello";
    str[1]="i";
    console.log(str) // hello
    ```
- 인덱스를 사용한 임의접근이 통상적으로는 가능하지만, IE 구버전에서는 지원하지 않는다.(charAt()을 사용한다.)

#### symbol

#### object
- typeof은 "function"이란 공역 요소를 가지고 있다.
    - function는 Object의 하위 집합으로, 내부 Property로 호출할 수 있는 Object인 Callable Object이다.

##### Array
- Array는 Object의 하위 집합으로, 숫자를 인덱스로 가지며 숫자 인덱스 수를 length라는 내장 Property로 갖는 Object이다.
- `arr["2"] === arr[2]` 처럼 인덱스에선 숫자로 이루어진 문자열과 숫자를 구분하지 않는다.
- 배열도 `arr["user"]`같이 String key를 가질 수 있지만 length에 영향을 주지 않는다.
    - delete 연산자로 요소를 지워도 length가 감소하지 않는다.
- 배열 크기를 정하지 않더라도 임의 접근이 가능하다.
    ```js
    const arr = [];
    arr[3] = 1;
    console.log(arr[3]) // 1
    console.log(arr.length) // 4
    // arr[0] ~ arr[2] 는 undefined
    ```
- 유사 배열
    - 배열처럼 숫자 인덱스로 값들을 가리키지만 배열이 아닌 Object
    - 배열로 변환하는 방법
        ```js
        const arr = Array.prototype.slice.call(유사배열)
        const arr2 = Array.from(유사배열)
        const arr3 = [...유사배열]
        ```

### 값 vs 레퍼런스
- 레퍼런스: 다른 변수의 포인터
- 다른 언어는 레퍼런스를 사용하지 않으면 객체라도 값이 복사된다.
- JS는 변수 참조 및 포인터 개념이 존재하지 않고, 값 자체를 레퍼런스의 대상으로 둔다.
- 실제로 변수는 각자의 레퍼런스값을 가지고 있으며, `변수 -> 레퍼런스값 -> 실제 값` 순으로 참조하는 방식이다.(항상 값을 가리키는 것이다.)
- JS의 변수는 다른 변수의 레퍼런스를 소유할 수 없어, 변수에 변수를 할당해도 변수 자체의 레퍼런스값은 고유하게 가지게 되며, 레퍼런스값의 참조를 동일한 값을 가리키게 되는 것이다.

```js
let a = 1;  // a -> 레퍼런스값1 -> 1(1)
let b = a; // b -> 레퍼런스값2 -> 1(2)
b = 2; // b -> 레퍼런스값2 -> 2(1)
```
- Primitive Type 값들은 항상 Value-Copy 방식으로 할당 및 전달된다.
- 따라서 b=a로 할당해도 별개의 값을 레퍼런스가 지칭하고 있어 b에 다른 값을 할당해도 a에 영향을 주지 않는다.

```js
const a = [1,2,3]; // a -> R1 -> [1,2,3](1)
let b = a;  // b -> R2 -> [1,2,3](1)
b.push(4); 
console.log(a) // [1,2,3,4](1)
console.log(b) // [1,2,3,4](1)
console.log(a===b) // true

b = [1,2,3,4]; // b -> R2 -> [1,2,3,4](2)
b.push(5);
console.log(a) // 1,2,3,4
console.log(b) // 1,2,3,4,5
console.log(a===b) // false
```
- Object의 할당과 전달은 레퍼런스를 새로 만들고 그 레퍼런스가 같은 대상값을 가리키는 Reference-Copy가 적용된다.

```js
const primitive = 1; // primitive -> R1 -> 1(1)
const obj = {a:2, b:3}; // obj -> R2 -> {}(1)
function func(p, o){
    // p -> R3 -> 1(2)
    // o -> R4 -> {}(1)
    p = 5;  // p -> R3 -> 5(1)
    o.a = 4; // o -> R4 -> {}(1) 
}

func(primitive, obj); 
console.log(primitive); // 1
console.log(obj); // {a:4, b:3}

function func2(o){
    o = { a:0, b:0}; // o -> R5 -> {}(2)
}
console.log(obj); // {a:4, b:3}
```
- 함수 인자넘김 또한, 똑같이 이루어져 레퍼런스 사본을 만든다.
- Primitive type은 Value-copy가, Object는 Reference-copy가 이루어진다.
- Object에서 Reference-copy로 생기는 Mutable 현상을 방지하기 위해선 인자로 `{...obj}`같이 새로운 Object를 만들어 넘겨준다.

## 네이티브
- 특정 환경에서 종속되지 않은 ECMAScript의 내장 객체
- String(), Number(), Boolean(), Array(), Object(), Function(), RegExp(), Date(), Error(), Symbol()...
- Native는 생성자처럼 사용할 수 있으며, 결과값은 객체 wrapper이다.
```js
const a = new String("abc");
console.log(typeof a) // Object
console.log(a instanceof String) // true
```
- Primitive type 이름의 Native의 typeof 연산값은 Object이다.
- 

## 문과 표현식
### 자연어 문법과 비교
- 문장은 어구들로 이루어져 있으며, 어떤 어구는 그 자체로 문장을 형성을 할 수 있지만 어떤 어구는 구두점이나 접속사로 다른 어구와 연결하며 결합해야 문장이 완성된다.
- 여기서 문(Statement)는 문장, 표현식(Expression)은 어구, 연산자는 구두점 및 접속사에 해당된다.
- 즉 문은 표현식과 연산자로 이루어져있으며, 표현식은 홀로 존재할 수 있으며 그 자체가 문이 될 수 있다.
```js
const a = 3*6;
const b = a;
b;
```
- 3*6, a는 할당 표현식(Assignment Expression)
- `const a = 3*6;`와 `const b = a;`는 선언문(Declaration Statement)
- `b;`는 표현식 문(Expression Statement)이라고 한다.

### Statement의 완료 값
- 모든 문은 완료 값(Completion Value)라는 반환 값을 갖는다.
- 변수 선언문은 `var`, `const`, `let`의 완료 값인 undefined를 반환한다.
- {}의 완료 값은 가장 마지막 문이나 표현식의 완료값이다.
    - 하지만 완료 값을 다른 변수에 할당하는 것은 문법상 불가능하다.
    - eval이나 do를 사용해 문의 완료 값을 변수에 할당할 수 있다.

### 중괄호의 사용
- 중괄호({})는 객체리터럴과 레이블, 블록, 객체 분해에 사용된다.

#### 레이블 Statement
```js
const a = {
    foo: bar()
}
```
라는 객체 리터럴에서 변수 할당을 제거한 문
```js
{
    foo:bar()
}
```
은 문법 상 오류를 발생하지 않고 레이블 문이 된다.
- 레이블 문은 continue와 break 문에서 선택적으로 레이블을 받아 프로그램의 실행 흐름을 점프시킨다.
- 블록 선언문(반복문, if문 등)이 레이블을 지정할 수 있다.
```js
foo: for(let i=0; i<4; i++){
    for(let j=0; j<4; j++){
        if(i*j >= 3) break:foo;
        console.log(i, j);
    }
    // (0 0) (0 1) (0 2) (0 3) (1 0) (1 1) (1 2) (1 3)
    // 해당 조건이 되면 foo 레이블의 문을 break한다.
}
```
- 반복문에만 continue와 함께 레이블을 사용할 수 있다.
- 레이블 이름은 문자열이 올 수 없다.
    - 이 말은 즉슨 JSON의 프로퍼티 문자열 문법자체는 JS의 문법이 아니다.
- 하지만 루프 점프보다 차라리 함수 호출하는 것이 좋다.

### else if
- else if문이란 것은 JS에 존재하지 않으며 else { if()}에서 단일 문 블록을 생략한 것이다.

### 연산자 우선 순위
1. &&는 || 보다 우선 순위가 크다
```js
const a = null;
const b = "foo";
const c = [1,2,3];

a || b && c //  null || ("foo" && "[1,2,3]") ===> [1,2,3]
```

2. ","는 우선순위가 최하위 수준이다.
```js
let a = 42, b;
b = a++, a; // a(43) b(42)
```
- `b = (a++, a)`에선 b가 43이지만 괄호를 없애면 42인 이유는 ","가 우선순위가 낮기 때문

3. &&가 "="보다 우선순위가 높다.
```js
if(str && matches = str.match(/[aeiou]/g))
```
- &&문의 우항에 괄호를 쳐야된다.
- matches 변수가 없으면 if문은 matches의 할당 표현식이 된다.

4. ?: 는 &&와 || 보다 우선 순위가 낮으며 우측 결합성 연산자이다.
```js
a ? b : c ? d : e;
===
a ? b : (c ? d : e);
```

### 세미클론 자동 삽입
- ASI(Automatic Semicolon Insertion)라고도 하며, 세미클론이 누락된 곳에 엔진이 자동으로 삽입하는 것
- 개행에만 적용되며, 줄 중간에 삽입되는 경우는 없다.
```js
var a = 42, b
c;
```
- c는 독립적인 표현식임
- ASI가 존재하지만 세미클론은 반드시 넣어야 한다.
    - ASI는 파서 에러의 정정 루틴일 뿐이라 세미클론을 넣지 않는다는 것은 최대한 파서를 깨뜨리고 프로그램을 작성한다는 의미
    - 문법 요건에 맞게 작성할 것인가 문법 예외 사항에 의존해 거스를 것인가?
    - ASI는 유효 개행 문자 규칙 삽입기가 아닌 공식적인 구문 오류 정정의 프로시저이므로 세미클론은 에러로 봐야하는 것이 맞다.

### 에러
- JS의 일부 에러는 컴파일 시점에 발생하게 문법적으로 정의되어 있어, try catch하기 전에 프로그램 파싱 및 컴파일이 실패한다.
    - 정규 표현식 오타
    - 확인자가 아닌 것에 값 할당
- Temporal Dead Zone
    - 초기화를 아직 하지 않아 변수를 참조할 수 없는 코드 여영ㄱ
    - let의 블록 스코핑이 해당된다.
    - typeof도 안전장치 역할로 동작하지 않는다.
    ```js
    {
        typeof a;
    }
    //"undefined"
    {
        typeof a;
        let a;
    }
    // Error!
    ```
    - 함수의 인자 할당문도 해당된다.
    ```js
    var b = 3;
    function foo(a = 42, b = a+b+5){}
    // 두 번째 할당문에서 좌변 b는 TDZ에 있는 우변 b를 참조하기 때문에 에러 발생
    ```

### try catch문
- try나 catch문에 return 문이 있더라도, finally절이 실행된다.
- 이 때 , 모두 return 문을 갖고 있으면 finally절의 return 문이 유효하게 동작한다.
- for문 안에 continue가 있는 try와 finally를 사용해도 finally가 반복해서 동작한다.



## Scope
스코프: 어디서 어떻게 저장된 변수를 찾는지에 대한 규칙

### JS의 컴파일 과정
- JS는 인터프리터 언어지만 컴파일을 한다.
- 하지만 컴파일을 미리하거나 컴파일 결과를 지속적으로 사용하지 못한다.
    - 그렇지만 컴파일을 수백만 분의 1초 전에 수행하기 때문에, 엔진은 빠른 성능을 위해서 여러 트릭을 사용한다.
- 컴파일레이션의 4단계
    1. Tokenizing
    - Statement들을 잘게 쪼개 의미 있는 조각으로 만드는 과정
    - 문자열을 분석해 상태 유지 파싱의 결과인 토큰으로 쪼개어 만듬
    2. Lexing
    - 생성된 토큰에 의미를 부여
    - Lexical Scope가 정의되는 단계이다.
    3. Parsing
    - 생성된 Token 배열을 Abstract Syntax Tree로 바꾸는 과정
    ```js
    const a = 2;
    (변수 선언) ──── (대입 수식) ──── 2
              └──── a(확인자id)
    ```
    4. Code-Generation
    - AST를 컴퓨터의 실행 코드로 바꾸는 과정

### 컴파일 과정에서 생기는 스코프
- JS 엔진은 구문이 주어지면 실행 과정에서 엔진이 처리할 구문을 전에 수생한 컴파일레이션에서 처리한 구문에서 참조한다.
- 컴파일 도 중 선언문을 만났을 때, 해당 스코프에 존재하는 변수면 다음으로 지나가고, 없으면 변수를 스코프 컬렉션에 선언하라고 요청한다.
- 즉, 컴파일러는 엔진이 참조할 수 있게 해당 스코프에 변수를 기록한다.
- 그 다음, 변수 할당을 처리하기 위해 엔진이 실행가능한 코드로 만들어준다.
- JS 엔진은 스코프를 통해 변수를 검색하는데, 방법은 2가지가 있다.
    1. LHS: 값을 넣을 변수 컨테이너를 찾는다.
        - 보통 대입 연산이나 함수에 인자를 넘겨줄 때 발생
        - LHS에 실패하면 글로벌 변수를 만들어 할당, 'strict mode'에선 Reference Error가 발생
    2. RHS: 특정 변수의 값을 찾는다.
        - RHS에 실패하면 Reference Error가 발생
        - RHS에 성공했지만 찾은 결괏값의 사용이 적합하지 않으면 TypeError 발생
            ```js
            var a = 2;
            a(); // Type Error
            ```
    ```js
    function foo(a){
        console.log(a);
    }
    foo(2);
    /*
    1. foo를 찾는 RHS 참조
    2. foo의 인자 a를 찾는 LHS 검색
    3. console를 찾는 RHS 참조
    4. console.log의 파라미터로 들어가는 a의 RHS 참조
    */
    ```
    ```js
    function foo(a){
        var b = a;
        return a+b;
    }
    var c = foo(2);
    /*
    1. c에 대한 LHS
    2. foo에 대한 RHS
    3. foo의 인자 a에 대한 LHS
    4. b에 대한 LHS
    5. 할당할 a에 대한 RHS
    6. a, b에 대한 RHS
    */
    ```

## Lexical Scope
- Lexical Scope: 확인자가 어디서 어떻게 호출되는지에는 상관없이 함수가 선언된 위치에 따라 정의되는 스코프
- Lexing 단계에서 모든 확인자가 어디서 어떻게 선언되었는지 파악해, 실행 단계에서 확인자의 검색을 도와준다.
- 스코프 버블: 확인자(변수 or 함수)를 현재 스코프에서 찾지 못 할 경우 가장 가까운 스코프로 버블링해서 참조할 것을 찾는 구조
    - 버블링해서 참조할 확인자를 찾으면 검색을 중단
- Shadowing: 중첩 스코프 층에 걸쳐 같은 확인자 이름을 정의하는 것

### Lexical 속이기
- 아래의 2가지 방법이 Lexical Scope를 수정한다.
- 하지만 해당 코드가 있다면 엔진은 Lexing 시간에 Scope가 수정될 것을 생각한다.
- 이에 따라, 엔진은 컴파일 단계에서 수행한 스코프 검색을 최적화하지 못한다.

#### eval
```js
function foo(str, a){
    eval(str);
    console.log(a, b);
}

var b = 2;
foo("var b = 3;", 1);
```
- 코드 자체만 보면 Lexical Scope에 따라 `console.log`의 b는 2를 참조해야 한다.
- 하지만 eval이 자체적으로 런타임에서 Lexical Scope를 수정한다.
- Strict mode에선 Lexical Scope를 수정하지 않는다.

#### with
```js
function foo(obj){
    with(obj){
        a = 2;
    }
}
var o1 = {
    a:3
}

var o2 = {
    b:3
}

foo(o1);
foo(o2);
console.log(o1.a); // 2
console.log(o2.a); // undefined
console.log(a); // 2
```
- with는 객체를 가지고 하나의 Lexical Scope를 생성한다.
- 여기서 o2의 경우 a가 없어 스코프 버블링이 일어나 전역 변수 a = 2가 생긴다.