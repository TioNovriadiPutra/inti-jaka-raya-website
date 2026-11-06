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
    <Flex ref={dropdownRef} className="relative min-w-0 gap-2">
      <p className="text-small font-bold text-primary-700">
        {label}{" "}
        {error && <span className="text-red-500">({error.message})</span>}
      </p>

      <button
        type="button"
        disabled={disabled}
        className={`flex min-h-12 min-w-0 items-center gap-3 px-4 py-3 shadow-xs transition-colors focus-visible:outline-2 focus-visible:outline-accent-600 motion-reduce:transition-none ${disabled ? "bg-neutral-100" : "bg-white"} border ${error ? "border-red-500" : "border-neutral-200"} rounded-xl ${disabled ? "cursor-not-allowed!" : ""}`}
        onClick={() => setOpenDropdown((prev) => !prev)}
      >
        <p className="min-w-0 flex-1 text-left text-small text-neutral-700 wrap-anywhere">
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
            className="absolute inset-x-0 top-[calc(100%+8px)] z-50 flex max-h-72 origin-top flex-col overflow-y-auto rounded-xl border border-neutral-200 bg-white p-1.5 shadow-xl shadow-primary-900/10"
          >
            {items.map((item, index) => (
              <button
                key={index.toString()}
                type="button"
                className="flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-primary-50/40 focus-visible:outline-2 focus-visible:outline-accent-600 motion-reduce:transition-none"
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
                  <Flex className="size-6 shrink-0 rounded-md border border-neutral-200 bg-neutral-50" />
                )}

                <p className="min-w-0 text-small text-neutral-600 wrap-anywhere">{item.label}</p>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </Flex>
  );
};

export default CMSDropdown;
