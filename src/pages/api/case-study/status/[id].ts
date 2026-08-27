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

  if (req.method !== "PUT") {
    return methodNotAllowedError(res, log.log);
  }

  const { id } = req.query;

  const supabase = createSupabaseClient(req, res);

  const { data, error } = await supabase
    .from("case_studies")
    .select()
    .eq("id", id)
    .single();

  if (error) {
    return errorHandler(res, log.log, error, error.code);
  }

  const { data: updateData, error: updateError } = await supabase
    .from("case_studies")
    .update({
      is_showing: !data.is_showing,
    })
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    return errorHandler(res, log.log, updateError, updateError.code);
  }

  return res.status(200).json({
    success: true,
    message: "Case study updated!",
    data: updateData,
  });
}
