import { useRouter } from "next/router";
import { translate } from "@/utils/translations";

export default function useTranslation() {
  const router = useRouter();
  const locale = router.locale === "id" ? "id" : "en";
  return { locale, t: (text: string) => translate(text, locale) };
}
