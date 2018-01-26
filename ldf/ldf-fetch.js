
require('isomorphic-fetch');
let request = require('./Request');

function ldfFetch(input, init) {
  // convert init to options

  let options = Object.assign({}, init);
  options.url = input; // can use .url option due to Request.js
  if (init.headers) {
    let headers = {};
    init.headers.forEach((val, key) => {
      headers[key] = val;
    });
    options.headers = headers;
  }

  // can't do body when using Request.js, would have to go deeper
  // mode, credentials, cache, redirect, referrer, referrerPolicy, integrity, keepalive, signal

  // fetch has no auth/agent/timeout

  return new Promise((resolve, reject) => {
    let req = request(options);
    req.on('response', httpResponse => {
      let result = {
        body: httpResponse,
        headers: new Headers(httpResponse.headers),
        ok: httpResponse.statusCode < 300,
        status: httpResponse.statusCode,
        statusText: null,
        url: httpResponse.url,
        redirected: httpResponse.url !== httpResponse.responseUrl,
        clone: null
      };
      resolve(result);
    });

    req.on('error', reject);
  });
}

module.exports = ldfFetch;