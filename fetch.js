
// require('isomorphic-fetch');
let ldfFetch = require('./ldf/ldf-fetch');

let headers = new Headers();
headers.append('Accept', 'application/trig;q=1.0,application/n-quads;q=0.7,text/n3,q=0.6');

console.time('TIMER');
call(0);

function call(count) {
  console.log(count);
  if (count >= 1)
    return console.timeEnd('TIMER');
  //let url = 'http://fragments.dbpedia.org/2016-04/en?page=' + (count+1);
  let url = 'http://www.google.com';
  ldfFetch(url, { headers }).then(response => {
    response.body.on('data', (data) => {});
    response.body.on('end', () => {
      call(count+1);
    });
  });
}