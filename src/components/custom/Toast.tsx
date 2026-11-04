import { useToast } from "@/stores/page.store";
import { ErrorIcon, SuccessIcon } from "../../../public";
import { CloseCircle } from "iconsax-reactjs";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";

const Toast = () => {
  const toast = useToast();

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (toast.isShowing) {
      timeout = setTimeout(() => {
        toast.hideToast();
      }, 3000);
    }

    return () => clearTimeout(timeout);
  }, [toast, toast.isShowing]);

  return (
    <AnimatePresence>
      {toast.isShowing && (
        <motion.div
          initial={{
            y: "100%",
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          exit={{
            y: "100%",
            opacity: 0,
          }}
          className="flex items-center justify-between gap-6 absolute z-[1001] bottom-10.25 left-1/2 transform -translate-x-1/2 bg-white min-w-90 px-6 py-3.5 rounded-[14px] shadow-sm"
        >
          {toast.type === "success" ? <SuccessIcon /> : <ErrorIcon />}

          <p className="text-body-xs font-semibold text-neutral-700">
            {toast.message}
          </p>

          <button type="button">
            <CloseCircle size={24} color="var(--neutral-400)" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
