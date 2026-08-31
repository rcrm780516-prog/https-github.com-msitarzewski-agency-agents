import { contact } from '../config/site';

/**
 * Contexto de atribucion que viaja con cada clic a WhatsApp.
 * El agente (humano o IA) recibe el mensaje con la pista de origen incluida,
 * y el mismo objeto alimenta el dataLayer del evento click_whatsapp.
 */
export interface WhatsAppContext {
  /** slug del servicio desde el que se hace clic */
  service?: string;
  /** slug de la sede */
  location?: string;
  /** slug del medico */
  doctor?: string;
  /** mensaje base; si se omite se arma uno segun el contexto */
  message?: string;
  /** numero especifico de sede; por defecto el numero central */
  phone?: string;
}

/** Solo digitos: wa.me no acepta signos ni espacios. */
export function normalizePhone(raw: string): string {
  return (raw || '').replace(/\D/g, '');
}

/** Texto precargado, adaptado al contexto de la pagina. */
export function buildMessage(ctx: WhatsAppContext = {}): string {
  if (ctx.message) return ctx.message;
  const parts: string[] = ['Hola GEMMAE'];
  if (ctx.doctor) parts.push(`quiero agendar una consulta con el especialista (${ctx.doctor})`);
  else if (ctx.service) parts.push(`me interesa información sobre ${ctx.service.replace(/-/g, ' ')}`);
  else parts.push('me gustaría agendar una consulta');
  if (ctx.location) parts.push(`en la sede de ${ctx.location}`);
  return `${parts.join(', ')}.`;
}

/**
 * Enlace wa.me renderizado en el HTML. Funciona sin JavaScript;
 * el script de atribucion le agrega los UTM de la sesion en el cliente.
 */
export function whatsappHref(ctx: WhatsAppContext = {}): string {
  const phone = normalizePhone(ctx.phone || contact.whatsapp);
  const text = encodeURIComponent(buildMessage(ctx));
  return `https://wa.me/${phone}?text=${text}`;
}

/** Enlace tel: seguro a partir de un telefono legible. */
export function telHref(raw: string): string {
  const digits = normalizePhone(raw);
  return digits ? `tel:+${digits}` : '';
}
