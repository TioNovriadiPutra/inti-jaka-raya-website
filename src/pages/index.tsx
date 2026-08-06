import { Flex } from "@/components/shared";
import { UPSLogo } from "../../public";
import { section3Data, section4Data, section5Data } from "@/utils/constant";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, type Variants } from "motion/react";

const MotionFlex = motion.create(Flex);
const MotionImage = motion.create(Image);

const viewportOnce = {
  once: true,
  amount: 0.7,
  margin: "0px 0px -20% 0px",
} as const;

const revealContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.12,
    },
  },
};

const revealItem: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.975, filter: "blur(7px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 1.35,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const cardReveal: Variants = {
  hidden: { opacity: 0, y: 42, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 1.45,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.16,
      delayChildren: 0.18,
    },
  },
};

const lineReveal: Variants = {
  hidden: { opacity: 0, scaleX: 0.12 },
  visible: {
    opacity: 1,
    scaleX: 1,
    transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] },
  },
};

const headingReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
    scale: 0.97,
    filter: "blur(6px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const serviceCopyItem: Variants = {
  hidden: { opacity: 0, y: 22, filter: "blur(5px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1] },
  },
};

const serviceTextReveal: Variants = {
  hidden: (direction: number) => ({
    opacity: 0,
    x: direction * -54,
    filter: "blur(7px)",
  }),
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.16,
      delayChildren: 0.16,
    },
  },
};

