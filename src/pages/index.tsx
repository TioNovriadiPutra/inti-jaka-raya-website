import Image from "next/image";
import Link from "next/link";
import CaseStudyCarousel from "@/components/custom/CaseStudyCarousel";
import useTranslation from "@/hooks/useTranslation";
import { section3Data, section4Data } from "@/utils/constant";
import { homeStyles as styles } from "@/styles/ui";
import Reveal from "@/components/shared/Reveal";

function Arrow() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="home-heading">
        <div className={styles.heroShade} />
        <div className={styles.heroInner}>
          <Reveal as="p" className={styles.heroEyebrow}><span />PT. INTI JAKA RAYA</Reveal>
          <Reveal as="h1" id="home-heading" className={styles.heroTitle} delay={0.12}>
            {t("Composites & Protective Coatings Tailored for Your Industry")}
          </Reveal>
          <Reveal as="p" className={styles.heroDescription} delay={0.24}>
            {t("Sole Distributor for UNIQUE POLYMER SYSTEMS Made in UK, in Indonesia.")}
          </Reveal>
          <Reveal className={styles.heroActions} delay={0.36}>
            <Link href="/products" className={styles.primaryButton}>{t("View Product")}<Arrow /></Link>
            <Link href="/about" className={styles.secondaryButton}>{t("About Us")}<Arrow /></Link>
          </Reveal>
          <Reveal className={styles.heroFoot} delay={0.48}>
            <p>{t("Industrial maintenance")}</p><span aria-hidden="true" />
            <p>{t("Repair. Rebuild. Protect.")}</p>
          </Reveal>
        </div>
        <div className={styles.heroIndex} aria-hidden="true">01 <span>/</span> IJR</div>
      </section>

      <section className={styles.trustSection} aria-labelledby="quality-heading">
        <div className={styles.container}>
          <div className={styles.trustGrid}>
            <Reveal direction="left">
              <p className={styles.eyebrow}><span />{t("Our commitment")}</p>
              <h2 id="quality-heading" className={styles.sectionTitle}>
                {t("Focusing on quality,")}<br /><span>{t("we maintain customer trust")}</span>
              </h2>
            </Reveal>
            <Reveal className={styles.trustCopy} direction="right" delay={0.12}>
              <p className={styles.body}>
                {t("For over 30 years, we've provided reliable solutions to combat industrial challenges like erosion, corrosion, chemical attacks, and wear. Our advanced systems also offer water and weatherproofing, along with safety grip solutions, ensuring your assets stay protected.")}
              </p>
              <Link href="/about" className={styles.textLink}>{t("Get to know us")}<Arrow /></Link>
            </Reveal>
          </div>
          <Reveal className={styles.partnerBar} delay={0.12}>
            <div className={styles.partnerBrand}>
              <div className={styles.partnerLogo}>
                <Image
                  src="/ups.svg"
                  alt="Unique Polymer Systems — Innovate | Rebuild | Enhance"
                  width={226}
                  height={120}
                  className={styles.partnerLogoImage}
                  unoptimized
                />
              </div>
              <div className={styles.partnerIdentity}>
                <p className={styles.partnerLabel}>{t("Authorized Distributor")}</p>
                <p className={styles.partnerName}>Unique Polymer Systems</p>
              </div>
            </div>
            <p className={styles.partnerOrigin}>{t("Made in the United Kingdom. Available in Indonesia.")}</p>
          </Reveal>
        </div>
      </section>

      <section className={styles.servicesSection} aria-labelledby="services-heading">
        <div className={styles.container}>
          <Reveal as="header" className={styles.sectionHeader}>
            <div>
              <p className={styles.eyebrow}><span />{t("What we do")}</p>
              <h2 id="services-heading" className={styles.sectionTitle}>
                {t("Trusted services")}<br /><span>{t("for your various needs")}</span>
              </h2>
            </div>
            <p className={styles.sectionIntro}>{t("Purpose-built protection for the assets that keep your industry moving.")}</p>
          </Reveal>
          <div className={styles.servicesGrid}>
            {section3Data.map((item, index) => (
              <Reveal as="article" key={item.tag} className={styles.serviceCard} direction={index === 0 ? "left" : "right"} delay={index * 0.12}>
                <Reveal className={styles.serviceMedia} direction="scale" delay={0.12 + index * 0.12}>
                  <Image
                    src={item.image}
                    alt={t(item.title)}
                    width={item.width}
                    height={item.height}
                    sizes="(min-width: 1280px) 588px, (min-width: 768px) calc(50vw - 72px), calc(100vw - 28px)"
                    className={styles.serviceImage}
                  />
                  <p className={styles.serviceImageLabel}>{t(item.tag)}<span>{String(index + 1).padStart(2, "0")}</span></p>
                </Reveal>
                <Reveal className={styles.serviceContent} delay={0.2 + index * 0.12}>
                  <p className={styles.category}>{t(item.tag)}</p>
                  <h3 className={styles.cardTitle}>{t(item.title)}</h3>
                  <p className={styles.body}>{t(item.description)}</p>
                  <Link href="/products" className={styles.textLink}>{t("Explore solutions")}<Arrow /></Link>
                </Reveal>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.benefitsSection} aria-labelledby="benefits-heading">
        <div className={styles.container}>
          <div className={styles.benefitsLayout}>
            <Reveal as="header" className={styles.benefitsHeader} direction="left">
              <p className={styles.eyebrow}><span />{t("The UPS advantage")}</p>
              <h2 id="benefits-heading" className={styles.sectionTitle}>
                {t("Why choose")}<br /><span>Unique Polymer Systems?</span>
              </h2>
              <p className={styles.body}>{t("Reliable materials. Practical application. Protection that lasts.")}</p>
              <Link href="/products" className={styles.textLink}>{t("View Product")}<Arrow /></Link>
            </Reveal>
            <div className={styles.benefitsGrid}>
              {section4Data.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Reveal as="article" key={item.title} className={styles.benefitCard} delay={(index % 2) * 0.12} lift>
                    <div className={styles.benefitTop}>
                      <span className={styles.benefitIcon} aria-hidden="true"><Icon /></span>
                      <span className={styles.benefitNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                    </div>
                    <h3 className={styles.benefitTitle}>{t(item.title)}</h3>
                    <p className={styles.body}>{t(item.description)}</p>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <CaseStudyCarousel />
    </main>
  );
}
