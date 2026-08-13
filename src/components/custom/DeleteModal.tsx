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
        <div className="hidden lg:flex absolute z-998 inset-0 bg-[rgba(23,23,23,0.5)] items-center justify-center">
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
            className="flex flex-col bg-white min-w-lg rounded-md p-6"
          >
            <p className="text-body-l font-bold text-neutral-900 mb-2">
              Delete
            </p>

            <p className="text-body-s text-neutral-500 mb-4">
              Are you sure want to delete “{deleteModal.itemName}”?
            </p>

            <Flex className="flex-row! items-center justify-end gap-2">
              <button
                type="button"
                disabled={isLoading}
                className="flex text-body-s font-semibold text-neutral-900 px-4 py-2.25 border border-neutral-200 rounded-md"
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
                className="flex text-body-s font-semibold text-white bg-red-500 px-4 py-2.25 rounded-md"
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
                  "Logout"
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
