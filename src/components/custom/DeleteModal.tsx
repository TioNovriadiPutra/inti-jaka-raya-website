import { useDeleteModal, useLoading } from "@/stores/page.store";
import { AnimatePresence, motion } from "motion/react";
import { Flex } from "../shared";
import { Ring2 } from "ldrs/react";
import "ldrs/react/Ring2.css";

const DeleteModal = () => {
  const deleteModal = useDeleteModal();
  const isLoading = useLoading((state) => state.isLoading);

  return (
    <AnimatePresence>
      {deleteModal.showModal && (
        <div className="absolute inset-0 z-998 hidden items-center justify-center bg-primary-900/45 p-6 font-sans backdrop-blur-sm lg:flex">
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
            transition={{
              ease: "easeOut",
              duration: 0.2,
            }}
            className="flex w-full max-w-lg flex-col rounded-2xl border border-neutral-200 bg-white p-7 shadow-2xl shadow-primary-900/15"
          >
            <p className="mb-3 text-h5-desktop font-extrabold tracking-tight text-primary-700">
              Delete
            </p>

            <p className="mb-7 text-small leading-relaxed text-neutral-500 wrap-anywhere">
              Are you sure want to delete “{deleteModal.itemName}”?
            </p>

            <Flex className="flex-row! items-center justify-end gap-3 border-t border-neutral-100 pt-5">
              <button
                type="button"
                disabled={isLoading}
                className="flex min-h-11 items-center justify-center rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-small font-bold text-neutral-600 transition-colors hover:bg-neutral-50 disabled:cursor-wait disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-accent-600 motion-reduce:transition-none"
                onClick={() => deleteModal.setShowModal(false, "", undefined)}
              >
                {isLoading ? (
                  <Ring2
                    size="20"
                    stroke="3"
                    strokeLength="0.25"
                    bgOpacity="0.1"
                    speed="0.8"
                    color="var(--neutral-900)"
                  />
                ) : (
                  "Cancel"
                )}
              </button>

              <button
                type="button"
                disabled={isLoading}
                className="flex min-h-11 items-center justify-center rounded-xl border border-red-500 bg-red-500 px-5 py-2.5 text-small font-bold text-white transition-colors hover:bg-red-600 disabled:cursor-wait disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-accent-600 motion-reduce:transition-none"
                onClick={deleteModal.onDelete}
              >
                {isLoading ? (
                  <Ring2
                    size="20"
                    stroke="3"
                    strokeLength="0.25"
                    bgOpacity="0.1"
                    speed="0.8"
                    color="white"
                  />
                ) : (
                  "Delete"
                )}
              </button>
            </Flex>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DeleteModal;
