# -*- coding: utf-8 -*-
"""
Genera las tres paginas de destino como HTML estatico independiente.

No toca ningun archivo existente: solo escribe
sitio-publicar/<slug>/index.html y sitio-publicar/paginas-destino/estilos.css.

Cada pagina:
  - lleva todo su contenido en el HTML crudo (indexable sin JS)
  - NO carga el enrutador de una sola pagina ni teve-config.js
  - no tiene hreflang y no la redirige el detector de idioma
  - usa solo fotos que ya existen en el sitio
"""
import html
import json
import os
import re
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
import contenido as C  # noqa: E402

RAIZ = os.path.dirname(AQUI)
SALIDA = os.path.join(RAIZ, "sitio-publicar")
BASE = "https://www.tevetransferstours.com"

SUB = ("Private driver &middot; $300 per vehicle, up to 8 people "
       "&mdash; not per person")
ACLARACION = ("Entrance fees, guide and meals not included "
              "&mdash; paid directly at the site.")

# --- piezas comunes, copiadas del sitio para que las paginas se vean igual ---

GTM = """<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NVZVBKPQ');</script>
<!-- End Google Tag Manager -->

<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-16596162124"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'AW-16596162124');
</script>"""

BARRA_SUP = """<div class="barra-sup">
  <div class="contenedor">
    <a href="tel:+529987351905"><span aria-hidden="true">&#128222;</span> +52 998 735 1905</a>
    <a href="mailto:reservas@tevetransferstours.com"><span aria-hidden="true">&#9993;</span> reservas@tevetransferstours.com</a>
    <span><span aria-hidden="true">&#128337;</span> Available 24/7, 365 days a year</span>
  </div>
</div>"""

CABECERA = """<header class="cabecera">
  <div class="contenedor">
    <a href="/" aria-label="TEVE Transfers &amp; Tours home"><img src="/img/logo-teve.png" alt="TEVE Transfers &amp; Tours"></a>
    <nav class="menu">
      <a href="/">Home</a>
      <a href="/private-driver-cancun">Private Driver</a>
      <a href="/tours">Popular Tours</a>
      <a href="/destinations">Destinations</a>
      <a href="/about-tim">Meet Tim</a>
      <a class="btn btn-sec" href="/contact">Contact</a>
    </nav>
  </div>
</header>"""

WA_SVG = ('<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884M20.463 3.488A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413"></path></svg>')

PIE = """<footer class="pie">
  <div class="contenedor">
    <div class="pie-cols">
      <div>
        <h3>TEVE Transfers &amp; Tours</h3>
        <p>Private driver, airport transfers and custom tours in Cancun and the Riviera Maya. Bilingual driver, book direct.</p>
      </div>
      <div>
        <h3>Contact</h3>
        <p><a href="tel:+529987351905">+52 998 735 1905</a><br>
        <a href="tel:+522282107684">+52 228 210 7684</a><br>
        <a href="mailto:reservas@tevetransferstours.com">reservas@tevetransferstours.com</a></p>
      </div>
      <div>
        <h3>Services</h3>
        <p><a href="/private-driver-cancun">Private Driver</a><br>
        <a href="/tours">Popular Tours</a><br>
        <a href="/destinations">Destinations</a><br>
        <a href="/contact">Contact Us</a></p>
      </div>
      <div>
        <h3>Day trips from Cancun</h3>
        <p><a href="/private-chichen-itza-tour-from-cancun">Chichen Itza, cenote &amp; Valladolid</a><br>
        <a href="/private-tulum-cenote-tour-from-cancun">Tulum &amp; cenote</a><br>
        <a href="/akumal-turtles-tulum-private-tour-from-cancun">Akumal turtles &amp; Tulum</a></p>
      </div>
    </div>
    <div class="pie-abajo">
      <a href="/privacy">Privacy Policy</a> &middot;
      <a href="/terms">Terms &amp; Conditions</a> &middot;
      <a href="/cookies">Cookie Policy</a>
      <p style="margin-top:10px">&copy; 2026 TEVE Transfers &amp; Tours. All rights reserved.</p>
    </div>
  </div>
</footer>"""


def wa_url(texto):
    from urllib.parse import quote
    return "https://wa.me/%s?text=%s" % (C.WA, quote(texto, safe=""))


