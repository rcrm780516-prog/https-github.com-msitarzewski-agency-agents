# agent/crm.py — CRM integrado de Sofía (Virtuoso Marketing)
# Generado por AgentKit

"""
Capa de CRM:
- Extrae automáticamente los datos del lead a partir de la conversación (con IA económica).
- Calcula métricas para el reporte semanal.
- Genera el panel privado /admin (ver chats, leads, estados, exportar y traspasar).

El panel se protege con la variable de entorno ADMIN_KEY. Si no está configurada,
el panel queda DESHABILITADO por seguridad.
"""

import os
import csv
import io
import json
import html
import logging
import urllib.parse

from anthropic import AsyncAnthropic
from dotenv import load_dotenv

from agent.memory import (
    actualizar_lead,
    listar_leads,
    obtener_lead,
    obtener_historial,
    estadisticas_crm,
    marcar_handoff,
)
from agent.notificaciones import notificar_equipo

load_dotenv()
logger = logging.getLogger("agentkit")

# Modelo económico para extracción estructurada (no necesita ser el grande)
MODELO_EXTRACCION = "claude-haiku-4-5-20251001"

# WhatsApp de atención a clientes (para traspaso). Solo dígitos, formato internacional.
WHATSAPP_ATENCION = os.getenv("WHATSAPP_ATENCION", "5219983441662")

ADMIN_KEY = os.getenv("ADMIN_KEY", "")

_client = AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

ESTADOS_VALIDOS = [
    "nuevo", "en_conversacion", "calificado",
    "propuesta_solicitada", "ganado", "perdido", "seguimiento",
]

_PROMPT_EXTRACCION = """Eres un extractor de datos de CRM. Lee la conversación entre un cliente y Sofía
(asesora de Virtuoso Marketing) y devuelve SOLO un JSON válido, sin texto extra, con esta forma:

{
  "nombre": "",
  "giro": "",
  "ciudad": "",
  "objetivo": "",
  "presupuesto": "",
  "plan_interes": "",
  "temperatura": "frio|tibio|caliente",
  "estado": "nuevo|en_conversacion|calificado|propuesta_solicitada|ganado|perdido|seguimiento",
  "resumen": "",
  "dio_precio": false,
  "pidio_cita_o_llamada": false
}

Reglas:
- Llena solo lo que se deduzca de la conversación; si algo no se sabe, deja "".
- "temperatura": caliente si pidió propuesta/precio o dio varios datos; tibio si muestra interés; frio si apenas saluda.
- "estado": usa "propuesta_solicitada" si pidió hablar con un estratega o una cotización;
  "calificado" si ya dio giro+objetivo+ciudad; "ganado" solo si confirmó contratar;
  "perdido" si dijo claramente que no le interesa; si no, "en_conversacion".
- "resumen": 1-2 frases con lo más importante para que un humano dé seguimiento.
- "dio_precio": true si Sofía YA mencionó un costo/precio/cifra de algún plan en la conversación.
- "pidio_cita_o_llamada": true si el cliente pidió una cita, una llamada, que lo contacten,
  hablar con un asesor/estratega o dejó/pidió datos de contacto.
- Responde ÚNICAMENTE el JSON."""


async def actualizar_lead_desde_conversacion(telefono: str):
    """
    Lee el historial reciente y usa IA económica para extraer/actualizar
    los datos del lead. Pensada para correrse en segundo plano (no bloquea la respuesta).
    """
    try:
        historial = await obtener_historial(telefono, limite=20)
        if not historial:
            return
        conversacion = "\n".join(
            f"{'Cliente' if m['role'] == 'user' else 'Sofía'}: {m['content']}"
            for m in historial
        )
        resp = await _client.messages.create(
            model=MODELO_EXTRACCION,
            max_tokens=500,
            system=_PROMPT_EXTRACCION,
            messages=[{"role": "user", "content": conversacion}],
        )
        texto = resp.content[0].text.strip()
        # Limpiar posibles ```json ... ```
        if texto.startswith("```"):
            texto = texto.strip("`")
            texto = texto[texto.find("{"):texto.rfind("}") + 1]
        datos = json.loads(texto)
        if datos.get("estado") not in ESTADOS_VALIDOS:
            datos.pop("estado", None)

        # Separar las banderas de disparo (no son campos de texto del lead)
        dio_precio = bool(datos.pop("dio_precio", False))
        pidio_cita = bool(datos.pop("pidio_cita_o_llamada", False))

        await actualizar_lead(telefono, datos)
        logger.info(f"CRM: lead {telefono} actualizado ({datos.get('estado', '')})")

        # Handoff automático: avisar al equipo una sola vez por lead
        if dio_precio or pidio_cita:
            lead = await obtener_lead(telefono) or {}
            if not lead.get("handoff_enviado"):
                motivo = "pidió cita/llamada" if pidio_cita else "ya se le dieron precios"
                await _notificar_handoff(telefono, lead, motivo)
    except Exception as e:
        logger.warning(f"CRM: no se pudo actualizar lead {telefono}: {e}")


