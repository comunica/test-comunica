
let request = require('./ldf/Request');

let options = {
  url: 'http://fragments.dbpedia.org/2016-04/en?page=0',
  method: 'GET',
  headers: { Accept: 'application/trig;q=1.0,application/n-quads;q=0.7,text/n3,q=0.6'}
};

console.time('TIMER');
call(0);

function call(count) {
  if (count >= 100)
    return console.timeEnd('TIMER');
  options.url = 'http://fragments.dbpedia.org/2016-04/en?page=' + (count+1);
  request(options).on('response', httpResponse => {
    httpResponse.resume();
    httpResponse.on('data', () => {});
    httpResponse.on('end', () => {
      call(count+1);
    })
  });
}