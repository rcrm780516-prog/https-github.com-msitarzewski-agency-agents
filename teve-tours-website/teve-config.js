/* ==========================================================================
   TEVE TRANSFERS & TOURS — ARCHIVO DE PERSONALIZACIÓN (EL "EMBEBEDOR")
   ==========================================================================

   Este es el ÚNICO archivo que necesitas editar. No toques index.html.

   Aquí se cambian: el logotipo, TODAS las imágenes, los teléfonos,
   los precios, los textos y el SEO — en los TRES IDIOMAS.

   --------------------------------------------------------------------------
   CÓMO ESTÁ ORGANIZADO
   --------------------------------------------------------------------------
   PARTE A — Datos que NO cambian entre idiomas:
             logotipo, teléfonos, correo, redes sociales, imágenes,
             widgets y analítica. Se editan una sola vez.

   PARTE B — Textos, uno por idioma, dentro de  textos: { en, es, pt }.
             El inglés (en) es la versión original: es el idioma del
             mercado principal (Reino Unido, Australia, Estados Unidos y
             Canadá). El español y el portugués son traducciones.

   --------------------------------------------------------------------------
   CÓMO PONER UNA IMAGEN — hay tres formas, todas válidas
   --------------------------------------------------------------------------
   1) ARCHIVO SUBIDO (lo normal)
      Sube la foto a la carpeta  img/  de tu hosting y escribe la ruta
      empezando con una barra, para que también funcione en /es/ y /pt/:
          "/img/hero-cancun.jpg"

   2) DIRECCIÓN DE INTERNET
      Si la foto ya está publicada en otro lado:
          "https://misitio.com/foto.jpg"

   3) INCRUSTADA (base64)
      Conviértela en https://www.base64-image.de y pega el resultado:
          "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
      Así viaja dentro del código y nunca se rompe. Ideal para el logo.

   Si dejas una imagen en "" el sitio muestra un degradado animado con los
   colores de la marca. Nunca se ve rota ni con el ícono de imagen perdida.
   Las medidas recomendadas están en  img/LEEME.txt

   --------------------------------------------------------------------------
   REGLA DE ORO PARA EDITAR
   --------------------------------------------------------------------------
   El texto va SIEMPRE entre comillas dobles y cada línea termina en coma.
   Si borras una comilla o una coma, la página sale en blanco. Si eso pasa:
   abre la página, presiona F12, pestaña Console, y ahí te dice la línea.
   ========================================================================== */

