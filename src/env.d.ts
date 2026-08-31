/// <reference types="astro/client" />

interface GemmaeAPI {
  track: (event: string, params?: Record<string, unknown>) => void;
  attribution: () => Record<string, string>;
  enrichWhatsApp: (link: HTMLAnchorElement) => void;
}

declare global {
  interface Window {
    gemmae?: GemmaeAPI;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_WHATSAPP?: string;
  readonly PUBLIC_WHATSAPP_DISPLAY?: string;
  readonly PUBLIC_PHONE?: string;
  readonly PUBLIC_PHONE_HREF?: string;
  readonly PUBLIC_EMAIL?: string;
  readonly PUBLIC_INSTAGRAM?: string;
  readonly PUBLIC_FACEBOOK?: string;
  readonly PUBLIC_TIKTOK?: string;
  readonly PUBLIC_YOUTUBE?: string;
  readonly PUBLIC_DOCTORALIA?: string;
  readonly PUBLIC_GOOGLE_BUSINESS?: string;
  readonly PUBLIC_GTM_ID?: string;
  readonly PUBLIC_GA4_ID?: string;
  readonly PUBLIC_META_PIXEL_ID?: string;
  readonly PUBLIC_GOOGLE_ADS_ID?: string;
  readonly PUBLIC_GOOGLE_ADS_LABEL?: string;
  readonly PUBLIC_FORM_ENDPOINT?: string;
  readonly PUBLIC_SELF_HOSTED_FONTS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export {};