const serviceImageReveal: Variants = {
  hidden: (direction: number) => ({
    opacity: 0,
    x: direction * 54,
    scale: 0.9,
    clipPath: direction === 1 ? "inset(0 0 0 18%)" : "inset(0 18% 0 0)",
  }),
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    clipPath: "inset(0 0 0 0%)",
    transition: {
      duration: 1.6,
      delay: 0.08,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const Home = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const carouselIndexRef = useRef(0);
  const autoScrollTimerRef = useRef<number | undefined>(undefined);
  const scrollEndTimerRef = useRef<number | undefined>(undefined);
  const scheduleAutoScrollRef = useRef<() => void>(() => undefined);
  const isAutoScrollingRef = useRef(false);
  const isResettingCarouselRef = useRef(false);
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const [progressCycle, setProgressCycle] = useState(0);
  const [isCarouselEntryComplete, setIsCarouselEntryComplete] = useState(false);

  const getCarouselStep = useCallback(() => {
    const firstSlide = carouselRef.current?.firstElementChild
      ?.firstElementChild as HTMLElement | null;

    return firstSlide ? firstSlide.offsetWidth + 16 : 0;
  }, []);

  const scheduleAutoScroll = useCallback(() => {
    window.clearTimeout(autoScrollTimerRef.current);
    if (document.hidden || !isCarouselEntryComplete) return;

    window.requestAnimationFrame(() => {
      setProgressCycle((currentCycle) => currentCycle + 1);
    });

    autoScrollTimerRef.current = window.setTimeout(() => {
      const carousel = carouselRef.current;
      const step = getCarouselStep();
      if (!carousel || !step) return;

      const nextIndex = carouselIndexRef.current + 1;
      const nextActiveIndex = nextIndex % section5Data.length;

      isAutoScrollingRef.current = true;
      carouselIndexRef.current = nextIndex;
      setActiveCarouselIndex(nextActiveIndex);
      carousel.scrollTo({ left: nextIndex * step, behavior: "smooth" });
      scheduleAutoScrollRef.current();
    }, 3000);
  }, [getCarouselStep, isCarouselEntryComplete]);

  useEffect(() => {
    scheduleAutoScrollRef.current = scheduleAutoScroll;
  }, [scheduleAutoScroll]);

  useEffect(() => {
    scheduleAutoScroll();

    const handleVisibilityChange = () => {
      window.clearTimeout(autoScrollTimerRef.current);
      if (!document.hidden) scheduleAutoScroll();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearTimeout(autoScrollTimerRef.current);
      window.clearTimeout(scrollEndTimerRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [scheduleAutoScroll]);

  const handleCarouselScroll = () => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    if (isResettingCarouselRef.current) {
      isResettingCarouselRef.current = false;
      return;
    }

    if (isAutoScrollingRef.current) {
      window.clearTimeout(scrollEndTimerRef.current);

      scrollEndTimerRef.current = window.setTimeout(() => {
        const step = getCarouselStep();
        if (!step) return;

        let nextIndex = Math.round(carousel.scrollLeft / step);

        if (nextIndex >= section5Data.length) {
          isResettingCarouselRef.current = true;
          carousel.scrollTo({ left: 0, behavior: "auto" });
          nextIndex = 0;
        }

        carouselIndexRef.current = nextIndex;
        isAutoScrollingRef.current = false;
      }, 150);

      return;
    }

    window.clearTimeout(autoScrollTimerRef.current);
    window.clearTimeout(scrollEndTimerRef.current);

    scrollEndTimerRef.current = window.setTimeout(() => {
      const step = getCarouselStep();
      if (!step) return;

      let nextIndex = Math.round(carousel.scrollLeft / step);

      if (nextIndex >= section5Data.length) {
        carousel.scrollTo({ left: 0, behavior: "auto" });
        nextIndex = 0;
      }

      carouselIndexRef.current = nextIndex;
      setActiveCarouselIndex(nextIndex);
      scheduleAutoScroll();
    }, 150);
  };

  return (
    <Flex className="grow basis-0">
      {/* Section 1 */}
      <MotionFlex
        className="px-3.5 md:px-15 lg:pl-20 lg:pr-12.25 xl:px-30 pt-19 lg:pt-43.25 xl:pt-43.25 pb-31.5 md:pb-27.5 lg:pb-47.25 xl:pb-79.5 bg-[rgba(0,0,0,0.4)]"
        variants={revealContainer}
        initial="hidden"
        animate="visible"
      >
        <Flex className="xl:w-full xl:max-w-300 xl:self-center">
          <motion.h1
            className="text-white text-shadow-[2px_4px_24px_rgb(0_0_0/0.25)] mb-3.5"
            variants={headingReveal}
          >
            Composites & Protective Coatings Tailored for Your Industry
          </motion.h1>

          <motion.p
            className="text-body-s text-white text-shadow-[2px_4px_24px_rgba(0,0,0,0.25)] mb-9"
            variants={revealItem}
          >
            Sole Distributor for UNIQUE POLYMER SYSTEMS Made in UK, in
            Indonesia.
          </motion.p>

          <motion.div className="self-start" variants={revealItem}>
            <motion.button
              type="button"
              className="relative flex overflow-hidden bg-white px-6 py-[11.5px] rounded-3xl shadow-[2px_4px_24px_rgba(0,0,0,0.15)]"
              initial="rest"
              animate="rest"
              whileHover="hover"
              whileTap="tap"
              variants={{
                rest: {
                  y: 0,
                  scale: 1,
                  boxShadow: "2px 4px 24px rgba(0, 0, 0, 0.15)",
                },
                hover: {
                  y: -3,
                  scale: 1.045,
                  boxShadow: "2px 10px 32px rgba(0, 0, 0, 0.22)",
                },
                tap: { y: -1, scale: 0.975 },
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                mass: 0.7,
              }}
            >
              <motion.span
                aria-hidden="true"
                className="absolute inset-0 origin-left bg-accent-600"
                variants={{
                  rest: { scaleX: 0 },
                  hover: { scaleX: 1 },
                  tap: { scaleX: 1 },
                }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              />

              <motion.span
                className="relative z-10"
                variants={{
                  rest: { color: "var(--neutral-800)" },
                  hover: { color: "white" },
                  tap: { color: "white" },
                }}
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                View Product
              </motion.span>
            </motion.button>
          </motion.div>
        </Flex>
      </MotionFlex>

      {/* Section 2 */}
      <MotionFlex
        className="px-3.5 md:px-15 pt-16 md:py-21.5 bg-neutral-50 gap-10 md:gap-16"
        variants={revealContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <MotionFlex
          className="lg:flex-row! lg:justify-center gap-10 md:gap-21.5 xl:gap-83.5"
          variants={revealItem}
        >
          <h3 className="font-medium text-neutral-800 lg:w-111">
            Focusing on quality,
            <br className="lg:hidden" />
            <span className="font-semibold text-neutral-400">
              we maintain customer trust
            </span>
          </h3>

          <p className="text-body-m text-neutral-500 lg:w-93.5 xl:w-105.5">
            For over 30 years, we&apos;ve provided reliable solutions to combat
            industrial challenges like erosion, corrosion, chemical attacks, and
            wear. Our advanced systems also offer water and weatherproofing,
            along with safety grip solutions, ensuring your assets stay
            protected.
          </p>
        </MotionFlex>

        <MotionFlex
          className="lg:flex-row! items-center lg:justify-center gap-6 lg:gap-15"
          variants={revealItem}
        >
          <UPSLogo />

          <div className="w-44.5 lg:w-px h-px lg:h-full bg-neutral-200" />

          <h3 className="text-center font-medium text-neutral-400">
            Authorized
            <br />
            Distributor
          </h3>
        </MotionFlex>
      </MotionFlex>

      {/* Section 3 */}
      <Flex className="px-3.5 md:px-15 lg:px-20 xl:px-30 py-16 md:py-21.5 xl:pt-14.25 xl:pb-21.5 -mt-px bg-white">
        <motion.h3
          className="text-center font-medium text-neutral-800 mb-6"
          variants={headingReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ ...viewportOnce, amount: 0.7 }}
        >
          Trusted services
          <br />
          <span className="font-bold text-neutral-400">
            for your various needs
          </span>
        </motion.h3>

        <motion.div
          className="w-45 h-px bg-neutral-200 self-center mb-21.5"
          variants={lineReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ ...viewportOnce, amount: 0.8 }}
        />

        <Flex className="gap-16 lg:gap-32 xl:gap-32 xl:w-full xl:max-w-300 xl:self-center">
          {section3Data.map((item, index) => (
            <MotionFlex
              key={index.toString()}
              className={`${index % 2 === 0 ? "lg:flex-row!" : "lg:flex-row-reverse!"} lg:gap-16 lg:justify-center lg:items-center`}
              initial="hidden"
              whileInView="visible"
              viewport={{ ...viewportOnce, amount: 0.6 }}
            >
              <MotionFlex
                className="lg:w-84 xl:flex-1"
                custom={index % 2 === 0 ? 1 : -1}
                variants={serviceTextReveal}
              >
                <motion.p
                  className="text-body-xs text-accent-600"
                  variants={serviceCopyItem}
                >
                  {item.tag}
                </motion.p>

                <motion.h4
                  className="text-neutral-800 mb-3"
                  variants={serviceCopyItem}
                >
                  {item.title}
                </motion.h4>

                <motion.p
                  className="text-body-s text-neutral-500 mb-16 lg:mb-0"
                  variants={serviceCopyItem}
                >
                  {item.description}
                </motion.p>
              </MotionFlex>

              <MotionImage
                src={item.image}
                alt={`Image ${index + 1}`}
                width={item.width}
                height={item.height}
                className="w-full lg:w-116 xl:w-125.25 h-62.25 md:h-109.75 lg:h-87 xl:h-94 overflow-hidden rounded-3xl object-cover object-center"
                custom={index % 2 === 0 ? 1 : -1}
                variants={serviceImageReveal}
              />
            </MotionFlex>
          ))}
        </Flex>
      </Flex>

      {/* Section 4 */}
      <Flex className="py-21.5 md:pt-21.5 md:pb-16 lg:py-21.5 px-3.5 md:px-15 xl:px-30 bg-neutral-50 -mt-px">
        <motion.h3
          className="text-center font-medium text-neutral-800 mb-8"
          variants={headingReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ ...viewportOnce, amount: 0.7 }}
        >
          Why choose
          <br />
          <span className="text-bold text-neutral-400">
            Unique Polymer Systems?
          </span>
        </motion.h3>

        <Flex className="border border-neutral-200 rounded-3xl bg-white lg:grid! lg:grid-cols-2 xl:w-full xl:max-w-300 xl:self-center">
          {section4Data.map((item, index) => {
            const Icon = item.icon;

            return (
              <MotionFlex
                key={index.toString()}
                className={`w-full h-70.75 lg:h-auto justify-center px-6 lg:p-12 ${item.border}`}
                variants={cardReveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ ...viewportOnce, amount: 0.72 }}
              >
                <MotionFlex
                  className="size-14 bg-white rounded-[14px] shadow-[2px_2px_24px_rgba(0,0,0,0.1)] items-center justify-center mb-6"
                  variants={serviceCopyItem}
                >
                  <Icon />
                </MotionFlex>

                <motion.h5
                  className="font-semibold text-neutral-800 mb-3.5"
                  variants={serviceCopyItem}
                >
                  {item.title}
                </motion.h5>

                <motion.p
                  className="text-body-s text-neutral-500"
                  variants={serviceCopyItem}
                >
                  {item.description}
                </motion.p>
              </MotionFlex>
            );
          })}
        </Flex>
      </Flex>

      {/* Section 5 */}
      <Flex className="px-3.5 md:px-15 xl:px-30 pt-10 lg:pt-16 pb-21.5 lg:pb-25.5 -mt-px bg-white">
        <motion.h3
          className="text-center font-medium text-neutral-800 mb-10"
          variants={headingReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ ...viewportOnce, amount: 0.7 }}
        >
          See how we solve problems,
          <br />
          <span className="font-bold text-neutral-400">right on target</span>
        </motion.h3>

        <MotionFlex
          className="gap-8 xl:w-full xl:max-w-300 xl:self-center @container"
          variants={cardReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ ...viewportOnce, amount: 0.6 }}
          onAnimationComplete={(definition) => {
            if (definition === "visible") {
              setIsCarouselEntryComplete(true);
            }
          }}
        >
          <div
            ref={carouselRef}
            className="carousel overflow-x-auto snap-x snap-mandatory"
            onScroll={handleCarouselScroll}
          >
            <div className="flex w-max gap-4">
              {[...section5Data, section5Data[0]].map((item, index) => {
                const isDuplicate = index === section5Data.length;

                return (
                  <Flex
                    key={`${isDuplicate ? "duplicate" : "original"}-${index}`}
                    className="lg:flex-row-reverse! shrink-0 snap-start overflow-hidden w-[calc(100dvw-1.75rem)] md:w-[calc(100dvw-7.5rem)] xl:w-[100cqw] h-137.5 md:h-132 lg:h-95.5 rounded-[14px] bg-neutral-50 lg:py-4.5 lg:pl-6 lg:pr-4.5 lg:items-center lg:justify-center lg:gap-12"
                    aria-hidden={isDuplicate || undefined}
                  >
                    <Image
                      src={item.image}
                      alt={isDuplicate ? "" : `Carousel ${index + 1}`}
                      width={item.width}
                      height={item.height}
                      className="w-full lg:w-98.5 h-67.75 lg:h-86.5 lg:rounded-3xl object-cover object-center"
                    />

                    <Flex className="flex-1 py-6 lg:py-3 px-3.5 md:px-6 lg:px-0">
                      <p className="text-body-s font-semibold text-neutral-500 mb-3.5">
                        {item.subTitle}
                      </p>

                      <h5 className="font-semibold text-neutral-800 mb-7">
                        {item.title}
                      </h5>

                      <p className="text-body-s text-neutral-500 mb-8 line-clamp-3 md:line-clamp-2 lg:line-clamp-5">
                        {item.description}
                      </p>

                      <button
                        type="button"
                        className="flex px-6 py-[11.5px] bg-accent-600 self-start rounded-3xl text-body-xs font-bold text-white"
                        tabIndex={isDuplicate ? -1 : undefined}
                      >
                        View Case Study
                      </button>
                    </Flex>
                  </Flex>
                );
              })}
            </div>
          </div>

          <Flex className="flex-row! lg:justify-center gap-4.5">
            {Array.from({ length: section5Data.length }).map((_, index) => (
              <Flex
                key={index.toString()}
                className="relative h-0.75 flex-1 lg:max-w-[181.33px] bg-neutral-200 rounded-full"
              >
                <div
                  className={`h-full rounded-full bg-accent-600 ${
                    !isCarouselEntryComplete
                      ? "w-0"
                      : index < activeCarouselIndex
                        ? "w-full"
                        : index === activeCarouselIndex
                          ? progressCycle % 2 === 0
                            ? "carousel-progress-a"
                            : "carousel-progress-b"
                          : "w-0"
                  }`}
                />
              </Flex>
            ))}
          </Flex>
        </MotionFlex>
      </Flex>
    </Flex>
  );
};

export default Home;
