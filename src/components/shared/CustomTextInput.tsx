import { ControllerRenderProps } from "react-hook-form";
import Flex from "./Flex";
import { HTMLInputTypeAttribute, useState } from "react";
import { Eye, EyeSlash } from "iconsax-reactjs";

type Props = {
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: ControllerRenderProps<any, any>;
  placeholder: string;
  type?: HTMLInputTypeAttribute;
};

const CustomTextInput = ({
  label,
  field,
  placeholder,
  type = "text",
}: Props) => {
  const [showPass, setShowPass] = useState(false);

  return (
    <Flex className="gap-3">
      <p className="text-body-xs text-neutral-900">{label}</p>

      <Flex className="flex-row! items-center px-3.5 py-2 border border-neutral-200 rounded-md">
        <input
          {...field}
          placeholder={placeholder}
          type={type === "password" ? (showPass ? "text" : "password") : "text"}
          className="flex-1 text-body-xs text-neutral-900 outline-none"
        />

        {type === "password" && (
          <button type="button" onClick={() => setShowPass((prev) => !prev)}>
            {showPass ? (
              <EyeSlash size={18} color="var(--neutral-400)" stroke="1.5px" />
            ) : (
              <Eye size={18} color="var(--neutral-400)" stroke="1.5px" />
            )}
          </button>
        )}
      </Flex>
    </Flex>
  );
};

export default CustomTextInput;
