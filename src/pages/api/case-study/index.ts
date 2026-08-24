import {
  errorHandler,
  initiateLogger,
  methodNotAllowedError,
} from "@/utils/helperServer";
import { createSupabaseClient } from "@/utils/supabase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const log = initiateLogger(req);

  if (req.method !== "GET") {
    return methodNotAllowedError(res, log.log);
  }

  const { page, type } = req.query;

  const from = (Number(page) - 1) * 10;
  const to = from + 10 - 1;

  const supabase = createSupabaseClient(req, res);

  let query = supabase.from("case_studies").select(
    `
        id,
        title,
        is_showing,
        industry:industries (
          id,
          industry_name
        )
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
    return errorHandler(res, log.log, error, error.code);
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
