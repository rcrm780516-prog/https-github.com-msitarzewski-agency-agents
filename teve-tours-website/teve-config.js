/* ==========================================================================
   TEVE TRANSFERS & TOURS — ARCHIVO DE PERSONALIZACIÓN (EMBEBEDOR)
   ==========================================================================

   ESTE ES EL ÚNICO ARCHIVO QUE NECESITAS EDITAR.

   Aquí se cambian: el logotipo, TODAS las imágenes, los teléfonos,
   el WhatsApp, los correos, las redes sociales, los precios,
   los tours, los destinos, las reseñas y los artículos del blog.

   NO necesitas tocar index.html para nada.

   --------------------------------------------------------------------------
   CÓMO PONER UNA IMAGEN O EL LOGOTIPO — 3 FORMAS, todas válidas:
   --------------------------------------------------------------------------

   FORMA 1 (RECOMENDADA) — Subir el archivo a Hostinger:
       Sube tus fotos a la carpeta  public_html/img/
       y aquí escribes la ruta:      "img/logo.png"
                                     "img/hero-cancun.jpg"

   FORMA 2 — Usar una imagen que ya está en internet:
       "https://www.tevetours.com/wp-content/uploads/foto.jpg"
       (también sirve un enlace de Google Drive público, Cloudinary, etc.)

   FORMA 3 — Incrustar la imagen dentro de este mismo archivo (base64):
       "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg..."
       Útil para el logo, así viaja dentro del código y nunca se rompe.
       Convierte tu archivo en: https://www.base64-image.de/

   DEJAR EN BLANCO ("") ES VÁLIDO:
       Si dejas una imagen vacía, la página muestra automáticamente un
       fondo degradado animado con los colores de la marca. El sitio nunca
       se ve roto ni con imágenes rotas. Puedes ir subiendo fotos poco a poco.

   --------------------------------------------------------------------------
   MEDIDAS RECOMENDADAS DE LAS IMÁGENES
   --------------------------------------------------------------------------
       Logo (fondo claro).......... PNG transparente   400 x 120 px
       Logo (fondo oscuro/blanco).. PNG transparente   400 x 120 px
       Favicon..................... PNG                 32 x  32 px
       Hero (portada).............. JPG               1920 x 1080 px
       Servicios................... JPG                800 x  500 px
       Tours....................... JPG                800 x  500 px
       Destinos.................... JPG                800 x 1000 px (vertical)
       Foto de Tim................. JPG                800 x  800 px
       Imagen para redes (OG)...... JPG               1200 x  630 px

   Comprime las fotos antes de subirlas en https://squoosh.app
   (bajo 300 KB cada una) para que la página cargue rápido en Google.
   ========================================================================== */

