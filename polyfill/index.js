const sym = Symbol();

const promise = Promise.resolve();

const arr = ["arr", "yeah!"];
const check = arr.includes("yeah!");

console.log(arr[Symbol.iterator]());
