#!/usr/bin/env python3
"""
Genera index-demo.html: una copia de index.html con el config y los
logotipos incrustados dentro del propio archivo.

Sirve para enseñar el sitio sin servidor y sin subir nada: se abre con
doble clic desde el escritorio, una memoria USB o adjunto en un correo.

    python3 construir-demo.py

Vuelve a ejecutarlo cada vez que cambies index.html o teve-config.js.
Lo que sube a Hostinger sigue siendo index.html + teve-config.js + img/,
no este archivo.
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
    for ruta in IMAGENES:
        config = config.replace('"%s"' % ruta, '"%s"' % a_data_uri(ruta))

    html = (RAIZ / 'index.html').read_text(encoding='utf-8')
    etiqueta = '<script src="/teve-config.js"></script>'
    if etiqueta not in html:
        raise SystemExit('No se encontró la etiqueta del config en index.html')

    html = html.replace(
        etiqueta,
        '<!-- DEMO: el config y el logotipo viajan dentro de este archivo -->\n'
        '<script>\n' + config + '\n</script>'
    )

    salida = RAIZ / 'index-demo.html'
    salida.write_text(html, encoding='utf-8')
    print('Listo: %s (%.0f KB)' % (salida.name, salida.stat().st_size / 1024))


if __name__ == '__main__':
    main()
