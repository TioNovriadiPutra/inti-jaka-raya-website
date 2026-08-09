import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onSubmit?: () => void;
};

const CMSFormContainer = ({ children, onSubmit }: Props) => {
  return (
    <form
      className="flex flex-col grow basis-0 px-6 py-3.5 gap-4 max-w-245.5 mx-auto"
      onSubmit={onSubmit}
    >
      {children}
    </form>
  );
};

export default CMSFormContainer;
