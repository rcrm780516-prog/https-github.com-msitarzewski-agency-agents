========================================================
  DR. VÍCTOR SEPÚLVEDA — SITIO WEB PROFESIONAL
  Traumatólogo y Ortopedista en Monterrey, NL
========================================================

CONTENIDO DEL PAQUETE
----------------------
  index.html        → Página principal (con marcadores de foto)
  embed_images.py   → Script Python para incrustar las fotos
  sitemap.xml       → Mapa del sitio para Google
  robots.txt        → Instrucciones para buscadores
  404.html          → Página de error personalizada
  .htaccess         → Configuración del servidor Apache
  README.txt        → Este archivo


PASO 1 — INCRUSTAR LAS FOTOGRAFÍAS
------------------------------------
Tienes 9 fotos + el logo que debes incrustar en el sitio.

1. Coloca tus fotografías en esta misma carpeta con estos
   nombres exactos (puedes usar .jpg, .jpeg, .png o .webp):

   logo.jpg      → Logotipo del Dr. Sepúlveda
                   (aparece automáticamente en blanco en el
                    encabezado; se recomienda PNG sin fondo)

   foto_1.jpg    → Foto en traje quirúrgico azul
                   (portada / sección de inicio del sitio)

   foto_2.jpg    → Foto en bata blanca en consultorio
                   (sección "Acerca del Doctor")

   foto_3.jpg    → Cirugía — Prótesis de rodilla y cadera
                   (tarjeta de servicio 1)

   foto_4.jpg    → Cirugía — Artroscopia de rodilla y hombro
                   (tarjeta de servicio 2)

   foto_5.jpg    → Cirugía — Fracturas y traumatología
                   (tarjeta de servicio 3)

   foto_6.jpg    → Cirugía — Lesiones deportivas y mano
                   (tarjeta de servicio 4)

   foto_7.jpg    → Cirugía para galería (imagen principal grande)

   foto_8.jpg    → Cirugía para galería (imagen pequeña 1)

   foto_9.jpg    → Cirugía para galería (imagen pequeña 2)

2. Asegúrate de tener Python 3 instalado. Para instalar Pillow:
      pip install Pillow

3. Ejecuta el script:
      python embed_images.py

4. Se generará index-final.html con las fotos ya incrustadas.

5. Renombra index-final.html → index.html (reemplaza el anterior).

NOTA SOBRE EL LOGO: El sitio aplica automáticamente el filtro
"blanco" al logo para que se vea correctamente sobre el
encabezado azul marino. Para mejores resultados usa un PNG
con fondo transparente.


PASO 2 — ACTUALIZAR EL DOMINIO EN SITEMAP
-------------------------------------------
Abre sitemap.xml con un editor de texto y reemplaza:
   drvictorsepulveda.com
por tu dominio real si es diferente.

Haz lo mismo en .htaccess si cambias el dominio.


PASO 3 — SUBIR A HOSTINGER
----------------------------
En el panel de Hostinger → Administrador de archivos → public_html

Sube TODOS estos archivos:
  ✓ index.html        (la versión final con fotos incrustadas)
  ✓ sitemap.xml
  ✓ robots.txt
  ✓ 404.html
  ✓ .htaccess

NOTA: .htaccess es un archivo oculto — activa "Mostrar archivos
ocultos" en el administrador de archivos de Hostinger.

NO subas estos archivos al servidor:
  ✗ embed_images.py   (script local, no debe estar en el servidor)
  ✗ README.txt        (este archivo)
  ✗ Las fotografías sueltas (ya están incrustadas en el HTML)


PASO 4 — CONFIGURAR SSL EN HOSTINGER
--------------------------------------
En el panel de Hostinger → SSL → Instalar Let's Encrypt (gratis)
El .htaccess redirige automáticamente HTTP → HTTPS.


PASO 5 — REGISTRAR EN GOOGLE SEARCH CONSOLE
---------------------------------------------
1. Ve a search.google.com/search-console
2. Agrega tu dominio
3. Envía la URL del sitemap:
      https://www.drvictorsepulveda.com/sitemap.xml


INFORMACIÓN DEL SITIO
-----------------------
Doctor:       Dr. Víctor Sepúlveda
Especialidad: Traumatología y Ortopedia
Ubicación:    Centro Médico González
              Dra. Fernando Guajardo No. 160, Consultorio 203
              Col. Los Doctores, Monterrey NL, CP 64710
WhatsApp:     81 2202 6068
Cédula prof.: 12556748
Cédula esp.:  15582450
COFEPRIS:     2619012002A00339

========================================================
