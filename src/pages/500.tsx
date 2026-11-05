import type { GetStaticProps } from "next";
import Error from "next/error";

export const getStaticProps: GetStaticProps = async () => ({ props: {} });

export default function ServerError() {
  return <Error statusCode={500} />;
}
