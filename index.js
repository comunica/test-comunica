
const fs = require('fs');
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/sparql',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  }
};

console.time('TIMER');
const req = http.request(options, res => {
  res.once('data', () => {
    console.time('AFTER_RESULT');
  })
  res.on('data', data => { });
  res.on('end', () => {
    console.timeEnd('AFTER_RESULT');
    console.timeEnd('TIMER');
  });
});

req.write('query=' + fs.readFileSync('sparql/bradpitt.sparql', 'utf8'));
//req.write('query=' + fs.readFileSync('sparql/select10000.sparql', 'utf8'));
req.end();