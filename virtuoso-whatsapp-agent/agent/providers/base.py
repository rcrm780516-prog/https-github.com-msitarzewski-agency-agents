# agent/providers/base.py — Clase base para proveedores de WhatsApp
# Generado por AgentKit

"""
Define la interfaz común que todos los proveedores de WhatsApp deben implementar.
Esto permite cambiar de proveedor sin modificar el resto del código.
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass
from fastapi import Request


@dataclass
class MensajeEntrante:
    """Mensaje normalizado — mismo formato sin importar el proveedor."""
    telefono: str            # Número del remitente
    texto: str               # Contenido del mensaje
    mensaje_id: str          # ID único del mensaje
    es_propio: bool          # True si lo envió el agente (se ignora)
    phone_number_id: str = ""  # ID del número que RECIBIÓ el mensaje (para multi-número)


class ProveedorWhatsApp(ABC):
    """Interfaz que cada proveedor de WhatsApp debe implementar."""

    @abstractmethod
    async def parsear_webhook(self, request: Request) -> list[MensajeEntrante]:
        """Extrae y normaliza mensajes del payload del webhook."""
        ...

    @abstractmethod
    async def enviar_mensaje(self, telefono: str, mensaje: str, phone_number_id: str | None = None) -> bool:
        """
        Envía un mensaje de texto. Retorna True si fue exitoso.
        phone_number_id: número emisor a usar (para atender varios números). Si es None, usa el de .env.
        """
        ...

    async def validar_webhook(self, request: Request) -> dict | int | None:
        """Verificación GET del webhook (solo Meta la requiere). Retorna respuesta o None."""
        return None
