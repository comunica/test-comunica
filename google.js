
let request = require('./ldf/Request');
let url = require('url');
let http = require('follow-redirects').http;
let https = require('follow-redirects').https;
let EventEmitter = require('events').EventEmitter;

let options = {
  url: 'http://google.com',
  method: 'GET'
};

//options.url = 'http://fragments.dbpedia.org/2016-04/en';

// maximize buffer size to drain the response stream, since unconsumed responses
// can lead to out-of-memory errors (http://nodejs.org/api/http.html)

// Try to keep connections open, and set a maximum number of connections per server
let AGENT_SETTINGS = { keepAlive: true, maxSockets: 5 };
let AGENTS = {
  http:  new http.Agent(AGENT_SETTINGS),
  https: new https.Agent(AGENT_SETTINGS),
};

let req = getRequest(options);
req.on('response', httpResponse => {
  httpResponse.resume();
  httpResponse.on('data', console.log);
  httpResponse.on('error', console.error);
  httpResponse.on('end', () => {
    console.log('end');
  })
});

function getRequest(settings) {
  if (settings.url)
    Object.assign(settings, url.parse(settings.url));

  settings.agents = AGENTS;

  // Emit the response through a proxy
  let request, requestProxy = new EventEmitter(),
    requester = settings.protocol === 'http:' ? http : https;
  request = requester.request(settings, function (response) {
    requestProxy.emit('response', response);
  });
  request.end();
  return requestProxy;
}