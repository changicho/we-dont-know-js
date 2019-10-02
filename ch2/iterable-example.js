const iterableObj = {
  [Symbol.iterator]() { // Symbol.iterator 를 키로 가지는 함수를 가지고 있다
    let i = 5;
    return {
      next() { // next() 리턴 값이 순차적으로 이터레이팅 된다
        return i == 0 ? {done: true} : {value: i--, done: false};
      },
      [Symbol.iterator]() { // well-formed iterator
        return this;
      }
    }
  }
};

const arr = [...iterableObj]; // [5,4,3,2,1]
console.log('arr : ', arr);

const arr2 = [...iterableObj[Symbol.iterator]]; // [5,4,3,2,1]
// well-formed iterator : Symbol.iterator 함수의 리턴값으로도 이터레이팅 할 수 있음

console.log('arr2 : ', arr2);
