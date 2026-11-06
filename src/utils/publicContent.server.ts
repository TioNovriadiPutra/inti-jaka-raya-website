import type { SupabaseClient } from "@supabase/supabase-js";

export function getPublicProduct(supabase: SupabaseClient, id: string) {
  return supabase
      .from("products")
      .select(`
        id,
        product_code,
        product_name,
        descriptions:product_descriptions (id, title, description),
        galleries:product_galleries (id, image_url, ori_width, ori_height, is_thumbnail),
        documents:product_documents (id, doc_url, doc_name),
        case_studies (id, title, problem)
      `)
      .eq("id", id)
      .eq("is_showing", true)
      .eq("case_studies.is_showing", true)
      .order("id", { referencedTable: "descriptions", ascending: true })
      .order("id", { referencedTable: "galleries", ascending: true })
      .order("id", { referencedTable: "documents", ascending: true })
      .order("created_at", { referencedTable: "case_studies", ascending: false })
      .maybeSingle();
}

export function getPublicCaseStudy(supabase: SupabaseClient, id: string) {
  return supabase
      .from("case_studies")
      .select(`
        id, title, problem,
        product:products (id, product_code, product_name, is_showing),
        category:categories (id, category_name),
        industry:industries (id, industry_name),
        division:divisions (id, division_name),
        application:applications (id, application_name),
        descriptions:case_study_descriptions (id, title, description),
        galleries:case_study_galleries (id, image_url, ori_width, ori_height, is_thumbnail),
        documents:case_study_documents (id, doc_url, doc_name)
      `)
      .eq("id", id)
      .eq("is_showing", true)
      .eq("product.is_showing", true)
      .order("id", { referencedTable: "descriptions", ascending: true })
      .order("id", { referencedTable: "galleries", ascending: true })
      .order("id", { referencedTable: "documents", ascending: true })
      .maybeSingle();
}
