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
    # Se INCRUSTA el contenido y ADEMÁS se conserva la etiqueta original.
    # Así el archivo funciona solo, pero si subes un teve-config.js o un
    # teve-fotos.js al servidor, esos ganan y el sitio los usa.
    # (Si no existen, el navegador simplemente no carga nada y quedan los
    #  valores incrustados: el sitio nunca se queda sin datos.)
    for etiqueta, contenido in (('<script src="/teve-config.js"></script>', config),
                                ('<script src="/teve-fotos.js"></script>', fotos)):
        if etiqueta not in html:
            raise SystemExit('No se encontró %s en index.html' % etiqueta)
        html = html.replace(etiqueta, '<script>\n' + contenido + '\n</script>\n' + etiqueta)

    destino = RAIZ / 'dist'
    destino.mkdir(exist_ok=True)
    salida = destino / 'index.html'
    salida.write_text(html, encoding='utf-8')
    print('Listo: dist/index.html (%.0f KB)' % (salida.stat().st_size / 1024))


if __name__ == '__main__':
    main()
