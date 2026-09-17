#!/usr/bin/env python3
"""
Genera dist/index.html: el sitio COMPLETO en un solo archivo, con el config
y las fotografías ya incrustados.

    python3 construir-index-unico.py

Úsalo cuando quieras subir un único archivo a Hostinger en vez de
index.html + teve-config.js + teve-fotos.js + img/.

Vuelve a ejecutarlo cada vez que cambies cualquiera de esos archivos.
"""
import base64
import pathlib
import re

RAIZ = pathlib.Path(__file__).parent

TIPOS = {'.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
         '.webp': 'image/webp', '.svg': 'image/svg+xml', '.gif': 'image/gif'}


def a_data_uri(ruta):
    datos = (RAIZ / ruta.lstrip('/')).read_bytes()
    tipo = TIPOS.get(pathlib.Path(ruta).suffix.lower(), 'application/octet-stream')
    return 'data:%s;base64,%s' % (tipo, base64.b64encode(datos).decode())


def incrustar_rutas(texto):
    """Cambia cada "/img/..." por la imagen misma, en base64.

    Antes solo se incrustaban tres rutas escritas a mano, así que una foto
    nueva en img/ salía como ruta rota en el archivo único. Ahora se busca
    cualquier ruta de img/ que aparezca entre comillas. Así las fotografías
    pueden vivir como archivos normales en el repositorio -- se ven, se
    reemplazan y pesan lo que pesan -- en vez de como un chorro de base64
    dentro de teve-fotos.js, que nadie puede abrir ni revisar.
    """
    def cambia(m):
        ruta = m.group(1)
        archivo = RAIZ / ruta.lstrip('/')
        if not archivo.is_file():
            faltantes.append(ruta)
            return m.group(0)
        return '"%s"' % a_data_uri(ruta)

    faltantes = []
    texto = re.sub(r'"(/img/[^"]+)"', cambia, texto)
    for r in sorted(set(faltantes)):
        print('  AVISO: no existe %s — se queda como ruta' % r)
    return texto


def main():
    config = incrustar_rutas((RAIZ / 'teve-config.js').read_text(encoding='utf-8'))
    fotos = incrustar_rutas((RAIZ / 'teve-fotos.js').read_text(encoding='utf-8'))

    html = (RAIZ / 'index.html').read_text(encoding='utf-8')
    # La etiqueta original se SUSTITUYE por el contenido, no se conserva.
    #
    # Antes se dejaban las dos cosas, para poder cambiar textos o fotos en el
    # servidor sin volver a generar el archivo. Salió caro: si en public_html
    # quedaba un teve-config.js de una versión anterior, ese ganaba y el sitio
    # mostraba el contenido viejo sobre el diseño nuevo, sin ningún aviso.
    # Un archivo único tiene que ser exactamente lo que dice ser: lo que está
    # adentro es lo que se ve, sin importar qué más haya en la carpeta.
    # La etiqueta lleva ?v=… para que el navegador no sirva una copia vieja,
    # así que se busca por patrón y no por texto exacto.
    for archivo, contenido in (('teve-config.js', config), ('teve-fotos.js', fotos)):
        patron = re.compile(r'<script src="/%s(?:\?v=[^"]*)?"></script>' % re.escape(archivo))
        if not patron.search(html):
            raise SystemExit('No se encontró la etiqueta de %s en index.html' % archivo)
        html = patron.sub(lambda m: '<script>\n' + contenido + '\n</script>', html, count=1)

    destino = RAIZ / 'dist'
    destino.mkdir(exist_ok=True)
    salida = destino / 'index.html'
    salida.write_text(html, encoding='utf-8')
    print('Listo: dist/index.html (%.0f KB)' % (salida.stat().st_size / 1024))


if __name__ == '__main__':
    main()
