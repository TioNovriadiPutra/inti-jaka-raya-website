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

  const { id } = req.query;

  const supabase = createSupabaseClient(req, res);

  const { data, error } = await supabase
    .from("products")
    .select()
    .eq("id", id)
    .single();

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
      data: {},
    });
  }

  const { data: updateData, error: updateError } = await supabase
    .from("products")
    .update({
      is_showing: !data.is_showing,
    })
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    return res.status(400).json({
      success: false,
      message: updateError.message,
      data: {},
    });
  }

  return res.status(200).json({
    success: true,
    message: "Product updated!",
    data: updateData,
  });
}
