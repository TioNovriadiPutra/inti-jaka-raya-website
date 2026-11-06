import { ReactNode } from "react";
import Flex from "./Flex";

type Props = {
  children: ReactNode;
};

const CMSContainer = ({ children }: Props) => {
  return (
    <Flex className="min-h-0 min-w-0 flex-1 gap-5 overflow-y-auto bg-neutral-50 px-4 py-6 font-sans sm:px-6 lg:px-8 lg:py-8 xl:px-10 [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-offset-2 [&_button:focus-visible]:outline-accent-600">
      {children}
    </Flex>
  );
};

export default CMSContainer;
