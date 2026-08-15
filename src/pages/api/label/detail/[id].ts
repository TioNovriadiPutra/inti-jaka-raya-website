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

  const { id, type } = req.query;

  const supabase = createSupabaseClient(req, res);

  if (type === "category") {
    const { data, error } = await supabase
      .from("categories")
      .select()
      .eq("id", id)
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
  } else if (type === "industry") {
    const { data, error } = await supabase
      .from("industries")
      .select()
      .eq("id", id)
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
  } else if (type === "application") {
    const { data, error } = await supabase
      .from("applications")
      .select()
      .eq("id", id)
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
  } else if (type === "division") {
    const { data, error } = await supabase
      .from("divisions")
      .select()
      .eq("id", id)
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
}
