const sym = Symbol();

const promise = Promise.resolve();
const promise1 = new Promise(((resolve, reject) => {
  const num = Math.random() * 10;
  if (num < 10) {
    resolve(num);
  } else {
    reject('error');
  }
}));

promise1.then((res) => {
  console.log(res);
}).catch((err) => {
  console.error(err);
}).finally(() => {
  console.log('finally');
});

const arr = ["arr", "yeah!"];
const check = arr.includes("yeah!");

console.log(arr[Symbol.iterator]());
