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

  const supabase = createSupabaseClient(req, res);

  const { error } = await supabase.auth.signOut();

  if (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
      data: {},
    });
  }

  return res.status(200).json({
    success: true,
    message: "Logout success!",
    data: {},
  });
}
