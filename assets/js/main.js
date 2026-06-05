/* ============================================================
   Sky Solutions MX — Lógica de interfaz principal
   (La animación de intro está en intro.js)
   ============================================================ */
(function () {
  "use strict";

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ----------------------------------------------------------
     1) IDIOMA (i18n)
     ---------------------------------------------------------- */
  const LANG_KEY = "ssmx-lang";

  function detectLang() {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === "es" || saved === "en") return saved;
    return (navigator.language || "es").toLowerCase().startsWith("en") ? "en" : "es";
  }

  function applyLang(lang) {
    const dict = (window.I18N && window.I18N[lang]) || {};
    document.documentElement.lang = lang;

    $$("[data-i18n]").forEach((el) => {
      const k = el.getAttribute("data-i18n");
      if (dict[k] != null) el.textContent = dict[k];
    });
    $$("[data-i18n-placeholder]").forEach((el) => {
      const k = el.getAttribute("data-i18n-placeholder");
      if (dict[k] != null) el.setAttribute("placeholder", dict[k]);
    });

    $$(".lang-opt").forEach((o) => o.classList.toggle("active", o.dataset.lang === lang));
    localStorage.setItem(LANG_KEY, lang);
    window.__lang = lang;
  }

  let lang = detectLang();
  applyLang(lang);

  const langBtn = $("#lang-btn");
  if (langBtn) {
    langBtn.addEventListener("click", () => {
      lang = lang === "es" ? "en" : "es";
      applyLang(lang);
    });
  }

  /* ----------------------------------------------------------
     2) HEADER: glass blur al hacer scroll
     ---------------------------------------------------------- */
  const header = $("#header");
  const syncHeader = () => header.classList.toggle("stuck", window.scrollY > 30);
  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });

  /* ----------------------------------------------------------
     3) MENÚ MÓVIL
     ---------------------------------------------------------- */
  const burger = $("#burger");
  const nav    = $("#main-nav");

  if (burger && nav) {
    const close = () => {
      nav.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    };
    burger.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
    });
    $$("a", nav).forEach((a) => a.addEventListener("click", close));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  }

  /* ----------------------------------------------------------
     4) REVEAL ON SCROLL (IntersectionObserver)
     ---------------------------------------------------------- */
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if ("IntersectionObserver" in window && !reducedMotion) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    );
    $$(".reveal, .reveal-left, .reveal-right").forEach((el) => io.observe(el));
  } else {
    $$(".reveal, .reveal-left, .reveal-right").forEach((el) => el.classList.add("in"));
  }

  /* ----------------------------------------------------------
     5) AÑO DINÁMICO EN EL FOOTER
     ---------------------------------------------------------- */
  const yr = $("#year");
  if (yr) yr.textContent = String(new Date().getFullYear());

  /* ----------------------------------------------------------
     6) FORMULARIO DE CONTACTO
        Cambia FORM_ENDPOINT por tu endpoint real (Formspree,
        Netlify Forms, etc.) antes de publicar el sitio.
        Si es null, usa el fallback mailto.
     ---------------------------------------------------------- */
  const FORM_ENDPOINT  = null; // Ejemplo: "https://formspree.io/f/tu-id"
  const FALLBACK_EMAIL = "contacto@skysolutionmx.com";

  const t = (k) => {
    const l = window.__lang || "es";
    return (window.I18N && window.I18N[l] && window.I18N[l][k]) || "";
  };

  const form     = $("#contact-form");
  const statusEl = $("#form-status");

  if (form && statusEl) {
    // Limpiar estado "invalid" al escribir
    $$("input, textarea", form).forEach((el) =>
      el.addEventListener("input", () => el.closest(".field").classList.remove("invalid"))
    );

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      statusEl.className = "form-status";
      statusEl.textContent = "";

      // Validación mínima
      let valid = true;
      ["cf-name", "cf-email", "cf-message"].forEach((id) => {
        const input = $("#" + id);
        const field = input.closest(".field");
        const ok = input.checkValidity() && input.value.trim() !== "";
        field.classList.toggle("invalid", !ok);
        if (!ok) valid = false;
      });

      if (!valid) {
        statusEl.className = "form-status err";
        statusEl.textContent = t("form.error");
        return;
      }

      const data = Object.fromEntries(new FormData(form).entries());

      if (FORM_ENDPOINT) {
        statusEl.textContent = t("form.sending");
        try {
          const res = await fetch(FORM_ENDPOINT, {
            method: "POST",
            headers: { Accept: "application/json" },
            body: new FormData(form),
          });
          if (!res.ok) throw new Error("server error");
          form.reset();
          statusEl.className = "form-status ok";
          statusEl.textContent = t("form.success");
        } catch {
          statusEl.className = "form-status err";
          statusEl.textContent = t("form.error");
        }
      } else {
        // Fallback: abrir cliente de correo
        const subject = encodeURIComponent(`[Web] ${data.service || "Cotización"} — ${data.name}`);
        const body = encodeURIComponent(
          `Nombre: ${data.name}\nCorreo: ${data.email}\nTeléfono: ${data.phone || "-"}\nServicio: ${data.service}\n\n${data.message}`
        );
        window.location.href = `mailto:${FALLBACK_EMAIL}?subject=${subject}&body=${body}`;
        statusEl.className = "form-status ok";
        statusEl.textContent = t("form.success");
      }
    });
  }
})();
