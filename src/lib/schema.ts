/**
 * Constructores de JSON-LD.
 *
 * Regla central: ningun campo con marcador [POR CONFIRMAR], vacio o nulo llega
 * al JSON-LD. Publicar un telefono o una direccion placeholder en datos
 * estructurados es peor que omitirlos: Google los toma como NAP real.
 */
import { site, contact, social, isTBC } from '../config/site';
import { absolute } from './urls';
import { normalizePhone } from './whatsapp';

type Json = Record<string, unknown>;

/** Elimina recursivamente valores vacios, nulos o pendientes de confirmar. */
export function clean<T>(value: T): T | undefined {
  if (value === null || value === undefined) return undefined;
  if (typeof value === 'string') {
    const s = value.trim();
    return s && !isTBC(s) ? (s as unknown as T) : undefined;
  }
  if (Array.isArray(value)) {
    const arr = value.map((v) => clean(v)).filter((v) => v !== undefined);
    return arr.length ? (arr as unknown as T) : undefined;
  }
  if (typeof value === 'object') {
    const out: Json = {};
    for (const [k, v] of Object.entries(value as Json)) {
      const c = clean(v);
      if (c !== undefined) out[k] = c;
    }
    // Un objeto que solo conserva @type no aporta informacion.
    const keys = Object.keys(out).filter((k) => k !== '@type');
    return keys.length ? (out as unknown as T) : undefined;
  }
  return value;
}

const sameAs = () =>
  [
    social.instagram,
    social.facebook,
    social.tiktok,
    social.youtube,
    social.doctoralia,
    social.googleBusiness,
  ].filter(Boolean);

/** Identificador estable de la organizacion, referenciado por el resto de nodos. */
export const ORG_ID = `${site.url}/#organization`;
export const WEBSITE_ID = `${site.url}/#website`;

export function organizationSchema() {
  return clean({
    '@type': 'MedicalBusiness',
    '@id': ORG_ID,
    name: site.name,
    alternateName: site.shortName,
    legalName: site.legalName,
    url: site.url,
    description: site.description,
    medicalSpecialty: ['Obstetric', 'Gynecologic'],
    telephone: contact.phone,
    email: contact.email,
    areaServed: [
      { '@type': 'City', name: 'Toluca' },
      { '@type': 'City', name: 'Metepec' },
      { '@type': 'City', name: 'Zinacantepec' },
      { '@type': 'City', name: 'Lerma' },
    ],
    sameAs: sameAs(),
  });
}

export function websiteSchema() {
  return clean({
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: site.url,
    name: site.name,
    inLanguage: site.locale,
    publisher: { '@id': ORG_ID },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${site.url}/buscar/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  });
}

export interface ClinicInput {
  slug: string;
  name: string;
  description: string;
  address: {
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  phone: string;
  whatsapp?: string;
  email?: string;
  geo: { lat: number | null; lng: number | null };
  hoursSchema: string[];
  mapLink?: string;
  googleBusinessUrl?: string;
  services: string[];
  coverage: string[];
}

/** MedicalClinic de una sede concreta, ligada a la organizacion matriz. */
export function clinicSchema(input: ClinicInput) {
  const url = absolute(`/ubicaciones/${input.slug}/`);
  const streetAddress = [input.address.street, input.address.neighborhood]
    .map((s) => (isTBC(s) ? '' : s))
    .filter(Boolean)
    .join(', ');

  return clean({
    '@type': 'MedicalClinic',
    '@id': `${url}#clinic`,
    name: input.name,
    description: input.description,
    url,
    parentOrganization: { '@id': ORG_ID },
    telephone: input.phone,
    email: input.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress,
      addressLocality: input.address.city,
      addressRegion: input.address.state,
      postalCode: input.address.postalCode,
      addressCountry: input.address.country,
    },
    geo:
      input.geo.lat !== null && input.geo.lng !== null
        ? { '@type': 'GeoCoordinates', latitude: input.geo.lat, longitude: input.geo.lng }
        : undefined,
    openingHours: input.hoursSchema,
    hasMap: input.mapLink,
    sameAs: [input.googleBusinessUrl].filter(Boolean),
    medicalSpecialty: ['Obstetric', 'Gynecologic'],
    availableService: input.services.map((s) => ({ '@type': 'MedicalProcedure', name: s })),
    areaServed: input.coverage.map((c) => ({ '@type': 'Place', name: c })),
  });
}

