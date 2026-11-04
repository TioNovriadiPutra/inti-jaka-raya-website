import useTranslation from "@/hooks/useTranslation";
import { CloseCircle } from "iconsax-reactjs";
import Image from "next/image";
import { CustomTextInput, Flex } from "../shared";
import { Controller, useForm } from "react-hook-form";
import { AnimatePresence, motion } from "motion/react";
import { useLoading, useLoginModal } from "@/stores/page.store";
import { Ring2 } from "ldrs/react";
import "ldrs/react/Ring2.css";
import useAuthController from "@/controllers/auth.controller";

const LoginModal = () => {
  const { t } = useTranslation();
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
        <div className="fixed inset-0 z-[1000] hidden items-center justify-center overflow-y-auto bg-primary-900/50 p-6 backdrop-blur-sm lg:flex">
          <motion.div
            initial={{
              scale: 0.97,
              y: 12,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              y: 0,
              opacity: 1,
            }}
            exit={{
              scale: 0.97,
              y: 12,
              opacity: 0,
            }}
            transition={{
              ease: "easeOut",
              duration: 0.2,
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-heading"
            aria-describedby="login-description"
            className="flex max-h-[calc(100dvh-48px)] w-full max-w-110 flex-col overflow-y-auto rounded-3xl border border-neutral-200 bg-white shadow-2xl shadow-primary-900/20"
          >
            <Flex className="shrink-0 flex-row! items-center justify-between gap-4 border-b border-neutral-200 px-6 py-5">
              <Image src="/images/brand-logo.png" alt="PT. Inti Jaka Raya" width={225} height={42} sizes="160px" className="block h-auto w-40 max-w-full object-contain" />
              <button
                type="button"
                aria-label={t("Close")}
                className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 transition-colors hover:bg-primary-50/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600"
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

            <Flex className="gap-0 px-6 py-7">
              <p className="mb-3 flex items-center gap-2 text-caption font-extrabold uppercase tracking-[.14em] text-accent-700"><span className="h-0.5 w-5 bg-current" />{t("Welcome back")}</p>
              <h2 id="login-heading" className="mb-2 text-h5-desktop font-bold leading-snug tracking-tight text-primary-700">{t("Sign In")}</h2>

              <p id="login-description" className="mb-6 text-body-xs leading-relaxed text-neutral-500">{t("Unlock access to the document by")}{" "}{t("logging in first!")}</p>

              <form
                className="flex flex-col gap-6"
                onSubmit={handleSubmit((data) => loginService(data))}
              >
                <Flex className="gap-5 [&>div]:gap-2 [&>div>p]:text-label [&>div>p]:font-bold [&>div>p]:text-primary-700 [&>div>div]:min-h-12 [&>div>div]:rounded-lg [&>div>div]:border-neutral-200 [&>div>div]:bg-neutral-50 [&>div>div]:transition-colors [&>div>div:focus-within]:border-primary-300 [&>div>div:focus-within]:bg-white [&_input]:min-w-0 [&_input]:text-body-xs [&_input]:text-primary-700 [&_input::placeholder]:text-neutral-400 [&_button]:flex [&_button]:size-8 [&_button]:shrink-0 [&_button]:items-center [&_button]:justify-center">
                  <Controller
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <CustomTextInput
                        label={t("Email")}
                        field={field}
                        placeholder={t("Enter your email")}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="password"
                    render={({ field }) => (
                      <CustomTextInput
                        label={t("Password")}
                        field={field}
                        placeholder={t("Enter your password")}
                        type="password"
                      />
                    )}
                  />
                </Flex>

                <button
                  type="submit"
                  aria-busy={isLoading}
                  className="flex min-h-12 items-center justify-center rounded-lg border border-primary-600 bg-primary-600 px-6 py-3 text-body-xs font-bold text-white transition-colors hover:bg-primary-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-600"
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
                    t("Sign In")
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
