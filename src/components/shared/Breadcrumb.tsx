import { ArrowRight, ArrowRightDark } from "../../../public";
import Flex from "./Flex";

type Props = {
  pages: string[];
  color?: "light" | "dark";
};

const Breadcrumb = ({ pages, color = "light" }: Props) => {
  return (
    <Flex
      className={`flex-row! items-center px-3.5 py-3 ${color === "dark" ? "bg-neutral-100" : "bg-[rgba(245,245,245,0.3)]"} rounded-lg self-start gap-5`}
    >
      {pages.map((page, index) => (
        <Flex key={index.toString()} className="flex-row! items-center gap-5">
          <p
            className={`text-body-s ${color === "dark" ? "text-neutral-400" : "text-white"}`}
          >
            {page}
          </p>

          {index < pages.length - 1 &&
            (color === "dark" ? <ArrowRightDark /> : <ArrowRight />)}
        </Flex>
      ))}
    </Flex>
  );
};

export default Breadcrumb;