async def _notificar_handoff(telefono: str, lead: dict, motivo: str):
    """Construye y envía el aviso al equipo, y marca el lead para no repetir."""
    mensaje = (
        f"🔔 *Lead listo para seguimiento* — Sofía\n"
        f"Motivo: {motivo}\n"
        f"Tel cliente: {telefono}\n"
        f"Nombre: {lead.get('nombre') or '-'}\n"
        f"Giro: {lead.get('giro') or '-'} · Ciudad: {lead.get('ciudad') or '-'}\n"
        f"Interés: {lead.get('plan_interes') or '-'}\n"
        f"Resumen: {lead.get('resumen') or '-'}\n"
        f"Escríbele: https://wa.me/{telefono.lstrip('+')}"
    )
    ok = await notificar_equipo(mensaje)
    if ok:
        await marcar_handoff(telefono, motivo)
        logger.info(f"CRM: handoff notificado para {telefono} ({motivo})")


# ════════════════════════════════════════════════════════════
# Exportación y traspaso
# ════════════════════════════════════════════════════════════

async def exportar_csv(estado: str | None = None) -> str:
    """Devuelve todos los leads como texto CSV (para Excel/Sheets)."""
    leads = await listar_leads(estado=estado)
    salida = io.StringIO()
    campos = [
        "telefono", "nombre", "giro", "ciudad", "objetivo", "presupuesto",
        "plan_interes", "estado", "temperatura", "resumen", "notas",
        "mensajes_count", "creado", "actualizado", "ultimo_mensaje",
    ]
    writer = csv.DictWriter(salida, fieldnames=campos)
    writer.writeheader()
    for lead in leads:
        writer.writerow({k: lead.get(k, "") for k in campos})
    return salida.getvalue()


def link_traspaso(lead: dict) -> str:
    """
    Genera un link wa.me hacia el WhatsApp de atención a clientes con un resumen
    del cliente, para 'migrar' la conversación al equipo humano.
    """
    resumen = (
        f"Nuevo cliente desde Sofía 🤖\n"
        f"Tel: {lead.get('telefono','')}\n"
        f"Nombre: {lead.get('nombre','') or '-'}\n"
        f"Giro: {lead.get('giro','') or '-'}\n"
        f"Ciudad: {lead.get('ciudad','') or '-'}\n"
        f"Interés: {lead.get('plan_interes','') or '-'}\n"
        f"Estado: {lead.get('estado','')}\n"
        f"Resumen: {lead.get('resumen','') or '-'}"
    )
    return f"https://wa.me/{WHATSAPP_ATENCION}?text=" + urllib.parse.quote(resumen)


# ════════════════════════════════════════════════════════════
# Panel HTML /admin
# ════════════════════════════════════════════════════════════

_COLOR_ESTADO = {
    "nuevo": "#6B7280", "en_conversacion": "#3B82F6", "calificado": "#8B5CF6",
    "propuesta_solicitada": "#F59E0B", "ganado": "#10B981",
    "perdido": "#EF4444", "seguimiento": "#06B6D4",
}
_EMOJI_TEMP = {"caliente": "🔥", "tibio": "🌤️", "frio": "❄️"}


def admin_habilitado() -> bool:
    return bool(ADMIN_KEY)


def clave_valida(clave: str) -> bool:
    return bool(ADMIN_KEY) and clave == ADMIN_KEY


def _e(texto) -> str:
    return html.escape(str(texto or ""))


def _layout(titulo: str, cuerpo: str, key: str) -> str:
    return f"""<!doctype html><html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{_e(titulo)} — CRM Sofía</title>
<style>
 body{{font-family:-apple-system,Segoe UI,Roboto,sans-serif;margin:0;background:#0f172a;color:#e2e8f0}}
 header{{background:#1e293b;padding:16px 20px;display:flex;align-items:center;gap:12px;flex-wrap:wrap}}
 header h1{{font-size:18px;margin:0}} a{{color:#38bdf8;text-decoration:none}}
 .wrap{{padding:20px;max-width:1100px;margin:0 auto}}
 .cards{{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:20px}}
 .card{{background:#1e293b;border-radius:12px;padding:16px 20px;min-width:130px}}
 .card .n{{font-size:28px;font-weight:700}} .card .l{{font-size:12px;color:#94a3b8}}
 table{{width:100%;border-collapse:collapse;background:#1e293b;border-radius:12px;overflow:hidden}}
 th,td{{padding:10px 12px;text-align:left;font-size:14px;border-bottom:1px solid #334155}}
 th{{background:#0f172a;color:#94a3b8;font-size:12px;text-transform:uppercase}}
 .badge{{padding:3px 8px;border-radius:999px;color:#fff;font-size:11px;white-space:nowrap}}
 .btn{{display:inline-block;background:#10b981;color:#fff;padding:6px 12px;border-radius:8px;font-size:13px;margin-right:6px}}
 .btn.gray{{background:#334155}} .msg{{margin:8px 0;padding:10px 14px;border-radius:12px;max-width:80%}}
 .msg.user{{background:#334155}} .msg.assistant{{background:#065f46;margin-left:auto}}
 .nav a{{margin-right:16px}}
</style></head><body>
<header><h1>📊 CRM Sofía — Virtuoso Marketing</h1>
<span class="nav"><a href="/admin?key={_e(key)}">Inicio</a>
<a href="/admin/export.csv?key={_e(key)}">⬇️ Exportar CSV</a></span></header>
<div class="wrap">{cuerpo}</div></body></html>"""


