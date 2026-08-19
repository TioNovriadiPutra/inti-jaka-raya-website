import { Box1 } from "iconsax-reactjs";
import Flex from "./Flex";

type Props = {
  title?: string;
  description?: string;
};

const EmptyState = ({
  title = "No data found",
  description = "There is no data to display at the moment.",
}: Props) => {
  return (
    <Flex className="min-h-64 flex-1 items-center justify-center px-6 py-12 text-center">
      <Flex className="mb-5 size-14 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50">
        <Box1 size={26} color="var(--neutral-400)" variant="Bulk" />
      </Flex>

      <h6 className="mb-1.5 font-semibold text-neutral-900">{title}</h6>

      <p className="max-w-80 text-body-xs text-neutral-500">{description}</p>
    </Flex>
  );
};

export default EmptyState;
