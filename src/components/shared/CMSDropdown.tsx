import { ControllerRenderProps, FieldError } from "react-hook-form";
import Flex from "./Flex";
import { DropdownType } from "@/interfaces/form.interface";
import { ArrowDown2, TickSquare } from "iconsax-reactjs";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

type Props = {
  field: ControllerRenderProps<any, any>;
  label: string;
  items: DropdownType[];
  error?: FieldError;
  disabled?: boolean;
};

const CMSDropdown = ({ field, label, items, error, disabled }: Props) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openDropdown) return;

    const handleClickOutside = (event: PointerEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(false);
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [openDropdown]);

  return (
    <Flex ref={dropdownRef} className="gap-3 relative">
      <p className="text-body-xs font-semibold text-neutral-900">
        {label}{" "}
        {error && <span className="text-red-500">({error.message})</span>}
      </p>

      <button
        type="button"
        disabled={disabled}
        className={`flex items-center px-3.5 py-2 ${disabled ? "bg-neutral-100" : "bg-white"} border ${error ? "border-red-500" : "border-neutral-200"} rounded-md ${disabled ? "cursor-not-allowed!" : ""}`}
        onClick={() => setOpenDropdown((prev) => !prev)}
      >
        <p className="flex-1 text-body-xs text-neutral-900 text-left">
          {field.value ? field.value.label : "Select here..."}
        </p>

        <ArrowDown2 size={18} color="var(--neutral-800)" />
      </button>

      <AnimatePresence>
        {openDropdown && (
          <motion.div
            initial={{
              scale: 0,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            exit={{
              scale: 0,
              opacity: 0,
            }}
            className="flex flex-col absolute z-50 top-[110%] left-0 right-0 p-2 bg-white border border-neutral-200 rounded-[14px] origin-top"
          >
            {items.map((item, index) => (
              <button
                key={index.toString()}
                type="button"
                className="flex items-center gap-2.5 px-2.5 py-3 hover:bg-neutral-100 duration-300 transition-colors rounded-lg"
                onClick={() => {
                  field.onChange(item);
                  setOpenDropdown(false);
                }}
              >
                {field.value && field.value.value === item.value ? (
                  <TickSquare
                    size={24}
                    color="var(--accent-600)"
                    variant="Bold"
                  />
                ) : (
                  <Flex className="size-6 bg-neutral-200 rounded-lg" />
                )}

                <p className="text-body-xs text-neutral-700">{item.label}</p>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </Flex>
  );
};

export default CMSDropdown;
