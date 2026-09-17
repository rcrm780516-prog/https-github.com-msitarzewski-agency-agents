import fs from 'fs'; import vm from 'vm';
const W='/home/user/https-github.com-msitarzewski-agency-agents/teve-tours-website/';
const ctx = { window:{}, console };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(W+'teve-config.js','utf8'), ctx);
const C = ctx.window.TEVE_CONFIG;
const idiomas = C.idiomasActivos || Object.keys(C.textos);
const salida = [];
for (const l of idiomas) {
  const m = C.textos[l].meta;
  for (const [pagina, slug] of Object.entries(m.rutas||{})) {
    const partes = [];
    if (m.prefijo) partes.push(m.prefijo);
    if (slug) partes.push(slug);
    salida.push({ lang:l, pagina, url:'/'+partes.join('/'),
                  titulo:(m.titulos||{})[pagina] || m.titulo || '' });
  }
}
console.log(JSON.stringify({idiomas, porDefecto:C.idiomaPorDefecto, total:salida.length, rutas:salida}, null, 1));
