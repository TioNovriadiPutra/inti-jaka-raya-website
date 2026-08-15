import { ControllerRenderProps, FieldError } from "react-hook-form";
import Flex from "./Flex";

type Props = {
  field: ControllerRenderProps<any, any>;
  label: string;
  error?: FieldError;
};

const CMSTextArea = ({ field, label, error }: Props) => {
  return (
    <Flex className="gap-3">
      <p className="text-body-xs font-semibold text-neutral-900">
        {label}{" "}
        {error && <span className="text-red-500">({error.message})</span>}
      </p>

      <Flex
        className={`flex-row! items-center px-3.5 py-2 bg-white border ${error ? "border-red-500" : "border-neutral-200"} rounded-md h-25`}
      >
        <textarea
          {...field}
          placeholder="Input here..."
          className="h-full w-full text-body-xs text-neutral-900 outline-none"
        ></textarea>
      </Flex>
    </Flex>
  );
};

export default CMSTextArea;
