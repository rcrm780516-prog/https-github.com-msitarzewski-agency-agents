/* ==========================================================================
   TEVE TRANSFERS & TOURS — ARCHIVO DE FOTOGRAFÍAS
   ==========================================================================

   Este archivo existe para UNA sola cosa: pegar las fotos del sitio.
   Cada renglón dice exactamente dónde sale la foto y de qué medida va.

   No necesitas tocar teve-config.js ni index.html para poner imágenes.

   --------------------------------------------------------------------------
   CÓMO SE LLENA
   --------------------------------------------------------------------------
   1) Sube tus fotos por FTP o por el Administrador de archivos de Hostinger
      a la carpeta  public_html/img/

   2) Escribe la ruta entre comillas, empezando SIEMPRE con una barra:

          hero: "/img/portada-cancun.jpg",

      La barra del inicio es obligatoria: sin ella la foto no carga en las
      páginas en español (/es/...) ni en portugués (/pt/...).

   3) Sube este archivo actualizado y listo. No hay que hacer nada más.

   --------------------------------------------------------------------------
   OTRAS DOS FORMAS DE PONER UNA FOTO
   --------------------------------------------------------------------------
   • Si ya está publicada en internet:
        hero: "https://misitio.com/foto.jpg",

   • Incrustada dentro del código (no necesitas subir el archivo):
        conviértela en https://www.base64-image.de y pega el resultado:
        hero: "data:image/jpeg;base64,/9j/4AAQSkZJRg...",

   --------------------------------------------------------------------------
   LO QUE PASA SI DEJAS UN ESPACIO VACÍO ("")
   --------------------------------------------------------------------------
   No se rompe nada. Ese lugar muestra un degradado animado con los colores
   de la marca. Puedes ir subiendo fotos de a poco, sin prisa.

   --------------------------------------------------------------------------
   ANTES DE SUBIR CADA FOTO
   --------------------------------------------------------------------------
   • Compárala en  https://squoosh.app  y déjala por debajo de 300 KB.
     Una foto de 4 MB directa de la cámara hace lentísima la página, y
     Google castiga la lentitud en el posicionamiento.
   • Nombre del archivo sin acentos, sin espacios y sin mayúsculas:
        SÍ:  tour-chichen-itza.jpg
        NO:  Tour Chichén Itzá.JPG
   • Formato .jpg para fotografías, .png solo si necesitas transparencia.

   --------------------------------------------------------------------------
   REGLA DE ORO
   --------------------------------------------------------------------------
   Cada renglón termina en coma y el texto va entre comillas dobles.
   Si borras una coma o una comilla, la página sale en blanco. Si eso pasa:
   abre la página, presiona F12, pestaña "Console", y ahí te dice la línea.
   ========================================================================== */

