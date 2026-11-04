import type { GetServerSideProps } from "next";
import { absoluteUrl, localizedPath, publicPages } from "@/utils/seo";

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const escapeXml = (value: string) => value.replace(/[<>&"']/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[char]!);
  const urls = Object.keys(publicPages).flatMap((path) => ["en", "id"].map((locale) => `<url><loc>${escapeXml(absoluteUrl(localizedPath(path, locale)))}</loc></url>`)).join("");
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.end(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`);
  return { props: {} };
};

export default function Sitemap() {
  return null;
}
