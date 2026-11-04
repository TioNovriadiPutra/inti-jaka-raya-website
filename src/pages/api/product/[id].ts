import {
  errorHandler,
  initiateLogger,
  methodNotAllowedError,
} from "@/utils/helperServer";
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
    return res.status(400).json({ success: false, message: "Invalid product ID", data: {} });
  }

  try {
    const supabase = createSupabaseClient(req, res);
    const { data, error } = await supabase
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

    if (error) {
      return errorHandler(res, log.log, error, error.code);
    }

    if (!data) {
      return res.status(404).json({ success: false, message: "Product not found", data: {} });
    }

    return res.status(200).json({ success: true, message: "Data fetched!", data });
  } catch (error) {
    return errorHandler(res, log.log, error);
  }
}
