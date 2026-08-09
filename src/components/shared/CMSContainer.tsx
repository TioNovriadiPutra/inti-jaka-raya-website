import { ReactNode } from "react";
import Flex from "./Flex";

type Props = {
  children: ReactNode;
};

const CMSContainer = ({ children }: Props) => {
  return (
    <Flex className="grow basis-0 px-6 py-3.5 gap-4 overflow-y-auto">
      {children}
    </Flex>
  );
};

export default CMSContainer;
