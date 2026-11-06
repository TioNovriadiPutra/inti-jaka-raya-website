import { getPublicCaseStudy } from "@/utils/publicContent.server";
import { errorHandler, initiateLogger, methodNotAllowedError } from "@/utils/helperServer";
import { createSupabaseClient } from "@/utils/supabase";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const log = initiateLogger(req);

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return methodNotAllowedError(res, log.log);
  }

  const { id } = req.query;
  if (typeof id !== "string" || !/^\d+$/.test(id) || !Number.isSafeInteger(Number(id)) || Number(id) < 1) {
    return res.status(400).json({ success: false, message: "Invalid case study ID", data: {} });
  }

  try {
    const supabase = createSupabaseClient(req, res);
    const { data, error } = await getPublicCaseStudy(supabase, id);

    if (error) return errorHandler(res, log.log, error, error.code);
    if (!data) {
      return res.status(404).json({ success: false, message: "Case study not found", data: {} });
    }

    return res.status(200).json({ success: true, message: "Data fetched!", data });
  } catch (error) {
    return errorHandler(res, log.log, error);
  }
}
