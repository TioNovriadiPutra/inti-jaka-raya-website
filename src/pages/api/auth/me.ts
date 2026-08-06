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

  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    return res.status(401).json({
      success: false,
      message: "Session not found!",
      data: {},
    });
  }

  return res.status(200).json({
    success: true,
    message: "Session found!",
    data: {
      id: data.claims.sub,
      email: data.claims.email ?? null,
    },
  });
}
