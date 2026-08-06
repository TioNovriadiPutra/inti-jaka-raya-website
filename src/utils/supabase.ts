import { createServerClient, serializeCookieHeader } from "@supabase/ssr";
import { NextApiRequest, NextApiResponse } from "next";

export function createSupabaseClient(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return Object.entries(req.cookies).map(([name, value]) => ({
            name,
            value: value ?? "",
          }));
        },
        setAll(cookieToSet) {
          res.setHeader(
            "Set-Cookie",
            cookieToSet.map(({ name, value, options }) =>
              serializeCookieHeader(name, value, options),
            ),
          );
        },
      },
    },
  );
}
