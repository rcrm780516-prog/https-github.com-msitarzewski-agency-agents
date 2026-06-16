# agent/tools.py — Herramientas del agente
# Generado por AgentKit

"""
Herramientas específicas del negocio Virtuoso Marketing.
Estas funciones extienden las capacidades del agente más allá de responder texto.

Casos de uso configurados:
  - Responder preguntas frecuentes (FAQ) sobre planes y servicios
  - Atención a clientes
  - Calificar leads y escalar oportunidades a un estratega/vendedor
"""

import os
import json
import yaml
import logging
from datetime import datetime

logger = logging.getLogger("agentkit")

# Archivo donde se guardan los leads calificados (formato JSON Lines)
LEADS_FILE = os.getenv("LEADS_FILE", "leads.jsonl")

# Preguntas de calificación recomendadas por Virtuoso para descubrir necesidad
PREGUNTAS_CALIFICACION = [
    "¿Cuál es el giro y la ciudad del negocio?",
    "¿Cuál es el objetivo principal: citas, reservaciones, mensajes, leads o ventas?",
    "¿Ya cuenta con redes sociales, Google Business Profile o sitio web?",
    "¿Actualmente invierte en Meta Ads o Google Ads?",
    "¿Cuál es su presupuesto mensual de publicidad?",
    "¿Necesita creación de contenido, manejo de redes, campañas o una solución integral?",
    "¿Requiere chatbot, automatización, agenda o seguimiento de leads?",
    "¿Qué capacidad tiene para atender nuevos prospectos o pacientes?",
    "¿Cuál es su ticket promedio o valor de consulta?",
    "¿En cuánto tiempo desea comenzar?",
]


def cargar_info_negocio() -> dict:
    """Carga la información del negocio desde business.yaml."""
    try:
        with open("config/business.yaml", "r", encoding="utf-8") as f:
            return yaml.safe_load(f)
    except FileNotFoundError:
        logger.error("config/business.yaml no encontrado")
        return {}


def obtener_horario() -> dict:
    """Retorna el horario de atención del negocio."""
    info = cargar_info_negocio()
    return {
        "horario": info.get("negocio", {}).get("horario", "No disponible"),
        "esta_abierto": True,  # TODO: calcular según hora actual y horario
    }


def buscar_en_knowledge(consulta: str) -> str:
    """
    Busca información relevante en los archivos de /knowledge.
    Retorna el contenido más relevante encontrado.
    """
    resultados = []
    knowledge_dir = "knowledge"

    if not os.path.exists(knowledge_dir):
        return "No hay archivos de conocimiento disponibles."

    for archivo in os.listdir(knowledge_dir):
        ruta = os.path.join(knowledge_dir, archivo)
        if archivo.startswith(".") or not os.path.isfile(ruta):
            continue
        try:
            with open(ruta, "r", encoding="utf-8") as f:
                contenido = f.read()
                # Búsqueda simple por coincidencia de texto
                if consulta.lower() in contenido.lower():
                    resultados.append(f"[{archivo}]: {contenido[:500]}")
        except (UnicodeDecodeError, IOError):
            continue

    if resultados:
        return "\n---\n".join(resultados)
    return "No encontré información específica sobre eso en mis archivos."


# ════════════════════════════════════════════════════════════
# Herramientas de VENTAS y CALIFICACIÓN DE LEADS
# (caso de uso elegido por Virtuoso Marketing)
# ════════════════════════════════════════════════════════════

