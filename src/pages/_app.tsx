import useTranslation from "@/hooks/useTranslation";
import { DeleteModal, LoginModal, Navbar, Sidebar } from "@/components/custom";
import { Flex } from "@/components/shared";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toast from "@/components/custom/Toast";
import SEO from "@/components/custom/SEO";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function App({ Component, pageProps }: AppProps) {
  const { t } = useTranslation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  const router = useRouter();

  const parallaxImage =
    router.pathname === "/about"
      ? "/images/parallax2.jpg"
      : "/images/parallax.jpg";

  const isCMS = router.pathname.includes("cms");

  useLayoutEffect(() => {
    scrollContainerRef.current?.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [router.asPath]);

  return (
    <QueryClientProvider client={queryClient}>
      <SEO />
      <Flex className="relative w-dvw h-dvh overflow-hidden">
        {!isCMS && <Navbar />}

        <Flex className="relative flex-1 overflow-hidden bg-neutral-50">
          <Flex
            ref={scrollContainerRef}
            className={`${isCMS ? "flex-row!" : ""} z-20 flex-1 overflow-y-auto`}
          >
            {isCMS && <Sidebar />}

            <Component {...pageProps} />

            {!isCMS && (
              <footer className="shrink-0 border-t border-neutral-200 bg-neutral-50 px-5 pb-7 pt-12 font-sans md:px-6 md:pt-14 lg:px-10 xl:px-30">
                <div className="mx-auto w-full max-w-300">
                  <div className="grid min-w-0 gap-8 pb-9 text-center sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-[1.4fr_.7fr_.9fr] lg:gap-12 lg:pb-12 lg:text-left">
                    <div className="flex min-w-0 flex-col items-center sm:col-span-2 lg:col-span-1 lg:items-start">
                      <Link
                        href="/"
                        aria-label="PT. Inti Jaka Raya"
                        className="inline-flex max-w-full items-center justify-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-600"
                      >
                        <Image
                          src="/images/logo.png"
                          alt="PT. Inti Jaka Raya"
                          width={1012}
                          height={423}
                          sizes="160px"
                          className="block h-auto w-40 max-w-full object-contain xl:hidden"
                        />
                        <Image
                          src="/images/brand-logo.png"
                          alt="PT. Inti Jaka Raya"
                          width={225}
                          height={42}
                          sizes="208px"
                          className="hidden h-auto w-52 max-w-full object-contain xl:block"
                        />
                      </Link>
                      <p className="mt-5 max-w-90 text-small leading-relaxed text-neutral-500">
                        {t(
                          "Industrial repair composites and protective coatings in Indonesia.",
                        )}
                      </p>
                      <p className="mt-4 flex items-center gap-2 text-caption font-bold tracking-wide text-primary-600">
                        <span
                          className="size-1.5 shrink-0 rounded-full bg-accent-600"
                          aria-hidden="true"
                        />
                        {t("Repair. Rebuild. Protect.")}
                      </p>
                    </div>

                    <nav
                      aria-label={t("Footer navigation")}
                      className="min-w-0"
                    >
                      <p className="mb-3 text-caption font-extrabold uppercase tracking-[.14em] text-primary-700">
                        {t("Explore")}
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-0 sm:flex-col sm:gap-0 lg:items-start">
                        {[
                          { label: "Home", href: "/" },
                          { label: "About Us", href: "/about" },
                          { label: "Products", href: "/products" },
                        ].map(({ label, href }) => (
                          <Link
                            key={href}
                            href={href}
                            aria-current={
                              router.pathname === href ||
                              (href !== "/" &&
                                router.pathname.startsWith(href + "/"))
                                ? "page"
                                : undefined
                            }
                            className="inline-flex min-h-11 max-w-full items-center rounded text-small font-semibold text-neutral-500 transition-colors hover:text-primary-600 aria-[current=page]:text-primary-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-600 motion-reduce:transition-none"
                          >
                            {t(label)}
                          </Link>
                        ))}
                      </div>
                    </nav>

                    <div className="min-w-0">
                      <p className="mb-4 text-caption font-extrabold uppercase tracking-[.14em] text-primary-700">
                        {t("Social media")}
                      </p>
                      <div
                        role="group"
                        aria-label={t("Social media")}
                        className="grid grid-cols-[repeat(3,44px)] justify-center gap-3 lg:justify-start [&_button]:inline-flex [&_button]:size-11 [&_button]:shrink-0 [&_button]:items-center [&_button]:justify-center [&_button]:rounded-full [&_button]:border [&_button]:border-neutral-200 [&_button]:bg-white [&_button]:p-0 [&_button]:transition-colors [&_button:hover]:border-primary-100 [&_button:hover]:bg-primary-50/30 [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-offset-4 [&_button:focus-visible]:outline-accent-600 motion-reduce:[&_button]:transition-none"
                      >
                        <button type="button" aria-label="Facebook">
                          <Image
                            src="/facebook.svg"
                            alt=""
                            aria-hidden="true"
                            width={20}
                            height={20}
                            unoptimized
                            className="block size-5 shrink-0 object-contain"
                          />
                        </button>
                        <button type="button" aria-label="X / Twitter">
                          <Image
                            src="/twitter.svg"
                            alt=""
                            aria-hidden="true"
                            width={20}
                            height={20}
                            unoptimized
                            className="block size-5 shrink-0 object-contain"
                          />
                        </button>
                        <button type="button" aria-label="Instagram">
                          <Image
                            src="/instagram.svg"
                            alt=""
                            aria-hidden="true"
                            width={20}
                            height={20}
                            unoptimized
                            className="block size-5 shrink-0 object-contain"
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex min-w-0 flex-col items-center gap-3 border-t border-neutral-200 pt-6 text-center lg:flex-row lg:justify-between lg:gap-6 lg:text-left">
                    <p className="max-w-full text-label leading-relaxed text-neutral-500">
                      {t("© PT. Inti Jaka Raya. All Rights Reserved")}
                    </p>
                    <div className="flex max-w-full flex-wrap items-center justify-center gap-x-3 gap-y-2 text-label leading-relaxed text-neutral-500">
                      <span>{t("Terms of Service")}</span>
                      <span
                        className="size-1 shrink-0 rounded-full bg-neutral-300"
                        aria-hidden="true"
                      />
                      <span>{t("Privacy Policy")}</span>
                    </div>
                  </div>
                </div>
              </footer>
            )}
          </Flex>

          {!isCMS && (
            <Image
              src={parallaxImage}
              alt={t("Parallax")}
              width={4096}
              height={2731}
              style={
                router.pathname === "/" ? { minHeight: "960px" } : undefined
              }
              className="absolute z-10 w-dvw h-157 lg:h-180 xl:h-193.5 object-cover object-center"
            />
          )}
        </Flex>

        <LoginModal />
        <DeleteModal />

        <Toast />
      </Flex>

      <Analytics />
      <SpeedInsights />
    </QueryClientProvider>
  );
}
