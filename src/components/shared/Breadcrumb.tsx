import useTranslation from "@/hooks/useTranslation";
import { ArrowRight, ArrowRightDark } from "../../../public";
import Flex from "./Flex";
import { motion, type Variants } from "motion/react";

const MotionFlex = motion.create(Flex);

const breadcrumbReveal: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.2 },
  },
};

const breadcrumbGroupReveal: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14 },
  },
};

const breadcrumbItemReveal: Variants = {
  hidden: { opacity: 0, x: -14, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
};

type Props = {
  pages: string[];
  color?: "light" | "dark";
  animated?: boolean;
};

const Breadcrumb = ({ pages, color = "light", animated = false }: Props) => {
  const { t } = useTranslation();
  return (
    <MotionFlex
      className={`flex-row! items-center px-3.5 py-3 ${color === "dark" ? "bg-neutral-100" : "bg-[rgba(245,245,245,0.3)]"} rounded-lg self-start gap-5`}
      variants={breadcrumbReveal}
      initial={animated ? "hidden" : false}
      animate={animated ? "visible" : undefined}
    >
      {pages.map((page, index) => (
        <MotionFlex
          key={index.toString()}
          className="flex-row! items-center gap-5"
          variants={animated ? breadcrumbGroupReveal : undefined}
        >
          <motion.p
            className={`text-body-s ${color === "dark" ? "text-neutral-400" : "text-white"}`}
            variants={animated ? breadcrumbItemReveal : undefined}
          >
            {t(page)}
          </motion.p>

          {index < pages.length - 1 &&
            (color === "dark" ? (
              <motion.span className="flex" variants={animated ? breadcrumbItemReveal : undefined}>
                <ArrowRightDark />
              </motion.span>
            ) : (
              <motion.span className="flex" variants={animated ? breadcrumbItemReveal : undefined}>
                <ArrowRight />
              </motion.span>
            ))}
        </MotionFlex>
      ))}
    </MotionFlex>
  );
};

export default Breadcrumb;