def registrar_lead(telefono: str, datos: dict) -> dict:
    """
    Registra o actualiza un lead en el archivo de leads (JSON Lines).

    Args:
        telefono: Número de WhatsApp del prospecto (identificador único)
        datos: Diccionario con cualquier dato capturado, por ejemplo:
               {"nombre": "...", "giro": "medico", "ciudad": "Cancún",
                "objetivo": "más pacientes", "presupuesto": "10000 MXN",
                "interes": "Plan Essential médico"}

    Returns:
        El registro del lead guardado.
    """
    registro = {
        "telefono": telefono,
        "actualizado": datetime.utcnow().isoformat(),
        **datos,
    }
    try:
        with open(LEADS_FILE, "a", encoding="utf-8") as f:
            f.write(json.dumps(registro, ensure_ascii=False) + "\n")
        logger.info(f"Lead registrado: {telefono}")
    except IOError as e:
        logger.error(f"No se pudo guardar el lead: {e}")
    return registro


def calificar_lead(datos: dict) -> dict:
    """
    Evalúa qué tan listo está un lead según los datos capturados y
    sugiere el plan de Virtuoso más adecuado.

    Lógica basada en la "Lógica recomendada para sugerir un plan" de Virtuoso.
    NUNCA promete cifras; solo orienta hacia el plan y siempre sujeto a cotización.

    Args:
        datos: dict con campos como giro, objetivo, activos, presupuesto, necesidad.

    Returns:
        {"plan_sugerido": str, "temperatura": "frio|tibio|caliente", "razon": str}
    """
    giro = (datos.get("giro") or "").lower()
    necesidad = (datos.get("necesidad") or datos.get("objetivo") or "").lower()
    es_medico = any(p in giro for p in ["medic", "clinic", "consultor", "doctor", "salud", "dental"])

    plan = "Diagnóstico con un estratega"
    razon = "Se requiere conocer más para recomendar el plan ideal."

    if any(p in necesidad for p in ["automatiz", "chatbot", "agente", "24/7", "seguimiento", "reservacion", "cita"]):
        plan = "Automatizaciones inteligentes con Agentes IA"
        razon = "Necesita atención automatizada, citas/reservaciones o seguimiento de leads."
    elif any(p in necesidad for p in ["integral", "sitio", "landing", "google ads", "dominio"]):
        plan = "Plan Essential para médicos" if es_medico else "Plan Essential Business"
        razon = "Busca una solución integral con activos digitales y campañas."
    elif any(p in necesidad for p in ["contenido", "redes", "meta ads", "instagram", "facebook", "tiktok"]):
        plan = "Plan Social Media para médicos" if es_medico else "Plan Essential Business"
        razon = "Requiere manejo de redes y campañas en Meta Ads."
    elif any(p in necesidad for p in ["empezar", "entrada", "iniciar", "económico", "barato", "presupuesto bajo"]):
        plan = "Plan Basic para médicos" if es_medico else "Plan Basic Business"
        razon = "Busca una inversión de entrada (alcance sujeto a cotización)."

    # Temperatura del lead según información disponible
    campos_clave = ["giro", "objetivo", "presupuesto", "ciudad"]
    completos = sum(1 for c in campos_clave if datos.get(c))
    if completos >= 3:
        temperatura = "caliente"
    elif completos >= 1:
        temperatura = "tibio"
    else:
        temperatura = "frio"

    return {"plan_sugerido": plan, "temperatura": temperatura, "razon": razon}


def escalar_a_vendedor(telefono: str, contexto: str) -> dict:
    """
    Marca un lead para que un estratega humano de Virtuoso lo contacte.
    Deja el contexto de la conversación y los datos de contacto de cierre.

    Args:
        telefono: Número del prospecto
        contexto: Resumen de lo que necesita el cliente

    Returns:
        dict con la confirmación y los datos de contacto de Virtuoso.
    """
    registro = registrar_lead(telefono, {
        "estado": "escalado_a_estratega",
        "contexto": contexto,
    })
    return {
        "ok": True,
        "lead": registro,
        "contacto_virtuoso": {
            "whatsapp": ["998 344 1662", "998 201 1676"],
            "telefono": "998 201 1676",
            "web": "https://virtuoso.com.mx",
            "ubicaciones": ["Guadalajara, Jalisco", "Cancún, Quintana Roo"],
        },
    }