export interface PhysicianInput {
  slug: string;
  name: string;
  honorific?: string;
  specialty: string;
  description: string;
  photo?: string;
  url: string;
  locations: { name: string; slug: string }[];
  languages: string[];
  doctoraliaUrl?: string;
}

/** Physician: solo se emite cuando el perfil tiene nombre real. */
export function physicianSchema(input: PhysicianInput) {
  if (isTBC(input.name)) return undefined;
  return clean({
    '@type': 'Physician',
    '@id': `${input.url}#physician`,
    name: [input.honorific, input.name].filter(Boolean).join(' '),
    medicalSpecialty: input.specialty,
    description: input.description,
    image: input.photo ? absolute(input.photo) : undefined,
    url: input.url,
    worksFor: { '@id': ORG_ID },
    availableLanguage: input.languages,
    sameAs: [input.doctoraliaUrl].filter(Boolean),
    workLocation: input.locations.map((l) => ({
      '@type': 'MedicalClinic',
      '@id': `${absolute(`/ubicaciones/${l.slug}/`)}#clinic`,
      name: l.name,
    })),
  });
}

/** Pagina de servicio: MedicalWebPage con la entidad principal correspondiente. */
export function medicalWebPageSchema(input: {
  url: string;
  name: string;
  description: string;
  entityType: string;
  entityName: string;
  lastReviewed?: string;
}) {
  return clean({
    '@type': 'MedicalWebPage',
    '@id': `${input.url}#webpage`,
    url: input.url,
    name: input.name,
    description: input.description,
    inLanguage: site.locale,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@type': input.entityType, name: input.entityName },
    lastReviewed: input.lastReviewed,
    publisher: { '@id': ORG_ID },
  });
}

export function articleSchema(input: {
  url: string;
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified: string;
  authorName?: string;
  reviewerName?: string;
  medicalSpecialty?: string;
}) {
  return clean({
    '@type': 'Article',
    '@id': `${input.url}#article`,
    headline: input.headline,
    description: input.description,
    image: input.image ? absolute(input.image) : undefined,
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    inLanguage: site.locale,
    mainEntityOfPage: input.url,
    // Sin autor confirmado se declara a la organizacion, nunca una persona ficticia.
    author: input.authorName
      ? { '@type': 'Person', name: input.authorName }
      : { '@id': ORG_ID },
    reviewedBy: input.reviewerName ? { '@type': 'Person', name: input.reviewerName } : undefined,
    publisher: { '@id': ORG_ID },
  });
}

export function faqSchema(items: { q: string; a: string }[]) {
  const valid = items.filter((i) => !isTBC(i.a) && !isTBC(i.q));
  if (!valid.length) return undefined;
  return {
    '@type': 'FAQPage',
    mainEntity: valid.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  };
}

export function breadcrumbSchema(items: { label: string; href: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: absolute(item.href),
    })),
  };
}

/** Envuelve los nodos en un unico @graph: un solo bloque JSON-LD por pagina. */
export function graph(nodes: (unknown | undefined)[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes.filter(Boolean),
  };
}

/** wa.me como ContactPoint solo si el numero es real. */
export function whatsappContactPoint() {
  const digits = normalizePhone(contact.whatsapp);
  if (!digits || isTBC(contact.whatsapp)) return undefined;
  return {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    telephone: `+${digits}`,
    availableLanguage: ['es'],
  };
}
