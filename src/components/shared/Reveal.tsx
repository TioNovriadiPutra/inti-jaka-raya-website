import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { revealStyles as styles } from "@/styles/ui";

const elements = {
  div: motion.div,
  article: motion.article,
  header: motion.header,
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
};

type Props = {
  as?: keyof typeof elements;
  children: ReactNode;
  className?: string;
  id?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "scale";
  lift?: boolean;
};

export default function Reveal({
  as = "div",
  children,
  className = "",
  id,
  delay = 0,
  direction = "up",
  lift = false,
}: Props) {
  const reducedMotion = useReducedMotion();
  const Element = elements[as];
  const variants: Variants = {
    hidden: {
      opacity: 0,
      x: direction === "left" ? -28 : direction === "right" ? 28 : 0,
      y: direction === "up" ? 24 : 0,
      scale: direction === "scale" ? 0.97 : 1,
      filter: "blur(5px)",
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: reducedMotion ? 0 : 0.85,
        delay: reducedMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <Element
      id={id}
      className={`${styles.reveal} ${className}`}
      variants={variants}
      initial={reducedMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -24px 0px" }}
      whileHover={lift && !reducedMotion ? { y: -4, scale: 1.005, transition: { duration: 0.25, ease: "easeOut" } } : undefined}
    >
      {children}
    </Element>
  );
}
