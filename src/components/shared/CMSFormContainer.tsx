import { ReactNode } from "react";
import Flex from "./Flex";
import { useRouter } from "next/router";
import { ArrowLeft2 } from "iconsax-reactjs";
import { useLoading } from "@/stores/page.store";
import { Ring2 } from "ldrs/react";
import "ldrs/react/Ring2.css";

type Props = {
  children: ReactNode;
  title: string;
  fetchLoading?: boolean;
  onSubmit?: () => void;
};

const CMSFormContainer = ({
  children,
  title,
  fetchLoading,
  onSubmit,
}: Props) => {
  const isLoading = useLoading((state) => state.isLoading);

  const route = useRouter();

  return (
    <form
      className="mx-auto flex min-h-0 min-w-0 w-full max-w-6xl flex-1 flex-col gap-6 overflow-auto bg-neutral-50 px-4 py-6 font-sans sm:px-6 lg:px-8 lg:py-8 [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-offset-2 [&_button:focus-visible]:outline-accent-600"
      onSubmit={onSubmit}
    >
      <Flex className="flex-col! items-start justify-between gap-5 border-b border-neutral-200 pb-6 lg:flex-row! lg:items-center">
        <Flex className="min-w-0 flex-row! items-center gap-3">
          <button
            type="button"
            className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white transition-colors hover:border-primary-100 hover:bg-primary-50/40 motion-reduce:transition-none"
            onClick={() => route.back()}
          >
            <ArrowLeft2 size={16} color="var(--neutral-900)" />
          </button>

          <h1 className="text-h5-mobile font-extrabold tracking-tight text-primary-700 wrap-anywhere md:text-h5-desktop">{title}</h1>
        </Flex>

        <Flex className="w-full flex-row! items-center gap-3 lg:w-auto">
          <button
            type="button"
            disabled={isLoading}
            className="flex min-h-11 flex-1 items-center justify-center rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-small font-bold text-neutral-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:cursor-wait disabled:opacity-60 motion-reduce:transition-none lg:flex-none"
          >
            {isLoading ? (
              <Ring2
                size="22"
                stroke="3"
                strokeLength="0.25"
                bgOpacity="0.1"
                speed="0.8"
                color="var(--neutral-900)"
              />
            ) : (
              "Discard"
            )}
          </button>

          <button
            type="button"
            disabled={isLoading}
            className="flex min-h-11 flex-1 items-center justify-center rounded-xl border border-primary-600 bg-primary-600 px-6 py-2.5 text-small font-bold text-white shadow-sm transition-colors hover:bg-primary-500 disabled:cursor-wait disabled:opacity-60 motion-reduce:transition-none lg:flex-none"
            onClick={onSubmit}
          >
            {isLoading ? (
              <Ring2
                size="22"
                stroke="3"
                strokeLength="0.25"
                bgOpacity="0.1"
                speed="0.8"
                color="var(--neutral-900)"
              />
            ) : (
              "Submit"
            )}
          </button>
        </Flex>
      </Flex>

      {fetchLoading ? (
        <Flex className="min-h-80 flex-1 items-center justify-center rounded-2xl border border-neutral-200 bg-white">
          <Ring2
            size="30"
            stroke="3"
            strokeLength="0.25"
            bgOpacity="0.1"
            speed="0.8"
            color="var(--neutral-900)"
          />
        </Flex>
      ) : (
        children
      )}
    </form>
  );
};

export default CMSFormContainer;
