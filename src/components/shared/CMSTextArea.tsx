import { ControllerRenderProps, FieldError } from "react-hook-form";
import Flex from "./Flex";

type Props = {
  field: ControllerRenderProps<any, any>;
  label: string;
  error?: FieldError;
};

const CMSTextArea = ({ field, label, error }: Props) => {
  return (
    <Flex className="min-w-0 gap-2">
      <p className="text-small font-bold text-primary-700">
        {label}{" "}
        {error && <span className="text-red-500">({error.message})</span>}
      </p>

      <Flex
        className={`min-w-0 flex-row! items-center border bg-white px-4 py-3 shadow-xs transition-colors focus-within:border-primary-300 focus-within:ring-3 focus-within:ring-primary-50 motion-reduce:transition-none ${error ? "border-red-500" : "border-neutral-200"} rounded-xl min-h-36`}
      >
        <textarea
          {...field}
          placeholder="Input here..."
          className="min-h-30 min-w-0 w-full resize-y bg-transparent text-small leading-relaxed text-neutral-700 outline-none placeholder:text-neutral-400"
        ></textarea>
      </Flex>
    </Flex>
  );
};

export default CMSTextArea;
