
const fs = require('fs');
const http = require('http');
const path = require('path');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/sparql',
  method: 'POST',
  headers: {
    'Accept': 'table',
    'Content-Type': 'application/x-www-form-urlencoded',
  }
};

let watdiv = {};
let names = [];
let queryFolder = 'sparql/watdiv-10M';
let filenames = fs.readdirSync(queryFolder);
for (let filename of filenames) {
  let queries = fs.readFileSync(path.join(queryFolder, filename), 'utf8').split('\n\n').filter((x) => x.length > 0);
  let name = filename.replace(/\.txt$/, '');
  watdiv[name] = queries;
  names.push(name);
}

callRecursive(0, 0);

function callRecursive(nameId, id) {
  let name = names[nameId];
  console.log(name + ' ' + id);
  call(watdiv[name][id], () => {
    ++id;
    if (id >= watdiv[name].length) {
      id = 0;
      ++nameId
    }
    if (nameId < names.length) {
      callRecursive(nameId, id);
    }
  });
}

function call(query, done) {
  let hrstart = process.hrtime();
  let count = -2; // ignore header lines
  const req = http.request(options, res => {
    res.on('data', data => { console.log(data.toString()); count += data.toString().split('\n').filter(x => x.trim().length > 0).length; });
    res.on('end', () => {
      console.log(count + ' results');
      console.log(Math.floor(stop(hrstart)) + 'ms');
      done();
    });
  });

  req.write('query=' + query);
  req.end();
}


function stop(hrstart) {
  // execution time simulated with setTimeout function
  let hrend = process.hrtime(hrstart);
  return hrend[0]*1000 + hrend[1]/1000000;
}
