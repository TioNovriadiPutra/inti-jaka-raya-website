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

  const { page, type, search, category, industry, application, division } =
    req.query;

  const from = 0;
  const to = Number(page) - 1 + 10 - 1;

  const toArray = (value: string | string[] | undefined): string[] =>
    value === undefined ? [] : Array.isArray(value) ? value : [value];

  const categoryIds = toArray(category);
  const industryIds = toArray(industry);
  const applicationIds = toArray(application);
  const divisionIds = toArray(division);

  const supabase = createSupabaseClient(req, res);

  const fields =
    type === "products"
      ? `
    title:product_name,
    product_code,
    thumbnail:product_galleries (
      image_url,
      ori_width,
      ori_height
    )
  `
      : `
    title,
    thumbnail:case_study_galleries (
      image_url,
      ori_width,
      ori_height
    )
  `;

  let query = supabase
    .from(type as string)
    .select(
      `
        id,
        ${fields}
      `,
      {
        count: "exact",
      },
    )
    .eq("is_showing", true)
    .eq("thumbnail.is_thumbnail", true);

  if (categoryIds.length > 0) {
    query = query.in("category_id", categoryIds);
  }

  if (industryIds.length > 0) {
    query = query.in("industry_id", industryIds);
  }

  if (applicationIds.length > 0) {
    query = query.in("application_id", applicationIds);
  }

  if (divisionIds.length > 0) {
    query = query.in("division_id", divisionIds);
  }

  const { data, error, count } = await query
    .ilike(type === "products" ? "product_name" : "title", `%${search ?? ""}%`)
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
        limit: 999,
        total: Math.ceil((count ?? 0) / 10),
      },
    },
  });
}