window.TEVE_CONFIG = {

  /* ======================================================================
     1. MARCA Y LOGOTIPO
     ====================================================================== */
  marca: {
    nombre: "TEVE",
    nombreCompleto: "TEVE Transfers & Tours",
    tagline: "Transfers & Tours",
    dominio: "https://www.tevetours.com",

    // ---- LOGOTIPO ----
    // Déjalo en "" y se muestra el logotipo de texto "TEVE / Transfers & Tours".
    // Pon la ruta de tu archivo para usar el logotipo real.
    // El logotipo oficial de TEVE está incluido como SVG vectorial (nítido en
    // cualquier tamaño y pantalla). Si prefieres tu archivo PNG original,
    // súbelo a img/ y cambia la ruta aquí — no hay que tocar nada más.
    logo:        "img/logo-teve.svg",         // barra de navegación (fondo blanco)
    logoBlanco:  "img/logo-teve-blanco.svg",  // pie de página oscuro
    logoAlto:    "56", // altura del logo en píxeles dentro de la barra de navegación

    favicon:     "img/favicon.svg",   // ícono de la pestaña del navegador
    imagenRedes: ""    // ej. "img/og-teve.jpg" — la que se ve al compartir en Facebook/WhatsApp
  },

  /* ======================================================================
     2. CONTACTO  ← CAMBIA ESTO PRIMERO, ES LO MÁS IMPORTANTE
     ====================================================================== */
  contacto: {
    // WhatsApp: SOLO NÚMEROS, con código de país, sin +, sin espacios, sin guiones.
    // México: 52 + 1 + LADA + número.  Ejemplo real: "5219981234567"
    whatsapp: "529980000000",

    // Mensaje que aparece ya escrito cuando el visitante abre WhatsApp.
    whatsappTexto: "¡Hola! Quiero información de un servicio privado en Cancún.",

    email: "reservas@tevetours.com",

    // Teléfonos que se muestran en el pie de página.
    // Puedes agregar o quitar los que quieras.
    telefonos: [
      { etiqueta: "México",   numero: "+52 998 000 0000", marcar: "+529980000000" },
      { etiqueta: "USA",      numero: "(786) 409-0545",   marcar: "+17864090545"  },
      { etiqueta: "Sin costo", numero: "(800) 704-5202",  marcar: "+18007045202"  }
    ],

    direccion: {
      calle: "Zona Hotelera",
      ciudad: "Cancún",
      estado: "Quintana Roo",
      cp: "77500",
      pais: "MX"
    },

    horario: "Disponibles 24/7, los 365 días del año"
  },

  /* ======================================================================
     3. REDES SOCIALES
     Deja en "" las que no uses y desaparecen solas del sitio.
     ====================================================================== */
  redes: {
    facebook:    "https://www.facebook.com/profile.php?id=61550914251672",
    instagram:   "https://www.instagram.com/tevetransferstours",
    tripadvisor: "https://www.tripadvisor.com.au/Attraction_Review-g150807-d28028440-Reviews-Teve_Transfers_Tours-Cancun_Yucatan_Peninsula.html",
    youtube:     "",
    tiktok:      ""
  },

  /* ======================================================================
     4. IMÁGENES PRINCIPALES
     ====================================================================== */
  imagenes: {
    hero:    "",  // Portada. ej. "img/hero-cancun.jpg"  (1920x1080)
    timFoto: "",  // Foto de Tim. ej. "img/tim.jpg"      (800x800)
    porQue:  "",  // Fondo de la sección "¿Por qué TEVE?" (1920x800)
    contacto:""   // Fondo de la sección de contacto (opcional)
  },

  /* ======================================================================
     5. TEXTOS DE LA PORTADA
     ====================================================================== */
  portada: {
    titulo: "Vive Cancún<br>a tu Manera",
    subtitulo: "Transportación privada y tours a la medida en Cancún y Riviera Maya. Un solo chofer de confianza, del aeropuerto a tus recuerdos.",

    // Las 4 cifras de confianza que aparecen bajo el buscador.
    metricas: [
      { numero: "500+", texto: "Viajeros Felices" },
      { numero: "5.0★", texto: "TripAdvisor" },
      { numero: "8+",   texto: "Años en Cancún" },
      { numero: "USD",  texto: "CAD y AUD aceptados" }
    ]
  },

  /* ======================================================================
     6. SERVICIOS
     Agrega, quita o reordena bloques libremente.
     "imagen" acepta ruta, URL o "" (degradado automático).
     ====================================================================== */
  servicios: [
    {
      titulo: "Transfer Privado Aeropuerto ↔ Hotel",
      texto: "Recepción con letrero en el aeropuerto, ayuda con equipaje y vehículo con aire acondicionado. Tu conductor te espera aunque tu vuelo se retrase.",
      desde: "Desde $45 USD por trayecto",
      imagen: "",
      destacado: true   // true = también aparece en la portada
    },
    {
      titulo: "Chofer Privado por Día",
      texto: "Van de lujo y chofer bilingüe a tu disposición por horas o el día completo. Playas, restaurantes y compras a tu ritmo.",
      desde: "Desde $180 USD por día",
      imagen: "",
      destacado: true
    },
    {
      titulo: "Transportación para Grupos",
      texto: "¿Planeas una conferencia, boda o evento corporativo? Contamos con flotilla y logística a la medida para grupos grandes.",
      desde: "Desde $650 USD",
      imagen: "",
      destacado: true
    },
    {
      titulo: "Catamarán a Isla Mujeres",
      texto: "Zarpa hacia Isla Mujeres con snorkel incluido y tiempo libre en la isla. Todo coordinado por tu chofer TEVE.",
      desde: "Desde $95 USD",
      imagen: "",
      destacado: false
    },
    {
      titulo: "Renta de Yate Privado",
      texto: "Desde una lancha deportiva hasta un catamarán de lujo. Día de pesca, atardecer o isla privada, tú decides.",
      desde: "Desde $650 USD medio día",
      imagen: "",
      destacado: false
    },
    {
      titulo: "Travel Concierge",
      texto: "Planeación completa de tu itinerario: reservaciones, actividades y recomendaciones locales de quien realmente vive aquí.",
      desde: "Cotización personalizada",
      imagen: "",
      destacado: false
    }
  ],

  /* ======================================================================
     7. TOURS PRIVADOS
     Los 3 primeros se muestran también en la portada.
     ====================================================================== */
  tours: [
    {
      titulo: "Chichén Itzá y Cenote con Experiencia Maya",
      texto: "Vive una aventura visitando una de las 7 maravillas del mundo, un cenote y aprende sobre la cocina maya.",
      precio: "$2,197 MXN",
      duracion: "Día completo",
      imagen: ""
    },
    {
      titulo: "Tulum, Cenote y Playa del Carmen",
      texto: "Conoce Tulum, una de las ciudades mayas frente al mar más impresionantes, además de un cenote y la 5ta Avenida.",
      precio: "$1,723 MXN",
      duracion: "Día completo",
      imagen: ""
    },
    {
      titulo: "Catamarán de Lujo a Isla Mujeres",
      texto: "Navega entre Cancún e Isla Mujeres, con snorkel y tiempo libre en la isla.",
      precio: "$2,039 MXN",
      duracion: "6 horas",
      imagen: ""
    },
    {
      titulo: "Visita a Cenote y Snorkel en Laguna",
      texto: "Sumérgete en agua cristalina de cenote y conoce una laguna espectacular lejos de las multitudes.",
      precio: "$1,407 MXN",
      duracion: "Medio día",
      imagen: ""
    },
    {
      titulo: "Akumal: Snorkel con Tortugas y Cenotes",
      texto: "Nada junto a tortugas marinas en Akumal y explora un cenote con estalactitas impresionantes.",
      precio: "$1,953 MXN",
      duracion: "Día completo",
      imagen: ""
    },
    {
      titulo: "Observación de Monos y Visita a Cobá",
      texto: "Descubre la selva maya, observa monos araña y visita la enigmática ciudad de Cobá.",
      precio: "$9,322 MXN",
      duracion: "Día completo",
      imagen: ""
    }
  ],

  /* ======================================================================
     8. DESTINOS
     Estas tarjetas son verticales (fotos 800x1000 se ven mejor).
     ====================================================================== */
  destinos: [
    {
      nombre: "Chichén Itzá",
      duracion: "Medio día o día completo",
      texto: "2.5 hrs desde Cancún · Guía privado incluido",
      imagen: "",
      paleta: "jungle"    // fondo automático si no hay imagen: jungle / coastal / ocean / lagoon
    },
    {
      nombre: "Tulum",
      duracion: "Excursión de un día",
      texto: "1.5 hrs desde Cancún · Ruinas frente al mar y cenotes",
      imagen: "",
      paleta: "coastal"
    },
    {
      nombre: "Isla Mujeres",
      duracion: "Día completo",
      texto: "30 min en ferry · Catamarán privado disponible",
      imagen: "",
      paleta: "ocean"
    },
    {
      nombre: "Bacalar y Holbox",
      duracion: "Con opción de noche",
      texto: "3-4 hrs · La magia fuera del camino turístico",
      imagen: "",
      paleta: "lagoon"
    }
  ],

  /* ======================================================================
     9. PÁGINA DE TIM (marca personal)
     ====================================================================== */
  tim: {
    titulo: "Tim — Tu Persona de Confianza en Cancún",
    citaDestacada: "Tim fue mucho más que un chofer, se volvió parte de nuestras vacaciones. Sabía exactamente a dónde llevarnos y todo fluyó sin esfuerzo.",
    citaAutor: "Sarah M., Toronto · TripAdvisor",
    biografia: "Tim lleva más de 8 años guiando viajeros por Cancún y la Riviera Maya. Bilingüe, conectado con la cultura local y genuinamente comprometido con hacer inolvidable tu viaje — por eso su nombre aparece de forma espontánea en cientos de reseñas de cinco estrellas.",
    botonTexto: "Escríbele a Tim por WhatsApp"
  },

  /* ======================================================================
     10. RESEÑAS
     ====================================================================== */
  resenas: [
    {
      texto: "Tim se encargó de todo: aeropuerto, Chichén Itzá, cenote, comida. Nunca sentimos prisa y sabía cada rincón para evitar las multitudes.",
      nombre: "Jennifer K.",
      lugar: "Houston, Texas 🇺🇸"
    },
    {
      texto: "Como canadienses que pasamos 6 semanas cada invierno en Cancún, encontrar transportación confiable era nuestra mayor preocupación. Tim la resolvió por completo.",
      nombre: "Robert & Linda S.",
      lugar: "Vancouver, BC 🇨🇦"
    },
    {
      texto: "Llegamos desde Sydney sin saber nada de la zona. Tim se volvió nuestro concierge no oficial. Ya lo recomendé a cuatro amigos.",
      nombre: "Michael P.",
      lugar: "Sydney, Australia 🇦🇺"
    }
  ],

  /* ======================================================================
     11. BLOG
     Cuando escribas el artículo completo, pon la dirección en "enlace".
     Mientras esté en "", el botón no lleva a ningún lado.
     ====================================================================== */
  blog: [
    {
      categoria: "Aeropuerto y Traslados",
      titulo: "Transfer Privado vs Compartido: ¿Cuál te conviene?",
      texto: "Comparamos ambas opciones con datos reales para que decidas antes de reservar tu próximo viaje.",
      imagen: "",
      enlace: ""
    },
    {
      categoria: "Tours Privados",
      titulo: "Chichén Itzá Privado desde Cancún: Guía Completa 2026",
      texto: "Hora ideal de llegada, qué llevar, la mejor parada para comer y por qué un guía privado cambia la experiencia.",
      imagen: "",
      enlace: ""
    },
    {
      categoria: "Para Viajeros Canadienses",
      titulo: "Estadías de Invierno en Cancún: Guía de Transporte",
      texto: "Todo sobre transportación privada recurrente para estadías largas de 4 a 8 semanas.",
      imagen: "",
      enlace: ""
    }
  ],

  /* ======================================================================
     12. SEO — títulos y descripciones de cada sección
     Google lee esto. Máximo 60 caracteres en título, 155 en descripción.
     ====================================================================== */
  seo: {
    home: {
      titulo: "Transportación Privada y Tours en Cancún | TEVE Transfers & Tours",
      descripcion: "Transfers privados del aeropuerto de Cancún, chofer privado por día y tours a la medida en Riviera Maya. Reserva directo por WhatsApp con Tim."
    },
    servicios: {
      titulo: "Servicios de Transportación Privada en Cancún | TEVE",
      descripcion: "Transfer aeropuerto-hotel, chofer privado por día, transportación para grupos, catamarán y renta de yates en Cancún y Riviera Maya."
    },
    tours: {
      titulo: "Tours Privados desde Cancún | Chichén Itzá, Tulum, Isla Mujeres",
      descripcion: "Tours privados a Chichén Itzá, Tulum, Cobá, Akumal e Isla Mujeres. Vehículo privado, guía bilingüe y horarios flexibles a tu ritmo."
    },
    destinos: {
      titulo: "Destinos desde Cancún: Tulum, Chichén Itzá, Bacalar | TEVE",
      descripcion: "Descubre a dónde te llevamos desde Cancún: Chichén Itzá, Tulum, Isla Mujeres, Bacalar y Holbox con transporte privado puerta a puerta."
    },
    tim: {
      titulo: "Conoce a Tim, tu Chofer Privado de Confianza en Cancún",
      descripcion: "Más de 8 años guiando viajeros por Cancún y Riviera Maya. Bilingüe, local y con cientos de reseñas de cinco estrellas a su nombre."
    },
    blog: {
      titulo: "Blog de Viajes: Guías de Cancún y Riviera Maya | TEVE",
      descripcion: "Guías prácticas para planear tu viaje a Cancún: traslados, tours privados, estadías largas y consejos de un local."
    },
    contacto: {
      titulo: "Contacto y Cotizaciones | TEVE Transfers & Tours Cancún",
      descripcion: "Cotiza tu traslado o tour privado en Cancún. Respuesta rápida por WhatsApp, correo o teléfono. Atendemos todo el año."
    }
  },

  /* ======================================================================
     13. WIDGETS SOCIALES
     ----------------------------------------------------------------------
     El sello de TripAdvisor se carga desde los servidores de TripAdvisor y se
     actualiza solo. Los datos salen del código que TripAdvisor entrega en su
     panel: locationId es el número que aparece como d######## en tu enlace.

     Para ocultar cualquier widget, pon  activo: false.
     ====================================================================== */
  widgets: {
    tripadvisor: {
      activo:     true,
      locationId: "28028440",   // el d28028440 de tu enlace de TripAdvisor
      uniq:       "663",        // identificador del widget que da TripAdvisor
      idioma:     "en_AU",      // cámbialo a "es" cuando tengas el sello en español
      anio:       "2026"        // año del sello Travelers' Choice
    },
    // Facebook e Instagram se muestran como tarjetas que enlazan al perfil.
    // No cargan scripts de terceros ni cookies, así el sitio sigue siendo
    // rápido y no arrastra problemas de privacidad ni de Core Web Vitals.
    facebook:  { activo: true },
    instagram: { activo: true }
  },

  /* ======================================================================
     14. ANALÍTICA (opcional — déjalo en "" si aún no lo tienes)
     ====================================================================== */
  analitica: {
    googleAnalytics: "",   // ej. "G-XXXXXXXXXX"
    googleTagManager: "",  // ej. "GTM-XXXXXXX"
    facebookPixel: ""      // ej. "123456789012345"
  }
};
