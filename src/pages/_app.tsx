import { Navbar } from "@/components/custom";
import { Flex } from "@/components/shared";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Image from "next/image";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Flex className="w-dvw h-dvh overflow-hidden">
      <Navbar />

      <Flex className="relative flex-1 overflow-hidden">
        <Flex className="z-20 flex-1 overflow-y-auto">
          <Component {...pageProps} />
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
