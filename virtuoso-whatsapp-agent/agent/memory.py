# agent/memory.py — Memoria de conversaciones con SQLite
# Generado por AgentKit

"""
Sistema de memoria del agente. Guarda el historial de conversaciones
por número de teléfono usando SQLite (local) o PostgreSQL (producción).
"""

import os
from datetime import datetime, timedelta
from urllib.parse import urlsplit, urlunsplit, parse_qsl, urlencode
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import String, Text, DateTime, select, Integer, func
from dotenv import load_dotenv

load_dotenv()

# Configuración de base de datos.
# Soporta SQLite (local), PostgreSQL de Railway (interno) y Postgres externo gratis
# como Neon o Supabase (que requieren SSL).
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./agentkit.db")
_connect_args: dict = {}

if DATABASE_URL.startswith("postgres"):
    # Normalizar el esquema al driver async (asyncpg)
    if DATABASE_URL.startswith("postgresql://"):
        DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)
    elif DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)

    # asyncpg NO entiende parámetros como sslmode/channel_binding en la URL.
    # Los quitamos y, si estaban (o el host es externo), activamos SSL por connect_args.
    partes = urlsplit(DATABASE_URL)
    query = parse_qsl(partes.query)
    tenia_ssl = any(k in ("sslmode", "ssl") for k, _ in query)
    query_limpia = [(k, v) for k, v in query if k not in ("sslmode", "channel_binding", "ssl")]
    DATABASE_URL = urlunsplit(
        (partes.scheme, partes.netloc, partes.path, urlencode(query_limpia), partes.fragment)
    )
    host_externo = any(h in (partes.netloc or "") for h in ("neon.tech", "supabase", "render.com", "amazonaws"))
    es_interno_railway = "railway.internal" in (partes.netloc or "")
    if (tenia_ssl or host_externo) and not es_interno_railway:
        _connect_args = {"ssl": True}

engine = create_async_engine(DATABASE_URL, echo=False, connect_args=_connect_args)
async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


class Mensaje(Base):
    """Modelo de mensaje en la base de datos."""
    __tablename__ = "mensajes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    telefono: Mapped[str] = mapped_column(String(50), index=True)
    role: Mapped[str] = mapped_column(String(20))  # "user" o "assistant"
    content: Mapped[str] = mapped_column(Text)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Lead(Base):
    """
    Ficha de cliente/prospecto del CRM. Una por número de teléfono.
    Sofía la va llenando automáticamente conforme conversa.
    """
    __tablename__ = "leads"

    telefono: Mapped[str] = mapped_column(String(50), primary_key=True)
    nombre: Mapped[str] = mapped_column(String(120), default="")
    giro: Mapped[str] = mapped_column(String(120), default="")
    ciudad: Mapped[str] = mapped_column(String(120), default="")
    objetivo: Mapped[str] = mapped_column(Text, default="")
    presupuesto: Mapped[str] = mapped_column(String(120), default="")
    plan_interes: Mapped[str] = mapped_column(String(160), default="")
    # estado: nuevo | en_conversacion | calificado | propuesta_solicitada | ganado | perdido | seguimiento
    estado: Mapped[str] = mapped_column(String(40), default="nuevo", index=True)
    temperatura: Mapped[str] = mapped_column(String(20), default="frio")  # frio | tibio | caliente
    resumen: Mapped[str] = mapped_column(Text, default="")
    notas: Mapped[str] = mapped_column(Text, default="")
    mensajes_count: Mapped[int] = mapped_column(Integer, default=0)
    creado: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    actualizado: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    ultimo_mensaje: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


