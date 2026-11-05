import { errorHandler, initiateLogger, methodNotAllowedError } from "@/utils/helperServer";
import { createSupabaseClient } from "@/utils/supabase";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const log = initiateLogger(req);

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return methodNotAllowedError(res, log.log);
  }

  const { id } = req.query;
  if (typeof id !== "string" || !/^\d+$/.test(id) || !Number.isSafeInteger(Number(id)) || Number(id) < 1) {
    return res.status(400).json({ success: false, message: "Invalid case study ID", data: {} });
  }

  try {
    const supabase = createSupabaseClient(req, res);
    const { data, error } = await supabase
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

    if (error) return errorHandler(res, log.log, error, error.code);
    if (!data) {
      return res.status(404).json({ success: false, message: "Case study not found", data: {} });
    }

    return res.status(200).json({ success: true, message: "Data fetched!", data });
  } catch (error) {
    return errorHandler(res, log.log, error);
  }
}
