import useTranslation from "@/hooks/useTranslation";
import { Flex } from "../shared";
import { CloseSquare, HamburgerMenu, User } from "iconsax-reactjs";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth, useLoginModal } from "@/stores/page.store";
import { Ring2 } from "ldrs/react";
import "ldrs/react/Ring2.css";
import useAuthController from "@/controllers/auth.controller";

const Navbar = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const activeLang = router.locale === "id" ? "id" : "en";
  const setActiveLang = (locale: "id" | "en") => {
    if (locale === activeLang) return;
    setMenuOpen(false);
    void router
      .push({ pathname: router.pathname, query: router.query }, router.asPath, {
        locale,
      })
      .then((changed) => {
        if (changed)
          document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
      });
  };
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingOpen, setSettingOpen] = useState(false);
  const settingDropdownRef = useRef<HTMLDivElement>(null);

  const setLoginModal = useLoginModal((state) => state.setShowModal);
  const isLoggedIn = useAuth((state) => state.isLoggedIn);

  const { useCheckIsLoggedInService, logoutService } = useAuthController();

  const { isLoading, isRefetching } = useCheckIsLoggedInService();

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
    <Flex className="relative z-999 shrink-0 overflow-visible font-sans [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-accent-600 [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-offset-4 [&_button:focus-visible]:outline-accent-600">
      <Flex className="relative z-20 h-14.5 flex-row! items-center gap-2 border-b border-neutral-200 bg-white px-4 xl:h-16 xl:px-20 shadow-[0_4px_24px_-16px_var(--primary-900)] max-xl:grid! max-xl:grid-cols-[76px_minmax(0,1fr)_76px] max-xl:px-3! max-xl:sm:px-6!">
        <Flex className="contents! xl:hidden!">
          <button
            type="button"
            className="flex size-11 shrink-0 items-center justify-center justify-self-start rounded-lg border border-neutral-200 bg-neutral-50 text-primary-600 transition-colors hover:bg-primary-50/40"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={t(menuOpen ? "Close navigation" : "Open navigation")}
          >
            <span
              className="flex size-6 flex-col overflow-hidden"
              aria-hidden="true"
            >
              <motion.div
                className="size-6 shrink-0"
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
                className="size-6 shrink-0"
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
            </span>
          </button>

          <Link
            href="/"
            aria-label="PT. Inti Jaka Raya"
            className="flex h-12 w-full min-w-0 max-w-46 items-center justify-center justify-self-center"
          >
            <Image
              src="/images/logo.png"
              alt="PT. Inti Jaka Raya"
              width={1012}
              height={423}
              sizes="(min-width: 640px) 115px, 106px"
              priority
              className="block h-11 w-auto max-w-full object-contain sm:h-12"
            />
          </Link>
        </Flex>

        <div className="mx-auto hidden w-full max-w-360 min-w-0 flex-1 items-center justify-between gap-6 xl:flex">
          <Flex className="flex-row! shrink-0 items-center gap-5 xl:gap-6">
            <Link
              href="/"
              aria-label="PT. Inti Jaka Raya"
              className="flex h-11 w-46 shrink-0 items-center justify-center"
            >
              <Image
                src="/images/brand-logo.png"
                alt="PT. Inti Jaka Raya"
                width={225}
                height={42}
                sizes="184px"
                priority
                className="block h-auto w-full object-contain"
              />
            </Link>

            <Flex className="h-7 w-px bg-neutral-200" />

            <Flex className="relative isolate flex-row! rounded-[10px] border border-neutral-200 bg-neutral-50 p-0.75">
              <motion.button
                type="button"
                className="relative z-10 flex size-9 items-center justify-center rounded-[7px] text-caption font-extrabold tracking-wide"
                initial={false}
                animate={{
                  color: activeLang === "id" ? "white" : "var(--neutral-500)",
                }}
                aria-label="Bahasa Indonesia"
                aria-pressed={activeLang === "id"}
                onClick={() => setActiveLang("id")}
              >
                {t("ID")}
              </motion.button>

              <motion.button
                type="button"
                className="relative z-10 flex size-9 items-center justify-center rounded-[7px] text-caption font-extrabold tracking-wide"
                initial={false}
                animate={{
                  color: activeLang === "en" ? "white" : "var(--neutral-500)",
                }}
                aria-label="English"
                aria-pressed={activeLang === "en"}
                onClick={() => setActiveLang("en")}
              >
                {t("EN")}
              </motion.button>

              <motion.div
                className="pointer-events-none absolute left-0.75 top-0.75 z-0 size-9 rounded-[7px] bg-primary-600 shadow-sm"
                initial={false}
                animate={{
                  x: activeLang === "id" ? 0 : "100%",
                }}
              />
            </Flex>
          </Flex>

          <Flex className="flex-row! items-center gap-5 xl:gap-8">
            <Flex className="flex-row! shrink-0 items-center gap-1 xl:gap-2">
              {[
                { label: "Home", href: "/" },
                { label: "About Us", href: "/about" },
                { label: "Products", href: "/products" },
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
                    aria-current={
                      router.pathname === href ||
                      (href !== "/" && router.pathname.startsWith(href + "/"))
                        ? "page"
                        : undefined
                    }
                    className="relative block rounded-lg px-3 py-2.5 text-small font-bold text-neutral-600 transition-colors hover:bg-neutral-50 xl:px-4"
                    onClick={() => setMenuOpen(false)}
                  >
                    <motion.span
                      className="block"
                      variants={{
                        rest: {
                          scale: 1,
                          opacity: 1,
                          color:
                            router.pathname === href ||
                            (href !== "/" &&
                              router.pathname.startsWith(href + "/"))
                              ? "var(--primary-600)"
                              : "var(--neutral-600)",
                        },
                        hover: {
                          scale: 1.045,
                          opacity: 0.88,
                          color: "var(--primary-600)",
                        },
                      }}
                      transition={{
                        duration: 0.28,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      {t(label)}
                    </motion.span>

                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-x-3 bottom-0.5 h-0.5 origin-center rounded-full bg-accent-600 xl:inset-x-4"
                      variants={{
                        rest: {
                          scaleX:
                            router.pathname === href ||
                            (href !== "/" &&
                              router.pathname.startsWith(href + "/"))
                              ? 1
                              : 0.45,
                          opacity:
                            router.pathname === href ||
                            (href !== "/" &&
                              router.pathname.startsWith(href + "/"))
                              ? 1
                              : 0,
                        },
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

            <div className="flex h-11 min-w-26 items-center justify-end">
              {isLoading || isRefetching ? (
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
                    className="flex size-10 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 transition-colors hover:border-primary-100 hover:bg-primary-50/30"
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
                        className="absolute right-0 top-[calc(100%+12px)] z-50 flex w-50 max-w-[calc(100vw-32px)] origin-top-right flex-col rounded-[14px] border border-neutral-200 bg-white p-2 shadow-xl shadow-primary-900/10"
                      >
                        <Link
                          href="/cms/products"
                          className="rounded-lg px-3 py-3 text-small font-semibold text-neutral-600 transition-colors duration-200 hover:bg-primary-50/30 hover:text-primary-600"
                          onClick={() => setSettingOpen(false)}
                        >
                          {t("Dashboard")}
                        </Link>

                        <button
                          className="flex rounded-lg px-3 py-3 text-small font-semibold text-neutral-600 transition-colors duration-200 hover:bg-primary-50/30 hover:text-primary-600"
                          onClick={() => {
                            setSettingOpen(false);
                            logoutService();
                          }}
                        >
                          {t("Logout")}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Flex>
              ) : (
                <motion.button
                  type="button"
                  className="flex min-h-10 min-w-26 items-center justify-center whitespace-nowrap rounded-lg border border-primary-600 bg-primary-600 px-5 py-2.5 text-label font-bold text-white"
                  whileHover={{
                    scale: 1.045,
                    opacity: 0.92,
                    color: "white",
                    backgroundColor: "var(--primary-500)",
                    borderColor: "var(--primary-500)",
                    boxShadow:
                      "0 6px 18px color-mix(in srgb, var(--primary-600) 18%, transparent)",
                  }}
                  whileTap={{ scale: 0.975, opacity: 1 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => setLoginModal(true)}
                >
                  {t("Sign In")}
                </motion.button>
              )}
            </div>
          </Flex>
        </div>

        <Flex className="relative isolate h-10.5 w-19 shrink-0 flex-row! items-center justify-self-end rounded-[10px] border border-neutral-200 bg-neutral-50 p-0.75 xl:hidden!">
          <motion.button
            type="button"
            className="relative z-10 flex size-8.5 shrink-0 items-center justify-center rounded-[7px] text-caption font-extrabold tracking-wide"
            initial={false}
            animate={{
              color: activeLang === "en" ? "white" : "var(--neutral-500)",
            }}
            aria-label="English"
            aria-pressed={activeLang === "en"}
            onClick={() => setActiveLang("en")}
          >
            {t("EN")}
          </motion.button>

          <motion.button
            type="button"
            className="relative z-10 flex size-8.5 shrink-0 items-center justify-center rounded-[7px] text-caption font-extrabold tracking-wide"
            initial={false}
            animate={{
              color: activeLang === "id" ? "white" : "var(--neutral-500)",
            }}
            aria-label="Bahasa Indonesia"
            aria-pressed={activeLang === "id"}
            onClick={() => setActiveLang("id")}
          >
            {t("ID")}
          </motion.button>

          <motion.div
            className="pointer-events-none absolute left-0.75 top-0.75 z-0 size-8.5 rounded-[7px] bg-primary-600 shadow-sm"
            initial={false}
            animate={{
              x: activeLang === "en" ? 0 : "100%",
            }}
          />
        </Flex>
      </Flex>

      <AnimatePresence>
        {menuOpen && (
          <Flex className="absolute inset-x-0 top-14.5 z-10 h-[calc(100dvh-3.625rem)] min-h-0 bg-primary-900/40 backdrop-blur-sm xl:hidden!">
            <motion.div
              className="my-3 flex max-h-[calc(100dvh-5.125rem)] min-h-0 w-[calc(100%_-_24px)] max-w-xl shrink-0 self-center flex-col gap-4 overflow-y-auto overscroll-contain rounded-2xl border border-neutral-200 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-xl shadow-primary-900/10 sm:p-5"
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
              <Flex
                id="mobile-navigation"
                role="navigation"
                aria-label={t("Navigation")}
                className="w-full min-w-0 gap-1.5 [&_a]:min-w-0 [&_a]:break-words [&_a[aria-current=page]]:border-primary-50 [&_a[aria-current=page]]:bg-primary-50/30 [&_a[aria-current=page]]:text-primary-600"
              >
                <Link
                  href="/"
                  aria-current={router.pathname === "/" ? "page" : undefined}
                  className="flex min-h-12 w-full items-center rounded-xl border border-transparent px-4 py-3 text-body-xs font-bold text-neutral-600 transition-colors hover:border-neutral-200 hover:bg-neutral-50"
                  onClick={() => setMenuOpen(false)}
                >
                  {t("Home")}
                </Link>

                <Link
                  href="/about"
                  aria-current={
                    router.pathname === "/about" ? "page" : undefined
                  }
                  className="flex min-h-12 w-full items-center rounded-xl border border-transparent px-4 py-3 text-body-xs font-bold text-neutral-600 transition-colors hover:border-neutral-200 hover:bg-neutral-50"
                  onClick={() => setMenuOpen(false)}
                >
                  {t("About Us")}
                </Link>

                <Link
                  href="/products"
                  aria-current={
                    router.pathname === "/products" ||
                    router.pathname.startsWith("/products/")
                      ? "page"
                      : undefined
                  }
                  className="flex min-h-12 w-full items-center rounded-xl border border-transparent px-4 py-3 text-body-xs font-bold text-neutral-600 transition-colors hover:border-neutral-200 hover:bg-neutral-50"
                  onClick={() => setMenuOpen(false)}
                >
                  {t("Products")}
                </Link>
              </Flex>

              <div className="h-px bg-neutral-200" />

              <Flex className="grid! shrink-0 grid-cols-[repeat(3,44px)] justify-center gap-3 [&_button]:inline-flex [&_button]:size-11 [&_button]:shrink-0 [&_button]:items-center [&_button]:justify-center [&_button]:rounded-full [&_button]:border [&_button]:border-neutral-200 [&_button]:bg-neutral-50 [&_button]:p-0 [&_button]:transition-colors [&_button:hover]:border-primary-100 [&_button:hover]:bg-primary-50/30">
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
              </Flex>
            </motion.div>

            <Flex
              className="min-h-0 flex-1"
              onClick={() => setMenuOpen(false)}
            />
          </Flex>
        )}
      </AnimatePresence>
    </Flex>
  );
};

export default Navbar;
