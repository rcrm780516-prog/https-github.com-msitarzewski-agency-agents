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

RAIZ = pathlib.Path(__file__).parent
IMAGENES = ('/img/logo-teve.png', '/img/logo-teve-blanco.png', '/img/favicon.png')


def a_data_uri(ruta):
    datos = (RAIZ / ruta.lstrip('/')).read_bytes()
    tipo = 'image/png' if ruta.lower().endswith('.png') else 'image/svg+xml'
    return 'data:%s;base64,%s' % (tipo, base64.b64encode(datos).decode())


def main():
    config = (RAIZ / 'teve-config.js').read_text(encoding='utf-8')
    fotos = (RAIZ / 'teve-fotos.js').read_text(encoding='utf-8')
    for ruta in IMAGENES:
        uri = a_data_uri(ruta)
        config = config.replace('"%s"' % ruta, '"%s"' % uri)
        fotos = fotos.replace('"%s"' % ruta, '"%s"' % uri)

    html = (RAIZ / 'index.html').read_text(encoding='utf-8')
    # La etiqueta original se SUSTITUYE por el contenido, no se conserva.
    #
    # Antes se dejaban las dos cosas, para poder cambiar textos o fotos en el
    # servidor sin volver a generar el archivo. Salió caro: si en public_html
    # quedaba un teve-config.js de una versión anterior, ese ganaba y el sitio
    # mostraba el contenido viejo sobre el diseño nuevo, sin ningún aviso.
    # Un archivo único tiene que ser exactamente lo que dice ser: lo que está
    # adentro es lo que se ve, sin importar qué más haya en la carpeta.
    for etiqueta, contenido in (('<script src="/teve-config.js"></script>', config),
                                ('<script src="/teve-fotos.js"></script>', fotos)):
        if etiqueta not in html:
            raise SystemExit('No se encontró %s en index.html' % etiqueta)
        html = html.replace(etiqueta, '<script>\n' + contenido + '\n</script>')

    destino = RAIZ / 'dist'
    destino.mkdir(exist_ok=True)
    salida = destino / 'index.html'
    salida.write_text(html, encoding='utf-8')
    print('Listo: dist/index.html (%.0f KB)' % (salida.stat().st_size / 1024))


if __name__ == '__main__':
    main()
