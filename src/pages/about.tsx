import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/shared/Reveal";
import useTranslation from "@/hooks/useTranslation";
import { aboutSection2Data } from "@/utils/constant";
import { homeStyles as shared } from "@/styles/ui";
import { aboutStyles as styles } from "@/styles/ui";

function Arrow() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12h14m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function About() {
  const { t } = useTranslation();

  return (
    <main className={shared.page}>
      <section
        className={shared.hero + " " + styles.hero}
        aria-labelledby="about-heading"
      >
        <div className={shared.heroShade} />
        <div className={shared.container}>
          <Reveal>
            <nav className={styles.breadcrumb} aria-label={t("Breadcrumb")}>
              <Link href="/">{t("Home")}</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{t("About Us")}</span>
            </nav>
          </Reveal>
          <Reveal as="p" className={shared.heroEyebrow} delay={0.1}>
            <span />
            {t("About Us")}
          </Reveal>
          <Reveal
            as="h1"
            id="about-heading"
            className={shared.heroTitle + " " + styles.heroTitle}
            delay={0.2}
          >
            {t("We are committed to providing the best products & services")}
          </Reveal>
          <Reveal
            className={shared.heroFoot + " " + styles.heroFoot}
            delay={0.32}
          >
            <p>PT. INTI JAKA RAYA</p>
            <span aria-hidden="true" />
            <p>{t("Industrial maintenance")}</p>
          </Reveal>
        </div>
      </section>

      <section
        className={styles.storySection}
        aria-labelledby="about-solutions-heading"
      >
        <div className={shared.container}>
          <div className={styles.storyGrid}>
            <Reveal direction="left">
              <p className={shared.eyebrow}>
                <span />
                {t("What we do")}
              </p>
              <h2 id="about-solutions-heading" className={shared.sectionTitle}>
                {t("Delivering The Finest Industrial Maintenance Solution")}
              </h2>
              <Link
                href="/products"
                className={shared.textLink + " " + styles.storyLink}
              >
                {t("Explore solutions")}
                <Arrow />
              </Link>
            </Reveal>
            <Reveal className={styles.storyCopy} direction="right" delay={0.12}>
              <p className={shared.body}>
                {t(
                  "PT INTI JAKARAYA was established in 2017 located in Bandung West Java – Indonesia. PT INTI JAKARAYA is a Sole Distributor for UNIQUE POLYMER SYSTEMS Made in UK, in Indonesia.",
                )}
              </p>
              <p className={shared.body}>
                {t(
                  "PT INTI JAKARAYA provides innovative business solution to our customers that have fluid flow system problems, such as : erosion, corrosion, cavitation, dry abrasive, chemical attack concrete problem, floor protection and etc.",
                )}
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <dl className={styles.facts}>
              <div>
                <dt>{t("Established")}</dt>
                <dd>2017</dd>
              </div>
              <div>
                <dt>{t("Based in")}</dt>
                <dd>{t("Bandung, West Java")}</dd>
              </div>
              <div>
                <dt>{t("Serving")}</dt>
                <dd>Indonesia</dd>
              </div>
            </dl>
          </Reveal>

          <Reveal
            className={shared.partnerBar + " " + styles.partnerBar}
            delay={0.16}
          >
            <div className={shared.partnerBrand}>
              <div className={shared.partnerLogo}>
                <Image
                  src="/ups.svg"
                  alt="Unique Polymer Systems — Innovate | Rebuild | Enhance"
                  width={226}
                  height={120}
                  className={shared.partnerLogoImage}
                  unoptimized
                />
              </div>
              <div className={shared.partnerIdentity}>
                <p className={shared.partnerLabel}>
                  {t("Authorized Distributor")}
                </p>
                <p className={shared.partnerName}>Unique Polymer Systems</p>
              </div>
            </div>
            <p className={shared.partnerOrigin}>
              {t("Made in the United Kingdom. Available in Indonesia.")}
            </p>
          </Reveal>
        </div>
      </section>

      <section
        className={styles.missionSection}
        aria-labelledby="mission-heading"
      >
        <div className={shared.container}>
          <Reveal as="header" className={styles.missionHeader}>
            <div>
              <p className={shared.eyebrow}>
                <span />
                {t("Our Mission")}
              </p>
              <h2 id="mission-heading" className={shared.sectionTitle}>
                {t(
                  "We are dedicated to offering the best products and services.",
                )}
              </h2>
            </div>
            <p className={styles.missionIntro}>{t("Our commitment")}</p>
          </Reveal>
          <div className={styles.missionGrid}>
            {aboutSection2Data.map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal
                  as="article"
                  key={item.title}
                  className={styles.missionCard}
                  delay={index * 0.12}
                  lift
                >
                  <div className={styles.cardTop}>
                    <span className={styles.icon} aria-hidden="true">
                      <Icon />
                    </span>
                    <span className={styles.number} aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className={styles.cardTitle}>{t(item.title)}</h3>
                  <p className={shared.body}>{t(item.description)}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
