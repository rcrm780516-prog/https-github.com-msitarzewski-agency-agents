# 🍽️ Programa de Lealtad con QR para Restaurante

App **gratis, sin costo de hosting**, para dar tarjetas de lealtad por QR:
cada cliente tiene un **QR único**, sumas visitas al escanearlo, y el sistema
te dice en mesa qué **premio o descuento** le toca (ej. café gratis cada 10
visitas, 50% de descuento cada 5). Todo se maneja desde una **mesa de control
(CRM)** que abres con un link en cualquier PC o celular.

## ¿Qué incluye?

| Archivo | Para qué sirve |
|---|---|
| `index.html` | **Mesa de control (CRM).** Registrar clientes, ver visitas, generar/imprimir el QR, estadísticas. La abres en la PC. |
| `escanear.html` | **Vista del mesero.** Es la página que abre el QR al escanearlo con el celular: muestra las visitas y el premio, y tiene el botón "Registrar visita". |
| `config.js` | **El único archivo que editas.** Nombre del restaurante, premios y (opcional) conexión a la nube. |
| `schema.sql` | Script para crear la base de datos en Supabase (solo si usas la nube). |
| `assets/` | Diseño, lógica y el generador de QR (funciona sin internet). |

---

## 🚀 Opción 1: Probarlo YA (modo demo, 0 configuración)

1. Abre `index.html` en tu navegador (doble clic o publícalo, ver abajo).
2. Registra un cliente → se genera su QR.
3. Registra visitas y observa cómo aparecen los premios.

> ⚠️ En **modo demo** los datos se guardan solo en **ese** navegador. El QR
> escaneado desde otro celular **no verá** los mismos datos. Para uso real
> (que el mesero escanee en su celular y tú lo veas en la PC), usa la Opción 2.

---

## ☁️ Opción 2: Nube gratis con Supabase (recomendada para uso real)

Así los datos se **sincronizan al instante** entre el celular del mesero y la
PC. Es **gratis y permanente** (el plan Free de Supabase sobra para un
restaurante). Toma ~5 minutos.

1. Crea una cuenta gratis en **https://supabase.com** y un **New Project**
   (elige una contraseña para la base de datos y espera ~2 min a que se cree).
2. Ve a **SQL Editor → New query**, pega **todo** el contenido de
   `schema.sql` y presiona **Run**. Esto crea las tablas.
3. Ve a **Project Settings → API** y copia:
   - **Project URL** (ej: `https://abcdxyz.supabase.co`)
   - **anon public** key (una cadena larga que empieza con `eyJ...`). Es
     pública, es normal exponerla en la app.
4. Abre `config.js` y cambia:
   ```js
   backend: "supabase",
   supabaseUrl: "https://abcdxyz.supabase.co",   // tu Project URL
   supabaseKey: "eyJhbGciOiJI...",               // tu anon public key
   ```
5. Vuelve a publicar (o recarga). Arriba a la derecha debe decir
   **"● Nube conectada"**. ¡Listo!

Para monitorear directamente los datos también puedes entrar a Supabase →
**Table Editor** y ver las tablas `customers` y `visits` como una hoja de cálculo.

---

## 🌐 Publicar el link gratis con GitHub Pages

Para que la mesa de control se abra desde **cualquier PC/celular** con un link:

1. Sube esta carpeta a tu repositorio de GitHub (ya está en la rama de trabajo).
2. En GitHub: **Settings → Pages**.
3. En **Build and deployment → Source** elige **Deploy from a branch**.
4. Selecciona la rama y la carpeta raíz (`/root`), guarda.
5. En 1–2 minutos tendrás un link tipo:
   ```
   https://TU-USUARIO.github.io/TU-REPO/restaurant-loyalty/index.html
   ```
   Ese es el link de la **mesa de control**. Los QR que genera apuntan
   automáticamente a `escanear.html` en ese mismo link, así que el mesero solo
   escanea y funciona.

> 💡 Si usas modo demo, cada dispositivo verá sus propios datos aunque el link
> sea el mismo. Para datos compartidos, activa Supabase (Opción 2).

---

## 🎁 Personalizar los premios

Todo se edita en `config.js`, sin saber programar. Ejemplo:

```js
rewards: [
  { everyVisits: 10, label: "Café gratis",                            icon: "☕" },
  { everyVisits: 5,  label: "50% de descuento en su próximo consumo", icon: "🎉" },
  { everyVisits: 20, label: "Postre de la casa",                      icon: "🍰" }
]
```

- `everyVisits`: cada cuántas visitas se otorga el premio.
- `label`: el texto que verá el mesero en mesa.
- `icon`: un emoji decorativo.

También puedes poner un **PIN** para la mesa de control:

```js
crmPin: "1234"
```

---

## 🔒 Nota de seguridad

La app es un sitio estático que usa la *anon key* de Supabase (pública) con
permisos de lectura/escritura. Es adecuado para un negocio pequeño. Si en el
futuro necesitas control por empleado o auditoría estricta, se puede añadir
autenticación de Supabase y afinar las políticas (RLS) del archivo `schema.sql`.

## 🖨️ Entregar el QR al cliente

En la mesa de control, abre un cliente y usa **"Imprimir QR"** para darle una
tarjeta física, o toma captura del QR para enviárselo por WhatsApp. El cliente
lo muestra en cada visita y el mesero lo escanea.
