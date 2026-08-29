const http = require('http');
const send=(res,code,body)=>{res.writeHead(code,{'content-type':'application/json','cache-control':'public, max-age=60'});res.end(JSON.stringify(body));};
http.createServer((req,res)=>{
  if(req.url==='/') return send(res,200,{challenge:'Cache Mirage',routes:['/digest','/preview','/final']});
  if(req.url==='/digest' && req.headers['x-lab-role']==='analyst') return send(res,200,{token:'vELndgfMuPDuBjzAH4E7LLS8re-cwCzSJ5F4-ccwZVoZwGvr',hint:'preview uses X-Preview: violet'});
  if(req.url==='/preview' && req.headers['x-preview']==='violet') return send(res,200,{token:'FwJSCStG_h2xoWoGISp50nwlxzpROR5IwDpMf8YgfGWPUcJK',hint:'final uses X-Review: cache-miss'});
  if(req.url==='/final' && req.headers['x-review']==='cache-miss') return send(res,200,{token:'Aa5TO3GMg3HMxgn_D3Z_GBuIU8otqV-Gu8loQ12WmR5Q9rup'});
  return send(res,404,{error:'not_found'});
}).listen(3000);
