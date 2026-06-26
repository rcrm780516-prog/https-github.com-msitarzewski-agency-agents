# EventPass — Boletos Virtuales con QR

App web gratuita para generar y validar boletos de eventos con códigos QR.  
**Sin instalación · Sin costo · Funciona en cualquier celular o computadora.**

## Cómo usar

### Opción A — Abrir directo en el navegador
1. Descarga `index.html`
2. Ábrelo en cualquier navegador (Chrome, Safari, Firefox)
3. ¡Listo! Puedes crear eventos y generar boletos de inmediato.

### Opción B — Publicar en GitHub Pages (recomendado)
1. Sube `index.html` a un repositorio de GitHub
2. Activa GitHub Pages en Settings → Pages
3. Comparte el link con tu equipo — todos acceden desde sus celulares sin instalar nada.

---

## Flujo de trabajo

```
Organizador                          Personal en entrada
──────────                           ─────────────────
1. Crear evento                      
2. Generar boleto por asistente  →   Escanear QR con cámara del celular
3. Compartir boleto (WhatsApp,        ✅ Verde = Válido (marca como usado)
   email, imprimir)                  ❌ Rojo  = Ya utilizado / No encontrado
```

---

## Funcionalidades

| Feature | Descripción |
|---|---|
| 🎉 Múltiples eventos | Crea y gestiona varios eventos |
| 🎫 Generación de boletos | Nombre + email opcional → QR único |
| 🖨 Imprimir / PDF | Ticket listo para imprimir o guardar como PDF |
| 📤 Compartir | Usa el botón compartir para enviar por WhatsApp |
| 📷 Escáner QR | Cámara del celular para validar en la entrada |
| 📋 Lista de asistentes | Ver estado: pendiente / usado |
| 📊 Exportar CSV | Lista de boletos para Excel |
| 📦 Exportar / Importar JSON | Comparte datos entre dispositivos |
| ☁️ Supabase (opcional) | Multi-dispositivo en tiempo real |
| 🔊 Beep de validación | Sonido diferente para válido / inválido |

---

## Multi-dispositivo con Supabase (gratis)

Si necesitas que **varios celulares escaneen** al mismo tiempo:

1. Crea cuenta gratuita en [supabase.com](https://supabase.com)
2. Crea un proyecto nuevo
3. Ve a **SQL Editor** y ejecuta:

```sql
create table if not exists ep_events (
  id uuid primary key,
  name text not null,
  date text, time text, location text, description text,
  created_at bigint
);
create table if not exists ep_tickets (
  id uuid primary key,
  event_id uuid references ep_events(id),
  ticket_number text, attendee_name text, attendee_email text,
  is_used boolean default false, used_at bigint, created_at bigint
);
alter table ep_events  enable row level security;
alter table ep_tickets enable row level security;
create policy "public_all" on ep_events  for all using (true) with check (true);
create policy "public_all" on ep_tickets for all using (true) with check (true);
```

4. Ve a **Project Settings → API**, copia la URL y la `anon public` key
5. En la app, abre ⚙️ Configuración → ingresa esos valores → Conectar

Desde ese momento todos los dispositivos comparten la misma base de datos en tiempo real.

---

## Sin Supabase (uso en un solo dispositivo)

Los datos se guardan en el navegador (`localStorage`). Puedes:
- Generar boletos en la computadora del organizador
- Exportar JSON → importar en el celular del personal de entrada
- Usar ese celular para escanear toda la noche

---

## Tech stack (100% gratuito)

- HTML + CSS + JavaScript vanilla
- [Tailwind CSS](https://tailwindcss.com) — estilos (CDN)
- [qrcodejs](https://github.com/davidshimjs/qrcodejs) — generación de QR (CDN)
- [html5-qrcode](https://github.com/mebjas/html5-qrcode) — escaneo con cámara (CDN)
- [Supabase JS](https://supabase.com/docs/reference/javascript) — sync opcional (CDN)
