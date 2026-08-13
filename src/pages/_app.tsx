import { DeleteModal, LoginModal, Navbar, Sidebar } from "@/components/custom";
import { Flex } from "@/components/shared";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  DotText,
  FacebookIcon,
  InstagramIcon,
  LogoFull,
  TwitterIcon,
} from "../../public";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toast from "@/components/custom/Toast";

export default function App({ Component, pageProps }: AppProps) {
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

  return (
    <QueryClientProvider client={queryClient}>
      <Flex className="relative w-dvw h-dvh overflow-hidden">
        {!isCMS && <Navbar />}

        <Flex className="relative flex-1 overflow-hidden bg-neutral-50">
          <Flex
            className={`${isCMS ? "flex-row!" : ""} z-20 flex-1 overflow-y-auto`}
          >
            {isCMS && <Sidebar />}

            <Component {...pageProps} />

            {!isCMS && (
              <Flex className="px-3.5 lg:px-20 py-12 lg:py-12 bg-neutral-50 -mt-px">
                <Flex className="lg:flex-row! lg:justify-between lg:items-center gap-12 mb-[42.5px] lg:mb-12 xl:w-full xl:max-w-7xl xl:self-center">
                  <LogoFull className="" />

                  <Flex className="flex-row! gap-6">
                    <button type="button">
                      <FacebookIcon />
                    </button>

                    <button type="button">
                      <TwitterIcon />
                    </button>

                    <button type="button">
                      <InstagramIcon />
                    </button>
                  </Flex>
                </Flex>

                <Flex className="h-px bg-neutral-200 mb-12 xl:w-full xl:max-w-7xl xl:self-center" />

                <Flex className="lg:flex-row! lg:justify-between gap-2.5 xl:w-full xl:max-w-7xl xl:self-center">
                  <p className="text-body-xs text-neutral-500">
                    © PT. Inti Jaka Raya. All Rights Reserved
                  </p>

                  <Flex className="flex-row! items-center gap-2.5">
                    <p className="text-body-xs text-neutral-500">
                      Terms of Service
                    </p>

                    <DotText />

                    <p className="text-body-xs text-neutral-500">
                      Privacy Policy
                    </p>
                  </Flex>
                </Flex>
              </Flex>
            )}
          </Flex>

          {!isCMS && (
            <Image
              src={parallaxImage}
              alt="Parallax"
              width={4096}
              height={2731}
              className="absolute z-10 w-dvw h-157 lg:h-180 xl:h-193.5 object-cover object-center"
            />
          )}
        </Flex>

        <LoginModal />
        <DeleteModal />

        <Toast />
      </Flex>
    </QueryClientProvider>
  );
}
