import type { ReactNode } from "react";
import { Controller } from "react-hook-form";
import { SearchIcon } from "../../../public";
import Flex from "./Flex";
import { AnimatePresence, motion } from "motion/react";

type Props = {
  control?: any;
  name?: string;
  isOpen: boolean;
  onClose: () => void;
  placeholder?: string;
  showSearch?: boolean;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
};

const DropdownModal = ({
  control,
  name,
  isOpen,
  onClose,
  placeholder = "Search here...",
  showSearch = true,
  children,
  footer,
  className,
}: Props) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`fixed z-999 inset-0 flex flex-col justify-end bg-[rgba(14,14,14,0.4)] ${className}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.div
            className="flex h-[80%] flex-col bg-white rounded-t-3xl p-2"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
          >
            {showSearch && control && name && (
              <Flex className="shrink-0 flex-row! items-center px-2.5 py-3.25 border-b border-b-neutral-200 gap-4">
                <SearchIcon />

                <Controller
                  control={control}
                  name={name}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="search"
                      placeholder={placeholder}
                      className="min-w-0 flex-1 text-body-s text-neutral-600 outline-none"
                    />
                  )}
                />
              </Flex>
            )}

            <Flex
              className={`min-h-0 overflow-y-auto p-2 ${footer ? "flex-1" : ""}`}
            >
              {children}
            </Flex>
            {footer}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DropdownModal;
