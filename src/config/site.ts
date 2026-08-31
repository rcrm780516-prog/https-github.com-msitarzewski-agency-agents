/**
 * FUENTE UNICA DE VERDAD del sitio GEMMAE.
 * Todo dato de negocio (telefonos, WhatsApp, IDs de analitica, dominio) vive aqui
 * o en variables de entorno. Ningun componente debe hardcodear estos valores.
 *
 * Los valores marcados con TBC son placeholders: ver CONFIGURATION.md
 */

/** Marcador estandar para informacion que GEMMAE aun debe confirmar. */
export const TBC = '[POR CONFIRMAR]' as const;

/** Devuelve true si un valor sigue pendiente de confirmacion. */
export const isTBC = (value: unknown): boolean =>
  typeof value === 'string' && value.includes('[POR CONFIRMAR]');

const env = import.meta.env;

export const site = {
  name: 'GEMMAE Ginecólogos',
  shortName: 'GEMMAE',
  legalName: TBC, // razon social exacta
  tagline: 'Salud integral de la mujer',
  description:
    'Ginecología, obstetricia, embarazo, fertilidad y menopausia en Toluca, Metepec y Zinacantepec. Atención médica especializada para la mujer en cada etapa de su vida.',
  url: (env.PUBLIC_SITE_URL as string) || 'https://gemmaeginecologos.com',
  locale: 'es-MX',
  lang: 'es',
  country: 'MX',
  timezone: 'America/Mexico_City',
  currency: 'MXN',
  /** Imagen social por defecto (1200x630). */
  defaultOgImage: '/images/og/gemmae-og-default.png',
  themeColor: '#2F3B36',
} as const;

/** Contacto principal. Se sobreescribe por .env sin tocar codigo. */
export const contact = {
  /** Formato E.164 sin signos, usado para enlaces wa.me */
  whatsapp: (env.PUBLIC_WHATSAPP as string) || '52TBC0000000',
  /** Formato legible para humanos */
  whatsappDisplay: (env.PUBLIC_WHATSAPP_DISPLAY as string) || TBC,
  phone: (env.PUBLIC_PHONE as string) || TBC,
  phoneHref: (env.PUBLIC_PHONE_HREF as string) || '',
  email: (env.PUBLIC_EMAIL as string) || TBC,
  /** Mensaje precargado por defecto en WhatsApp */
  whatsappDefaultMessage:
    'Hola GEMMAE, me gustaría agendar una consulta. Vengo de su sitio web.',
} as const;

/** Perfiles oficiales. Se usan en el schema Organization (sameAs). */
export const social = {
  instagram: (env.PUBLIC_INSTAGRAM as string) || '',
  facebook: (env.PUBLIC_FACEBOOK as string) || '',
  tiktok: (env.PUBLIC_TIKTOK as string) || '',
  youtube: (env.PUBLIC_YOUTUBE as string) || '',
  doctoralia: (env.PUBLIC_DOCTORALIA as string) || '',
  googleBusiness: (env.PUBLIC_GOOGLE_BUSINESS as string) || '',
} as const;

/** IDs de medicion. Vacio = el script no se inyecta (cero peso, cero cookies). */
export const analytics = {
  gtmId: (env.PUBLIC_GTM_ID as string) || '',
  ga4Id: (env.PUBLIC_GA4_ID as string) || '',
  metaPixelId: (env.PUBLIC_META_PIXEL_ID as string) || '',
  googleAdsId: (env.PUBLIC_GOOGLE_ADS_ID as string) || '',
  /** Conversion label de Google Ads para el evento de contacto. */
  googleAdsConversionLabel: (env.PUBLIC_GOOGLE_ADS_LABEL as string) || '',
} as const;

/** Endpoint del formulario. Vacio => fallback automatico a WhatsApp. */
export const forms = {
  /** PHP incluido en el repo (Hostinger) o webhook n8n directo. */
  endpoint: (env.PUBLIC_FORM_ENDPOINT as string) || '/api/lead.php',
  /** Segundos minimos que debe tardar un humano en enviar (anti-bot). */
  minFillSeconds: 3,
} as const;

/** Datos regulatorios para publicidad medica en Mexico. */
export const compliance = {
  responsableSanitario: TBC,
  cofeprisAviso: TBC, // aviso de funcionamiento / permiso publicitario si aplica
  privacyContactEmail: TBC,
  disclaimer:
    'La información de este sitio es de carácter general y educativo. No sustituye una consulta ni una valoración médica presencial.',
} as const;

/** Navegacion principal (desktop). */
export const mainNav = [
  { label: 'Ginecología', href: '/ginecologia/' },
  { label: 'Embarazo', href: '/embarazo/' },
  { label: 'Fertilidad', href: '/fertilidad/' },
  { label: 'Menopausia', href: '/menopausia/' },
  { label: 'Médicos', href: '/medicos/' },
  { label: 'Ubicaciones', href: '/ubicaciones/' },
  { label: 'Blog', href: '/blog/' },
] as const;

export const footerNav = {
  servicios: [
    { label: 'Ginecología', href: '/ginecologia/' },
    { label: 'Obstetricia', href: '/obstetricia/' },
    { label: 'Embarazo', href: '/embarazo/' },
    { label: 'Embarazo de alto riesgo', href: '/embarazo-alto-riesgo/' },
    { label: 'Fertilidad', href: '/fertilidad/' },
    { label: 'Menopausia', href: '/menopausia/' },
    { label: 'Ginecología adolescente', href: '/ginecologia-adolescente/' },
    { label: 'Salud femenina', href: '/salud-femenina/' },
    { label: 'Colposcopia', href: '/colposcopia/' },
    { label: 'VPH', href: '/vph/' },
    { label: 'Ultrasonido', href: '/ultrasonido/' },
  ],
  clinica: [
    { label: 'Todos los servicios', href: '/servicios/' },
    { label: 'Nuestros médicos', href: '/medicos/' },
    { label: 'Ubicaciones', href: '/ubicaciones/' },
    { label: 'GEMMAE Contigo (Blog)', href: '/blog/' },
    { label: 'Preguntas frecuentes', href: '/preguntas-frecuentes/' },
    { label: 'Contacto', href: '/contacto/' },
  ],
  legal: [
    { label: 'Aviso de privacidad', href: '/aviso-de-privacidad/' },
    { label: 'Términos y condiciones', href: '/terminos-y-condiciones/' },
  ],
} as const;

export type SiteConfig = typeof site;
