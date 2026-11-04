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
    res.setHeader("Allow", "GET");
    return methodNotAllowedError(res, log.log);
  }

  try {
    const supabase = createSupabaseClient(req, res);

    const { data, error } = await supabase
      .from("case_studies")
      .select(
        `
        id,
        title,
        problem,
        category:categories (
          id,
          category_name
        ),
        thumbnail:case_study_galleries (
          image_url,
          ori_width,
          ori_height
        )
      `,
      )
      .eq("is_showing", true)
      .eq("thumbnail.is_thumbnail", true)
      .order("created_at", { ascending: false, nullsFirst: false })
      .order("id", { ascending: false })
      .limit(5)
      .order("id", { referencedTable: "thumbnail", ascending: true })
      .limit(1, { referencedTable: "thumbnail" });

    if (error) {
      return errorHandler(res, log.log, error, error.code);
    }

    return res.status(200).json({
      success: true,
      message: "Data fetched!",
      data,
    });
  } catch (error) {
    return errorHandler(res, log.log, error);
  }
}
