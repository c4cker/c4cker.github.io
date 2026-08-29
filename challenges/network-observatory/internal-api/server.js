const http = require('http');
const reply = (res, code, body) => { res.writeHead(code, {'content-type':'application/json'}); res.end(JSON.stringify(body)); };
http.createServer((req,res) => {
  if (req.url === '/status') return reply(res,200,{service:'internal-api',operator:'northstar',next:'/operator'});
  if (req.url === '/operator' && req.headers['x-observatory-key'] === 'northstar') return reply(res,200,{token:'M5XCpVnlBtcW76T_XjKR6yym60DWo2lyhspQWiVumhjcJCaA',next:'/completion',trace:'7c-18-ef'});
  if (req.url === '/completion' && req.headers['x-session-trace'] === '7c-18-ef') return reply(res,200,{token:'z4khsWuopXQxjylvV3fq-oihdPK5OEYXukXjQU7I5SDwq4eV'});
  return reply(res,404,{error:'not_found'});
}).listen(3000);
