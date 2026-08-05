========================================================
  DR. VÍCTOR SEPÚLVEDA — SITIO WEB PROFESIONAL
  Traumatólogo y Ortopedista en Monterrey, NL
========================================================

CONTENIDO DEL PAQUETE
----------------------
  index.html        → Página principal (con placeholders de fotos)
  embed_images.py   → Script para incrustar tus fotos en el HTML
  sitemap.xml       → Mapa del sitio para Google
  robots.txt        → Instrucciones para buscadores
  404.html          → Página de error personalizada
  .htaccess         → Configuración del servidor Apache
  README.txt        → Este archivo

IMPORTANTE: El archivo index.html contiene marcadores de texto
en lugar de las fotos reales. Debes ejecutar embed_images.py
para incrustar tus fotografías antes de subir el sitio.


PASO 1 — INCRUSTAR LAS FOTOGRAFÍAS
------------------------------------
1. Coloca tus fotografías en esta misma carpeta con estos nombres exactos:

   foto_perfil_azul.jpg   → Foto en ropa quirúrgica azul (portada del sitio)
   foto_perfil_bata.jpg   → Foto en bata blanca en consultorio
   foto_cirugia_1.jpg     → Cirugía con artroscopio
   foto_cirugia_2.jpg     → Cirugía de rodilla closeup
   foto_cirugia_3.jpg     → Cirugía con gorro Biotechsa
   foto_cirugia_4.jpg     → Cirugía articulación doblada
   foto_cirugia_5.jpg     → Equipo quirúrgico con luces de OR
   foto_cirugia_6.jpg     → Equipo quirúrgico letrero Quirofano
   foto_cirugia_7.jpg     → Doctor y colega con articulación

   Puedes usar .jpg, .jpeg, .png o .webp — el script lo detecta.

2. Asegúrate de tener Python 3 instalado. Para instalar Pillow:
      pip install Pillow

3. Ejecuta el script:
      python embed_images.py

4. Se generará index-final.html con las fotos ya incrustadas.

5. Renombra index-final.html → index.html (reemplaza el anterior).


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

NOTA: .htaccess es un archivo oculto — activa "Mostrar archivos ocultos"
en el administrador de archivos de Hostinger para verlo.

NO subas estos archivos al servidor:
  ✗ embed_images.py   (script local, no debe estar en el servidor)
  ✗ README.txt        (este archivo)
  ✗ las fotografías sueltas (ya están incrustadas en el HTML)


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

SOPORTE
-------
Si tienes dudas sobre la configuración, contacta a tu agencia web
o al soporte técnico de Hostinger en hpanel.hostinger.com.

========================================================
