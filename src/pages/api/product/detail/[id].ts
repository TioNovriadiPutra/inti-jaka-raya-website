import { createSupabaseClient } from "@/utils/supabase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
      data: {},
    });
  }

  const { id } = req.query;

  const supabase = createSupabaseClient(req, res);

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id,
      product_code,
      product_name,
      divisions:divisions (
        id,
        division_name
      ),
      applications:applications (
        id,
        application_name
      ),
      industries:industries (
        id,
        industry_name
      ),
      categories:categories (
        id,
        category_name
      ),
      galleries:product_galleries (
        id,
        image_url,
        ori_width,
        ori_height,
        is_thumbnail
      ),
      documents:product_documents (
        id,
        doc_url,
        doc_name
      ),
      descriptions:product_descriptions (
        id,
        title,
        description
      )
    `,
    )
    .eq("id", id)
    .order("id", {
      referencedTable: "product_descriptions",
      ascending: true,
    })
    .single();

  if (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: {},
    });
  }

  return res.status(200).json({
    success: true,
    message: "Data fetched!",
    data,
  });
}
