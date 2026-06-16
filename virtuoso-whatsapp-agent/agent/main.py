# agent/main.py — Servidor FastAPI + Webhook de WhatsApp
# Generado por AgentKit

"""
Servidor principal del agente de WhatsApp de Virtuoso Marketing.
Funciona con cualquier proveedor (Meta, Twilio) gracias a la capa de providers.
"""

import os
import asyncio
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import PlainTextResponse, HTMLResponse, Response
from dotenv import load_dotenv

from agent.brain import generar_respuesta
from agent.memory import (
    inicializar_db, guardar_mensaje, obtener_historial, registrar_contacto,
)
from agent.providers import obtener_proveedor
from agent import crm

load_dotenv()

# Conserva referencias de tareas en segundo plano para que no las recoja el GC
_tareas_fondo: set = set()


def _en_segundo_plano(corutina):
    """Lanza una corutina en segundo plano sin bloquear la respuesta de WhatsApp."""
    tarea = asyncio.create_task(corutina)
    _tareas_fondo.add(tarea)
    tarea.add_done_callback(_tareas_fondo.discard)

# Configuración de logging según entorno
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
log_level = logging.DEBUG if ENVIRONMENT == "development" else logging.INFO
logging.basicConfig(level=log_level)
logger = logging.getLogger("agentkit")

# Proveedor de WhatsApp (se configura en .env con WHATSAPP_PROVIDER)
proveedor = obtener_proveedor()
PORT = int(os.getenv("PORT", 8000))


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Inicializa la base de datos al arrancar el servidor."""
    await inicializar_db()
    logger.info("Base de datos inicializada")
    logger.info(f"Servidor AgentKit corriendo en puerto {PORT}")
    logger.info(f"Proveedor de WhatsApp: {proveedor.__class__.__name__}")
    yield


app = FastAPI(
    title="Virtuoso Marketing — Agente WhatsApp (Sofía)",
    version="1.0.0",
    lifespan=lifespan
)


@app.get("/")
async def health_check():
    """Endpoint de salud para Railway/monitoreo."""
    return {"status": "ok", "service": "virtuoso-sofia"}


@app.get("/webhook")
async def webhook_verificacion(request: Request):
    """Verificación GET del webhook (requerido por Meta Cloud API, no-op para otros)."""
    resultado = await proveedor.validar_webhook(request)
    if resultado is not None:
        return PlainTextResponse(str(resultado))
    return {"status": "ok"}


@app.post("/webhook")
async def webhook_handler(request: Request):
    """
    Recibe mensajes de WhatsApp via el proveedor configurado.
    Procesa el mensaje, genera respuesta con Claude y la envía de vuelta.
    """
    try:
        # Parsear webhook — el proveedor normaliza el formato
        mensajes = await proveedor.parsear_webhook(request)

        for msg in mensajes:
            # Ignorar mensajes propios o vacíos
            if msg.es_propio or not msg.texto:
                continue

            logger.info(f"Mensaje de {msg.telefono}: {msg.texto}")

            # CRM: registra el contacto y su actividad
            await registrar_contacto(msg.telefono)

            # Obtener historial ANTES de guardar el mensaje actual
            # (brain.py agrega el mensaje actual, evitando duplicados)
            historial = await obtener_historial(msg.telefono)

            # Generar respuesta con Claude
            respuesta = await generar_respuesta(msg.texto, historial)

            # Guardar mensaje del usuario Y respuesta del agente en memoria
            await guardar_mensaje(msg.telefono, "user", msg.texto)
            await guardar_mensaje(msg.telefono, "assistant", respuesta)

            # Enviar respuesta por WhatsApp via el proveedor
            await proveedor.enviar_mensaje(msg.telefono, respuesta)

            logger.info(f"Respuesta a {msg.telefono}: {respuesta}")

            # CRM: en segundo plano, extrae/actualiza los datos del lead (no bloquea)
            _en_segundo_plano(crm.actualizar_lead_desde_conversacion(msg.telefono))

        return {"status": "ok"}

    except Exception as e:
        logger.error(f"Error en webhook: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ════════════════════════════════════════════════════════════
# Panel privado del CRM (protegido con ADMIN_KEY)
# ════════════════════════════════════════════════════════════

def _verificar_admin(key: str):
    """Valida el acceso al panel. Lanza 403/404 si no procede."""
    if not crm.admin_habilitado():
        raise HTTPException(status_code=404, detail="Panel no configurado (define ADMIN_KEY)")
    if not crm.clave_valida(key):
        raise HTTPException(status_code=403, detail="Clave incorrecta")


@app.get("/admin", response_class=HTMLResponse)
async def admin_dashboard(key: str = ""):
    """Panel principal del CRM: métricas + lista de leads."""
    _verificar_admin(key)
    return await crm.render_dashboard(key)


@app.get("/admin/chat", response_class=HTMLResponse)
async def admin_chat(tel: str, key: str = ""):
    """Vista de una conversación completa."""
    _verificar_admin(key)
    return await crm.render_chat(tel, key)


@app.get("/admin/export.csv")
async def admin_export(key: str = "", estado: str = ""):
    """Descarga todos los leads en CSV (para Excel/Google Sheets)."""
    _verificar_admin(key)
    contenido = await crm.exportar_csv(estado=estado or None)
    return Response(
        content=contenido,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=leads-virtuoso.csv"},
    )
