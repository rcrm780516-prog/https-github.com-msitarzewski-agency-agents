# agent/notificaciones.py — Avisos al equipo humano (handoff)
# Generado por AgentKit

"""
Envía una notificación por WhatsApp a la línea de atención del equipo
(998 344 1662) cuando Sofía detecta que debe intervenir un humano:
- ya se dieron precios/costos, o
- el cliente pidió una cita o una llamada.

Canales (en orden de preferencia):
1) CallMeBot  -> confiable y gratis, sin plantillas de Meta.
                Requiere CALLMEBOT_PHONE y CALLMEBOT_APIKEY.
                Activación (una vez): el número 998 344 1662 debe enviar por WhatsApp
                el mensaje "I allow callmebot to send me messages" al +34 644 51 95 23,
                y CallMeBot le responde con su apikey. Más info: https://www.callmebot.com/blog/free-api-whatsapp-messages/
2) Meta Cloud API -> usa el mismo número del bot para escribir a NOTIFY_WHATSAPP.
                OJO: por la regla de 24h de Meta, fuera de ventana requiere plantilla
                aprobada; por eso CallMeBot es más confiable para avisos internos.
"""

import os
import logging
import httpx

logger = logging.getLogger("agentkit")

NOTIFY_WHATSAPP = os.getenv("NOTIFY_WHATSAPP", "5219983441662")  # solo dígitos, internacional
CALLMEBOT_PHONE = os.getenv("CALLMEBOT_PHONE", "")
CALLMEBOT_APIKEY = os.getenv("CALLMEBOT_APIKEY", "")

_META_TOKEN = os.getenv("META_ACCESS_TOKEN", "")
_META_PNID = os.getenv("META_PHONE_NUMBER_ID", "")
_API_VERSION = "v21.0"


async def notificar_equipo(texto: str) -> bool:
    """Intenta notificar al equipo por WhatsApp. Devuelve True si algún canal lo logró."""
    # 1) CallMeBot (preferido)
    if CALLMEBOT_PHONE and CALLMEBOT_APIKEY:
        try:
            params = {"phone": CALLMEBOT_PHONE, "text": texto, "apikey": CALLMEBOT_APIKEY}
            async with httpx.AsyncClient() as client:
                r = await client.get("https://api.callmebot.com/whatsapp.php", params=params, timeout=20)
            if r.status_code == 200:
                logger.info("Notificación al equipo enviada (CallMeBot)")
                return True
            logger.warning(f"CallMeBot falló: {r.status_code} — {r.text[:200]}")
        except Exception as e:
            logger.warning(f"CallMeBot error: {e}")

    # 2) Meta Cloud API (respaldo)
    if _META_TOKEN and _META_PNID and NOTIFY_WHATSAPP:
        try:
            url = f"https://graph.facebook.com/{_API_VERSION}/{_META_PNID}/messages"
            headers = {"Authorization": f"Bearer {_META_TOKEN}", "Content-Type": "application/json"}
            payload = {
                "messaging_product": "whatsapp",
                "to": NOTIFY_WHATSAPP,
                "type": "text",
                "text": {"body": texto},
            }
            async with httpx.AsyncClient() as client:
                r = await client.post(url, json=payload, headers=headers, timeout=20)
            if r.status_code == 200:
                logger.info("Notificación al equipo enviada (Meta)")
                return True
            logger.warning(f"Meta notif falló: {r.status_code} — {r.text[:300]}")
        except Exception as e:
            logger.warning(f"Meta notif error: {e}")

    logger.warning("No se pudo notificar al equipo: configura CALLMEBOT_* o revisa Meta.")
    return False
