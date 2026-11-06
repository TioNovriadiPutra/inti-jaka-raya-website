import Head from "next/head";
import { useRouter } from "next/router";
import {
  absoluteUrl,
  publicPages,
  type PublicPath,
  SITE_NAME,
  SITE_URL,
  SOCIAL_IMAGE,
  SOCIAL_IMAGE_ID,
  SOCIAL_IMAGE_ALT,
  indonesianPages,
  localizedPath,
  type DetailSEO,
} from "@/utils/seo";

export default function SEO({ detail }: { detail?: DetailSEO }) {
  const { pathname, locale = "en" } = useRouter();
  const pages = locale === "id" ? indonesianPages : publicPages;
  const detailPath = pathname === "/products/[id]" || pathname === "/products/article/[id]";
  const page = detailPath && detail ? detail : pages[pathname as PublicPath];
  const path = detailPath && detail ? detail.path : pathname;
  const noindex = !page;
  const title =
    page?.title ??
    `${pathname.startsWith("/cms") ? "CMS" : "Page"} | ${SITE_NAME}`;
  const description = page?.description ?? pages["/"].description;
  const canonical = page ? absoluteUrl(localizedPath(path, locale)) : undefined;
  const thumbnail = detailPath ? detail?.image : undefined;
  const image = absoluteUrl(thumbnail?.url ?? (locale === "id" ? SOCIAL_IMAGE_ID : SOCIAL_IMAGE));
  const imageWidth = thumbnail ? thumbnail.width : 1200;
  const imageHeight = thumbnail ? thumbnail.height : 630;
  const imageAlt = thumbnail ? title : locale === "id"
    ? "PT. Inti Jaka Raya — komposit perbaikan industri dan pelapis pelindung di Indonesia"
    : SOCIAL_IMAGE_ALT;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl("/images/logo.png"),
          width: 1012,
          height: 423,
        },
        image,
        description: pages["/"].description,
        foundingDate: "2017",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Bandung",
          addressRegion: "West Java",
          addressCountry: "ID",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        inLanguage: ["en", "id"],
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type":
          pathname === "/about"
            ? "AboutPage"
            : pathname === "/products"
              ? "CollectionPage"
              : "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: title,
        description,
        inLanguage: locale,
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: image,
          ...(imageWidth > 0 ? { width: imageWidth } : {}),
          ...(imageHeight > 0 ? { height: imageHeight } : {}),
        },
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} key="description" />
      <meta
        name="application-name"
        content={SITE_NAME}
        key="application-name"
      />
      <meta name="author" content={SITE_NAME} key="author" />
      <meta
        name="robots"
        content={
          noindex
            ? "noindex, nofollow"
            : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        }
        key="robots"
      />
      <meta name="theme-color" content="#293170" key="theme-color" />
      <link rel="icon" href="/favicon.ico" key="favicon-ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/icon.png" key="favicon" />
      {canonical && <link rel="canonical" href={canonical} key="canonical" />}
      {page && ["en", "id", "x-default"].map((language) => (
        <link rel="alternate" hrefLang={language} href={absoluteUrl(localizedPath(path, language))} key={`alternate:${language}`} />
      ))}
      <meta property="og:type" content="website" key="og:type" />
      <meta property="og:site_name" content={SITE_NAME} key="og:site_name" />
      <meta property="og:locale" content={locale === "id" ? "id_ID" : "en_GB"} key="og:locale" />
      {page && <meta property="og:locale:alternate" content={locale === "id" ? "en_GB" : "id_ID"} key="og:locale:alternate" />}
      <meta property="og:title" content={title} key="og:title" />
      <meta
        property="og:description"
        content={description}
        key="og:description"
      />
      {canonical && <meta property="og:url" content={canonical} key="og:url" />}
      <meta property="og:image" content={image} key="og:image" />
      <meta property="og:image:url" content={image} key="og:image:url" />
      <meta
        property="og:image:secure_url"
        content={image}
        key="og:image:secure_url"
      />
      {!thumbnail && <meta property="og:image:type" content="image/jpeg" key="og:image:type" />}
      {imageWidth > 0 && <meta property="og:image:width" content={String(imageWidth)} key="og:image:width" />}
      {imageHeight > 0 && <meta property="og:image:height" content={String(imageHeight)} key="og:image:height" />}
      <meta
        property="og:image:alt"
        content={imageAlt}
        key="og:image:alt"
      />
      <meta
        name="twitter:card"
        content="summary_large_image"
        key="twitter:card"
      />
      <meta name="twitter:title" content={title} key="twitter:title" />
      <meta
        name="twitter:description"
        content={description}
        key="twitter:description"
      />
      <meta name="twitter:image" content={image} key="twitter:image" />
      {canonical && <meta name="twitter:url" content={canonical} key="twitter:url" />}
      <meta
        name="twitter:image:alt"
        content={imageAlt}
        key="twitter:image:alt"
      />
      {!noindex && (
        <script
          type="application/ld+json"
          key="structured-data"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
      )}
    </Head>
  );
}
