import { Flex } from "../shared";
import { CloseSquare, HamburgerMenu } from "iconsax-reactjs";
import { LogoFull } from "../../../public";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import Link from "next/link";

const Navbar = () => {
  const [activeLang, setActiveLang] = useState<"id" | "en">("id");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Flex className="z-999 relative overflow-visible">
      <Flex className="flex-row! h-14.5 items-center px-3.5 py-2.75 bg-white shadow-[0_0_12px_0_rgba(0,0,0,0.15)] z-20">
        <Flex className="flex-1 flex-row! items-center gap-3.5">
          <button
            type="button"
            className="flex flex-col size-6 overflow-hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <motion.div
              initial={false}
              animate={{
                y: menuOpen ? "-100%" : 0,
              }}
              transition={{
                ease: "easeOut",
              }}
            >
              <HamburgerMenu size="24" color="var(--neutral-500)" />
            </motion.div>

            <motion.div
              initial={false}
              animate={{
                y: menuOpen ? "-100%" : 0,
              }}
              transition={{
                ease: "easeOut",
              }}
            >
              <CloseSquare size="24" color="var(--neutral-500)" />
            </motion.div>
          </button>

          <LogoFull />
        </Flex>

        <Flex className="relative flex-row! px-1 pt-1 pb-0.75 bg-neutral-50 rounded-sm">
          <motion.button
            type="button"
            className="flex w-6.5 h-7.25 items-center justify-center text-body-xs font-medium z-999"
            initial={false}
            animate={{
              color: activeLang === "id" ? "white" : "var(--neutral-400)",
            }}
            onClick={() => {
              setActiveLang("id");
            }}
          >
            ID
          </motion.button>

          <motion.button
            type="button"
            className="flex w-6.5 h-7.25 items-center justify-center text-body-xs font-medium z-999"
            initial={false}
            animate={{
              color: activeLang === "en" ? "white" : "var(--neutral-400)",
            }}
            onClick={() => {
              setActiveLang("en");
            }}
          >
            EN
          </motion.button>

          <motion.div
            className="absolute z-10 w-6.5 h-7.25 bg-primary-400 rounded-sm"
            initial={false}
            animate={{
              x: activeLang === "id" ? 0 : "100%",
            }}
          />
        </Flex>
      </Flex>

      <AnimatePresence>
        {menuOpen && (
          <Flex className="absolute left-0 right-0 top-14.5 h-[calc(100dvh-3.625rem)] bg-[rgba(14,14,14,0.4)] z-10">
            <motion.div
              className="flex flex-col py-8 px-3.5 bg-neutral-50 gap-6"
              initial={{
                y: "-100%",
              }}
              animate={{
                y: 0,
              }}
              exit={{
                y: "-100%",
              }}
              transition={{
                ease: "easeOut",
              }}
            >
              <Flex className="items-center mx-6.5 gap-8">
                <Link
                  href="/"
                  className="text-body-s font-semibold text-neutral-600"
                >
                  Home
                </Link>

                <Link
                  href="/"
                  className="text-body-s font-semibold text-neutral-600"
                >
                  About Us
                </Link>

                <Link
                  href="/"
                  className="text-body-s font-semibold text-neutral-600"
                >
                  Products
                </Link>

                <Link
                  href="/"
                  className="text-body-s font-semibold text-neutral-600"
                >
                  Case Study
                </Link>

                <button
                  type="button"
                  className="border w-full py-[11.5px] rounded-3xl border-neutral-200 text-body-xs font-bold text-neutral-600"
                >
                  Sign In
                </button>
              </Flex>

              <div className="h-px bg-neutral-200" />

              <Flex className="flex-row! self-center"></Flex>
            </motion.div>

            <Flex className="flex-1" onClick={() => setMenuOpen(false)} />
          </Flex>
        )}
      </AnimatePresence>
    </Flex>
  );
};

export default Navbar;
