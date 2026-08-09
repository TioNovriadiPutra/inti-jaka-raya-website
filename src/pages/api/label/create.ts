import { createSupabaseClient } from "@/utils/supabase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
      data: {},
    });
  }

  const { labelName, labelType } = req.body;

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
    .insert(
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
    .select()
    .single();

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
      data: {},
    });
  }

  return res.status(201).json({
    success: true,
    message: "Label created!",
    data,
  });
}