def sin_etiquetas(t):
    t = re.sub(r"<!--.*?-->", " ", t, flags=re.S)
    return re.sub(r"<[^>]+>", " ", t)


def texto_plano(t):
    """Para JSON-LD: sin etiquetas, sin comentarios, sin entidades."""
    return html.unescape(re.sub(r"\s+", " ", sin_etiquetas(t))).strip()


def tabla_personas():
    filas = "".join(
        "<tr><td>%d people</td><td>%s per person</td></tr>" % (n, p)
        for n, p in C.por_persona(300))
    return filas


def tabla_tarifas():
    return "".join("<tr><td>%s</td><td>%s</td></tr>" % (a, b)
                   for a, b in C.TARIFAS)


def bloque_resenas():
    tarjetas = []
    for texto, quien, donde in C.RESENAS:
        tarjetas.append(
            '<figure class="resena">'
            '<div class="estrellas" aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</div>'
            '<blockquote><p>&ldquo;%s&rdquo;</p></blockquote>'
            '<figcaption><span class="quien">%s</span>'
            '<span class="donde">%s</span></figcaption></figure>'
            % (texto, quien, donde))
    return '<div class="resenas">%s</div>' % "".join(tarjetas)


def otras_paginas(slug_actual):
    etiquetas = {
        "private-chichen-itza-tour-from-cancun":
            ("Chichen Itza, cenote &amp; Valladolid",
             "The pyramid before the coaches arrive, then fresh water and a colonial town."),
        "private-tulum-cenote-tour-from-cancun":
            ("Tulum &amp; cenote",
             "Maya ruins on a cliff above the Caribbean, the beach below and a cenote on the way back."),
        "akumal-turtles-tulum-private-tour-from-cancun":
            ("Akumal turtles &amp; Tulum",
             "Snorkel with green turtles in a protected bay, then the Tulum ruins."),
    }
    enlaces = []
    for p in C.PAGINAS:
        if p["slug"] == slug_actual:
            continue
        titulo, nota = etiquetas[p["slug"]]
        enlaces.append('<a href="/%s">%s<span>%s</span></a>'
                       % (p["slug"], titulo, nota))
    enlaces.append('<a href="/private-driver-cancun">Private driver by the day'
                   '<span>Any route you like, from $180 USD for four hours.</span></a>')
    enlaces.append('<a href="/">All our services'
                   '<span>Airport transfers, tours and private transport in Cancun.</span></a>')
    return '<div class="otras">%s</div>' % "".join(enlaces)


def datos_estructurados(p, url):
    viaje = {
        "@context": "https://schema.org",
        "@type": "TouristTrip",
        "name": texto_plano(p["h1"]),
        "description": texto_plano(p["desc"]),
        "url": url,
        "image": BASE + p["foto"],
        "touristType": ["Families", "Couples", "Small groups"],
        "provider": {
            "@type": "TravelAgency",
            "name": "TEVE Transfers & Tours",
            "url": BASE + "/",
            "telephone": "+529987351905",
            "email": "reservas@tevetransferstours.com",
        },
        "itinerary": {
            "@type": "ItemList",
            "itemListElement": [
                {"@type": "ListItem", "position": i + 1,
                 "item": {"@type": "Place", "name": texto_plano(t)}}
                for i, (_, t, _) in enumerate(p["itin"])
            ],
        },
        "offers": {
            "@type": "Offer",
            "price": "300",
            "priceCurrency": "USD",
            "url": url,
            "availability": "https://schema.org/InStock",
            "description": ("Price is per vehicle for up to 8 people, not per "
                            "person. Entrance fees, guide and meals are not "
                            "included and are paid directly at the site."),
            "eligibleQuantity": {"@type": "QuantitativeValue",
                                 "maxValue": 8, "unitText": "people"},
        },
    }
    faq = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {"@type": "Question", "name": texto_plano(q),
             "acceptedAnswer": {"@type": "Answer", "text": texto_plano(a)}}
            for q, a in p["faq"]
        ],
    }
    miga = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home",
             "item": BASE + "/"},
            {"@type": "ListItem", "position": 2, "name": "Popular Tours",
             "item": BASE + "/tours"},
            {"@type": "ListItem", "position": 3,
             "name": texto_plano(p["h1"]), "item": url},
        ],
    }
    salida = []
    for d in (viaje, faq, miga):
        salida.append('<script type="application/ld+json">%s</script>'
                      % json.dumps(d, ensure_ascii=False, indent=2))
    return "\n".join(salida)


