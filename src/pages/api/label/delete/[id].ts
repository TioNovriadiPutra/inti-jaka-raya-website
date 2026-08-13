import { createSupabaseClient } from "@/utils/supabase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
      data: {},
    });
  }

  const { id, type } = req.query;

  const table =
    type === "category"
      ? "categories"
      : type === "industry"
        ? "industries"
        : type === "application"
          ? "applications"
          : "divisions";

  const supabase = createSupabaseClient(req, res);

  const { data, error } = await supabase
    .from(table)
    .delete()
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
    message: "Label deleted!",
    data,
  });
}
