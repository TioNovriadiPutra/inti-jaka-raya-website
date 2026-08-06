import { Flex } from "../shared";
import { CloseSquare, HamburgerMenu, User } from "iconsax-reactjs";
import {
  FacebookIcon,
  InstagramIcon,
  LogoFull,
  TwitterIcon,
} from "../../../public";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth, useLoginModal } from "@/stores/page.store";
import { Ring2 } from "ldrs/react";
import "ldrs/react/Ring2.css";
import useAuthController from "@/controllers/auth.controller";

const Navbar = () => {
  const [activeLang, setActiveLang] = useState<"id" | "en">("en");
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingOpen, setSettingOpen] = useState(false);
  const settingDropdownRef = useRef<HTMLDivElement>(null);

  const setLoginModal = useLoginModal((state) => state.setShowModal);
  const isLoggedIn = useAuth((state) => state.isLoggedIn);

  const { useCheckIsLoggedInService } = useAuthController();

  const { isLoading } = useCheckIsLoggedInService();

  useEffect(() => {
    if (!settingOpen) return;

    const handleOutsideClick = (event: PointerEvent) => {
      if (
        settingDropdownRef.current &&
        !settingDropdownRef.current.contains(event.target as Node)
      ) {
        setSettingOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, [settingOpen]);

  return (
    <Flex className="z-999 relative overflow-visible">
      <Flex className="flex-row! h-14.5 lg:h-16 items-center px-3.5 lg:px-10 xl:px-20 py-2.75 bg-white shadow-[0_0_12px_0_rgba(0,0,0,0.15)] z-20">
        <Flex className="lg:hidden! flex-1 flex-row! items-center gap-3.5">
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

        <div className="hidden lg:flex flex-1 items-center justify-between">
          <Flex className="flex-row! items-center gap-6">
            <LogoFull />

            <Flex className="h-10.5 w-px bg-neutral-200" />

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

          <Flex className="flex-row! gap-10">
            <Flex className="flex-row! items-center gap-8 shrink-0">
              {[
                { label: "Home", href: "/" },
                { label: "About Us", href: "/about" },
                { label: "Products", href: "/products" },
                { label: "Case Study", href: "/" },
              ].map(({ label, href }) => (
                <motion.div
                  key={label}
                  className="relative"
                  initial="rest"
                  animate="rest"
                  whileHover="hover"
                >
                  <Link
                    href={href}
                    className="relative block py-2 text-body-s font-semibold text-neutral-600"
                    onClick={() => setMenuOpen(false)}
                  >
                    <motion.span
                      className="block"
                      variants={{
                        rest: {
                          scale: 1,
                          opacity: 1,
                          color: "var(--neutral-600)",
                        },
                        hover: {
                          scale: 1.045,
                          opacity: 0.88,
                          color: "var(--accent-600)",
                        },
                      }}
                      transition={{
                        duration: 0.28,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      {label}
                    </motion.span>

                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-0.5 origin-center rounded-full bg-accent-600"
                      variants={{
                        rest: { scaleX: 0.45, opacity: 0 },
                        hover: { scaleX: 1, opacity: 1 },
                      }}
                      transition={{
                        duration: 0.32,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    />
                  </Link>
                </motion.div>
              ))}
            </Flex>

            {isLoading ? (
              <Ring2
                size="32"
                stroke="4"
                strokeLength="0.25"
                bgOpacity="0.1"
                speed="0.8"
                color="var(--accent-600)"
              />
            ) : isLoggedIn ? (
              <Flex ref={settingDropdownRef} className="relative">
                <button
                  type="button"
                  className="flex size-9 items-center justify-center border border-neutral-200 rounded-full bg-neutral-50"
                  onClick={() => setSettingOpen((prev) => !prev)}
                >
                  <User size={18} color="var(--neutral-400)" />
                </button>

                <AnimatePresence>
                  {settingOpen && (
                    <motion.div
                      initial={{
                        scale: 0,
                        opacity: 0,
                      }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{
                        scale: 0,
                        opacity: 0,
                      }}
                      className="flex flex-col absolute right-0 top-[110%] z-50 w-44 bg-white p-2 border border-neutral-200 rounded-[14px] origin-top-right"
                    >
                      <Link
                        href="/dashboard"
                        className="px-2.5 py-3 text-body-s text-neutral-700 rounded-lg hover:bg-accent-50 hover:text-accent-600 duration-300 transition-colors"
                      >
                        Dashboard
                      </Link>

                      <button className="flex px-2.5 py-3 text-body-s text-neutral-700 rounded-lg hover:bg-accent-50 hover:text-accent-600 duration-300 transition-colors">
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Flex>
            ) : (
              <motion.button
                type="button"
                className="flex border py-[11.5px] px-6 rounded-3xl border-neutral-200 bg-white text-body-xs font-bold text-neutral-600"
                whileHover={{
                  scale: 1.045,
                  opacity: 0.92,
                  color: "white",
                  backgroundColor: "var(--accent-600)",
                  borderColor: "var(--accent-600)",
                  boxShadow: "0 10px 24px rgba(79, 175, 77, 0.22)",
                }}
                whileTap={{ scale: 0.975, opacity: 1 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setLoginModal(true)}
              >
                Sign In
              </motion.button>
            )}
          </Flex>
        </div>

        <Flex className="lg:hidden relative flex-row! px-1 pt-1 pb-0.75 bg-neutral-50 rounded-sm">
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

          <motion.div
            className="absolute z-10 w-6.5 h-7.25 bg-primary-400 rounded-sm"
            initial={false}
            animate={{
              x: activeLang === "en" ? 0 : "100%",
            }}
          />
        </Flex>
      </Flex>

      <AnimatePresence>
        {menuOpen && (
          <Flex className="xl:hidden absolute left-0 right-0 top-14.5 h-[calc(100dvh-3.625rem)] bg-[rgba(14,14,14,0.4)] z-10">
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
                  onClick={() => setMenuOpen(false)}
                >
                  Home
                </Link>

                <Link
                  href="/about"
                  className="text-body-s font-semibold text-neutral-600"
                  onClick={() => setMenuOpen(false)}
                >
                  About Us
                </Link>

                <Link
                  href="/products"
                  className="text-body-s font-semibold text-neutral-600"
                  onClick={() => setMenuOpen(false)}
                >
                  Products
                </Link>

                <Link
                  href="/"
                  className="text-body-s font-semibold text-neutral-600"
                  onClick={() => setMenuOpen(false)}
                >
                  Case Study
                </Link>
              </Flex>

              <div className="h-px bg-neutral-200" />

              <Flex className="flex-row! gap-6 justify-center">
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
            </motion.div>

            <Flex className="flex-1" onClick={() => setMenuOpen(false)} />
          </Flex>
        )}
      </AnimatePresence>
    </Flex>
  );
};

export default Navbar;
