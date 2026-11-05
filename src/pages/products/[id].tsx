import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import Reveal from "@/components/shared/Reveal";
import useProductController from "@/controllers/product.controller";
import useTranslation from "@/hooks/useTranslation";
import { ArrowDown } from "../../../public";

export default function ProductDetail() {
  const router = useRouter();
  const { t } = useTranslation();
  const id =
    typeof router.query.id === "string" && /^\d+$/.test(router.query.id)
      ? Number(router.query.id)
      : 0;
  const validId = Number.isSafeInteger(id) && id > 0;
  const { useGetPublicProductByIdService } = useProductController();
  const {
    finalData: product,
    isLoading,
    isError,
    refetch,
  } = useGetPublicProductByIdService(id);

  return (
    <main className="min-w-0 flex-1 bg-white px-5 pb-14 pt-6 font-sans md:px-6 lg:px-10 xl:px-30 xl:pb-24 xl:pt-8">
      <Head>
        <title>
          {product ? product.title : t("Products")} | PT. Inti Jaka Raya
        </title>
      </Head>
      <div className="mx-auto w-full max-w-300">
        <nav
          aria-label={t("Breadcrumb")}
          className="mb-6 flex min-w-0 items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-label text-neutral-500 md:mb-8 md:gap-3 md:px-4"
        >
          <Link
            href="/"
            className="inline-flex min-h-8 shrink-0 items-center rounded hover:text-primary-600 focus-visible:outline-2 focus-visible:outline-accent-600"
          >
            {t("Home")}
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href="/products"
            className="inline-flex min-h-8 shrink-0 items-center rounded hover:text-primary-600 focus-visible:outline-2 focus-visible:outline-accent-600"
          >
            {t("Products")}
          </Link>
          <span aria-hidden="true">/</span>
          <span
            aria-current="page"
            className="min-w-0 truncate text-primary-600"
          >
            {product
              ? product.code + " " + product.title
              : t("Product details")}
          </span>
        </nav>

        {!router.isReady || isLoading ? (
          <div
            role="status"
            aria-label={t("Loading product")}
            className="space-y-8"
          >
            <div className="grid items-center gap-6 md:grid-cols-[minmax(0,1fr)_280px] md:gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12">
              <div className="space-y-4 py-4">
                <div className="h-3 w-24 rounded bg-neutral-200" />
                <div className="h-7 w-4/5 rounded bg-neutral-200" />
                <div className="h-7 w-3/5 rounded bg-neutral-200" />
              </div>
              <div className="h-52 animate-pulse rounded-2xl border border-neutral-200 bg-neutral-100 motion-reduce:animate-none" />
            </div>
            <div className="h-4 w-40 rounded bg-neutral-100" />
            <div className="h-24 rounded bg-neutral-100" />
          </div>
        ) : !validId || isError || !product ? (
          <div
            role="status"
            className="flex min-h-80 flex-col items-center justify-center gap-4 rounded-3xl border border-neutral-200 bg-neutral-50 p-6 text-center"
          >
            <h1 className="text-h5-desktop font-bold text-primary-700">
              {t(
                isError ? "Unable to load this product." : "Product not found.",
              )}
            </h1>
            <p className="max-w-md text-body-xs leading-relaxed text-neutral-500">
              {t(
                "The product may be unavailable. Please return to the catalog or try again.",
              )}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/products"
                className="inline-flex min-h-11 items-center rounded-lg bg-primary-600 px-5 py-3 text-small font-bold text-white"
              >
                {t("Back to catalog")}
              </Link>
              {isError && validId && (
                <button
                  type="button"
                  onClick={() => void refetch()}
                  className="min-h-11 rounded-lg border border-neutral-200 bg-white px-5 py-3 text-small font-bold text-primary-600"
                >
                  {t("Try again")}
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <Reveal className="grid items-center gap-6 md:grid-cols-[minmax(0,1fr)_280px] md:gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12">
              <div className="flex min-w-0 flex-col items-start py-2 md:py-4">
                <p className="mb-4 flex items-center gap-2.5 text-caption font-extrabold uppercase tracking-[.14em] text-neutral-500">
                  <span
                    className="h-0.5 w-6 bg-accent-600"
                    aria-hidden="true"
                  />
                  {t("Product details")}
                </p>
                <p className="mb-3 inline-flex max-w-full rounded-md border border-primary-50 bg-primary-50/30 px-3 py-1.5 text-label font-bold tracking-wide text-primary-600 wrap-anywhere">
                  {product.code}
                </p>
                <h1 className="max-w-full text-card-heading font-bold leading-tight tracking-tight text-primary-700 wrap-anywhere lg:text-section-heading">
                  {product.title}
                </h1>
                {(product.documents.length > 0 ||
                  product.galleries.length > 0) && (
                  <div className="mt-6 flex max-w-full flex-wrap gap-3">
                    {product.documents.length > 0 && (
                      <a
                        href="#product-documentation"
                        className="inline-flex min-h-11 items-center gap-3 rounded-lg bg-primary-600 px-4 py-3 text-label font-bold text-white transition-colors hover:bg-primary-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-600"
                      >
                        {t("Documentation")}
                        <span className="text-primary-100">
                          {product.documents.length}
                        </span>
                        <span aria-hidden="true">↓</span>
                      </a>
                    )}
                    {product.galleries.length > 0 && (
                      <a
                        href="#product-gallery-heading"
                        className="inline-flex min-h-11 items-center gap-3 rounded-lg border border-neutral-200 bg-white px-4 py-3 text-label font-bold text-primary-600 transition-colors hover:border-primary-100 hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-600"
                      >
                        {t("Gallery")}
                        <span className="text-neutral-500">
                          {product.galleries.length}
                        </span>
                        <span aria-hidden="true">↗</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
              <div className="relative isolate min-w-0 p-3">
                <div
                  className="absolute inset-3 -z-10 rotate-3 rounded-[22px] bg-primary-600"
                  aria-hidden="true"
                />
                <div className="relative rounded-[20px] border border-neutral-200 bg-white p-5 shadow-lg shadow-primary-900/10">
                  <div className="mb-3 flex items-center justify-between gap-3 border-b border-neutral-100 pb-3 text-caption font-bold uppercase tracking-widest text-neutral-500">
                    <span>{t("Product")}</span>
                    <span
                      className="h-0.5 w-8 rounded-full bg-accent-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex min-w-0 items-center justify-center">
                    {product.thumbnail ? (
                      <Image
                        src={product.thumbnail.image_url}
                        alt={product.title}
                        width={
                          product.thumbnail.ori_width > 0
                            ? product.thumbnail.ori_width
                            : 640
                        }
                        height={
                          product.thumbnail.ori_height > 0
                            ? product.thumbnail.ori_height
                            : 480
                        }
                        sizes="(min-width: 1024px) 328px, (min-width: 768px) 248px, (min-width: 640px) 360px, calc(100vw - 72px)"
                        className="block h-auto max-h-56 w-auto max-w-full object-contain"
                      />
                    ) : (
                      <div className="flex min-h-40 items-center justify-center p-4 text-body-xs text-neutral-500">
                        {t("No image available")}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Reveal>

            <div className="mt-10 space-y-8 md:mt-12 md:space-y-10">
              {product.descriptions.map((section, index) => (
                <Reveal
                  as="article"
                  key={section.id}
                  delay={(index % 3) * 0.06}
                >
                  <h2 className="mb-4 text-h5-desktop font-semibold leading-snug tracking-tight text-primary-700 wrap-anywhere">
                    {section.title}
                  </h2>
                  <p className="whitespace-pre-line text-body-xs leading-[1.9] text-neutral-600 wrap-anywhere md:text-body-s">
                    {section.description}
                  </p>
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-10 space-y-4 md:mt-14">
              <details
                id="product-documentation"
                className="group scroll-mt-6 rounded-2xl border border-neutral-200 bg-neutral-50"
              >
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-4 text-body-s font-bold text-primary-700 focus-visible:outline-2 focus-visible:outline-accent-600 [&::-webkit-details-marker]:hidden">
                  <span>
                    {t("Documentation")}
                    <span className="ml-3 text-label font-normal text-neutral-500">
                      ({product.documents.length})
                    </span>
                  </span>
                  <ArrowDown className="size-4 shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none" />
                </summary>
                <div className="border-t border-neutral-200 px-5 py-3">
                  {product.documents.length ? (
                    product.documents.map((document) => (
                      <a
                        key={document.id}
                        href={document.doc_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex min-h-12 items-center justify-between gap-4 rounded-lg px-2 py-3 text-small font-semibold text-primary-600 hover:bg-white focus-visible:outline-2 focus-visible:outline-accent-600"
                      >
                        <span className="min-w-0 break-all">
                          {document.doc_name}
                        </span>
                        <span className="shrink-0 text-label text-neutral-500">
                          {t("Open document")} <span aria-hidden="true">↗</span>
                        </span>
                      </a>
                    ))
                  ) : (
                    <p className="py-3 text-body-xs text-neutral-500">
                      {t("No documents available.")}
                    </p>
                  )}
                </div>
              </details>

              <details className="group rounded-2xl border border-neutral-200 bg-neutral-50">
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-4 text-body-s font-bold text-primary-700 focus-visible:outline-2 focus-visible:outline-accent-600 [&::-webkit-details-marker]:hidden">
                  <span>
                    {t("Case Studies")}
                    <span className="ml-3 text-label font-normal text-neutral-500">
                      ({product.caseStudies.length})
                    </span>
                  </span>
                  <ArrowDown className="size-4 shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none" />
                </summary>
                <div className="space-y-4 border-t border-neutral-200 px-5 py-5">
                  {product.caseStudies.length ? (
                    product.caseStudies.map((study) => (
                      <article
                        key={study.id}
                        className="rounded-xl border border-neutral-200 bg-white p-4"
                      >
                        <h3 className="text-body-s font-bold leading-snug text-primary-700 wrap-anywhere">
                          <Link href={`/products/article/${study.id}`} className="rounded hover:underline focus-visible:outline-2 focus-visible:outline-accent-600">
                            {study.title}
                          </Link>
                        </h3>
                        <p className="mt-2 whitespace-pre-line text-body-xs leading-relaxed text-neutral-500 wrap-anywhere">
                          {study.problem}
                        </p>
                      </article>
                    ))
                  ) : (
                    <p className="text-body-xs text-neutral-500">
                      {t("No related case studies available.")}
                    </p>
                  )}
                </div>
              </details>
            </Reveal>

            <section
              className="mt-10 md:mt-14"
              aria-labelledby="product-gallery-heading"
            >
              <Reveal
                as="h2"
                id="product-gallery-heading"
                className="mb-6 text-h5-desktop font-bold tracking-tight text-primary-700"
              >
                {t("Gallery")}
              </Reveal>
              {product.galleries.length ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
                  {product.galleries.map((image, index) => (
                    <Reveal
                      key={image.id}
                      className="relative aspect-square overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50"
                      delay={(index % 4) * 0.06}
                    >
                      <Image
                        src={image.image_url}
                        alt={product.title + " — " + (index + 1)}
                        fill
                        sizes="(min-width: 1280px) 285px, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                        className="object-cover transition-transform duration-300 hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100"
                      />
                    </Reveal>
                  ))}
                </div>
              ) : (
                <p className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 p-6 text-center text-body-xs text-neutral-500">
                  {t("No gallery images available.")}
                </p>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
