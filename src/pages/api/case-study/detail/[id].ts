import {
  errorHandler,
  initiateLogger,
  methodNotAllowedError,
} from "@/utils/helperServer";
import { createSupabaseClient } from "@/utils/supabase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const log = initiateLogger(req);

  if (req.method !== "GET") {
    return methodNotAllowedError(res, log.log);
  }

  const { id } = req.query;

  const supabase = createSupabaseClient(req, res);

  const { data, error } = await supabase
    .from("case_studies")
    .select(
      `
      id,
      title,
      problem,
      product:products (
        id,
        product_name
      ),
      category:categories (
        id,
        category_name
      ),
      industry:industries (
        id,
        industry_name
      ),
      application:applications (
        id,
        application_name
      ),
      division:divisions (
        id,
        division_name
      ),
      galleries:case_study_galleries (
        id,
        image_url,
        ori_width,
        ori_height,
        is_thumbnail
      ),
      documents:case_study_documents (
        id,
        doc_url,
        doc_name
      ),
      descriptions:case_study_descriptions (
        id,
        title,
        description
      )
    `,
    )
    .eq("id", id)
    .order("id", {
      referencedTable: "case_study_descriptions",
      ascending: true,
    })
    .single();

  if (error) {
    return errorHandler(res, log.log, error, error.code);
  }

  return res.status(200).json({
    success: true,
    message: "Data fetched!",
    data,
  });
}
