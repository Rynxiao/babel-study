for (var i of foo) {}

const arrayFn = (...args) => {
  return ['babel config'].concat(args);
}

arrayFn('I', 'am', 'using');
