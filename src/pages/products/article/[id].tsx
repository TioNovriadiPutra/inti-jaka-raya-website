import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import Reveal from "@/components/shared/Reveal";
import useCaseStudyController from "@/controllers/caseStudy.controller";
import useTranslation from "@/hooks/useTranslation";
import { ArrowDown } from "../../../../public";
import type { InferGetServerSidePropsType } from "next";
import { getCaseStudyPageProps } from "@/utils/detailSEO.server";

export const getServerSideProps = getCaseStudyPageProps;

export default function CaseStudyArticle({ initialCaseStudy }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { t } = useTranslation();
  const id =
    typeof router.query.id === "string" && /^\d+$/.test(router.query.id)
      ? Number(router.query.id)
      : 0;
  const validId = Number.isSafeInteger(id) && id > 0;
  const { useGetPublicCaseStudyByIdService } = useCaseStudyController();
  const {
    finalData: study,
    isLoading,
    isError,
    refetch,
  } = useGetPublicCaseStudyByIdService(id, initialCaseStudy);

  return (
    <main className="min-w-0 flex-1 bg-white px-5 pb-14 pt-6 font-sans md:px-6 lg:px-10 xl:px-30 xl:pb-24 xl:pt-8">
      <div className="mx-auto w-full max-w-300">
        <nav
          aria-label={t("Breadcrumb")}
          className="mb-6 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-label text-neutral-500 md:mb-8 md:gap-x-3 md:px-4"
        >
          <Link
            href="/"
            className="inline-flex min-h-8 items-center rounded hover:text-primary-600 focus-visible:outline-2 focus-visible:outline-accent-600"
          >
            {t("Home")}
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href="/products"
            className="inline-flex min-h-8 items-center rounded hover:text-primary-600 focus-visible:outline-2 focus-visible:outline-accent-600"
          >
            {t("Products")}
          </Link>
          {study?.product && (
            <>
              <span aria-hidden="true">/</span>
              <Link
                href={`/products/${study.product.id}`}
                className="inline-flex min-h-8 min-w-0 max-w-full items-center rounded hover:text-primary-600 focus-visible:outline-2 focus-visible:outline-accent-600"
              >
                <span className="truncate">
                  {study.product.product_code} {study.product.product_name}
                </span>
              </Link>
            </>
          )}
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="text-primary-600">
            {t("Case Study")}
          </span>
        </nav>

        {isLoading ? (
          <div
            role="status"
            aria-label={t("Loading case study")}
            className="animate-pulse space-y-8 motion-reduce:animate-none"
          >
            <div className="h-3 w-24 rounded bg-neutral-200" />
            <div className="h-9 w-4/5 rounded bg-neutral-200" />
            <div className="h-48 rounded-2xl bg-neutral-100" />
            <div className="h-28 rounded-2xl bg-neutral-100" />
          </div>
        ) : !validId || isError || !study ? (
          <div
            role="status"
            className="flex min-h-80 flex-col items-center justify-center gap-4 rounded-3xl border border-neutral-200 bg-neutral-50 p-6 text-center"
          >
            <h1 className="text-h5-desktop font-bold text-primary-700">
              {t(
                isError
                  ? "Unable to load this case study."
                  : "Case study not found.",
              )}
            </h1>
            <p className="max-w-md text-body-xs leading-relaxed text-neutral-500">
              {t(
                "The case study may be unavailable. Please return to the catalog or try again.",
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
            <Reveal className="mb-7 md:mb-10">
              <p className="mb-4 flex items-center gap-2.5 text-caption font-extrabold uppercase tracking-[.14em] text-neutral-500">
                <span aria-hidden="true" className="h-0.5 w-6 bg-accent-600" />
                {t("Case Study")}
              </p>
              <h1 className="max-w-5xl text-[clamp(1.75rem,3.4vw,3rem)] leading-[1.16] font-bold tracking-tight text-primary-700 wrap-anywhere">
                {study.title}
              </h1>
            </Reveal>

            <div
              className={`grid gap-5 md:gap-7 ${study.thumbnail ? "lg:grid-cols-[minmax(0,1fr)_320px]" : ""}`}
            >
              <Reveal className="min-w-0 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 md:p-7">
                <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                  {study.labels.map((label) => (
                    <div key={label.name} className="min-w-0">
                      <dt className="mb-1 text-caption font-bold uppercase tracking-wider text-neutral-500">
                        {t(label.name)}
                      </dt>
                      <dd className="text-body-xs font-semibold leading-relaxed text-primary-700 wrap-anywhere md:text-body-s">
                        {label.value}
                      </dd>
                    </div>
                  ))}
                </dl>
                {study.product && (
                  <div
                    className={`${study.labels.length ? "mt-6 border-t border-neutral-200 pt-5" : ""}`}
                  >
                    <p className="mb-2 text-caption font-bold uppercase tracking-wider text-neutral-500">
                      {t("Product used")}
                    </p>
                    <Link
                      href={`/products/${study.product.id}`}
                      className="inline-flex min-h-11 max-w-full items-center gap-3 rounded-lg text-body-xs font-bold text-primary-600 hover:underline focus-visible:outline-2 focus-visible:outline-accent-600"
                    >
                      <span className="wrap-anywhere">
                        {study.product.product_code}{" "}
                        {study.product.product_name}
                      </span>
                      <span aria-hidden="true" className="shrink-0">
                        &rarr;
                      </span>
                    </Link>
                  </div>
                )}
              </Reveal>
              {study.thumbnail && (
                <Reveal className="flex items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50 p-3 md:p-4">
                  <Image
                    src={study.thumbnail.image_url}
                    alt={study.title}
                    width={
                      study.thumbnail.ori_width > 0
                        ? study.thumbnail.ori_width
                        : 600
                    }
                    height={
                      study.thumbnail.ori_height > 0
                        ? study.thumbnail.ori_height
                        : 400
                    }
                    priority
                    sizes="(min-width: 1024px) 320px, (min-width: 768px) 700px, 100vw"
                    className="max-h-72 w-full rounded-xl object-contain"
                  />
                </Reveal>
              )}
            </div>

            {study.problem && (
              <Reveal className="mt-6 rounded-2xl border border-primary-50 border-l-4 border-l-accent-600 bg-primary-50/30 p-5 md:mt-8 md:p-7">
                <h2 className="mb-3 text-body-s font-bold text-primary-700">
                  {t("Problem")}
                </h2>
                <p className="whitespace-pre-line text-body-xs leading-[1.9] text-neutral-600 wrap-anywhere md:text-body-s">
                  {study.problem}
                </p>
              </Reveal>
            )}

            <div className="mt-10 space-y-8 md:mt-14 md:space-y-10">
              {study.descriptions.map((section) => (
                <Reveal key={section.id}>
                  {section.title && (
                    <h2 className="mb-4 text-h5-desktop font-bold tracking-tight text-primary-700 wrap-anywhere">
                      {section.title}
                    </h2>
                  )}
                  <p className="whitespace-pre-line text-body-xs leading-[1.9] text-neutral-600 wrap-anywhere md:text-body-s">
                    {section.description}
                  </p>
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-10 md:mt-14">
              <details className="group rounded-2xl border border-neutral-200 bg-neutral-50">
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-4 text-body-s font-bold text-primary-700 focus-visible:outline-2 focus-visible:outline-accent-600 [&::-webkit-details-marker]:hidden">
                  <span>
                    {t("Documentation")}
                    <span className="ml-3 text-label font-normal text-neutral-500">
                      ({study.documents.length})
                    </span>
                  </span>
                  <ArrowDown className="size-4 shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none" />
                </summary>
                <div className="border-t border-neutral-200 px-5 py-3">
                  {study.documents.length ? (
                    study.documents.map((document) => (
                      <a
                        key={document.id}
                        href={document.doc_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex min-h-12 flex-wrap items-center justify-between gap-3 rounded-lg px-2 py-3 text-small font-semibold text-primary-600 hover:bg-white focus-visible:outline-2 focus-visible:outline-accent-600"
                      >
                        <span className="min-w-0 break-all">
                          {document.doc_name}
                        </span>
                        <span className="shrink-0 text-label text-neutral-500">
                          {t("Open document")} &nearr;
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
            </Reveal>

            <section
              className="mt-10 md:mt-14"
              aria-labelledby="case-study-gallery-heading"
            >
              <Reveal
                as="h2"
                id="case-study-gallery-heading"
                className="mb-6 text-h5-desktop font-bold tracking-tight text-primary-700"
              >
                {t("Gallery")}
              </Reveal>
              {study.galleries.length ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
                  {study.galleries.map((image, index) => (
                    <Reveal
                      key={image.id}
                      delay={(index % 4) * 0.06}
                      className="relative aspect-square overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50"
                    >
                      <a
                        href={image.image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${t("Open image")}: ${study.title} (${index + 1})`}
                        className="absolute inset-0 rounded-2xl focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-accent-600"
                      >
                        <Image
                          src={image.image_url}
                          alt={`${study.title} (${index + 1})`}
                          fill
                          sizes="(min-width: 1280px) 285px, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                          className="object-cover transition-transform duration-300 hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100"
                        />
                      </a>
                    </Reveal>
                  ))}
                </div>
              ) : (
                <p className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 text-body-xs text-neutral-500">
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
