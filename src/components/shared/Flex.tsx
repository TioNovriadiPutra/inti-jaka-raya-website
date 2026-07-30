import { CSSProperties, ReactNode } from "react";

type Props = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
};

const Flex = ({ children, className, style, onClick }: Props) => {
  return (
    <div
      className={`flex flex-col ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Flex;
