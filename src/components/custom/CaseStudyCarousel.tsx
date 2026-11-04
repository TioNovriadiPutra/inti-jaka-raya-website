import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import useCaseStudyController from "@/controllers/caseStudy.controller";
import useTranslation from "@/hooks/useTranslation";
import { carouselStyles as styles } from "@/styles/ui";
import Reveal from "@/components/shared/Reveal";

function Arrow({ previous = false }: { previous?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={previous ? { transform: "rotate(180deg)" } : undefined}>
      <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function CaseStudyCarousel() {
  const { t } = useTranslation();
  const { useGetCaseStudyCarouselService } = useCaseStudyController();
  const { finalData: items, isLoading, isError, refetch } = useGetCaseStudyCarouselService();
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const currentIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [inView, setInView] = useState(false);
  const count = items.length;
  const currentIndex = Math.min(activeIndex, Math.max(count - 1, 0));
  const playing = count > 1 && inView && !paused && !hovered && !focused && !hidden && !reducedMotion;

  const goTo = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track || count === 0) return;
    const nextIndex = ((index % count) + count) % count;
    track.scrollTo({ left: nextIndex * track.clientWidth, behavior: reducedMotion ? "auto" : "smooth" });
    setActiveIndex(nextIndex);
  }, [count, reducedMotion]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    const updateVisibility = () => setHidden(document.hidden);
    updatePreference();
    updateVisibility();
    preference.addEventListener("change", updatePreference);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      preference.removeEventListener("change", updatePreference);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => goTo(currentIndex + 1), 6000);
    return () => window.clearTimeout(timer);
  }, [playing, currentIndex, goTo]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    // Keep the active card aligned when the viewport or API result changes.
    const observer = new ResizeObserver(() => {
      track.scrollTo({ left: currentIndexRef.current * track.clientWidth, behavior: "instant" });
    });
    observer.observe(track);
    return () => observer.disconnect();
  }, [count]);

  return (
    <section ref={sectionRef} className={styles.section} aria-labelledby="case-studies-heading">
      <Reveal className={styles.container}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}><span />{t("Case Studies")}</p>
            <h2 id="case-studies-heading" className={styles.heading}>
              {t("See how we solve problems,")}<br />
              <span>{t("right on target")}</span>
            </h2>
          </div>
          <p className={styles.intro}>{t("Practical solutions. Real industrial challenges.")}</p>
        </header>

        {isLoading ? (
          <div className={styles.skeleton} role="status" aria-label={t("Loading case studies")}>
            <div /><div><span /><span /><span /></div>
          </div>
        ) : count === 0 ? (
          <div className={styles.empty} role="status">
            <p>{t(isError ? "Unable to load case studies." : "No case studies available yet.")}</p>
            {isError && <button type="button" onClick={() => void refetch()}>{t("Try again")}</button>}
          </div>
        ) : (
          <div
            role="region"
            aria-roledescription={t("Carousel")}
            aria-label={t("Case Studies")}
            onPointerEnter={(event) => { if (event.pointerType === "mouse") setHovered(true); }}
            onPointerLeave={() => setHovered(false)}
            onFocusCapture={() => setFocused(true)}
            onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
            onKeyDown={(event) => {
              if (event.target !== trackRef.current) return;
              if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                event.preventDefault();
                goTo(currentIndex + (event.key === "ArrowLeft" ? -1 : 1));
              }
            }}
          >
            <div
              id="case-study-slides"
              ref={trackRef}
              className={styles.track}
              tabIndex={0}
              aria-label={t("Use arrow keys or swipe to browse case studies")}
              onScroll={() => {
                const track = trackRef.current;
                if (track?.clientWidth) setActiveIndex(Math.min(count - 1, Math.max(0, Math.round(track.scrollLeft / track.clientWidth))));
              }}
            >
              {items.map((item, index) => (
                <article
                  key={item.id}
                  className={styles.card}
                  aria-roledescription={t("Slide")}
                  aria-label={`${index + 1} / ${count}: ${item.title}`}
                  aria-hidden={index !== currentIndex}
                  inert={index !== currentIndex}
                >
                  <div className={styles.media}>
                    <Image src={item.image} alt={item.title} width={item.width} height={item.height} sizes="(min-width: 1280px) 560px, (min-width: 1024px) 50vw, (min-width: 768px) calc(100vw - 120px), calc(100vw - 28px)" className={styles.image} />
                    <span className={styles.imageLabel}>{t("Case Study")}<span>{String(index + 1).padStart(2, "0")}</span></span>
                  </div>
                  <div className={styles.content}>
                    {item.subTitle && <p className={styles.category}>{item.subTitle}</p>}
                    <h3 className={styles.title}>{item.title}</h3>
                    <div className={styles.problem}>
                      <p className={styles.problemLabel}>{t("The challenge")}</p>
                      <p className={styles.description}>{item.description}</p>
                    </div>
                    <Link href="/products" className={styles.link} tabIndex={index === currentIndex ? 0 : -1}>
                      {t("Explore solutions")}<Arrow />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            <div className={styles.controls}>
              <div className={styles.pagination} role="group" aria-label={t("Choose a case study")}>
                {items.map((item, index) => (
                  <button key={item.id} type="button" className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ""}`} aria-label={`${t("Case Study")} ${index + 1}: ${item.title}`} aria-current={index === currentIndex ? "true" : undefined} aria-controls="case-study-slides" onClick={() => goTo(index)}><span /></button>
                ))}
              </div>
              <div className={styles.navigation}>
                <p className={styles.counter} aria-live={playing ? "off" : "polite"} aria-atomic="true"><strong>{String(currentIndex + 1).padStart(2, "0")}</strong><span>/</span>{String(count).padStart(2, "0")}</p>
                {count > 1 && <>
                  {!reducedMotion && <button type="button" className={styles.control} aria-label={t(paused ? "Play carousel" : "Pause carousel")} aria-pressed={paused} onClick={() => setPaused((value) => !value)}>
                    {paused ? <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m8 5 11 7-11 7V5Z" /></svg> : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 6v12m6-12v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>}
                  </button>}
                  <button type="button" className={styles.control} aria-label={t("Previous case study")} aria-controls="case-study-slides" onClick={() => goTo(currentIndex - 1)}><Arrow previous /></button>
                  <button type="button" className={`${styles.control} ${styles.next}`} aria-label={t("Next case study")} aria-controls="case-study-slides" onClick={() => goTo(currentIndex + 1)}><Arrow /></button>
                </>}
              </div>
            </div>
          </div>
        )}
      </Reveal>
    </section>
  );
}
