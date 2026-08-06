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

  const { email, password } = req.body;

  const supabase = createSupabaseClient(req, res);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
      data: {},
    });
  }

  return res.status(200).json({
    success: true,
    message: "Login success!",
    data: data.user,
  });
}
