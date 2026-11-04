import type { GetServerSideProps } from "next";
import { absoluteUrl } from "@/utils/seo";

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  // CMS and dummy product pages remain crawlable so bots can read noindex.
  res.end(`User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${absoluteUrl("/sitemap.xml")}\n`);
  return { props: {} };
};

export default function Robots() {
  return null;
}
