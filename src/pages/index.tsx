import { Flex } from "@/components/shared";
import { UPSLogo } from "../../public";
import { section3Data, section4Data, section5Data } from "@/utils/constant";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

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

  const getCarouselStep = useCallback(() => {
    const firstSlide = carouselRef.current?.firstElementChild
      ?.firstElementChild as HTMLElement | null;

    return firstSlide ? firstSlide.offsetWidth + 16 : 0;
  }, []);

  const scheduleAutoScroll = useCallback(() => {
    window.clearTimeout(autoScrollTimerRef.current);
    if (document.hidden) return;

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
  }, [getCarouselStep]);

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
      <Flex className="px-3.5 pt-19 pb-31.5 bg-[rgba(0,0,0,0.4)]">
        <h1 className="text-white text-shadow-[2px_4px_24px_rgb(0_0_0/0.25)] mb-3.5">
          Composites & Protective Coatings Tailored for Your Industry
        </h1>

        <p className="text-body-s text-white text-shadow-[2px_4px_24px_rgba(0,0,0,0.25)] mb-9">
          Sole Distributor for UNIQUE POLYMER SYSTEMS Made in UK, in Indonesia.
        </p>

        <button
          type="button"
          className="flex self-start bg-white px-6 py-[11.5px] rounded-3xl shadow-[2px_4px_24px_rgba(0,0,0,0.15)]"
        >
          View Product
        </button>
      </Flex>

      {/* Section 2 */}
      <Flex className="px-3.5 pt-16 bg-neutral-50 gap-10">
        <h3 className="font-medium text-neutral-800">
          Focusing on quality,
          <br />
          <span className="font-semibold text-neutral-400">
            we maintain customer trust
          </span>
        </h3>

        <p className="text-body-m text-neutral-500">
          For over 30 years, we&apos;ve provided reliable solutions to combat
          industrial challenges like erosion, corrosion, chemical attacks, and
          wear. Our advanced systems also offer water and weatherproofing, along
          with safety grip solutions, ensuring your assets stay protected.
        </p>

        <Flex className="items-center gap-6">
          <UPSLogo />

          <div className="w-44.5 h-px bg-neutral-200" />

          <h3 className="text-center font-medium text-neutral-400">
            Authorized
            <br />
            Distributor
          </h3>
        </Flex>
      </Flex>

      {/* Section 3 */}
      <Flex className="px-3.5 py-16 -mt-px">
        <h3 className="text-center font-medium text-neutral-800 mb-6">
          Trusted services
          <br />
          <span className="font-bold text-neutral-400">
            for your various needs
          </span>
        </h3>

        <div className="w-45 h-px bg-neutral-200 self-center mb-21.5" />

        <Flex className="gap-16">
          {section3Data.map((item, index) => (
            <Flex key={index.toString()}>
              <p className="text-body-xs text-accent-600">{item.tag}</p>

              <h4 className="text-neutral-800 mb-3">{item.title}</h4>

              <p className="text-body-s text-neutral-500 mb-16">
                {item.description}
              </p>

              <Flex className="w-full h-62.25 overflow-hidden rounded-3xl">
                <Image
                  src={item.image}
                  alt={`Image ${index + 1}`}
                  width={item.width}
                  height={item.height}
                  className="w-full h-auto object-cover object-center"
                />
              </Flex>
            </Flex>
          ))}
        </Flex>
      </Flex>

      {/* Section 4 */}
      <Flex className="py-21.5 px-3.5 bg-neutral-50 -mt-px">
        <h3 className="text-center font-medium text-neutral-800 mb-8">
          Why choose
          <br />
          <span className="text-bold text-neutral-400">
            Unique Polymer Systems?
          </span>
        </h3>

        <Flex className="border border-neutral-200 rounded-3xl bg-white">
          {section4Data.map((item, index) => {
            const Icon = item.icon;

            return (
              <Flex
                key={index.toString()}
                className={`w-full h-70.75 justify-center px-6 ${index < section4Data.length - 1 ? "border-b border-b-neutral-200" : ""}`}
              >
                <Flex className="size-14 bg-white rounded-[14px] shadow-[2px_2px_24px_rgba(0,0,0,0.1)] items-center justify-center mb-6">
                  <Icon />
                </Flex>

                <h5 className="font-semibold text-neutral-800 mb-3.5">
                  {item.title}
                </h5>

                <p className="text-body-s text-neutral-500">
                  Perform on-site repairs quickly and efficiently, reducing the
                  need for equipment dismantling.
                </p>
              </Flex>
            );
          })}
        </Flex>
      </Flex>

      {/* Section 5 */}
      <Flex className="px-3.5 pt-10 pb-21.5 -mt-px">
        <h3 className="text-center font-medium text-neutral-800 mb-10">
          See how we solve problems,
          <br />
          <span className="font-bold text-neutral-400">right on target</span>
        </h3>

        <Flex className="gap-8">
          <div
            ref={carouselRef}
            className="carousel overflow-x-auto snap-x snap-mandatory"
            onScroll={handleCarouselScroll}
          >
            <div className="flex w-max gap-4">
              {[...section5Data, section5Data[0]].map((item, index) => {
                const isDuplicate = index === section5Data.length;

                return (
                  <div
                    key={`${isDuplicate ? "duplicate" : "original"}-${index}`}
                    className="flex flex-col shrink-0 snap-start overflow-hidden w-[calc(100dvw-1.75rem)] h-137.5 rounded-[14px] bg-neutral-50"
                    aria-hidden={isDuplicate || undefined}
                  >
                    <Image
                      src={item.image}
                      alt={isDuplicate ? "" : `Carousel ${index + 1}`}
                      width={item.width}
                      height={item.height}
                      className="w-full h-67.75 object-cover object-center"
                    />

                    <Flex className="flex-1 pt-6 px-3.5">
                      <p className="text-body-s font-semibold text-neutral-500 mb-3.5">
                        {item.subTitle}
                      </p>

                      <h5 className="font-semibold text-neutral-800 mb-7">
                        {item.title}
                      </h5>

                      <p className="text-body-s text-neutral-500 mb-8 line-clamp-3">
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
                  </div>
                );
              })}
            </div>
          </div>

          <Flex className="flex-row! gap-4.5">
            {Array.from({ length: section5Data.length }).map((_, index) => (
              <Flex
                key={index.toString()}
                className="relative h-0.75 flex-1 bg-neutral-200 rounded-full"
              >
                <div
                  className={`h-full rounded-full bg-accent-600 ${
                    index < activeCarouselIndex
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
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Home;
