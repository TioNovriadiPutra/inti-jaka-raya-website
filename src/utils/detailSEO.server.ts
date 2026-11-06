import { createClient } from "@supabase/supabase-js";
import type { GetServerSidePropsContext } from "next";
import type { ProductPublicDetailDTO } from "@/interfaces/product.interface";
import type { CaseStudyPublicDetailDTO } from "@/interfaces/caseStudy.interface";
import type { DetailSEO } from "./seo";
import { SITE_NAME } from "./seo";
import { getPublicCaseStudy, getPublicProduct } from "./publicContent.server";

export function createPublicSupabaseClient() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

function description(text: string, fallback: string) {
  return (text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() || fallback).slice(0, 160);
}

function validId(context: GetServerSidePropsContext) {
  const id = context.params?.id;
  return typeof id === "string" && /^\d+$/.test(id) && Number.isSafeInteger(Number(id)) && Number(id) > 0 ? id : null;
}

function thumbnail(galleries: ProductPublicDetailDTO["galleries"]): DetailSEO["image"] {
  const image = galleries.find((item) => item.is_thumbnail && item.image_url);
  return image ? { url: image.image_url, width: image.ori_width ?? 0, height: image.ori_height ?? 0 } : undefined;
}

export async function getProductPageProps(context: GetServerSidePropsContext) {
  const id = validId(context);
  if (!id) return { notFound: true as const };
  const { data, error } = await getPublicProduct(createPublicSupabaseClient(), id);
  if (error) throw new Error(`Public product query failed: ${error.code}`);
  if (!data) return { notFound: true as const };
  const product = data as unknown as ProductPublicDetailDTO;
  const name = `${product.product_code} ${product.product_name}`.trim();
  const fallback = context.locale === "id" ? `Informasi, aplikasi, dan dokumentasi ${name} dari ${SITE_NAME}.` : `Explore ${name}, its applications and technical documentation from ${SITE_NAME}.`;
  const seo: DetailSEO = {
    path: `/products/${product.id}`,
    title: `${name} | ${SITE_NAME}`,
    description: description(product.descriptions.map((section) => section.description).join(" "), fallback),
  };
  const image = thumbnail(product.galleries);
  if (image) seo.image = image;
  return { props: { initialProduct: { success: true, message: "Data fetched!", data: product }, seo } };
}

export async function getCaseStudyPageProps(context: GetServerSidePropsContext) {
  const id = validId(context);
  if (!id) return { notFound: true as const };
  const { data, error } = await getPublicCaseStudy(createPublicSupabaseClient(), id);
  if (error) throw new Error(`Public case study query failed: ${error.code}`);
  if (!data) return { notFound: true as const };
  const study = data as unknown as CaseStudyPublicDetailDTO;
  const fallback = context.locale === "id" ? `Studi kasus ${study.title}: solusi perbaikan industri dari ${SITE_NAME}.` : `${study.title}: an industrial repair case study from ${SITE_NAME}.`;
  const seo: DetailSEO = {
    path: `/products/article/${study.id}`,
    title: `${study.title} | ${SITE_NAME}`,
    description: description(study.problem || study.descriptions.map((section) => section.description).join(" "), fallback),
  };
  const image = thumbnail(study.galleries);
  if (image) seo.image = image;
  return { props: { initialCaseStudy: { success: true, message: "Data fetched!", data: study }, seo } };
}
