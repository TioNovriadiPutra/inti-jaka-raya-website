import { Breadcrumb, Flex } from "@/components/shared";
import { aboutSection2Data } from "@/utils/constant";
import { motion, type Variants } from "motion/react";

const MotionFlex = motion.create(Flex);

const viewportOnce = {
  once: true,
  amount: 0.6,
  margin: "0px 0px -15% 0px",
} as const;

const revealContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.16, delayChildren: 0.1 } },
};

const revealUp: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.98, filter: "blur(7px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 1.25, ease: [0.16, 1, 0.3, 1] },
  },
};

const horizontalReveal = (direction: -1 | 1): Variants => ({
  hidden: { opacity: 0, x: direction * 48, filter: "blur(7px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 1.25, ease: [0.16, 1, 0.3, 1] },
  },
});

const cardReveal: Variants = {
  hidden: { opacity: 0, y: 42, scale: 0.95 },
  visible: (index: number = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 1.2,
      delay: index * 0.18,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.13,
      delayChildren: 0.14,
    },
  }),
  hover: (index: number = 0) => ({
    y: -8,
    scale: 1.025,
    rotateX: -2.5,
    rotateY: index % 2 === 0 ? 3.5 : -3.5,
    boxShadow:
      "0 28px 65px rgba(79, 175, 77, 0.3), 0 10px 28px rgba(79, 175, 77, 0.2)",
    transition: {
      type: "spring",
      stiffness: 230,
      damping: 20,
      mass: 0.75,
    },
  }),
};

const cardItem: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
  hover: {
    z: 12,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
};

const cardIcon: Variants = {
  ...cardItem,
  hover: {
    z: 28,
    scale: 1.06,
    transition: { type: "spring", stiffness: 260, damping: 18 },
  },
};

const About = () => {
  return (
    <Flex className="grow basis-0">
      {/* Section 1 */}
      <MotionFlex
        className="px-3.5 md:px-15 xl:px-30 pt-10 pb-32.5 md:pb-34.25 lg:pb-39.25 xl:pb-60 bg-[rgba(0,0,0,0.4)]"
        variants={revealContainer}
        initial="hidden"
        animate="visible"
      >
        <Flex className="gap-16 md:gap-12.75 lg:gap-28.25 xl:gap-38.5 xl:w-full xl:max-w-300 xl:self-center">
          <motion.div className="w-fit self-start">
            <Breadcrumb pages={["Home", "About Us"]} animated />
          </motion.div>

          <motion.h1
            className="text-white text-shadow-[2px_4px_24px_rgb(0_0_0/0.25)]"
            variants={revealUp}
          >
            We are committed to providing the best products & services
          </motion.h1>
        </Flex>
      </MotionFlex>

      {/* Section 2 */}
      <Flex className="px-3.5 md:px-15 xl:px-30 py-16 md:py-21.5 bg-neutral-50">
        <MotionFlex
          className="lg:gap-16 lg:flex-row! xl:max-w-300 xl:self-center"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <MotionFlex
            className="mb-10 md:mb-16 lg:mb-0 lg:w-105 xl:w-142 lg:shrink-0"
            variants={horizontalReveal(-1)}
          >
            <p className="text-body-xs text-accent-600">What we do</p>
            <h4 className="text-neutral-800">
              Delivering The Finest Industrial Maintenance Solution
            </h4>
          </MotionFlex>

          <motion.p
            className="text-body-s text-neutral-500 text-justify"
            variants={horizontalReveal(1)}
          >
            PT INTI JAKARAYA was established in 2017 located in Bandung West
            Java – Indonesia. PT INTI JAKARAYA is a Sole Distributor for UNIQUE
            POLYMER SYSTEMS Made in UK, in Indonesia.
            <br />
            <br />
            PT INTI JAKARAYA provides innovative business solution to our
            customers that have fluid flow system problems, such as : erosion,
            corrosion, cavitation, dry abrasive, chemical attack concrete
            problem, floor protection and etc.
          </motion.p>
        </MotionFlex>
      </Flex>

      {/* Section 3 */}
      <Flex className="px-3.5 md:px-15 py-16 md:py-21.5 bg-white -mt-px">
        <MotionFlex
          className="xl:max-w-300 xl:self-center"
          variants={revealContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ ...viewportOnce, amount: 0.2, margin: "0px 0px -5% 0px" }}
        >
          <motion.p className="text-body-xs text-accent-600" variants={revealUp}>
            Our Mission
          </motion.p>
          <motion.h4 className="text-neutral-800 mb-22 lg:w-141" variants={revealUp}>
            We Are Dedicated To Offering The Test Goods And Services.
          </motion.h4>

          <MotionFlex className="gap-8 lg:flex-row!" variants={revealContainer}>
            {aboutSection2Data.map((item, index) => {
              const Icon = item.icon;

              return (
                <MotionFlex
                  key={index.toString()}
                  className="w-full h-70.75 lg:h-full justify-center px-6 md:px-7.5 lg:py-10 border border-neutral-200 rounded-2xl shadow-lg"
                  custom={index}
                  variants={cardReveal}
                  inherit={false}
                  initial="hidden"
                  whileInView="visible"
                  whileHover="hover"
                  viewport={{ once: true, amount: 0.7 }}
                  style={{
                    transformPerspective: 1000,
                    transformStyle: "preserve-3d",
                  }}
                >
                  <MotionFlex
                    className="size-14 md:w-17.5 md:h-18 bg-white rounded-[14px] shadow-[2px_2px_24px_rgba(0,0,0,0.1)] items-center justify-center mb-6 md:mb-14.5"
                    variants={cardIcon}
                  >
                    <Icon />
                  </MotionFlex>
                  <motion.h5
                    className="font-semibold text-neutral-800 mb-3.5 md:mb-3"
                    variants={cardItem}
                  >
                    {item.title}
                  </motion.h5>
                  <motion.p className="text-body-s text-neutral-500" variants={cardItem}>
                    {item.description}
                  </motion.p>
                </MotionFlex>
              );
            })}
          </MotionFlex>
        </MotionFlex>
      </Flex>
    </Flex>
  );
};

export default About;
