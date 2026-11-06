export const SITE_NAME = "PT. Inti Jaka Raya";

export interface DetailSEO {
  path: string;
  title: string;
  description: string;
  image?: { url: string; width: number; height: number };
}

export const SITE_URL = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || "https://intijakaraya.com",
).origin;

export const SOCIAL_IMAGE = "/images/social-preview-v2.jpg";
export const SOCIAL_IMAGE_ID = "/images/social-preview-id-v2.jpg";
export const SOCIAL_IMAGE_ALT =
  "PT. Inti Jaka Raya — industrial repair composites and protective coatings in Indonesia";

export const publicPages = {
  "/": {
    title: "Inti Jaka Raya | Industrial Repair & Protective Coatings",
    description:
      "Explore industrial repair composites and protective coatings from PT. Inti Jaka Raya, Indonesia's sole distributor for UK-made Unique Polymer Systems.",
  },
  "/about": {
    title: "About Inti Jaka Raya | Industrial Maintenance in Indonesia",
    description:
      "Meet PT. Inti Jaka Raya, established in Bandung in 2017, providing industrial maintenance solutions for corrosion, erosion and equipment protection.",
  },
  "/products": {
    title: "Industrial Repair Products & Case Studies | Inti Jaka Raya",
    description:
      "Browse industrial repair products and case studies from Inti Jaka Raya. Discover composite repair materials and protective coatings for your industry.",
  },
} as const;

export type PublicPath = keyof typeof publicPages;

export const indonesianPages: Record<PublicPath, { title: string; description: string }> = {
  "/": {
    title: "Inti Jaka Raya | Perbaikan Industri & Pelapis Pelindung",
    description: "Temukan komposit perbaikan industri dan pelapis pelindung dari PT. Inti Jaka Raya, distributor tunggal Unique Polymer Systems buatan Inggris di Indonesia.",
  },
  "/about": {
    title: "Tentang Inti Jaka Raya | Pemeliharaan Industri Indonesia",
    description: "Kenali PT. Inti Jaka Raya, berdiri di Bandung sejak 2017, penyedia solusi pemeliharaan industri untuk mengatasi korosi, erosi, dan melindungi peralatan.",
  },
  "/products": {
    title: "Produk Perbaikan Industri & Studi Kasus | Inti Jaka Raya",
    description: "Jelajahi produk perbaikan industri dan studi kasus Inti Jaka Raya. Temukan material perbaikan komposit dan pelapis pelindung untuk kebutuhan industri Anda.",
  },
};

export function localizedPath(path: string, locale: string = "en") {
  return locale === "id" ? `/id${path === "/" ? "" : path}` : path;
}

export function absoluteUrl(path: string) {
  return new URL(path, `${SITE_URL}/`).href;
}
