/* ============================================================
   Sky Solutions MX — Lógica de la interfaz
   ============================================================ */
(function () {
  "use strict";

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----------------------------------------------------------
     1) IDIOMA (i18n)
     ---------------------------------------------------------- */
  const STORE_KEY = "ssmx-lang";

  function detectLang() {
    const saved = localStorage.getItem(STORE_KEY);
    if (saved === "es" || saved === "en") return saved;
    return (navigator.language || "es").toLowerCase().startsWith("en") ? "en" : "es";
  }

  function applyLang(lang) {
    const dict = (window.I18N && window.I18N[lang]) || {};
    document.documentElement.lang = lang;

    $$("[data-i18n]").forEach((el) => {
      const val = dict[el.getAttribute("data-i18n")];
      if (val != null) el.textContent = val;
    });
    $$("[data-i18n-placeholder]").forEach((el) => {
      const val = dict[el.getAttribute("data-i18n-placeholder")];
      if (val != null) el.setAttribute("placeholder", val);
    });

    $$(".lang-opt").forEach((o) => o.classList.toggle("active", o.dataset.lang === lang));
    localStorage.setItem(STORE_KEY, lang);
    window.__lang = lang;
  }

  let currentLang = detectLang();
  applyLang(currentLang);

  const langToggle = $("#lang-toggle");
  if (langToggle) {
    langToggle.addEventListener("click", () => {
      currentLang = currentLang === "es" ? "en" : "es";
      applyLang(currentLang);
    });
  }

  /* ----------------------------------------------------------
     2) HEADER: sombra al hacer scroll + menú móvil
     ---------------------------------------------------------- */
  const header = $("#header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const burger = $("#nav-burger");
  const nav = $("#nav");
  if (burger && nav) {
    const closeNav = () => { nav.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); };
    burger.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
    });
    $$("a", nav).forEach((a) => a.addEventListener("click", closeNav));
  }

  /* ----------------------------------------------------------
     3) REVELAR AL HACER SCROLL
     ---------------------------------------------------------- */
  const reveals = $$(".reveal");
  if ("IntersectionObserver" in window && !prefersReduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("visible"));
  }

  /* ----------------------------------------------------------
     4) AÑO EN EL FOOTER
     ---------------------------------------------------------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ----------------------------------------------------------
     5) INTRO / ANIMACIÓN DEL RAPELISTA
        - El video con canal alfa (rapelista limpiando) se reproduce
          sobre una capa de espuma.
        - Conforme avanza el video, la espuma se "limpia" (--reveal 0→1)
          dejando ver el contenido del sitio.
        - Al terminar, el overlay se desvanece.
        Fallbacks: prefers-reduced-motion, sin soporte WebM-alpha,
        error de carga o timeout -> se omite la intro.
     ---------------------------------------------------------- */
  const overlay = $("#intro-overlay");
  const video = $("#intro-video");
  const skipBtn = $("#intro-skip");

  function finishIntro() {
    if (!overlay) return;
    overlay.classList.add("done");
    document.body.classList.remove("intro-active");
    try { video && video.pause(); } catch (e) {}
    window.removeEventListener("keydown", onKey);
    setTimeout(() => overlay && overlay.remove(), 700);
  }

  function onKey(e) { if (e.key === "Escape") finishIntro(); }

  function canPlayWebmAlpha() {
    // VP8/VP9 con alpha solo es fiable fuera de Safari/iOS.
    if (!video || !video.canPlayType) return false;
    const ua = navigator.userAgent;
    const isAppleWebkit = /^((?!chrome|android|crios|fxios).)*safari/i.test(ua) || /iPad|iPhone|iPod/.test(ua);
    if (isAppleWebkit) return false;
    return !!video.canPlayType('video/webm; codecs="vp9"') ||
           !!video.canPlayType('video/webm; codecs="vp8, vorbis"');
  }

  function runIntro() {
    if (!overlay || !video || prefersReduced || !canPlayWebmAlpha()) {
      finishIntro();
      return;
    }

    document.body.classList.add("intro-active");
    overlay.classList.add("active");
    overlay.setAttribute("aria-hidden", "false");
    window.addEventListener("keydown", onKey);
    if (skipBtn) skipBtn.addEventListener("click", finishIntro);

    // Si el video no carga en 4s, omitir.
    const failSafe = setTimeout(finishIntro, 4000);

    const startReveal = () => {
      clearTimeout(failSafe);
      const dur = isFinite(video.duration) && video.duration > 0 ? video.duration : 5;

      const tick = () => {
        // Empezamos a limpiar después de un breve arranque y dejamos
        // el sitio totalmente visible un poco antes de que termine.
        const p = Math.min(1, Math.max(0, (video.currentTime - 0.4) / (dur - 0.9)));
        overlay.style.setProperty("--reveal", p.toFixed(3));
      };

      video.addEventListener("timeupdate", tick);
      video.addEventListener("ended", finishIntro);
      // Respaldo por si "ended" no dispara.
      setTimeout(finishIntro, (dur + 1.2) * 1000);
    };

    video.addEventListener("loadedmetadata", startReveal, { once: true });
    video.addEventListener("error", finishIntro, { once: true });

    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => finishIntro()); // autoplay bloqueado
    }
  }

  // Lanzar la intro solo si estamos al inicio de la página.
  if (window.scrollY < 40) {
    runIntro();
  } else {
    finishIntro();
  }

  /* ----------------------------------------------------------
     6) FORMULARIO DE CONTACTO
        Validación básica + estado. El envío real debe conectarse
        a un endpoint/servicio (ver README).
        Por defecto hace fallback a un enlace mailto.
     ---------------------------------------------------------- */
  const form = $("#contact-form");
  const statusEl = $("#form-status");

  // Cambia esto por la URL de tu endpoint (Formspree, Netlify, etc.)
  // o deja null para usar el fallback a correo.
  const FORM_ENDPOINT = null;
  const FALLBACK_EMAIL = "contacto@skysolutionmx.com";

  function t(key) {
    const lang = window.__lang || "es";
    return (window.I18N[lang] && window.I18N[lang][key]) || "";
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      statusEl.className = "form-status";
      statusEl.textContent = "";

      // Validación
      let ok = true;
      ["cf-name", "cf-email", "cf-message"].forEach((id) => {
        const input = $("#" + id);
        const field = input.closest(".field");
        const valid = input.checkValidity() && input.value.trim() !== "";
        field.classList.toggle("invalid", !valid);
        if (!valid) ok = false;
      });

      if (!ok) {
        statusEl.classList.add("err");
        statusEl.textContent = t("form.error");
        return;
      }

      const data = Object.fromEntries(new FormData(form).entries());

      if (FORM_ENDPOINT) {
        try {
          statusEl.textContent = t("form.sending");
          const res = await fetch(FORM_ENDPOINT, {
            method: "POST",
            headers: { "Accept": "application/json" },
            body: new FormData(form),
          });
          if (!res.ok) throw new Error("bad response");
          form.reset();
          statusEl.classList.add("ok");
          statusEl.textContent = t("form.success");
        } catch (err) {
          statusEl.classList.add("err");
          statusEl.textContent = t("form.error");
        }
      } else {
        // Fallback: abrir cliente de correo con los datos.
        const subject = encodeURIComponent(`[Web] ${data.service || "Cotización"} — ${data.name}`);
        const body = encodeURIComponent(
          `Nombre: ${data.name}\nCorreo: ${data.email}\nTeléfono: ${data.phone || "-"}\nServicio: ${data.service}\n\n${data.message}`
        );
        window.location.href = `mailto:${FALLBACK_EMAIL}?subject=${subject}&body=${body}`;
        statusEl.classList.add("ok");
        statusEl.textContent = t("form.success");
      }
    });

    // Limpiar estado "invalid" al escribir.
    $$("input, textarea", form).forEach((el) => {
      el.addEventListener("input", () => el.closest(".field").classList.remove("invalid"));
    });
  }
})();
