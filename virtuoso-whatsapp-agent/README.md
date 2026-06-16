# Sofía — Agente de WhatsApp de Virtuoso Marketing

Agente de WhatsApp con IA (Claude) para **Virtuoso Marketing**. Atiende clientes,
responde preguntas sobre planes y servicios, califica leads y los escala a un estratega humano.

Construido con [AgentKit](https://github.com/Hainrixz/whatsapp-agentkit) + Claude Code.

---

## ¿Qué hace Sofía?

- **Atención a clientes 24/7** por WhatsApp, con tono amigable y cercano.
- **Asesoría comercial (vendedora):** explica planes, precios y servicios de Virtuoso.
- **Calificación de leads:** descubre giro, objetivo, ciudad, presupuesto y necesidad,
  y recomienda el plan adecuado (sin prometer cifras, respetando las reglas comerciales).
- **Escala a un estratega humano** cuando el cliente está listo para cerrar.
- **Memoria por cliente:** recuerda la conversación de cada número de WhatsApp.

## Stack

| Componente | Tecnología |
|-----------|-----------|
| IA | Claude AI (`claude-sonnet-4-6`) |
| Servidor | FastAPI + Uvicorn |
| WhatsApp | Meta Cloud API |
| Base de datos | SQLite (local) / PostgreSQL (producción) |
| Deploy | Docker + Railway |

## Estructura

```
agent/
  main.py          Servidor FastAPI + webhook de WhatsApp
  brain.py         Conexión con Claude AI
  memory.py        Historial de conversaciones (SQLite/PostgreSQL)
  tools.py         Herramientas: calificar y registrar leads, buscar en knowledge
  providers/       Adaptador de Meta Cloud API
config/
  business.yaml    Datos de Virtuoso Marketing
  prompts.yaml     Personalidad y conocimiento de Sofía (system prompt)
knowledge/
  virtuoso-base-conocimiento.md   Planes, precios, reglas y FAQ
tests/
  test_local.py    Simulador de chat en terminal
```

## Probar en local

```bash
# 1. Instala dependencias
pip install -r requirements.txt

# 2. Configura tus llaves
cp .env.example .env   # y edita .env con tus credenciales reales

# 3. Chatea con Sofía en la terminal (necesitas ANTHROPIC_API_KEY)
python tests/test_local.py

# 4. O arranca el servidor del webhook
uvicorn agent.main:app --reload --port 8000
```

## Variables de entorno (`.env`)

```env
ANTHROPIC_API_KEY=sk-ant-...          # platform.anthropic.com
WHATSAPP_PROVIDER=meta
META_ACCESS_TOKEN=...                  # developers.facebook.com
META_PHONE_NUMBER_ID=...
META_VERIFY_TOKEN=virtuoso-sofia-2026  # invéntalo, debe coincidir con el de Meta
PORT=8000
ENVIRONMENT=development
DATABASE_URL=sqlite+aiosqlite:///./agentkit.db
```

> ⚠️ Nunca subas el archivo `.env` a GitHub. Ya está en `.gitignore`.

## Deploy a producción (Railway)

1. Sube este repo a tu GitHub (ya está listo).
2. En [railway.app](https://railway.app) → **New Project → Deploy from GitHub repo** → elige este repo.
3. En **Variables**, agrega las mismas de tu `.env` (con `ENVIRONMENT=production` y,
   opcionalmente, una base PostgreSQL de Railway en `DATABASE_URL`).
4. Copia la URL pública de Railway (ej. `https://tu-app.up.railway.app`).
5. En [developers.facebook.com](https://developers.facebook.com) → tu app → **WhatsApp → Configuration**:
   - **Callback URL:** `https://tu-app.up.railway.app/webhook`
   - **Verify Token:** el mismo de `META_VERIFY_TOKEN`
   - Suscríbete al campo **`messages`** y guarda.

Listo: cualquier persona que escriba al WhatsApp de Virtuoso será atendida por Sofía.

## Personalizar

Edita `config/prompts.yaml` para ajustar el tono o las reglas, y
`knowledge/virtuoso-base-conocimiento.md` para actualizar planes y precios.
También puedes pedirle cambios a Claude Code en lenguaje natural.

---

Hecho para **Virtuoso Marketing** · https://virtuoso.com.mx
