/* ============================================================
   Sky Solutions MX — Animación de intro con chroma key por canvas

   El video del rapelista (MP4 con fondo verde) se procesa
   frame a frame en un <canvas> eliminando el color verde en
   tiempo real. Esto es más fiable que WebM-alpha y funciona
   en todos los navegadores modernos (Chrome, Firefox, Safari).

   Flujo:
   1. El overlay cubre el sitio con la capa de espuma.
   2. El video oculto se reproduce.
   3. requestAnimationFrame dibuja cada frame en el canvas,
      removiendo los píxeles verdes vía manipulación de ImageData.
   4. Conforme avanza el video, la espuma se disuelve (--reveal 0→1)
      y el contenido del sitio se va viendo.
   5. Al terminar el video el overlay se desvanece.
   ============================================================ */
(function () {
  "use strict";

  const overlay  = document.getElementById("intro-overlay");
  const canvas   = document.getElementById("intro-canvas");
  const video    = document.getElementById("intro-video");
  const skipBtn  = document.getElementById("intro-skip");

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- Si no hay los elementos necesarios o el usuario prefiere
         sin movimiento, saltar la intro inmediatamente. --- */
  if (!overlay || !canvas || !video || prefersReduced) {
    if (overlay) overlay.classList.add("done");
    return;
  }

  /* --- Config del chroma key ---
     Ajusta KEY_R/G/B al color muestreado del fondo verde del video.
     THRESHOLD: qué tan "verde" debe ser un píxel para volverse transparent.
     SPILL: porcentaje de verde a eliminar en los bordes (anti-spill). */
  const KEY_R     = 76;
  const KEY_G     = 135;
  const KEY_B     = 87;
  const THRESHOLD = 72;   // distancia euclidiana en espacio RGB
  const SPILL     = 0.55; // corrección de derrame verde en bordes

  let ctx, rafId, done = false;

  /* --------------------------------------------------------
     Función de chroma key:
     Recorre cada píxel del frame; si la distancia al color
     clave es menor que THRESHOLD, lo vuelve transparente.
     Para los bordes aplica corrección de derrame.
     -------------------------------------------------------- */
  function removeGreen(imageData) {
    const d = imageData.data;
    const thr2 = THRESHOLD * THRESHOLD;
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i], g = d[i+1], b = d[i+2];
      const dr = r - KEY_R, dg = g - KEY_G, db = b - KEY_B;
      const dist2 = dr*dr + dg*dg + db*db;

      if (dist2 < thr2) {
        // Píxel dentro del rango: completamente transparente
        d[i+3] = 0;
      } else if (dist2 < thr2 * 3) {
        // Zona de borde: transparencia parcial + corrección derrame verde
        const alpha = Math.min(255, Math.round(255 * (dist2 - thr2) / (thr2 * 2)));
        d[i+3] = alpha;
        // Reduce el canal verde en los bordes para quitar el "spill"
        d[i+1] = Math.round(g * (1 - SPILL) + (r * 0.3 + b * 0.59) * SPILL);
      }
      // else: píxel normal, no tocar
    }
    return imageData;
  }

  /* --------------------------------------------------------
     Loop de renderizado
     -------------------------------------------------------- */
  function drawFrame() {
    if (done) return;
    if (video.readyState < 2) { rafId = requestAnimationFrame(drawFrame); return; }

    // Escalar canvas a video
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width  = video.videoWidth  || 1280;
      canvas.height = video.videoHeight || 720;
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      ctx.putImageData(removeGreen(imgData), 0, 0);
    } catch (e) {
      // CrossOrigin bloqueado (archivo://); el chroma key falla,
      // pero el video se muestra igual.
    }

    // Sincroniza el desvanecimiento de la espuma con el progreso del video
    const dur = isFinite(video.duration) && video.duration > 0 ? video.duration : 10;
    const progress = Math.min(1, Math.max(0, (video.currentTime - 0.5) / (dur - 1.2)));
    overlay.style.setProperty("--reveal", progress.toFixed(3));

    if (!done) rafId = requestAnimationFrame(drawFrame);
  }

  /* --------------------------------------------------------
     Terminar la intro
     -------------------------------------------------------- */
  function finish() {
    if (done) return;
    done = true;
    cancelAnimationFrame(rafId);
    video.pause();
    overlay.classList.add("done");
    document.body.classList.remove("no-scroll");
    window.removeEventListener("keydown", onKey);
  }

  function onKey(e) { if (e.key === "Escape") finish(); }

  /* --------------------------------------------------------
     Inicio
     -------------------------------------------------------- */
  function start() {
    overlay.classList.add("active");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");

    ctx = canvas.getContext("2d", { willReadFrequently: true });
    canvas.width  = 1280;
    canvas.height = 720;

    skipBtn.addEventListener("click", finish);
    window.addEventListener("keydown", onKey);

    video.addEventListener("ended", finish, { once: true });
    video.addEventListener("error", finish, { once: true });

    // Timeout de seguridad: si el video no carga o no termina en 15s
    const timeout = setTimeout(finish, 15000);
    video.addEventListener("ended", () => clearTimeout(timeout), { once: true });

    const play = video.play();
    if (play && typeof play.catch === "function") {
      play.catch(() => {
        // Autoplay bloqueado por el navegador (requiere interacción)
        finish();
      });
    }

    rafId = requestAnimationFrame(drawFrame);
  }

  /* ── Iniciar solo en la primera visita o recarga desde el top ── */
  if (window.scrollY < 20) {
    // Esperar que el DOM y el video estén listos
    if (document.readyState === "complete") {
      start();
    } else {
      window.addEventListener("load", start, { once: true });
    }
  }
  // Si el usuario llega scrolleado, no mostramos la intro
})();