async def inicializar_db():
    """Crea las tablas si no existen."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def guardar_mensaje(telefono: str, role: str, content: str):
    """Guarda un mensaje en el historial de conversación."""
    async with async_session() as session:
        mensaje = Mensaje(
            telefono=telefono,
            role=role,
            content=content,
            timestamp=datetime.utcnow()
        )
        session.add(mensaje)
        await session.commit()


async def obtener_historial(telefono: str, limite: int = 20) -> list[dict]:
    """
    Recupera los últimos N mensajes de una conversación.

    Args:
        telefono: Número de teléfono del cliente
        limite: Máximo de mensajes a recuperar (default: 20)

    Returns:
        Lista de diccionarios con role y content
    """
    async with async_session() as session:
        query = (
            select(Mensaje)
            .where(Mensaje.telefono == telefono)
            .order_by(Mensaje.timestamp.desc())
            .limit(limite)
        )
        result = await session.execute(query)
        mensajes = result.scalars().all()

        # Invertir para orden cronológico (los más recientes están primero)
        mensajes = list(mensajes)
        mensajes.reverse()

        return [
            {"role": msg.role, "content": msg.content}
            for msg in mensajes
        ]


async def limpiar_historial(telefono: str):
    """Borra todo el historial de una conversación."""
    async with async_session() as session:
        query = select(Mensaje).where(Mensaje.telefono == telefono)
        result = await session.execute(query)
        mensajes = result.scalars().all()
        for msg in mensajes:
            await session.delete(msg)
        await session.commit()


# ════════════════════════════════════════════════════════════
# CRM — Funciones de leads (clientes/prospectos)
# ════════════════════════════════════════════════════════════

# Campos de texto que se pueden actualizar en un lead
_CAMPOS_LEAD = {
    "nombre", "giro", "ciudad", "objetivo", "presupuesto",
    "plan_interes", "estado", "temperatura", "resumen", "notas",
}


async def registrar_contacto(telefono: str):
    """
    Asegura que exista la ficha del lead y actualiza su última actividad
    y el contador de mensajes. Se llama en cada mensaje entrante.
    """
    async with async_session() as session:
        lead = await session.get(Lead, telefono)
        ahora = datetime.utcnow()
        if lead is None:
            lead = Lead(telefono=telefono, estado="nuevo", creado=ahora)
            session.add(lead)
        lead.mensajes_count = (lead.mensajes_count or 0) + 1
        lead.ultimo_mensaje = ahora
        lead.actualizado = ahora
        await session.commit()


async def actualizar_lead(telefono: str, datos: dict):
    """
    Actualiza los datos estructurados de un lead (los que la IA extrajo).
    Solo sobrescribe campos con valor no vacío para no borrar info previa.
    """
    async with async_session() as session:
        lead = await session.get(Lead, telefono)
        if lead is None:
            lead = Lead(telefono=telefono, creado=datetime.utcnow())
            session.add(lead)
        for campo, valor in datos.items():
            if campo in _CAMPOS_LEAD and valor not in (None, "", "null"):
                setattr(lead, campo, str(valor))
        lead.actualizado = datetime.utcnow()
        await session.commit()


async def obtener_lead(telefono: str) -> dict | None:
    """Devuelve la ficha de un lead como diccionario, o None."""
    async with async_session() as session:
        lead = await session.get(Lead, telefono)
        if lead is None:
            return None
        return _lead_a_dict(lead)


async def listar_leads(estado: str | None = None, limite: int = 1000) -> list[dict]:
    """Lista los leads (opcionalmente filtrados por estado), del más reciente al más viejo."""
    async with async_session() as session:
        query = select(Lead).order_by(Lead.actualizado.desc()).limit(limite)
        if estado:
            query = query.where(Lead.estado == estado)
        result = await session.execute(query)
        return [_lead_a_dict(l) for l in result.scalars().all()]


async def estadisticas_crm() -> dict:
    """
    Calcula métricas para el reporte: totales, por estado, por temperatura
    y nuevos en los últimos 7 días.
    """
    async with async_session() as session:
        total = (await session.execute(select(func.count()).select_from(Lead))).scalar() or 0

        por_estado = {}
        res = await session.execute(select(Lead.estado, func.count()).group_by(Lead.estado))
        for estado, n in res.all():
            por_estado[estado or "nuevo"] = n

        por_temp = {}
        res = await session.execute(select(Lead.temperatura, func.count()).group_by(Lead.temperatura))
        for temp, n in res.all():
            por_temp[temp or "frio"] = n

        hace_7 = datetime.utcnow() - timedelta(days=7)
        nuevos_semana = (await session.execute(
            select(func.count()).select_from(Lead).where(Lead.creado >= hace_7)
        )).scalar() or 0
        activos_semana = (await session.execute(
            select(func.count()).select_from(Lead).where(Lead.ultimo_mensaje >= hace_7)
        )).scalar() or 0

        ganados = por_estado.get("ganado", 0)
        conversion = round((ganados / total) * 100, 1) if total else 0.0

        return {
            "total": total,
            "por_estado": por_estado,
            "por_temperatura": por_temp,
            "nuevos_semana": nuevos_semana,
            "activos_semana": activos_semana,
            "ganados": ganados,
            "conversion_pct": conversion,
        }


def _lead_a_dict(lead: "Lead") -> dict:
    """Convierte un objeto Lead a diccionario serializable."""
    return {
        "telefono": lead.telefono,
        "nombre": lead.nombre or "",
        "giro": lead.giro or "",
        "ciudad": lead.ciudad or "",
        "objetivo": lead.objetivo or "",
        "presupuesto": lead.presupuesto or "",
        "plan_interes": lead.plan_interes or "",
        "estado": lead.estado or "nuevo",
        "temperatura": lead.temperatura or "frio",
        "resumen": lead.resumen or "",
        "notas": lead.notas or "",
        "mensajes_count": lead.mensajes_count or 0,
        "creado": lead.creado.isoformat() if lead.creado else "",
        "actualizado": lead.actualizado.isoformat() if lead.actualizado else "",
        "ultimo_mensaje": lead.ultimo_mensaje.isoformat() if lead.ultimo_mensaje else "",
    }
