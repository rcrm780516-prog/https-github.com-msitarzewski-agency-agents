import { defineCollection, z, reference } from 'astro:content';
import { glob, file } from 'astro/loaders';

/** Bloque de pregunta frecuente reutilizable en servicios, sedes y medicos. */
const faqItem = z.object({
  q: z.string(),
  a: z.string(),
});

/** SEO comun a todas las colecciones. */
const seo = z.object({
  title: z.string().max(65, 'El title deberia tener 65 caracteres o menos'),
  description: z.string().min(70).max(165),
  ogImage: z.string().optional(),
  noindex: z.boolean().default(false),
});

const servicios = defineCollection({
  loader: glob({ base: './src/content/servicios', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    name: z.string(),
    /** Nombre corto para navegacion y breadcrumbs */
    shortName: z.string().optional(),
    h1: z.string(),
    excerpt: z.string(),
    seo,
    /** Agrupacion editorial en /servicios/ */
    category: z.enum(['ginecologia', 'obstetricia', 'etapas', 'diagnostico']),
    order: z.number().default(50),
    featured: z.boolean().default(false),
    /** Icono del set interno (src/components/Icon.astro) */
    icon: z.string().default('stethoscope'),
    intro: z.string(),
    whatIs: z.string(),
    /** Encabezado de la sección "qué es": por defecto "¿En qué consiste?" */
    whatIsTitle: z.string().default('¿En qué consiste?'),
    whenToConsult: z.array(z.string()).default([]),
    whatToExpect: z.array(z.string()).default([]),
    preparation: z.array(z.string()).default([]),
    /** Etapas del acompanamiento (embarazo, menopausia...) */
    journey: z
      .array(z.object({ title: z.string(), text: z.string() }))
      .default([]),
    journeyTitle: z.string().optional(),
    faq: z.array(faqItem).default([]),
    locations: z.array(reference('ubicaciones')).default([]),
    related: z.array(reference('servicios')).default([]),
    /** Terminos que alimentan el buscador interno (no son meta keywords) */
    searchTerms: z.array(z.string()).default([]),
    /** Tipo de schema.org que corresponde realmente a la pagina */
    schemaType: z
      .enum(['MedicalSpecialty', 'MedicalProcedure', 'MedicalTest', 'MedicalCondition', 'MedicalTherapy'])
      .default('MedicalProcedure'),
    ctaPrimary: z.string().default('Agenda tu consulta'),
    updatedAt: z.coerce.date().optional(),
  }),
});

const ubicaciones = defineCollection({
  loader: glob({ base: './src/content/ubicaciones', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    name: z.string(),
    city: z.string(),
    state: z.string().default('Estado de México'),
    h1: z.string(),
    excerpt: z.string(),
    seo,
    order: z.number().default(50),
    /** NAP: debe coincidir caracter por caracter con Google Business Profile */
    address: z.object({
      street: z.string(),
      neighborhood: z.string(),
      city: z.string(),
      state: z.string(),
      postalCode: z.string(),
      country: z.string().default('MX'),
    }),
    phone: z.string(),
    whatsapp: z.string(),
    email: z.string().optional(),
    /** Horario en formato schema.org: "Mo-Fr 09:00-19:00" + version legible */
    hours: z.array(z.object({ days: z.string(), time: z.string() })).default([]),
    hoursSchema: z.array(z.string()).default([]),
    geo: z.object({ lat: z.number().nullable(), lng: z.number().nullable() }).default({ lat: null, lng: null }),
    /** URL de incrustacion de Google Maps (modo privacidad, sin API key) */
    mapEmbed: z.string().default(''),
    mapLink: z.string().default(''),
    googleBusinessUrl: z.string().default(''),
    intro: z.string(),
    /** Referencias reales de la zona para el bloque "como llegar" */
    directions: z.array(z.string()).default([]),
    parking: z.string().optional(),
    services: z.array(reference('servicios')).default([]),
    doctors: z.array(reference('medicos')).default([]),
    faq: z.array(faqItem).default([]),
    searchTerms: z.array(z.string()).default([]),
    /** Zonas cercanas que atiende esta sede (SEO local, sin crear paginas nuevas) */
    coverage: z.array(z.string()).default([]),
  }),
});

const medicos = defineCollection({
  loader: glob({ base: './src/content/medicos', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    name: z.string(),
    /** Titulo profesional: "Dra." / "Dr." — vacio hasta confirmar */
    honorific: z.string().default(''),
    h1: z.string(),
    specialty: z.string(),
    subspecialties: z.array(z.string()).default([]),
    seo,
    order: z.number().default(50),
    photo: z.string().default(''),
    photoAlt: z.string().default(''),
    bio: z.string(),
    /** Cedula profesional y de especialidad: dato regulatorio, nunca inventado */
    licenses: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
    education: z.array(z.string()).default([]),
    certifications: z.array(z.string()).default([]),
    experience: z.string().default(''),
    publications: z.array(z.object({ title: z.string(), url: z.string().optional(), source: z.string().optional() })).default([]),
    languages: z.array(z.string()).default(['Español']),
    services: z.array(reference('servicios')).default([]),
    locations: z.array(reference('ubicaciones')).default([]),
    doctoraliaUrl: z.string().default(''),
    faq: z.array(faqItem).default([]),
    searchTerms: z.array(z.string()).default([]),
    /** true mientras el perfil sea una plantilla sin datos reales:
        se construye para revision pero no se indexa ni entra al sitemap. */
    draft: z.boolean().default(false),
  }),
});

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    h1: z.string().optional(),
    excerpt: z.string(),
    seo,
    category: z.enum([
      'ginecologia',
      'embarazo',
      'fertilidad',
      'menopausia',
      'vph',
      'salud-preventiva',
      'adolescencia',
    ]),
    /** Autor y revisor: se muestran solo cuando existen datos reales. */
    author: reference('medicos').optional(),
    authorName: z.string().optional(),
    reviewedBy: reference('medicos').optional(),
    reviewedByName: z.string().optional(),
    medicalSpecialty: z.string().default('Obstetrics and Gynecology'),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    readingMinutes: z.number().default(5),
    cover: z.string().default(''),
    coverAlt: z.string().default(''),
    sources: z
      .array(z.object({ label: z.string(), url: z.string().optional() }))
      .default([]),
    relatedServices: z.array(reference('servicios')).default([]),
    relatedArticles: z.array(reference('blog')).default([]),
    faq: z.array(faqItem).default([]),
    searchTerms: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

/** FAQs generales del sitio (no ligadas a un servicio concreto). */
const faqs = defineCollection({
  loader: file('./src/data/faqs.json'),
  schema: z.object({
    id: z.string(),
    q: z.string(),
    a: z.string(),
    topic: z.string(),
    order: z.number().default(50),
  }),
});

export const collections = { servicios, ubicaciones, medicos, blog, faqs };