window.TEVE_CONFIG = {

  /* ==========================================================================
     PARTE A — DATOS COMUNES A LOS TRES IDIOMAS
     ========================================================================== */

  /* ======================================================================
     0. IDIOMAS
     ----------------------------------------------------------------------
     El idioma por defecto es el que ve quien entra a tevetours.com sin
     indicar nada, y el que Google usa como versión principal del sitio.

     Está en inglés a propósito: tus clientes vienen de Reino Unido,
     Australia, Estados Unidos y Canadá.

     Direcciones que genera el sitio:
         Inglés     tevetours.com/            tevetours.com/tours
         Español    tevetours.com/es/         tevetours.com/es/tours
         Portugués  tevetours.com/pt/         tevetours.com/pt/tours

     Para quitar un idioma, bórralo de idiomasActivos y desaparece del
     selector, del mapa del sitio y de las etiquetas hreflang.
     ====================================================================== */
  idiomaPorDefecto: "en",
  idiomasActivos: ["en", "es", "pt"],

  // Detectar el idioma del navegador y redirigir la primera visita.
  // true  = un visitante de Brasil que entra a tevetours.com ve el portugués.
  // false = todos ven inglés hasta que cambian de idioma a mano.
  detectarIdiomaDelNavegador: true,

  /* ======================================================================
     1. MARCA Y LOGOTIPO
     ====================================================================== */
  marca: {
    nombre: "TEVE",
    nombreCompleto: "TEVE Transfers & Tours",
    dominio: "https://www.tevetours.com",

    // Logotipo oficial de TEVE, extraído del tarifario original a 834x840 px.
    // La versión "blanca" lleva el anillo y la tipografía en blanco para que
    // se lea sobre el fondo oscuro de la portada y del pie de página.
    logo:        "/img/logo-teve.png",         // barra de navegación (fondo blanco)
    logoBlanco:  "/img/logo-teve-blanco.png",  // portada y pie de página oscuro
    logoAlto:    "56", // altura del logo en píxeles dentro de la barra

    favicon:     "/img/favicon.png",   // ícono de la pestaña del navegador
    imagenRedes: ""    // ej. "/img/og-teve.jpg" (1200x630) — al compartir en redes
  },

  /* ======================================================================
     2. CONTACTO  ← CAMBIA ESTO PRIMERO, ES LO MÁS IMPORTANTE
     ====================================================================== */
  contacto: {
    // WhatsApp: SOLO NÚMEROS, con código de país, sin +, sin espacios, sin guiones.
    // México: 52 + 1 + LADA + número.
    // Si algún día WhatsApp deja de abrir, prueba quitando el 1: "529987351905".
    whatsapp: "5219987351905",

    email: "reservas@tevetours.com",

    // Teléfonos del pie de página. La etiqueta se traduce sola.
    telefonos: [
      { etiqueta: { en: "Cancun", es: "Cancún", pt: "Cancún" }, numero: "+52 998 735 1905", marcar: "+529987351905" }
    ],

    direccion: {
      calle: "Zona Hotelera",
      ciudad: "Cancún",
      estado: "Quintana Roo",
      cp: "77500",
      pais: "MX"
    }
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
    hero:    "",  // Portada. ej. "/img/hero-cancun.jpg" (1920x1080)
    timFoto: "",  // Foto de Tim. ej. "/img/tim.jpg"      (800x800)
    porQue:  "",  // Fondo de la sección "Why TEVE?"      (1920x800)
    contacto:""   // Fondo de la sección de contacto (opcional)
  },

  /* ======================================================================
     5. IMÁGENES Y PRECIOS DE SERVICIOS, TOURS Y DESTINOS
     ----------------------------------------------------------------------
     Las fotos y los precios son los mismos en los tres idiomas, así que
     viven aquí y NO se repiten en cada traducción. Cada bloque se une con
     su texto por el campo  id  (los ids deben coincidir exactamente).

     El orden de esta lista es el orden en que aparecen en el sitio.
     ====================================================================== */
  servicios: [
    // El precio del transfer sale del tarifario oficial (sección 6).
    // Los demás dicen "cotización personalizada" hasta que nos pases el
    // precio real: es preferible eso a publicar una cifra inventada.
    { id: "transfer",  imagen: "", destacado: true,  desde: { en: "From $50 USD per vehicle", es: "Desde $50 USD por vehículo", pt: "A partir de US$ 50 por veículo" } },
    { id: "chofer",    imagen: "", destacado: true,  desde: { en: "Custom quote", es: "Cotización personalizada", pt: "Orçamento personalizado" } },
    { id: "grupos",    imagen: "", destacado: true,  desde: { en: "Custom quote", es: "Cotización personalizada", pt: "Orçamento personalizado" } },
    { id: "catamaran", imagen: "", destacado: false, desde: { en: "Custom quote", es: "Cotización personalizada", pt: "Orçamento personalizado" } },
    { id: "yate",      imagen: "", destacado: false, desde: { en: "Custom quote", es: "Cotización personalizada", pt: "Orçamento personalizado" } },
    { id: "concierge", imagen: "", destacado: false, desde: { en: "Custom quote", es: "Cotización personalizada", pt: "Orçamento personalizado" } }
  ],

  /* --------------------------------------------------------------------
     TOURS
     --------------------------------------------------------------------
     El tarifario que nos diste solo cubre TRASLADOS, así que los tours
     salen sin precio a propósito: la tarjeta y el buscador dicen
     "cotización personalizada" y mandan al visitante a WhatsApp. Es
     preferible eso a publicar una cifra que no es tuya.

     CUANDO TENGAS LOS PRECIOS REALES, llena estos cuatro campos:

       precio      solo el número, sin signo ni comas: "2197"
                   déjalo en "" y sigue pidiendo cotización
       moneda      "MXN" o "USD"
       porPersona  true  -> el precio se multiplica por los pasajeros
                   false -> precio cerrado por grupo, no se multiplica
       minPax      mínimo de personas para que salga el tour

     Ejemplo ya listo para copiar:
       { id: "chichen", imagen: "", precio: "2197", moneda: "MXN",
         porPersona: true, minPax: 2, duracion: {...} },
     -------------------------------------------------------------------- */
  tours: [
    { id: "chichen",  imagen: "", precio: "", moneda: "MXN", porPersona: true, minPax: 1, duracion: { en: "Full day", es: "Día completo", pt: "Dia inteiro" } },
    { id: "tulum",    imagen: "", precio: "", moneda: "MXN", porPersona: true, minPax: 1, duracion: { en: "Full day", es: "Día completo", pt: "Dia inteiro" } },
    { id: "isla",     imagen: "", precio: "", moneda: "MXN", porPersona: true, minPax: 1, duracion: { en: "6 hours",  es: "6 horas",      pt: "6 horas"     } },
    { id: "cenote",   imagen: "", precio: "", moneda: "MXN", porPersona: true, minPax: 1, duracion: { en: "Half day", es: "Medio día",    pt: "Meio dia"    } },
    { id: "akumal",   imagen: "", precio: "", moneda: "MXN", porPersona: true, minPax: 1, duracion: { en: "Full day", es: "Día completo", pt: "Dia inteiro" } },
    { id: "coba",     imagen: "", precio: "", moneda: "MXN", porPersona: true, minPax: 1, duracion: { en: "Full day", es: "Día completo", pt: "Dia inteiro" } }
  ],

  // Las tarjetas de destino son verticales: las fotos de 800x1000 se ven mejor.
  // paleta = degradado automático si no hay foto: jungle / coastal / ocean / lagoon
  destinos: [
    { id: "chichen", nombre: "Chichén Itzá",     imagen: "", paleta: "jungle"  },
    { id: "tulum",   nombre: "Tulum",            imagen: "", paleta: "coastal" },
    { id: "isla",    nombre: "Isla Mujeres",     imagen: "", paleta: "ocean"   },
    { id: "bacalar", nombre: "Bacalar & Holbox", imagen: "", paleta: "lagoon"  }
  ],

  blog: [
    { id: "transfer-vs-shared", imagen: "", enlace: "" },
    { id: "chichen-guide",      imagen: "", enlace: "" },
    { id: "snowbirds",          imagen: "", enlace: "" }
  ],

  /* ======================================================================
     6. TARIFARIO DE TRASLADOS  (Price Chart)
     ----------------------------------------------------------------------
     Precios en dólares, POR VEHÍCULO (no por persona), tomados del
     tarifario oficial de TEVE. Dos columnas según el tamaño del grupo.

     Para cambiar un precio solo cambias el número: se actualiza solo en
     los tres idiomas. Para agregar una zona, copia un bloque completo.

     zona   = nombre de la zona (no se traduce, son nombres propios)
     rango  = los hoteles que abarca, en los tres idiomas
     ====================================================================== */
  tarifas: {
    moneda: "USD",

    // El tarifario da UN precio por zona. Asumimos que es por trayecto y que
    // el viaje redondo cuesta el doble. Si tus precios ya fueran redondos,
    // pon 1 aquí y la opción "redondo" dejará de multiplicar.
    redondoMultiplicador: 2,

    zonas: [
      { zona: "Cancún", hasta10: "50", hasta18: "90",
        rango: { en: "Downtown & Hotel Zone", es: "Centro y Zona Hotelera", pt: "Centro e Zona Hoteleira" } },
      { zona: "Punta Sam", hasta10: "60", hasta18: "100",
        rango: { en: "Puerto Juárez to Villas del Palmar", es: "Puerto Juárez hasta Villas del Palmar", pt: "Puerto Juárez até Villas del Palmar" } },
      { zona: "Riviera Cancún", hasta10: "60", hasta18: "100",
        rango: { en: "Moon Palace to Bahía Petempich", es: "Moon Palace hasta Bahía Petempich", pt: "Moon Palace até Bahía Petempich" } },
      { zona: "Playa Mujeres", hasta10: "70", hasta18: "110",
        rango: { en: "Marina V&V to Dreams Playa Mujeres", es: "Marina V&V hasta Dreams Playa Mujeres", pt: "Marina V&V até Dreams Playa Mujeres" } },
      { zona: "Costa Mujeres", hasta10: "80", hasta18: "120",
        rango: { en: "Palladium Costa Mujeres to RIU Dunamar", es: "Palladium Costa Mujeres hasta RIU Dunamar", pt: "Palladium Costa Mujeres até RIU Dunamar" } },
      { zona: "Puerto Morelos", hasta10: "60", hasta18: "110",
        rango: { en: "Crococun to Grand Residences", es: "Crococún hasta Grand Residences", pt: "Crococún até Grand Residences" } },
      { zona: "Playa del Carmen Norte", hasta10: "70", hasta18: "120",
        rango: { en: "Nickelodeon to Punta Maroma", es: "Nickelodeon hasta Punta Maroma", pt: "Nickelodeon até Punta Maroma" } },
      { zona: "Playa del Carmen", hasta10: "80", hasta18: "125",
        rango: { en: "Hacienda Tres Ríos to Xcaret", es: "Hacienda Tres Ríos hasta Xcaret", pt: "Hacienda Tres Ríos até Xcaret" } },
      { zona: "Puerto Aventuras", hasta10: "90", hasta18: "135",
        rango: { en: "Punta Venado to Catalonia Royal Tulum", es: "Punta Venado hasta Catalonia Royal Tulum", pt: "Punta Venado até Catalonia Royal Tulum" } },
      { zona: "Akumal", hasta10: "100", hasta18: "160",
        rango: { en: "El Dorado Seaside to Bahía Príncipe", es: "El Dorado Seaside hasta Bahía Príncipe", pt: "El Dorado Seaside até Bahía Príncipe" } },
      { zona: "Riviera Maya Tulum", hasta10: "120", hasta18: "180",
        rango: { en: "Chemuyil to Dreams Tulum", es: "Chemuyil hasta Dreams Tulum", pt: "Chemuyil até Dreams Tulum" } },
      { zona: "Tulum Centro", hasta10: "130", hasta18: "200",
        rango: { en: "Tulum Centro, Aldea Zamá & La Veleta", es: "Tulum Centro, Aldea Zamá y La Veleta", pt: "Tulum Centro, Aldea Zamá e La Veleta" } },
      { zona: "Tulum Hotel Zone", hasta10: "140", hasta18: "210",
        rango: { en: "Boca Paila coast road to Arco Maya", es: "Zona costera de Boca Paila hasta Arco Maya", pt: "Zona costeira de Boca Paila até Arco Maya" } },
      { zona: "Chiquilá (Holbox)", hasta10: "220", hasta18: "340",
        rango: { en: "From / to Cancun or the Riviera Maya", es: "Desde / a Cancún o Riviera Maya", pt: "De / para Cancún ou Riviera Maya" } }
    ],

    // Segunda tabla del tarifario: traslados entre puntos, marinas y parques.
    otros: [
      { hasta10: "50", hasta18: "100",
        zona:  { en: "Transfers within Cancun", es: "Traslados dentro de Cancún", pt: "Transfers dentro de Cancún" },
        rango: { en: "Downtown & Hotel Zone", es: "Centro y Zona Hotelera", pt: "Centro e Zona Hoteleira" } },
      { hasta10: "100", hasta18: "150",
        zona:  { en: "Playa del Carmen ↔ Cancun", es: "Playa del Carmen ↔ Cancún", pt: "Playa del Carmen ↔ Cancún" },
        rango: { en: "Marinas, hotel changes, theme parks", es: "Marinas, cambios de hotel, parques", pt: "Marinas, trocas de hotel, parques" } },
      { hasta10: "160", hasta18: "250",
        zona:  { en: "Tulum Hotel Zone ↔ Cancun", es: "Zona Hotelera Tulum ↔ Cancún", pt: "Zona Hoteleira Tulum ↔ Cancún" },
        rango: { en: "Marinas, hotel changes and more", es: "Marinas, cambios de hotel y más", pt: "Marinas, trocas de hotel e mais" } }
    ]
  },

  /* ======================================================================
     7. WIDGETS SOCIALES
     ----------------------------------------------------------------------
     El sello de TripAdvisor se carga desde los servidores de TripAdvisor y
     se actualiza solo. locationId es el número que aparece como d########
     en tu enlace de TripAdvisor.

     Para ocultar cualquier widget, pon  activo: false.
     ====================================================================== */
  widgets: {
    tripadvisor: {
      activo:     true,
      locationId: "28028440",   // el d28028440 de tu enlace de TripAdvisor
      uniq:       "663",        // identificador del widget que da TripAdvisor
      anio:       "2026",       // año del sello Travelers' Choice
      // Idioma del sello según el idioma que esté viendo el visitante.
      idioma: { en: "en_AU", es: "es", pt: "pt" }
    },
    // Facebook e Instagram se muestran como tarjetas que enlazan al perfil.
    // No cargan scripts de terceros ni cookies, así el sitio sigue siendo
    // rápido y no arrastra problemas de privacidad ni de Core Web Vitals.
    facebook:  { activo: true },
    instagram: { activo: true }
  },

  /* ======================================================================
     8. ANALÍTICA (opcional — déjalo en "" si aún no lo tienes)
     ====================================================================== */
  analitica: {
    googleAnalytics: "",   // ej. "G-XXXXXXXXXX"
    googleTagManager: "",  // ej. "GTM-XXXXXXX"
    facebookPixel: ""      // ej. "123456789012345"
  },

  /* ==========================================================================
     PARTE B — TEXTOS POR IDIOMA
     --------------------------------------------------------------------------
     Cada idioma es un bloque completo e independiente. Para traducir algo,
     busca la misma clave en los tres bloques y cámbiala en cada uno.

     Los  id  de servicios, tours, destinos y blog TIENEN QUE COINCIDIR con
     los de la PARTE A. Si cambias un id, cámbialo en los cuatro lugares.
     ========================================================================== */
  textos: {

    /* ======================================================================
       INGLÉS — VERSIÓN ORIGINAL
       ----------------------------------------------------------------------
       Este es el idioma principal del sitio y el que Google indexa como
       versión canónica. El SEO está escrito para el viajero que planea sus
       vacaciones desde Reino Unido, Australia, Estados Unidos y Canadá:
       busca en inglés, reserva con meses de anticipación y compara
       "private transfer" contra "shared shuttle" antes de decidir.
       ====================================================================== */
    en: {
      meta: {
        nombre: "English",
        bandera: "🇬🇧",
        htmlLang: "en",
        ogLocale: "en_US",
        // Variantes regionales que se declaran a Google con hreflang. Así la
        // misma página en inglés se ofrece a los cuatro mercados objetivo.
        hreflang: ["en", "en-GB", "en-AU", "en-US", "en-CA"],
        // Trozo de dirección de cada página. El inglés vive en la raíz.
        prefijo: "",
        rutas: {
          home: "", servicios: "services", tours: "tours",
          destinos: "destinations", tim: "about-tim",
          blog: "blog", contacto: "contact"
        }
      },

      ui: {
        navHome: "Home", navServicios: "Services", navTours: "Private Tours",
        navDestinos: "Destinations", navTim: "Meet Tim", navBlog: "Travel Blog",
        navContacto: "Contact Us", navAbrirMenu: "Open menu",
        selectorIdioma: "Language",

        heroBotonServicios: "View Services",
        heroBotonWhatsapp: "Quote on WhatsApp",

        buscadorTraslado: "🚐 Transfers", buscadorTour: "📍 Tours",
        buscadorTipo: "Service type",
        buscadorOpcion1: "Airport → Hotel",
        buscadorOpcion2: "Hotel → Airport",
        buscadorOpcion3: "Airport → Hotel → Airport (round trip)",
        buscadorDesde: "From", buscadorDesdeEjemplo: "Cancun Airport (CUN)",
        buscadorHacia: "To", buscadorHaciaEjemplo: "Hotel, Airbnb or address",
        buscadorFecha: "Arrival date", buscadorPasajeros: "Passengers",
        buscadorCotizarTraslado: "Quote My Transfer",
        buscadorDestino: "Destination or experience",
        buscadorDestinoEjemplo: "Chichen Itza, Tulum, Isla Mujeres…",
        buscadorFechaTour: "Date", buscadorCotizarTour: "Quote My Tour",

        homeServiciosEyebrow: "What We Offer",
        homeServiciosTitulo: "Our Transport Services",
        homeToursEyebrow: "The Best Of",
        homeToursTitulo: "Featured Private Tours",
        homeToursBoton: "See All Tours",

        porQueEyebrow: "Why TEVE?",
        porQueTitulo: "What Makes Us Different",
        porQueTexto: "TEVE Transfers &amp; Tours is the trusted choice for private transport and custom tours in Cancun, Tulum and the Riviera Maya. One driver who stays with you from the airport arrival hall to your last day of holiday. No shared shuttles, no waiting for strangers, no surprises — just your trip, built around you.",
        porQueBoton: "Let Us Plan Your Trip",

        serviciosEyebrow: "Transport in Cancun",
        serviciosTitulo: "TEVE Private Services",
        toursEyebrow: "The Best Of", toursTitulo: "Top Private Tours",
        destinosEyebrow: "Where We Take You", destinosTitulo: "Private Destinations",
        timEyebrow: "Meet Your Driver",
        resenasEyebrow: "Real Reviews", resenasTitulo: "What Our Travellers Say",
        // Textos del precio que se calcula solo en el buscador.
        cotizaAeropuerto: "Cancun International Airport (CUN)",
        cotizaGrupoZonas: "Hotel zones",
        cotizaGrupoPunto: "Point to point, marinas & parks",
        cotizaElige: "Choose a destination…",
        cotizaEligeTour: "Choose a tour…",
        cotizaOtroTour: "Something else / not sure yet",
        cotizaEtiqueta: "Your estimate",
        cotizaPorVehiculo: "per vehicle · up to {pax} passengers",
        cotizaRedondo: "round trip · per vehicle",
        cotizaPorPersona: "per person",
        cotizaGrupoGrande: "For groups over 18 we build a custom quote — send it over and we reply within the hour.",
        cotizaSinPrecio: "Tell us your dates and we will confirm the price by WhatsApp.",
        cotizaIncluye: "Meet and greet inside the terminal, luggage help and free waiting time if your flight is delayed.",
        cotizaPorPersonaUnidad: "per person",
        cotizaTotalPax: "total for {pax}",
        cotizaMinimo: "Minimum {min} passengers for this tour",
        cotizaZonaAZona: "We only publish rates between the airport and a hotel zone. Tell us both points and we quote it by WhatsApp.",
        cotizaMismoPunto: "Pick a different pick-up and drop-off point.",

        blogEyebrow: "Travel Guide", blogTitulo: "Plan Your Trip to Cancun",
        blogLeerMas: "Read article →",

        tarjetaCotizar: "Get a Quote", tarjetaReservar: "Book Now",
        tarjetaDesde: "From", tarjetaDescubrir: "Discover More",
        tarjetaSinPrecio: "Custom quote",

        contactoEyebrow: "Planning a trip to Cancun?",
        contactoTitulo: "Our team is ready to help",
        formNombre: "First name*", formApellido: "Last name*",
        formEmail: "Email address*", formTelefono: "Phone*",
        formLlegada: "Arrival date", formSalida: "Departure date",
        formAdultos: "Adults", formMenores: "Children",
        formMensaje: "Service you need / comments",
        formSms: "Send me SMS updates", formEmailOpt: "Send me email updates",
        formEnviar: "Send on WhatsApp",
        contactoWhatsappTexto: "Instant reply",

        socialEyebrow: "What people say about us",
        socialTitulo: "Follow us and read our reviews",
        socialTaTexto: "Verified reviews from travellers who have already ridden with us.",
        socialTaBoton: "Read reviews",
        socialFbTexto: "News, offers and photos from our transfers and tours.",
        socialFbBoton: "Follow on Facebook",
        socialIgTexto: "Day to day in Cancun, Tulum, Holbox and the Riviera Maya.",
        socialIgBoton: "Follow on Instagram",

        newsletterEyebrow: "Your next adventure starts here",
        newsletterTitulo: "Get travel inspiration by email",
        newsletterEjemplo: "Your email address",
        newsletterBoton: "Subscribe",

        pieContacto: "Contact", pieDescubrir: "Discover",
        pieLlamanos: "Call us", pieCorreo: "Email us", pieRedes: "Social Media",
        pieHorario: "Available 24/7, 365 days a year",
        pieCancun: "Cancun", pieQueVer: "What to see",
        pieTraslados: "Transfers &amp; transport", pieToursPrivados: "Private tours",
        pieBlog: "Travel blog", pieRiviera: "Riviera Maya",
        pieBacalar: "Bacalar &amp; Holbox", pieServicios: "Services",
        pieChofer: "Private driver", pieGrupos: "Groups &amp; events",
        pieYates: "Yacht charters", pieConcierge: "Travel concierge",
        pieCompania: "Company", pieConoceTim: "Meet Tim", pieContactanos: "Contact us",
        piePrivacidad: "Privacy Policy", pieTerminos: "Terms &amp; Conditions",
        pieCookies: "Cookie Policy", pieDerechos: "All rights reserved.",

        // Mensajes que se escriben solos en WhatsApp.
        waGeneral: "Hi! I'd like information about a private service in Cancun.",
        waPortada: "Hi! I'd like a quote for a private service in Cancun.",
        waServicio: "Hi! I'd like information about:",
        waTour: "Hi! I'd like to book the tour:",
        waDestino: "Hi! I'd like a quote for a private tour to",
        waTraslado: "Hi! I'd like to quote a transfer.",
        waTourBusqueda: "Hi! I'd like to quote a private tour.",
        waTim: "Message Tim on WhatsApp",

        avisoSuscrito: "Thank you! We'll send you travel ideas for the Riviera Maya.",
        avisoFaltanCampos: "Please fill in the required fields."
      },

      portada: {
        titulo: "Experience Cancun<br>Your Way",
        subtitulo: "Private transport and custom tours across Cancun and the Riviera Maya. One trusted driver, from the arrivals hall to the memories.",
        metricas: [
          { numero: "500+", texto: "Happy Travellers" },
          { numero: "5.0★", texto: "TripAdvisor" },
          { numero: "8+",   texto: "Years in Cancun" },
          { numero: "USD",  texto: "CAD, AUD & GBP welcome" }
        ]
      },

      servicios: {
        transfer: {
          titulo: "Private Airport ↔ Hotel Transfer",
          texto: "Name-board greeting in the arrivals hall, help with your luggage and an air-conditioned vehicle. Your driver waits even if your flight is delayed."
        },
        chofer: {
          titulo: "Private Driver by the Day",
          texto: "A comfortable van and an English-speaking driver at your disposal by the hour or for the full day. Beaches, restaurants and shopping at your own pace."
        },
        grupos: {
          titulo: "Group Transport",
          texto: "Planning a conference, wedding or corporate event? We have the fleet and the logistics to move large groups without anyone waiting around."
        },
        catamaran: {
          titulo: "Catamaran to Isla Mujeres",
          texto: "Sail across to Isla Mujeres with snorkelling included and free time on the island. Every detail coordinated by your TEVE driver."
        },
        yate: {
          titulo: "Private Yacht Charter",
          texto: "From a sport boat to a luxury catamaran. A day of fishing, a sunset cruise or your own private island — you choose."
        },
        concierge: {
          titulo: "Travel Concierge",
          texto: "Full itinerary planning: reservations, activities and local recommendations from someone who actually lives here."
        }
      },

      tours: {
        chichen: {
          titulo: "Chichen Itza & Cenote with Mayan Experience",
          texto: "Visit one of the New Seven Wonders of the World, swim in a cenote and learn how Mayan cooking really works."
        },
        tulum: {
          titulo: "Tulum, Cenote & Playa del Carmen",
          texto: "See Tulum, the most striking clifftop Mayan city on the Caribbean, plus a cenote and Fifth Avenue."
        },
        isla: {
          titulo: "Luxury Catamaran to Isla Mujeres",
          texto: "Sail between Cancun and Isla Mujeres, with snorkelling and free time on the island."
        },
        cenote: {
          titulo: "Cenote Visit & Lagoon Snorkelling",
          texto: "Sink into the clear water of a cenote and discover a spectacular lagoon far from the crowds."
        },
        akumal: {
          titulo: "Akumal: Snorkel with Turtles & Cenotes",
          texto: "Swim alongside sea turtles in Akumal and explore a cenote full of extraordinary stalactites."
        },
        coba: {
          titulo: "Monkey Watching & Coba Ruins",
          texto: "Head into the Mayan jungle, watch spider monkeys in the wild and visit the enigmatic city of Coba."
        }
      },

      destinos: {
        chichen: { duracion: "Half day or full day", texto: "2.5 hrs from Cancun · Private guide included" },
        tulum:   { duracion: "Day trip",             texto: "1.5 hrs from Cancun · Clifftop ruins and cenotes" },
        isla:    { duracion: "Full day",             texto: "30 min by ferry · Private catamaran available" },
        bacalar: { duracion: "Overnight optional",   texto: "3-4 hrs · The magic well off the tourist trail" }
      },

      tim: {
        titulo: "Tim — Your Trusted Person in Cancun",
        citaDestacada: "Tim was far more than a driver, he became part of our holiday. He knew exactly where to take us and everything just flowed.",
        citaAutor: "Sarah M., Toronto · TripAdvisor",
        biografia: "Tim has spent more than eight years guiding visitors around Cancun and the Riviera Maya. Bilingual, plugged into the local culture and genuinely invested in making your trip memorable — which is why his name turns up, unprompted, in hundreds of five-star reviews."
      },

      resenas: [
        {
          texto: "Tim handled everything: airport, Chichen Itza, cenote, lunch. We never felt rushed and he knew every trick for dodging the crowds.",
          nombre: "Jennifer K.",
          lugar: "Houston, Texas 🇺🇸"
        },
        {
          texto: "As Canadians who spend six weeks in Cancun every winter, reliable transport was our biggest worry. Tim solved it completely.",
          nombre: "Robert & Linda S.",
          lugar: "Vancouver, BC 🇨🇦"
        },
        {
          texto: "We flew in from Sydney knowing nothing about the area. Tim became our unofficial concierge. I've already recommended him to four friends.",
          nombre: "Michael P.",
          lugar: "Sydney, Australia 🇦🇺"
        }
      ],

      blog: {
        "transfer-vs-shared": {
          categoria: "Airport & Transfers",
          titulo: "Private vs Shared Transfer: Which One Suits You?",
          texto: "We compare both options with real numbers so you can decide before you book your next trip."
        },
        "chichen-guide": {
          categoria: "Private Tours",
          titulo: "Private Chichen Itza from Cancun: Complete 2026 Guide",
          texto: "The best arrival time, what to bring, where to stop for lunch and why a private guide changes the whole day."
        },
        "snowbirds": {
          categoria: "For Canadian Travellers",
          titulo: "Winter Stays in Cancun: A Transport Guide",
          texto: "Everything about recurring private transport for long stays of four to eight weeks."
        }
      },

      /* --------------------------------------------------------------------
         SEO EN INGLÉS
         --------------------------------------------------------------------
         Máximo recomendado: 60 caracteres en el título, 155 en la descripción.
         Las descripciones nombran a los cuatro mercados objetivo porque es
         literalmente lo que el viajero escribe en Google antes de reservar.
         -------------------------------------------------------------------- */
      seo: {
        home: {
          titulo: "Cancun Airport Transfers & Private Riviera Maya Tours",
          descripcion: "Private Cancun airport transfers and custom Riviera Maya tours for travellers from the UK, Australia, the US and Canada. Book direct on WhatsApp."
        },
        servicios: {
          titulo: "Cancun Airport Transfer & Private Driver Services | TEVE",
          descripcion: "Airport transfers, private drivers by the day, group transport, catamarans and yacht charters across Cancun, Tulum and the Riviera Maya."
        },
        tours: {
          titulo: "Private Tours from Cancun: Chichen Itza, Tulum, Isla Mujeres",
          descripcion: "Private day tours from Cancun to Chichen Itza, Tulum, Coba, Akumal and Isla Mujeres. Private vehicle, English-speaking guide, your own pace."
        },
        destinos: {
          titulo: "Riviera Maya Destinations from Cancun | TEVE Tours",
          descripcion: "Where we take you from Cancun: Chichen Itza, Tulum, Isla Mujeres, Bacalar and Holbox. Door-to-door private transport, never a crowded coach."
        },
        tim: {
          titulo: "Meet Tim — Your English-Speaking Driver in Cancun",
          descripcion: "Eight years driving visitors around Cancun and the Riviera Maya. Bilingual, local, and named personally in hundreds of five-star reviews."
        },
        blog: {
          titulo: "Cancun & Riviera Maya Travel Guides | TEVE Transfers",
          descripcion: "Practical guides for planning a Cancun trip: airport transfers, private tours, long winter stays and honest advice from a local driver."
        },
        contacto: {
          titulo: "Get a Quote — Cancun Transfers & Tours | TEVE",
          descripcion: "Get a quote for your Cancun transfer or private tour. Fast replies on WhatsApp, email or phone, across UK, Australian and North American hours."
        }
      }
    },

    /* ======================================================================
       ESPAÑOL — TRADUCCIÓN
       ----------------------------------------------------------------------
       Dirigido al viajero mexicano y latinoamericano, y a quien ya está en
       Cancún y busca transporte de última hora.
       ====================================================================== */
    es: {
      meta: {
        nombre: "Español",
        bandera: "🇲🇽",
        htmlLang: "es",
        ogLocale: "es_MX",
        hreflang: ["es", "es-MX"],
        prefijo: "es",
        rutas: {
          home: "", servicios: "servicios", tours: "tours",
          destinos: "destinos", tim: "tim",
          blog: "blog", contacto: "contacto"
        }
      },

      ui: {
        navHome: "Inicio", navServicios: "Servicios", navTours: "Tours Privados",
        navDestinos: "Destinos", navTim: "Conoce a Tim", navBlog: "Blog de Viajes",
        navContacto: "Contáctanos", navAbrirMenu: "Abrir menú",
        selectorIdioma: "Idioma",

        heroBotonServicios: "Ver Servicios",
        heroBotonWhatsapp: "Cotizar por WhatsApp",

        buscadorTraslado: "🚐 Traslados", buscadorTour: "📍 Tours",
        buscadorTipo: "Tipo de servicio",
        buscadorOpcion1: "Aeropuerto → Hotel",
        buscadorOpcion2: "Hotel → Aeropuerto",
        buscadorOpcion3: "Aeropuerto → Hotel → Aeropuerto (redondo)",
        buscadorDesde: "Desde", buscadorDesdeEjemplo: "Aeropuerto de Cancún (CUN)",
        buscadorHacia: "Hacia", buscadorHaciaEjemplo: "Hotel, Airbnb o dirección",
        buscadorFecha: "Fecha de llegada", buscadorPasajeros: "Pasajeros",
        buscadorCotizarTraslado: "Cotizar Traslado",
        buscadorDestino: "Destino o experiencia",
        buscadorDestinoEjemplo: "Chichén Itzá, Tulum, Isla Mujeres…",
        buscadorFechaTour: "Fecha", buscadorCotizarTour: "Cotizar Tour",

        homeServiciosEyebrow: "Lo que ofrecemos",
        homeServiciosTitulo: "Nuestros Servicios de Transportación",
        homeToursEyebrow: "Los Mejores",
        homeToursTitulo: "Tours Privados Destacados",
        homeToursBoton: "Ver Todos los Tours",

        porQueEyebrow: "¿Por qué TEVE?",
        porQueTitulo: "¿Qué nos hace diferentes?",
        porQueTexto: "TEVE Transfers &amp; Tours es la opción de confianza en transportación privada y tours a la medida en Cancún, Tulum y la Riviera Maya. Un solo chofer que te acompaña desde la sala de llegadas hasta tu último día de vacaciones. Sin shuttles compartidos, sin esperar a desconocidos, sin sorpresas: tu viaje, diseñado para ti.",
        porQueBoton: "Permítenos Planear Tu Viaje",

        serviciosEyebrow: "Transportación en Cancún",
        serviciosTitulo: "Servicios Privados TEVE",
        toursEyebrow: "Los Mejores", toursTitulo: "Top Tours Privados",
        destinosEyebrow: "A Dónde Te Llevamos", destinosTitulo: "Destinos Privados",
        timEyebrow: "Conoce a tu Guía",
        resenasEyebrow: "Reseñas Reales", resenasTitulo: "Lo Que Dicen Nuestros Viajeros",
        cotizaAeropuerto: "Aeropuerto Internacional de Cancún (CUN)",
        cotizaGrupoZonas: "Zonas hoteleras",
        cotizaGrupoPunto: "Punto a punto, marinas y parques",
        cotizaElige: "Elige un destino…",
        cotizaEligeTour: "Elige un tour…",
        cotizaOtroTour: "Otra cosa / aún no lo sé",
        cotizaEtiqueta: "Tu estimado",
        cotizaPorVehiculo: "por vehículo · hasta {pax} pasajeros",
        cotizaRedondo: "viaje redondo · por vehículo",
        cotizaPorPersona: "por persona",
        cotizaGrupoGrande: "Para grupos de más de 18 armamos una cotización a la medida — mándala y respondemos en menos de una hora.",
        cotizaSinPrecio: "Cuéntanos tus fechas y te confirmamos el precio por WhatsApp.",
        cotizaIncluye: "Recepción dentro de la terminal, ayuda con el equipaje y espera sin costo si tu vuelo se retrasa.",
        cotizaPorPersonaUnidad: "por persona",
        cotizaTotalPax: "total para {pax}",
        cotizaMinimo: "Mínimo {min} pasajeros para este tour",
        cotizaZonaAZona: "Solo publicamos tarifas entre el aeropuerto y una zona hotelera. Dinos los dos puntos y te cotizamos por WhatsApp.",
        cotizaMismoPunto: "Elige un punto de salida y uno de llegada distintos.",

        blogEyebrow: "Guía de Viaje", blogTitulo: "Planea tu Viaje a Cancún",
        blogLeerMas: "Leer artículo →",

        tarjetaCotizar: "Cotizar Ahora", tarjetaReservar: "Reservar",
        tarjetaDesde: "Desde", tarjetaDescubrir: "Descubrir Más",
        tarjetaSinPrecio: "Cotización personalizada",

        contactoEyebrow: "¿Planeas un viaje a Cancún?",
        contactoTitulo: "Nuestro equipo está listo para ayudarte",
        formNombre: "Nombre(s)*", formApellido: "Apellido(s)*",
        formEmail: "Correo electrónico*", formTelefono: "Teléfono*",
        formLlegada: "Fecha de llegada", formSalida: "Fecha de salida",
        formAdultos: "Adultos", formMenores: "Menores",
        formMensaje: "Servicio de interés / comentarios",
        formSms: "Recibir alertas por SMS", formEmailOpt: "Recibir alertas por email",
        formEnviar: "Enviar por WhatsApp",
        contactoWhatsappTexto: "Respuesta inmediata",

        socialEyebrow: "Lo que dicen de nosotros",
        socialTitulo: "Síguenos y lee nuestras reseñas",
        socialTaTexto: "Reseñas verificadas de viajeros que ya viajaron con nosotros.",
        socialTaBoton: "Leer reseñas",
        socialFbTexto: "Novedades, promociones y fotos de nuestros traslados y tours.",
        socialFbBoton: "Seguir en Facebook",
        socialIgTexto: "El día a día en Cancún, Tulum, Holbox y la Riviera Maya.",
        socialIgBoton: "Seguir en Instagram",

        newsletterEyebrow: "Tu próxima aventura empieza aquí",
        newsletterTitulo: "Recibe inspiración en tu correo",
        newsletterEjemplo: "Tu correo electrónico",
        newsletterBoton: "Suscribirme",

        pieContacto: "Contacto", pieDescubrir: "Descubrir",
        pieLlamanos: "Llámanos", pieCorreo: "Envíanos un correo", pieRedes: "Redes Sociales",
        pieHorario: "Disponibles 24/7, los 365 días del año",
        pieCancun: "Cancún", pieQueVer: "¿Qué ver?",
        pieTraslados: "Traslados y transportación", pieToursPrivados: "Tours privados",
        pieBlog: "Blog de viajes", pieRiviera: "Riviera Maya",
        pieBacalar: "Bacalar y Holbox", pieServicios: "Servicios",
        pieChofer: "Chofer privado", pieGrupos: "Grupos y eventos",
        pieYates: "Renta de yates", pieConcierge: "Travel concierge",
        pieCompania: "Compañía", pieConoceTim: "Conoce a Tim", pieContactanos: "Contáctanos",
        piePrivacidad: "Aviso de Privacidad", pieTerminos: "Términos y Condiciones",
        pieCookies: "Política de Cookies", pieDerechos: "Todos los derechos reservados.",

        waGeneral: "¡Hola! Quiero información de un servicio privado en Cancún.",
        waPortada: "¡Hola! Quiero cotizar un servicio privado en Cancún.",
        waServicio: "¡Hola! Quiero información sobre:",
        waTour: "¡Hola! Quiero reservar el tour:",
        waDestino: "¡Hola! Quiero cotizar un tour privado a",
        waTraslado: "¡Hola! Quiero cotizar un traslado.",
        waTourBusqueda: "¡Hola! Quiero cotizar un tour privado.",
        waTim: "Escríbele a Tim por WhatsApp",

        avisoSuscrito: "¡Gracias! Te enviaremos ideas de viaje para la Riviera Maya.",
        avisoFaltanCampos: "Por favor completa los campos obligatorios."
      },

      portada: {
        titulo: "Vive Cancún<br>a tu Manera",
        subtitulo: "Transportación privada y tours a la medida en Cancún y Riviera Maya. Un solo chofer de confianza, de la sala de llegadas a tus recuerdos.",
        metricas: [
          { numero: "500+", texto: "Viajeros Felices" },
          { numero: "5.0★", texto: "TripAdvisor" },
          { numero: "8+",   texto: "Años en Cancún" },
          { numero: "USD",  texto: "CAD, AUD y GBP aceptados" }
        ]
      },

      servicios: {
        transfer: {
          titulo: "Transfer Privado Aeropuerto ↔ Hotel",
          texto: "Recepción con letrero en la sala de llegadas, ayuda con el equipaje y vehículo con aire acondicionado. Tu conductor te espera aunque tu vuelo se retrase."
        },
        chofer: {
          titulo: "Chofer Privado por Día",
          texto: "Van cómoda y chofer bilingüe a tu disposición por horas o el día completo. Playas, restaurantes y compras a tu propio ritmo."
        },
        grupos: {
          titulo: "Transportación para Grupos",
          texto: "¿Planeas una conferencia, boda o evento corporativo? Contamos con flotilla y logística para mover grupos grandes sin que nadie espere."
        },
        catamaran: {
          titulo: "Catamarán a Isla Mujeres",
          texto: "Zarpa hacia Isla Mujeres con snorkel incluido y tiempo libre en la isla. Cada detalle coordinado por tu chofer TEVE."
        },
        yate: {
          titulo: "Renta de Yate Privado",
          texto: "Desde una lancha deportiva hasta un catamarán de lujo. Día de pesca, atardecer o isla privada, tú decides."
        },
        concierge: {
          titulo: "Travel Concierge",
          texto: "Planeación completa de tu itinerario: reservaciones, actividades y recomendaciones locales de quien realmente vive aquí."
        }
      },

      tours: {
        chichen: {
          titulo: "Chichén Itzá y Cenote con Experiencia Maya",
          texto: "Visita una de las nuevas siete maravillas del mundo, nada en un cenote y aprende cómo funciona de verdad la cocina maya."
        },
        tulum: {
          titulo: "Tulum, Cenote y Playa del Carmen",
          texto: "Conoce Tulum, la ciudad maya frente al mar más impresionante del Caribe, además de un cenote y la Quinta Avenida."
        },
        isla: {
          titulo: "Catamarán de Lujo a Isla Mujeres",
          texto: "Navega entre Cancún e Isla Mujeres, con snorkel y tiempo libre en la isla."
        },
        cenote: {
          titulo: "Visita a Cenote y Snorkel en Laguna",
          texto: "Sumérgete en el agua cristalina de un cenote y conoce una laguna espectacular lejos de las multitudes."
        },
        akumal: {
          titulo: "Akumal: Snorkel con Tortugas y Cenotes",
          texto: "Nada junto a tortugas marinas en Akumal y explora un cenote lleno de estalactitas extraordinarias."
        },
        coba: {
          titulo: "Observación de Monos y Ruinas de Cobá",
          texto: "Adéntrate en la selva maya, observa monos araña en libertad y visita la enigmática ciudad de Cobá."
        }
      },

      destinos: {
        chichen: { duracion: "Medio día o día completo", texto: "2.5 hrs desde Cancún · Guía privado incluido" },
        tulum:   { duracion: "Excursión de un día",      texto: "1.5 hrs desde Cancún · Ruinas frente al mar y cenotes" },
        isla:    { duracion: "Día completo",             texto: "30 min en ferry · Catamarán privado disponible" },
        bacalar: { duracion: "Con opción de noche",      texto: "3-4 hrs · La magia fuera del camino turístico" }
      },

      tim: {
        titulo: "Tim — Tu Persona de Confianza en Cancún",
        citaDestacada: "Tim fue mucho más que un chofer, se volvió parte de nuestras vacaciones. Sabía exactamente a dónde llevarnos y todo fluyó sin esfuerzo.",
        citaAutor: "Sarah M., Toronto · TripAdvisor",
        biografia: "Tim lleva más de ocho años guiando viajeros por Cancún y la Riviera Maya. Bilingüe, conectado con la cultura local y genuinamente comprometido con hacer memorable tu viaje — por eso su nombre aparece, sin que nadie se lo pida, en cientos de reseñas de cinco estrellas."
      },

      resenas: [
        {
          texto: "Tim se encargó de todo: aeropuerto, Chichén Itzá, cenote, comida. Nunca sentimos prisa y conocía cada truco para esquivar a las multitudes.",
          nombre: "Jennifer K.",
          lugar: "Houston, Texas 🇺🇸"
        },
        {
          texto: "Como canadienses que pasamos seis semanas en Cancún cada invierno, la transportación confiable era nuestra mayor preocupación. Tim la resolvió por completo.",
          nombre: "Robert & Linda S.",
          lugar: "Vancouver, BC 🇨🇦"
        },
        {
          texto: "Llegamos desde Sídney sin saber nada de la zona. Tim se volvió nuestro concierge no oficial. Ya lo recomendé a cuatro amigos.",
          nombre: "Michael P.",
          lugar: "Sídney, Australia 🇦🇺"
        }
      ],

      blog: {
        "transfer-vs-shared": {
          categoria: "Aeropuerto y Traslados",
          titulo: "Transfer Privado vs Compartido: ¿Cuál te conviene?",
          texto: "Comparamos ambas opciones con números reales para que decidas antes de reservar tu próximo viaje."
        },
        "chichen-guide": {
          categoria: "Tours Privados",
          titulo: "Chichén Itzá Privado desde Cancún: Guía Completa 2026",
          texto: "La mejor hora de llegada, qué llevar, dónde parar a comer y por qué un guía privado cambia el día entero."
        },
        "snowbirds": {
          categoria: "Para Viajeros Canadienses",
          titulo: "Estadías de Invierno en Cancún: Guía de Transporte",
          texto: "Todo sobre transportación privada recurrente para estadías largas de cuatro a ocho semanas."
        }
      },

      seo: {
        home: {
          titulo: "Transporte Privado y Tours en Cancún | TEVE Transfers",
          descripcion: "Traslados privados del aeropuerto de Cancún y tours a la medida en la Riviera Maya. Chofer bilingüe y reserva directa por WhatsApp con Tim."
        },
        servicios: {
          titulo: "Traslados y Chofer Privado en Cancún | TEVE",
          descripcion: "Transfer aeropuerto-hotel, chofer privado por día, transportación para grupos, catamarán y renta de yates en Cancún y Riviera Maya."
        },
        tours: {
          titulo: "Tours Privados desde Cancún: Chichén Itzá y Tulum",
          descripcion: "Tours privados a Chichén Itzá, Tulum, Cobá, Akumal e Isla Mujeres. Vehículo privado, guía bilingüe y horarios flexibles a tu ritmo."
        },
        destinos: {
          titulo: "Destinos desde Cancún: Tulum, Chichén Itzá, Bacalar",
          descripcion: "A dónde te llevamos desde Cancún: Chichén Itzá, Tulum, Isla Mujeres, Bacalar y Holbox con transporte privado puerta a puerta."
        },
        tim: {
          titulo: "Conoce a Tim, tu Chofer Privado en Cancún | TEVE",
          descripcion: "Más de ocho años guiando viajeros por Cancún y la Riviera Maya. Bilingüe, local y con cientos de reseñas de cinco estrellas a su nombre."
        },
        blog: {
          titulo: "Blog de Viajes: Guías de Cancún y Riviera Maya | TEVE",
          descripcion: "Guías prácticas para planear tu viaje a Cancún: traslados, tours privados, estadías largas y consejos honestos de un chofer local."
        },
        contacto: {
          titulo: "Contacto y Cotizaciones | TEVE Transfers & Tours",
          descripcion: "Cotiza tu traslado o tour privado en Cancún. Respuesta rápida por WhatsApp, correo o teléfono. Atendemos todo el año."
        }
      }
    },

    /* ======================================================================
       PORTUGUÉS — TRADUCCIÓN
       ----------------------------------------------------------------------
       Portugués de Brasil. Brasil es el mercado latinoamericano que más
       crece hacia Cancún y la Riviera Maya, y casi ningún competidor local
       tiene el sitio traducido.
       ====================================================================== */
    pt: {
      meta: {
        nombre: "Português",
        bandera: "🇧🇷",
        htmlLang: "pt-BR",
        ogLocale: "pt_BR",
        hreflang: ["pt", "pt-BR", "pt-PT"],
        prefijo: "pt",
        rutas: {
          home: "", servicios: "servicos", tours: "passeios",
          destinos: "destinos", tim: "tim",
          blog: "blog", contacto: "contato"
        }
      },

      ui: {
        navHome: "Início", navServicios: "Serviços", navTours: "Passeios Privativos",
        navDestinos: "Destinos", navTim: "Conheça o Tim", navBlog: "Blog de Viagem",
        navContacto: "Fale Conosco", navAbrirMenu: "Abrir menu",
        selectorIdioma: "Idioma",

        heroBotonServicios: "Ver Serviços",
        heroBotonWhatsapp: "Orçamento no WhatsApp",

        buscadorTraslado: "🚐 Transfers", buscadorTour: "📍 Passeios",
        buscadorTipo: "Tipo de serviço",
        buscadorOpcion1: "Aeroporto → Hotel",
        buscadorOpcion2: "Hotel → Aeroporto",
        buscadorOpcion3: "Aeroporto → Hotel → Aeroporto (ida e volta)",
        buscadorDesde: "De", buscadorDesdeEjemplo: "Aeroporto de Cancún (CUN)",
        buscadorHacia: "Para", buscadorHaciaEjemplo: "Hotel, Airbnb ou endereço",
        buscadorFecha: "Data de chegada", buscadorPasajeros: "Passageiros",
        buscadorCotizarTraslado: "Orçar Meu Transfer",
        buscadorDestino: "Destino ou experiência",
        buscadorDestinoEjemplo: "Chichén Itzá, Tulum, Isla Mujeres…",
        buscadorFechaTour: "Data", buscadorCotizarTour: "Orçar Meu Passeio",

        homeServiciosEyebrow: "O que oferecemos",
        homeServiciosTitulo: "Nossos Serviços de Transporte",
        homeToursEyebrow: "Os Melhores",
        homeToursTitulo: "Passeios Privativos em Destaque",
        homeToursBoton: "Ver Todos os Passeios",

        porQueEyebrow: "Por que a TEVE?",
        porQueTitulo: "O que nos torna diferentes",
        porQueTexto: "A TEVE Transfers &amp; Tours é a escolha de confiança em transporte privativo e passeios sob medida em Cancún, Tulum e na Riviera Maya. Um único motorista que acompanha você do saguão de desembarque até o último dia de férias. Sem vans compartilhadas, sem esperar por estranhos, sem surpresas: sua viagem, feita para você.",
        porQueBoton: "Deixe-nos Planejar Sua Viagem",

        serviciosEyebrow: "Transporte em Cancún",
        serviciosTitulo: "Serviços Privativos TEVE",
        toursEyebrow: "Os Melhores", toursTitulo: "Top Passeios Privativos",
        destinosEyebrow: "Para Onde Levamos Você", destinosTitulo: "Destinos Privativos",
        timEyebrow: "Conheça seu Guia",
        resenasEyebrow: "Avaliações Reais", resenasTitulo: "O Que Dizem Nossos Viajantes",
        cotizaAeropuerto: "Aeroporto Internacional de Cancún (CUN)",
        cotizaGrupoZonas: "Zonas hoteleiras",
        cotizaGrupoPunto: "Ponto a ponto, marinas e parques",
        cotizaElige: "Escolha um destino…",
        cotizaEligeTour: "Escolha um passeio…",
        cotizaOtroTour: "Outra coisa / ainda não sei",
        cotizaEtiqueta: "Sua estimativa",
        cotizaPorVehiculo: "por veículo · até {pax} passageiros",
        cotizaRedondo: "ida e volta · por veículo",
        cotizaPorPersona: "por pessoa",
        cotizaGrupoGrande: "Para grupos acima de 18 fazemos um orçamento sob medida — envie e respondemos em menos de uma hora.",
        cotizaSinPrecio: "Conte-nos suas datas e confirmamos o preço pelo WhatsApp.",
        cotizaIncluye: "Recepção dentro do terminal, ajuda com as malas e espera sem custo se o voo atrasar.",
        cotizaPorPersonaUnidad: "por pessoa",
        cotizaTotalPax: "total para {pax}",
        cotizaMinimo: "Mínimo de {min} passageiros para este passeio",
        cotizaZonaAZona: "Só publicamos tarifas entre o aeroporto e uma zona hoteleira. Diga-nos os dois pontos e orçamos pelo WhatsApp.",
        cotizaMismoPunto: "Escolha um ponto de saída e um de chegada diferentes.",

        blogEyebrow: "Guia de Viagem", blogTitulo: "Planeje sua Viagem a Cancún",
        blogLeerMas: "Ler artigo →",

        tarjetaCotizar: "Solicitar Orçamento", tarjetaReservar: "Reservar",
        tarjetaDesde: "A partir de", tarjetaDescubrir: "Descobrir Mais",
        tarjetaSinPrecio: "Orçamento personalizado",

        contactoEyebrow: "Planejando uma viagem a Cancún?",
        contactoTitulo: "Nossa equipe está pronta para ajudar",
        formNombre: "Nome*", formApellido: "Sobrenome*",
        formEmail: "E-mail*", formTelefono: "Telefone*",
        formLlegada: "Data de chegada", formSalida: "Data de saída",
        formAdultos: "Adultos", formMenores: "Crianças",
        formMensaje: "Serviço de interesse / comentários",
        formSms: "Quero receber avisos por SMS", formEmailOpt: "Quero receber avisos por e-mail",
        formEnviar: "Enviar pelo WhatsApp",
        contactoWhatsappTexto: "Resposta imediata",

        socialEyebrow: "O que dizem sobre nós",
        socialTitulo: "Siga-nos e leia nossas avaliações",
        socialTaTexto: "Avaliações verificadas de viajantes que já viajaram conosco.",
        socialTaBoton: "Ler avaliações",
        socialFbTexto: "Novidades, promoções e fotos dos nossos transfers e passeios.",
        socialFbBoton: "Seguir no Facebook",
        socialIgTexto: "O dia a dia em Cancún, Tulum, Holbox e na Riviera Maya.",
        socialIgBoton: "Seguir no Instagram",

        newsletterEyebrow: "Sua próxima aventura começa aqui",
        newsletterTitulo: "Receba inspiração por e-mail",
        newsletterEjemplo: "Seu e-mail",
        newsletterBoton: "Inscrever-me",

        pieContacto: "Contato", pieDescubrir: "Descobrir",
        pieLlamanos: "Ligue para nós", pieCorreo: "Envie um e-mail", pieRedes: "Redes Sociais",
        pieHorario: "Disponíveis 24/7, 365 dias por ano",
        pieCancun: "Cancún", pieQueVer: "O que ver",
        pieTraslados: "Transfers e transporte", pieToursPrivados: "Passeios privativos",
        pieBlog: "Blog de viagem", pieRiviera: "Riviera Maya",
        pieBacalar: "Bacalar e Holbox", pieServicios: "Serviços",
        pieChofer: "Motorista privativo", pieGrupos: "Grupos e eventos",
        pieYates: "Aluguel de iates", pieConcierge: "Travel concierge",
        pieCompania: "Empresa", pieConoceTim: "Conheça o Tim", pieContactanos: "Fale conosco",
        piePrivacidad: "Política de Privacidade", pieTerminos: "Termos e Condições",
        pieCookies: "Política de Cookies", pieDerechos: "Todos os direitos reservados.",

        waGeneral: "Olá! Quero informações sobre um serviço privativo em Cancún.",
        waPortada: "Olá! Quero um orçamento de serviço privativo em Cancún.",
        waServicio: "Olá! Quero informações sobre:",
        waTour: "Olá! Quero reservar o passeio:",
        waDestino: "Olá! Quero um orçamento de passeio privativo para",
        waTraslado: "Olá! Quero um orçamento de transfer.",
        waTourBusqueda: "Olá! Quero um orçamento de passeio privativo.",
        waTim: "Fale com o Tim no WhatsApp",

        avisoSuscrito: "Obrigado! Enviaremos ideias de viagem para a Riviera Maya.",
        avisoFaltanCampos: "Por favor, preencha os campos obrigatórios."
      },

      portada: {
        titulo: "Viva Cancún<br>do Seu Jeito",
        subtitulo: "Transporte privativo e passeios sob medida em Cancún e na Riviera Maya. Um único motorista de confiança, do desembarque às suas memórias.",
        metricas: [
          { numero: "500+", texto: "Viajantes Felizes" },
          { numero: "5.0★", texto: "TripAdvisor" },
          { numero: "8+",   texto: "Anos em Cancún" },
          { numero: "USD",  texto: "CAD, AUD e GBP aceitos" }
        ]
      },

      servicios: {
        transfer: {
          titulo: "Transfer Privativo Aeroporto ↔ Hotel",
          texto: "Recepção com placa no saguão de desembarque, ajuda com as malas e veículo com ar-condicionado. Seu motorista espera mesmo se o voo atrasar."
        },
        chofer: {
          titulo: "Motorista Privativo por Dia",
          texto: "Van confortável e motorista bilíngue à sua disposição por hora ou o dia inteiro. Praias, restaurantes e compras no seu ritmo."
        },
        grupos: {
          titulo: "Transporte para Grupos",
          texto: "Planejando um congresso, casamento ou evento corporativo? Temos frota e logística para mover grupos grandes sem ninguém esperando."
        },
        catamaran: {
          titulo: "Catamarã para Isla Mujeres",
          texto: "Navegue até Isla Mujeres com mergulho de snorkel incluído e tempo livre na ilha. Cada detalhe coordenado pelo seu motorista TEVE."
        },
        yate: {
          titulo: "Aluguel de Iate Privativo",
          texto: "De uma lancha esportiva a um catamarã de luxo. Dia de pesca, pôr do sol ou ilha privativa, você decide."
        },
        concierge: {
          titulo: "Travel Concierge",
          texto: "Planejamento completo do roteiro: reservas, atividades e recomendações locais de quem realmente mora aqui."
        }
      },

      tours: {
        chichen: {
          titulo: "Chichén Itzá e Cenote com Experiência Maia",
          texto: "Visite uma das novas sete maravilhas do mundo, nade em um cenote e aprenda como funciona de verdade a cozinha maia."
        },
        tulum: {
          titulo: "Tulum, Cenote e Playa del Carmen",
          texto: "Conheça Tulum, a mais impressionante cidade maia à beira-mar do Caribe, além de um cenote e a Quinta Avenida."
        },
        isla: {
          titulo: "Catamarã de Luxo para Isla Mujeres",
          texto: "Navegue entre Cancún e Isla Mujeres, com snorkel e tempo livre na ilha."
        },
        cenote: {
          titulo: "Visita a Cenote e Snorkel na Lagoa",
          texto: "Mergulhe na água cristalina de um cenote e conheça uma lagoa espetacular longe das multidões."
        },
        akumal: {
          titulo: "Akumal: Snorkel com Tartarugas e Cenotes",
          texto: "Nade ao lado de tartarugas marinhas em Akumal e explore um cenote cheio de estalactites extraordinárias."
        },
        coba: {
          titulo: "Observação de Macacos e Ruínas de Cobá",
          texto: "Entre na selva maia, observe macacos-aranha em liberdade e visite a enigmática cidade de Cobá."
        }
      },

      destinos: {
        chichen: { duracion: "Meio dia ou dia inteiro", texto: "2,5 h de Cancún · Guia privativo incluído" },
        tulum:   { duracion: "Bate-volta de um dia",    texto: "1,5 h de Cancún · Ruínas à beira-mar e cenotes" },
        isla:    { duracion: "Dia inteiro",             texto: "30 min de ferry · Catamarã privativo disponível" },
        bacalar: { duracion: "Com opção de pernoite",   texto: "3-4 h · A mágica fora da rota turística" }
      },

      tim: {
        titulo: "Tim — Sua Pessoa de Confiança em Cancún",
        citaDestacada: "O Tim foi muito mais que um motorista, virou parte das nossas férias. Sabia exatamente para onde nos levar e tudo fluiu sem esforço.",
        citaAutor: "Sarah M., Toronto · TripAdvisor",
        biografia: "O Tim tem mais de oito anos guiando visitantes por Cancún e pela Riviera Maya. Bilíngue, conectado à cultura local e genuinamente comprometido em tornar sua viagem memorável — por isso o nome dele aparece, sem que ninguém peça, em centenas de avaliações cinco estrelas."
      },

      resenas: [
        {
          texto: "O Tim cuidou de tudo: aeroporto, Chichén Itzá, cenote, almoço. Nunca nos sentimos apressados e ele conhecia cada truque para fugir das multidões.",
          nombre: "Jennifer K.",
          lugar: "Houston, Texas 🇺🇸"
        },
        {
          texto: "Como canadenses que passam seis semanas em Cancún todo inverno, transporte confiável era nossa maior preocupação. O Tim resolveu por completo.",
          nombre: "Robert & Linda S.",
          lugar: "Vancouver, BC 🇨🇦"
        },
        {
          texto: "Chegamos de Sydney sem saber nada da região. O Tim virou nosso concierge não oficial. Já o recomendei para quatro amigos.",
          nombre: "Michael P.",
          lugar: "Sydney, Austrália 🇦🇺"
        }
      ],

      blog: {
        "transfer-vs-shared": {
          categoria: "Aeroporto e Transfers",
          titulo: "Transfer Privativo vs Compartilhado: Qual Escolher?",
          texto: "Comparamos as duas opções com números reais para você decidir antes de reservar sua próxima viagem."
        },
        "chichen-guide": {
          categoria: "Passeios Privativos",
          titulo: "Chichén Itzá Privativo saindo de Cancún: Guia 2026",
          texto: "O melhor horário de chegada, o que levar, onde parar para almoçar e por que um guia privativo muda o dia inteiro."
        },
        "snowbirds": {
          categoria: "Para Viajantes Canadenses",
          titulo: "Temporadas de Inverno em Cancún: Guia de Transporte",
          texto: "Tudo sobre transporte privativo recorrente para estadias longas de quatro a oito semanas."
        }
      },

      seo: {
        home: {
          titulo: "Transfer e Passeios Privativos em Cancún | TEVE",
          descripcion: "Transfers privativos do aeroporto de Cancún e passeios sob medida na Riviera Maya. Motorista bilíngue e reserva direta pelo WhatsApp."
        },
        servicios: {
          titulo: "Transfer do Aeroporto e Motorista em Cancún | TEVE",
          descripcion: "Transfer aeroporto-hotel, motorista privativo por dia, transporte para grupos, catamarã e aluguel de iates em Cancún e Riviera Maya."
        },
        tours: {
          titulo: "Passeios Privativos de Cancún: Chichén Itzá e Tulum",
          descripcion: "Passeios privativos para Chichén Itzá, Tulum, Cobá, Akumal e Isla Mujeres. Veículo privativo, guia bilíngue e horários flexíveis."
        },
        destinos: {
          titulo: "Destinos saindo de Cancún: Tulum, Chichén Itzá, Bacalar",
          descripcion: "Para onde levamos você saindo de Cancún: Chichén Itzá, Tulum, Isla Mujeres, Bacalar e Holbox com transporte privativo porta a porta."
        },
        tim: {
          titulo: "Conheça o Tim, seu Motorista Privativo em Cancún",
          descripcion: "Mais de oito anos guiando viajantes por Cancún e pela Riviera Maya. Bilíngue, local e citado em centenas de avaliações cinco estrelas."
        },
        blog: {
          titulo: "Blog de Viagem: Guias de Cancún e Riviera Maya | TEVE",
          descripcion: "Guias práticos para planejar sua viagem a Cancún: transfers, passeios privativos, estadias longas e conselhos honestos de um local."
        },
        contacto: {
          titulo: "Contato e Orçamentos | TEVE Transfers & Tours Cancún",
          descripcion: "Solicite um orçamento do seu transfer ou passeio privativo em Cancún. Resposta rápida pelo WhatsApp, e-mail ou telefone, o ano todo."
        }
      }
    }
  }
};
