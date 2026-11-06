import type { GetServerSideProps } from "next";
import { absoluteUrl, localizedPath, publicPages } from "@/utils/seo";
import { createPublicSupabaseClient } from "@/utils/detailSEO.server";

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const supabase = createPublicSupabaseClient();
  const getPaths = async (table: "products" | "case_studies", prefix: string) => {
    const paths: string[] = [];
    const limit = 1000;
    for (let offset = 0; ; offset += limit) {
      const { data, error } = await supabase.from(table).select("id")
        .eq("is_showing", true).order("id", { ascending: true }).range(offset, offset + limit - 1);
      if (error) throw new Error(`Sitemap query failed for ${table}: ${error.code}`);
      paths.push(...data.map((item) => `${prefix}/${item.id}`));
      if (data.length < limit) break;
    }
    return paths;
  };
  let detailPaths: string[];
  try {
    const [products, studies] = await Promise.all([
      getPaths("products", "/products"),
      getPaths("case_studies", "/products/article"),
    ]);
    detailPaths = [...products, ...studies];
  } catch (error) {
    console.error(error);
    res.statusCode = 503;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Retry-After", "300");
    res.end("Sitemap temporarily unavailable.");
    return { props: {} };
  }
  const escapeXml = (value: string) => value.replace(/[<>&"']/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[char]!);
  const urls = [...Object.keys(publicPages), ...detailPaths].flatMap((path) => ["en", "id"].map((locale) => `<url><loc>${escapeXml(absoluteUrl(localizedPath(path, locale)))}</loc></url>`)).join("");
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=3600");
  res.end(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`);
  return { props: {} };
};

export default function Sitemap() {
  return null;
}
