import { createSupabaseClient } from "@/utils/supabase";
import { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "PUT") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
      data: {},
    });
  }

  const { labelName, labelType } = req.body;
  const { id } = req.query;

  const supabase = createSupabaseClient(req, res);

  const table =
    labelType === "category"
      ? "categories"
      : labelType === "industry"
        ? "industries"
        : labelType === "application"
          ? "applications"
          : "divisions";

  const { data, error } = await supabase
    .from(table)
    .update(
      labelType === "category"
        ? {
            category_name: labelName!,
          }
        : labelType === "industry"
          ? {
              industry_name: labelName!,
            }
          : labelType === "application"
            ? {
                application_name: labelName!,
              }
            : {
                division_name: labelName!,
              },
    )
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
      data: {},
    });
  }

  return res.status(200).json({
    success: true,
    message: "Label updated!",
    data,
  });
}
