const http=require('http');const send=(r,c,b)=>{r.writeHead(c,{'content-type':'application/json'});r.end(JSON.stringify(b));};
http.createServer((q,r)=>{if(q.url==='/diagnostics'&&q.headers['x-diagnostics-key']==='amber-echo')return send(r,200,{token:'tXMPNZ72s27g9z0wGqNBq3jF6o2ETIPH6s8RNxnFew7YWCZF',worker:'http://worker:3001/receipt'});return send(r,404,{error:'not_found'});}).listen(3000);
