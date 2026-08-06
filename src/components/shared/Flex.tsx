import { ComponentPropsWithoutRef, forwardRef } from "react";

type Props = ComponentPropsWithoutRef<"div">;

const Flex = forwardRef<HTMLDivElement, Props>(
  ({ children, className = "", ...props }, ref) => (
    <div ref={ref} className={`flex flex-col ${className}`} {...props}>
      {children}
    </div>
  ),
);

Flex.displayName = "Flex";

export default Flex;