def pagina(p):
    url = "%s/%s" % (BASE, p["slug"])
    enlace_wa = wa_url(p["wa"])

    parrafos_intro = "".join("<p>%s</p>" % t for t in p["intro"])
    parrafos_porque = "".join("<p>%s</p>" % t for t in p["porque"])
    parrafos_porque2 = "".join("<p>%s</p>" % t for t in p["porque2"])

    pasos = "".join(
        '<div class="paso"><div class="paso-num">%d</div><div>'
        '<h3>%s &mdash; %s</h3><p>%s</p></div></div>'
        % (i + 1, hora, titulo, texto)
        for i, (hora, titulo, texto) in enumerate(p["itin"]))

    faqs = "".join(
        '<details class="faq"><summary>%s</summary><p>%s</p></details>'
        % (q, a) for q, a in p["faq"])

    incluye = "".join("<li>%s</li>" % x for x in C.INCLUYE)
    no_incluye = "".join("<li>%s</li>" % x for x in C.NO_INCLUYE)

    return """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

%(gtm)s

<title>%(title)s</title>
<meta name="description" content="%(desc)s">
<meta name="robots" content="index, follow">
<meta name="author" content="TEVE Transfers &amp; Tours">
<link rel="canonical" href="%(url)s">

<meta property="og:type" content="article">
<meta property="og:site_name" content="TEVE Transfers &amp; Tours">
<meta property="og:title" content="%(title)s">
<meta property="og:description" content="%(desc)s">
<meta property="og:url" content="%(url)s">
<meta property="og:image" content="%(base)s%(foto)s">
<meta property="og:locale" content="en_US">
<meta name="twitter:card" content="summary_large_image">
<!-- Sin hreflang: estas paginas existen solo en ingles. -->

<link rel="icon" href="/img/favicon.png">
<link rel="apple-touch-icon" href="/img/favicon.png">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&amp;display=swap" rel="stylesheet">
<link rel="stylesheet" href="/paginas-destino/estilos.css">

%(schema)s
</head>
<body>
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NVZVBKPQ"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->

%(barra)s
%(cabecera)s

<section class="portada" style="background-image:url('%(foto)s')">
  <div class="contenedor">
    <h1>%(h1)s</h1>
    <p class="sub">%(sub)s</p>
    <a class="btn btn-wa" href="%(wa)s" target="_blank" rel="noopener">Ask on WhatsApp</a>
  </div>
</section>

<nav class="seccion" style="padding:14px 0" aria-label="Breadcrumb">
  <div class="contenedor" style="font-size:.85rem;color:#5a6b73">
    <a href="/">Home</a> &rsaquo; <a href="/tours">Popular Tours</a> &rsaquo; <span>%(h1)s</span>
  </div>
</nav>

<section class="seccion">
  <div class="contenedor">
    %(intro)s
  </div>
</section>

<section class="seccion gris" id="price">
  <div class="contenedor">
    <h2>What it costs</h2>
    <div class="dos">
      <div class="caja-precio">
        <div class="precio-grande">$300 USD</div>
        <div class="precio-pie">per vehicle for a full day, up to 8 people. Not per person.</div>
        <table class="tarifas">
          <caption class="sr-only">Cost per person when the $300 vehicle price is shared</caption>
          <thead><tr><th>Travelling party</th><th>Works out at</th></tr></thead>
          <tbody>%(personas)s</tbody>
        </table>
        <p class="aviso">%(aclaracion)s</p>
      </div>
      <div>
        <h3>Our standard rates</h3>
        <table class="tarifas">
          <thead><tr><th>Time with the driver</th><th>Price per vehicle</th></tr></thead>
          <tbody>%(tarifas)s</tbody>
        </table>
        <p>%(recargo)s</p>
        <p>A day of this kind is a full day, so it is priced at $300 USD for the
        vehicle. Shorter outings are available at the rates above.</p>
      </div>
    </div>
  </div>
</section>

<section class="seccion">
  <div class="contenedor">
    <h2>%(porque_h)s</h2>
    %(porque)s
  </div>
</section>

<section class="seccion gris">
  <div class="contenedor">
    <h2>%(itin_h)s</h2>
    <p>Times are a starting point, not a timetable. You set the pick-up time and
    the order of the day, and you can change it as you go.</p>
    %(pasos)s
  </div>
</section>

<section class="seccion">
  <div class="contenedor">
    <h2>What is included</h2>
    <div class="dos">
      <div>
        <h3>Included in the $300</h3>
        <ul class="si">%(incluye)s</ul>
      </div>
      <div>
        <h3>Not included</h3>
        <ul class="no">%(no_incluye)s</ul>
        <p class="aviso">%(aclaracion)s</p>
      </div>
    </div>
  </div>
</section>

<section class="seccion gris">
  <div class="contenedor">
    <h2>%(porque2_h)s</h2>
    %(porque2)s
  </div>
</section>

<section class="seccion">
  <div class="contenedor">
    <h2>What our travellers say</h2>
    <p>These are reviews left for our private driver service by travellers from
    the United States, Canada and Australia.</p>
    %(resenas)s
    <!-- TODO: el sitio no tiene resenas que mencionen a Felipe. Solo hay tres resenas y las tres hablan de Tim. -->
  </div>
</section>

<section class="seccion gris">
  <div class="contenedor">
    <h2>Questions people ask</h2>
    %(faqs)s
  </div>
</section>

<section class="cierre">
  <h2>Ready to plan this day?</h2>
  <p>%(sub)s. Message us on WhatsApp and we will put the day together with you
  &mdash; pick-up time, stops and how long you want at each one.</p>
  <a class="btn btn-wa" href="%(wa)s" target="_blank" rel="noopener">Message us on WhatsApp</a>
</section>

<section class="seccion">
  <div class="contenedor">
    <h2>Other days out from Cancun</h2>
    %(otras)s
  </div>
</section>

<a class="wa-flota" href="%(wa)s" target="_blank" rel="noopener" aria-label="WhatsApp">%(wasvg)s</a>

%(pie)s
</body>
</html>
""" % {
        "gtm": GTM, "barra": BARRA_SUP, "cabecera": CABECERA, "pie": PIE,
        "wasvg": WA_SVG, "base": BASE, "url": url,
        "title": p["title"], "desc": p["desc"], "h1": p["h1"],
        "foto": p["foto"], "sub": SUB, "wa": enlace_wa,
        "schema": datos_estructurados(p, url),
        "intro": parrafos_intro,
        "personas": tabla_personas(), "tarifas": tabla_tarifas(),
        "recargo": C.RECARGO, "aclaracion": ACLARACION,
        "porque_h": p["porque_h"], "porque": parrafos_porque,
        "itin_h": p["itin_h"], "pasos": pasos,
        "incluye": incluye, "no_incluye": no_incluye,
        "porque2_h": p["porque2_h"], "porque2": parrafos_porque2,
        "resenas": bloque_resenas(), "faqs": faqs,
        "otras": otras_paginas(p["slug"]),
    }


def main():
    destino_css = os.path.join(SALIDA, "paginas-destino")
    os.makedirs(destino_css, exist_ok=True)
    with open(os.path.join(AQUI, "estilos.css"), encoding="utf-8") as f:
        css = f.read()
    with open(os.path.join(destino_css, "estilos.css"), "w",
              encoding="utf-8") as f:
        f.write(css)
    print("escrito  /paginas-destino/estilos.css")

    for p in C.PAGINAS:
        carpeta = os.path.join(SALIDA, p["slug"])
        os.makedirs(carpeta, exist_ok=True)
        htm = pagina(p)
        with open(os.path.join(carpeta, "index.html"), "w",
                  encoding="utf-8") as f:
            f.write(htm)
        palabras = len(texto_plano(
            re.sub(r"(?is)<(script|style|head)[^>]*>.*?</\1>", " ", htm)
        ).split())
        print("escrito  /%s/index.html  (%d palabras visibles)"
              % (p["slug"], palabras))


if __name__ == "__main__":
    main()
