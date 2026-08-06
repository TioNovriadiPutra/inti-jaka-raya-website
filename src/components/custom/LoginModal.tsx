import { CloseCircle } from "iconsax-reactjs";
import { CustomTextInput, Flex } from "../shared";
import { Controller, useForm } from "react-hook-form";
import { AnimatePresence, motion } from "motion/react";
import { useLoading, useLoginModal } from "@/stores/page.store";
import { Ring2 } from "ldrs/react";
import "ldrs/react/Ring2.css";
import useAuthController from "@/controllers/auth.controller";

const LoginModal = () => {
  const isLoading = useLoading((state) => state.isLoading);
  const loginModal = useLoginModal();

  const { control, setValues, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { loginService } = useAuthController();

  return (
    <AnimatePresence>
      {loginModal.showModal && (
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
            className="flex flex-col bg-white w-105 rounded-[14px] pb-10"
          >
            <Flex className="items-end p-3.5">
              <button
                type="button"
                onClick={() => {
                  setValues({
                    email: "",
                    password: "",
                  });
                  loginModal.setShowModal(false);
                }}
              >
                <CloseCircle size={24} color="var(--neutral-400)" />
              </button>
            </Flex>

            <Flex className="px-10">
              <h5 className="font-bold text-neutral-900 text-center mb-1">
                Sign In
              </h5>

              <p className="text-body-xs text-neutral-500 text-center mb-8">
                Unlock access to the document by
                <br />
                logging in first!
              </p>

              <form
                className="flex flex-col gap-10"
                onSubmit={handleSubmit((data) => loginService(data))}
              >
                <Flex className="gap-4.5">
                  <Controller
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <CustomTextInput
                        label="Email"
                        field={field}
                        placeholder="Enter your email"
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="password"
                    render={({ field }) => (
                      <CustomTextInput
                        label="Password"
                        field={field}
                        placeholder="Enter your password"
                        type="password"
                      />
                    )}
                  />
                </Flex>

                <button
                  type="submit"
                  className="flex justify-center bg-accent-600 py-[11.5px] rounded-3xl shadow-[2px_4px_24px_rgba(0,0,0,0.2)] text-body-xs font-bold text-neutral-50"
                >
                  {isLoading ? (
                    <Ring2
                      size="18"
                      stroke="3"
                      strokeLength="0.25"
                      bgOpacity="0.1"
                      speed="0.8"
                      color="var(--neutral-50)"
                    />
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>
            </Flex>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
