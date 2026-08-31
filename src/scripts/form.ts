/**
 * Formulario de lead: validacion accesible, anti-spam y envio por fetch.
 * Sin JS el formulario hace POST normal al endpoint y este redirige a /gracias/.
 */
const form = document.querySelector<HTMLFormElement>('[data-lead-form]');

if (form) {
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  const submitBtn = form.querySelector<HTMLButtonElement>('[data-form-submit]');
  const startedAt = Date.now();
  let started = false;

  // Contexto de atribucion y de pagina en los campos ocultos.
  const attr = window.gemmae?.attribution() ?? {};
  const setHidden = (name: string, value: string) => {
    const el = form.querySelector<HTMLInputElement>(`input[name="${name}"]`);
    if (el && !el.value) el.value = value;
  };
  setHidden('utm_source', attr.utm_source || '');
  setHidden('utm_medium', attr.utm_medium || '');
  setHidden('utm_campaign', attr.utm_campaign || '');
  setHidden('utm_content', attr.utm_content || '');
  setHidden('utm_term', attr.utm_term || '');
  setHidden('landing_page', attr.landing_page || location.pathname);
  setHidden('referrer', attr.referrer || document.referrer || 'direct');
  setHidden('page', location.pathname);
  setHidden('ts', String(startedAt));

  // Prellenado desde los CTA: /contacto/?servicio=embarazo&sede=toluca
  const params = new URLSearchParams(location.search);
  const servicio = params.get('servicio');
  const sede = params.get('sede');
  const medico = params.get('medico');
  if (servicio) {
    const select = form.querySelector<HTMLSelectElement>('#service');
    if (select && Array.from(select.options).some((o) => o.value === servicio)) select.value = servicio;
  }
  if (sede) {
    const radio = form.querySelector<HTMLInputElement>(`input[name="location"][value="${sede}"]`);
    if (radio) radio.checked = true;
  }
  if (medico) setHidden('doctor', medico);

  const showError = (field: string, message: string) => {
    const el = form.querySelector<HTMLElement>(`[data-error-for="${field}"]`);
    const input = form.querySelector<HTMLInputElement>(`[name="${field}"]`);
    if (el) el.textContent = message;
    input?.setAttribute('aria-invalid', 'true');
  };

  const clearErrors = () => {
    form.querySelectorAll<HTMLElement>('[data-error-for]').forEach((el) => (el.textContent = ''));
    form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
  };

  const validate = (): boolean => {
    clearErrors();
    let ok = true;
    const name = form.querySelector<HTMLInputElement>('#name')!;
    const phone = form.querySelector<HTMLInputElement>('#phone')!;
    const consent = form.querySelector<HTMLInputElement>('input[name="consent"]')!;

    if (name.value.trim().length < 2) {
      showError('name', 'Escribe tu nombre para poder contactarte.');
      ok = false;
    }
    const digits = phone.value.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 15) {
      showError('phone', 'Escribe un número de WhatsApp válido a 10 dígitos.');
      ok = false;
    }
    if (!consent.checked) {
      showError('consent', 'Necesitamos tu autorización para contactarte.');
      ok = false;
    }
    if (!ok) {
      form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    }
    return ok;
  };

  form.addEventListener(
    'input',
    () => {
      if (!started) {
        started = true;
        window.gemmae?.track('form_start', { form: 'contacto' });
      }
    },
    { once: false }
  );

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Anti-bot: honeypot lleno o envio demasiado rapido.
    const hp = form.querySelector<HTMLInputElement>('input[name="website"]');
    const tooFast = Date.now() - startedAt < Number(form.dataset.minSeconds || 3) * 1000;
    if (hp?.value || tooFast) {
      if (status) {
        status.hidden = false;
        status.dataset.state = 'error';
        status.textContent = 'No pudimos enviar tu solicitud. Escríbenos por WhatsApp y te atendemos.';
      }
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    submitBtn && (submitBtn.disabled = true);
    if (status) {
      status.hidden = false;
      status.removeAttribute('data-state');
      status.textContent = 'Enviando tu solicitud…';
    }

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(String(res.status));

      window.gemmae?.track('form_submit', {
        form: 'contacto',
        service: String(data.service || ''),
        location: String(data.location || ''),
      });
      window.location.assign('/gracias/');
    } catch {
      submitBtn && (submitBtn.disabled = false);
      if (status) {
        status.hidden = false;
        status.dataset.state = 'error';
        status.innerHTML =
          'No pudimos enviar tu solicitud en este momento. ' +
          'Puedes intentar de nuevo o <a href="#" data-wa-inline>escribirnos por WhatsApp</a>.';
        document.querySelectorAll<HTMLAnchorElement>('[data-wa-inline]').forEach(setWaFallback);
      }
      window.gemmae?.track('form_error', { form: 'contacto' });
    }
  });

  // Enlace de respaldo a WhatsApp con lo que la usuaria ya escribio.
  function setWaFallback(link: HTMLAnchorElement) {
    const name = form!.querySelector<HTMLInputElement>('#name')?.value || '';
    const service = form!.querySelector<HTMLSelectElement>('#service')?.value || '';
    const text = `Hola GEMMAE, soy ${name || '[nombre]'}. Quiero agendar una consulta${
      service ? ` de ${service.replace(/-/g, ' ')}` : ''
    }.`;
    link.href = `https://wa.me/?text=${encodeURIComponent(text)}`;
    link.dataset.event = 'click_whatsapp';
    link.dataset.source = 'form_fallback';
  }
  document.querySelectorAll<HTMLAnchorElement>('[data-wa-inline]').forEach((link) => {
    link.addEventListener('mouseenter', () => setWaFallback(link));
    link.addEventListener('focus', () => setWaFallback(link));
    setWaFallback(link);
  });
}
