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

  const { type } = req.query;

  const supabase = createSupabaseClient(req, res);

  const { data, error } = await supabase.from(type as string).select();

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