window.TEVE_FOTOS = {

  /* ======================================================================
     1. LOGOTIPO E IMAGEN DE MARCA
     ----------------------------------------------------------------------
     El logotipo YA ESTÁ PUESTO y funcionando. Solo cambia estas rutas si
     el diseñador te entrega una versión nueva o en vectorial (.svg).
     ====================================================================== */
  marca: {

    // Logotipo de la barra de navegación (arriba, fondo blanco).
    // Fondo transparente · 800 px de ancho mínimo · PNG o SVG
    logo: "/img/logo-teve.png",

    // Logotipo para fondos oscuros: portada y pie de página.
    // Anillo y letras en BLANCO, guacamaya en azul · transparente
    logoBlanco: "/img/logo-teve-blanco.png",

    // Ícono de la pestaña del navegador y de "agregar a inicio" en iPhone.
    // Cuadrado · 256x256 px · debe leerse bien en miniatura
    favicon: "/img/favicon.png",

    // ⭐ IMPORTANTE PARA VENTAS: la imagen que aparece cuando alguien
    // comparte tevetours.com por WhatsApp, Facebook o Instagram.
    // Si está vacía, el enlace se ve gris y sin gancho.
    // 1200x630 px HORIZONTAL · pon una foto atractiva con el logo encima
    imagenRedes: ""
  },

  /* ======================================================================
     2. LAS CUATRO FOTOS GRANDES DEL SITIO
     ----------------------------------------------------------------------
     Son las más importantes. Si solo vas a conseguir cuatro fotos
     profesionales, que sean estas.
     ====================================================================== */
  imagenes: {

    // ⭐ PORTADA — lo primero que ve el visitante al entrar.
    // Detrás del logotipo animado y del título "Experience Cancun Your Way".
    // Se le pone un velo oscuro encima, así que funciona mejor una foto
    // luminosa: playa, mar turquesa, la camioneta con el hotel de fondo.
    // 1920x1080 px HORIZONTAL
    hero: "",

    // Franja "¿Qué nos hace diferentes?" (sale en Inicio y en Conoce a Tim).
    // Es una banda ancha y baja: la parte de arriba y de abajo se recortan.
    // Deja el motivo principal al centro.
    // 1920x800 px HORIZONTAL Y BAJA
    porQue: "",

    // Foto de Tim. Se recorta en CÍRCULO, así que debe ser cuadrada y con
    // la cara centrada, ni muy pegada al borde ni muy lejos.
    // Retrato sonriendo, de día, junto a la camioneta funciona muy bien.
    // 800x800 px CUADRADA
    timFoto: "",

    // Fondo de la página de Contacto (opcional).
    // 1920x800 px HORIZONTAL
    contacto: ""
  },

  /* ======================================================================
     3. SERVICIOS  —  6 fotos
     ----------------------------------------------------------------------
     Salen en las tarjetas de "Nuestros Servicios de Transportación"
     (portada) y en la página Servicios.
     TODAS: 800x500 px HORIZONTAL
     ====================================================================== */
  servicios: {

    // "Transfer Privado Aeropuerto ↔ Hotel"
    // Ideal: recepción con letrero en la sala de llegadas, o la camioneta
    // en la puerta del hotel con las maletas.
    transfer: "",

    // "Chofer Privado por Día"
    // Ideal: interior de la van limpia, o el chofer abriendo la puerta.
    chofer: "",

    // "Transportación para Grupos"
    // Ideal: la unidad grande, o un grupo subiendo a la camioneta.
    grupos: "",

    // "Catamarán a Isla Mujeres"
    // Ideal: el catamarán navegando, agua turquesa.
    catamaran: "",

    // "Renta de Yate Privado"
    // Ideal: el yate desde afuera, o la cubierta al atardecer.
    yate: "",

    // "Travel Concierge"
    // Ideal: algo que hable de planeación a la medida: un itinerario, una
    // mesa en restaurante, un atardecer reservado.
    concierge: ""
  },

  /* ======================================================================
     4. TOURS  —  6 fotos
     ----------------------------------------------------------------------
     Salen en "Tours Privados Destacados" (portada) y en la página Tours.
     TODAS: 800x500 px HORIZONTAL
     ====================================================================== */
  tours: {

    // "Chichén Itzá y Cenote con Experiencia Maya"
    chichen: "",

    // "Tulum, Cenote y Playa del Carmen"
    tulum: "",

    // "Catamarán de Lujo a Isla Mujeres"
    isla: "",

    // "Visita a Cenote y Snorkel en Laguna"
    cenote: "",

    // "Akumal: Snorkel con Tortugas y Cenotes"
    akumal: "",

    // "Observación de Monos y Ruinas de Cobá"
    coba: ""
  },

  /* ======================================================================
     5. DESTINOS  —  4 fotos
     ----------------------------------------------------------------------
     Salen en la página Destinos.
     ⚠ OJO: estas tarjetas son ALTAS, no anchas. Una foto horizontal se
     recorta a los lados y se ve mal. Usa fotos verticales o recórtalas.
     TODAS: 800x1000 px VERTICAL
     ====================================================================== */
  destinos: {

    // Tarjeta "Chichén Itzá"
    chichen: "",

    // Tarjeta "Tulum"
    tulum: "",

    // Tarjeta "Isla Mujeres"
    isla: "",

    // Tarjeta "Bacalar & Holbox"
    bacalar: ""
  },

  /* ======================================================================
     6. BLOG  —  3 fotos
     ----------------------------------------------------------------------
     Salen en "Planea tu Viaje a Cancún" (portada) y en la página Blog.
     TODAS: 800x500 px HORIZONTAL
     ====================================================================== */
  blog: {

    // "Transfer Privado vs Compartido: ¿Cuál te conviene?"
    "transfer-vs-shared": "",

    // "Chichén Itzá Privado desde Cancún: Guía Completa 2026"
    "chichen-guide": "",

    // "Estadías de Invierno en Cancún: Guía de Transporte"
    "snowbirds": ""
  }
};
