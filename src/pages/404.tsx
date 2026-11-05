import type { GetStaticProps } from "next";
import Error from "next/error";

// Register localized error pages in the prerender manifest for build adapters.
export const getStaticProps: GetStaticProps = async () => ({ props: {} });

export default function NotFound() {
  return <Error statusCode={404} />;
}
