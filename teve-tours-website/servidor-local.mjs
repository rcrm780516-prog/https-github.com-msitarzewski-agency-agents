// Servidor local que imita el .htaccess: cualquier ruta conocida del sitio
// entrega index.html, igual que hara Hostinger.
import http from 'http'; import fs from 'fs'; import path from 'path';
const RAIZ = process.argv[2], PUERTO = Number(process.argv[3]);
const TIPOS = {'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8',
  '.css':'text/css','.json':'application/json','.jpg':'image/jpeg','.jpeg':'image/jpeg',
  '.png':'image/png','.svg':'image/svg+xml','.xml':'application/xml','.txt':'text/plain; charset=utf-8'};
http.createServer((req,res) => {
  const limpia = decodeURIComponent(req.url.split('?')[0]);
  let f = path.join(RAIZ, limpia);
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) {
    const ind = path.join(f, 'index.html');
    f = (fs.existsSync(ind)) ? ind : path.join(RAIZ, 'index.html');
  }
  if (!fs.existsSync(f)) { res.writeHead(404); return res.end('no'); }
  res.writeHead(200, {'Content-Type': TIPOS[path.extname(f)] || 'application/octet-stream'});
  res.end(fs.readFileSync(f));
}).listen(PUERTO, () => console.log('servidor en', PUERTO, 'sirviendo', RAIZ));
