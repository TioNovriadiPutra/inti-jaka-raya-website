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

  const { page, type } = req.query;

  const from = (Number(page) - 1) * 10;
  const to = from + 10 - 1;

  const supabase = createSupabaseClient(req, res);

  let query = supabase.from("products").select(
    `
      id,
      product_code,
      product_name,
      is_showing
    `,
    {
      count: "exact",
    },
  );

  if (type !== "all") {
    query = query.eq("is_showing", type === "showing");
  }

  const { data, error, count } = await query
    .order("created_at", {
      ascending: false,
    })
    .range(from, to);

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
    data: {
      data,
      meta: {
        count,
        page,
        limit: 10,
        total: Math.ceil((count ?? 0) / 10),
      },
    },
  });
}
