import { Navbar } from "@/components/custom";
import { Flex } from "@/components/shared";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Image from "next/image";
import {
  DotText,
  FacebookIcon,
  InstagramIcon,
  LogoFull,
  TwitterIcon,
} from "../../public";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Flex className="w-dvw h-dvh overflow-hidden">
      <Navbar />

      <Flex className="relative flex-1 overflow-hidden">
        <Flex className="z-20 flex-1 overflow-y-auto bg-white">
          <Component {...pageProps} />

          <Flex className="px-3.5 py-12 bg-neutral-50">
            <Flex className="gap-12 mb-[42.5px]">
              <LogoFull />

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

            <Flex className="h-px bg-neutral-200 mb-12" />

            <Flex className="gap-2.5">
              <p className="text-body-xs text-neutral-500">
                © PT. Inti Jaka Raya. All Rights Reserved
              </p>

              <Flex className="flex-row! items-center gap-2.5">
                <p className="text-body-xs text-neutral-500">
                  Terms of Service
                </p>

                <DotText />

                <p className="text-body-xs text-neutral-500">Privacy Policy</p>
              </Flex>
            </Flex>
          </Flex>
        </Flex>

        <Image
          src="/images/parallax.jpg"
          alt="Parallax"
          width={4096}
          height={2731}
          className="absolute z-10 w-dvw h-157 object-cover object-center"
        />
      </Flex>
    </Flex>
  );
}