async def render_dashboard(key: str) -> str:
    stats = await estadisticas_crm()
    leads = await listar_leads()

    cards = f"""
    <div class="cards">
      <div class="card"><div class="n">{stats['total']}</div><div class="l">Leads totales</div></div>
      <div class="card"><div class="n">{stats['nuevos_semana']}</div><div class="l">Nuevos (7 días)</div></div>
      <div class="card"><div class="n">{stats['activos_semana']}</div><div class="l">Activos (7 días)</div></div>
      <div class="card"><div class="n">{stats['ganados']}</div><div class="l">Ganados</div></div>
      <div class="card"><div class="n">{stats['conversion_pct']}%</div><div class="l">Conversión</div></div>
    </div>"""

    porest = " · ".join(f"{k}: {v}" for k, v in stats["por_estado"].items()) or "—"
    portemp = " · ".join(f"{_EMOJI_TEMP.get(k,'')} {k}: {v}" for k, v in stats["por_temperatura"].items()) or "—"
    resumen = f'<p style="color:#94a3b8">Por estado → {_e(porest)}<br>Por temperatura → {_e(portemp)}</p>'

    filas = ""
    for l in leads:
        color = _COLOR_ESTADO.get(l["estado"], "#6B7280")
        aviso = " 🔔" if l.get("handoff_enviado") else ""
        filas += f"""<tr>
          <td>{_EMOJI_TEMP.get(l['temperatura'],'')} {_e(l['nombre'] or l['telefono'])}{aviso}</td>
          <td>{_e(l['giro'])}</td><td>{_e(l['ciudad'])}</td>
          <td>{_e(l['plan_interes'])}</td>
          <td><span class="badge" style="background:{color}">{_e(l['estado'])}</span></td>
          <td>{_e((l['actualizado'] or '')[:10])}</td>
          <td><a class="btn gray" href="/admin/chat?key={_e(key)}&tel={urllib.parse.quote(l['telefono'])}">Ver chat</a>
          <a class="btn" target="_blank" href="{link_traspaso(l)}">Traspasar 📲</a></td>
        </tr>"""
    if not filas:
        filas = '<tr><td colspan="7" style="text-align:center;color:#94a3b8">Aún no hay leads. ¡Cuando alguien le escriba a Sofía aparecerá aquí!</td></tr>'

    tabla = f"""<table><thead><tr>
      <th>Cliente</th><th>Giro</th><th>Ciudad</th><th>Interés</th>
      <th>Estado</th><th>Últ. act.</th><th>Acciones</th></tr></thead>
      <tbody>{filas}</tbody></table>"""

    return _layout("Inicio", cards + resumen + tabla, key)


async def render_chat(telefono: str, key: str) -> str:
    lead = await obtener_lead(telefono) or {"telefono": telefono}
    historial = await obtener_historial(telefono, limite=100)
    burbujas = ""
    for m in historial:
        clase = "user" if m["role"] == "user" else "assistant"
        quien = "Cliente" if m["role"] == "user" else "Sofía"
        burbujas += f'<div class="msg {clase}"><b>{quien}:</b><br>{_e(m["content"])}</div>'
    if not burbujas:
        burbujas = '<p style="color:#94a3b8">Sin mensajes guardados.</p>'

    ficha = f"""<p>
      <b>{_e(lead.get('nombre') or telefono)}</b> · {_e(lead.get('giro') or '-')} · {_e(lead.get('ciudad') or '-')}<br>
      Estado: {_e(lead.get('estado','-'))} · Interés: {_e(lead.get('plan_interes') or '-')}<br>
      <span style="color:#94a3b8">{_e(lead.get('resumen') or '')}</span><br>
      <a class="btn" target="_blank" href="{link_traspaso(lead)}">📲 Traspasar a atención</a>
      <a class="btn gray" href="/admin?key={_e(key)}">← Volver</a>
    </p><hr style="border-color:#334155">"""
    return _layout(f"Chat {telefono}", ficha + burbujas, key)
