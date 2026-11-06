import { Box1, ClipboardText, Document } from "iconsax-reactjs";
import {
  ChartIcon,
  CheckIcon,
  HandshakeIcon,
  LightbulbIcon,
  ShieldIcon,
  TemperatureIcon,
  TimeIcon,
} from "../../public";

export const section3Data = [
  {
    tag: "Rebuild",
    title: "We Rebuild",
    description:
      "Coatings play a critical role in industrial repair processes. They are used to restore or enhance the performance and longevity of various industrial components and structures. Here are some ways coatings are applied in industrial repair",
    image: "/images/section3First.png",
    width: 501,
    height: 376,
  },
  {
    tag: "Protect",
    title: "We Protect",
    description:
      "Provide a shield against a multitude of potential threats, including corrosion from moisture and chemicals, abrasion and wear from mechanical forces, and damage from UV radiation and weathering",
    image: "/images/section3Second.jpg",
    width: 4096,
    height: 2730,
  },
];

export const section4Data = [
  {
    icon: TimeIcon,
    title: "Minimise Downtime",
    description:
      "Perform on-site repairs quickly and efficiently, reducing the need for equipment dismantling.",  },
  {
    icon: ShieldIcon,
    title: "Enhanced Safety",
    description:
      "Our solvent-free materials reduce health and safety risks, offering a safer alternative to traditional methods.",  },
  {
    icon: TemperatureIcon,
    title: "Cold Cure Technology",
    description:
      "Materials that cure at ambient temperatures, eliminating hot work hazards and ensuring lasting repairs.",  },
  {
    icon: CheckIcon,
    title: "User-Friendly Application",
    description:
      "Easy-to-use products that allow your team to handle repairs in-house, saving time and resources.",  },
];

export const aboutSection2Data = [
  {
    icon: ChartIcon,
    title: "Improve Businesses",
    description:
      "Ensure profitability that can support the growth of the company.",
  },
  {
    icon: HandshakeIcon,
    title: "Maintain Trust",
    description:
      "Building trust through innovation in quality, products, and services.",
  },
  {
    icon: LightbulbIcon,
    title: "Creative Solutions",
    description: "Encourage creative competence to win the competition.",
  },
];

export const cmsSidebarData = [
  {
    icon: Box1,
    label: "Products",
    dest: "/cms/products",
  },
  {
    icon: Document,
    label: "Case Studies",
    dest: "/cms/case-studies",
  },
  {
    icon: ClipboardText,
    label: "Labels",
    dest: "/cms/labels",
  },
];

export const productFilter = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Showing",
    value: "showing",
  },
  {
    label: "Hidden",
    value: "hidden",
  },
];

export const caseStudyFilter = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Showing",
    value: "showing",
  },
  {
    label: "Hidden",
    value: "hidden",
  },
];

export const labelFilter = [
  {
    label: "Category",
    value: "category",
  },
  {
    label: "Industry",
    value: "industry",
  },
  {
    label: "Application",
    value: "application",
  },
  {
    label: "Division",
    value: "division",
  },
];
