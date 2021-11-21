const fetchData = () => {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Done!');
    }, 1500);
  });
  return promise;
};

setTimeout(() => {
  console.log('Timer is done');
  fetchData()
    .then(text => {
      console.log(text);
      return fetchData(); //no '.then(text2=>....)' here: instead 'return' that promise and chain '.then'
        //(and if you return not a promise inside '.then' block - it will be converted into a resolved promise)
    })
    .then(text2 => {
      console.log(text2);
    });
}, 2000);

console.log('Hello!');
console.log('Hi!');