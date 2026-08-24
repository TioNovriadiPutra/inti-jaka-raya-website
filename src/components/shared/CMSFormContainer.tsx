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
      className="flex flex-col grow basis-0 px-6 py-3.5 gap-4 max-w-245.5 mx-auto overflow-auto"
      onSubmit={onSubmit}
    >
      <Flex className="flex-row! items-center justify-between">
        <Flex className="flex-row! items-center gap-4">
          <button
            type="button"
            className="flex size-7 bg-white rounded-md border border-neutral-200 items-center justify-center hover:bg-neutral-200 duration-300 transition-colors"
            onClick={() => route.back()}
          >
            <ArrowLeft2 size={16} color="var(--neutral-900)" />
          </button>

          <h5 className="font-bold text-black">{title}</h5>
        </Flex>

        <Flex className="flex-row! items-center gap-2">
          <button
            type="button"
            disabled={isLoading}
            className="flex px-4 py-2.25 rounded-md border border-neutral-200 bg-white text-body-s font-semibold text-neutral-900 hover:bg-red-500 hover:text-white duration-300 transition-colors"
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
            className="flex px-4 py-2.25 rounded-md border border-neutral-200 bg-primary-500 text-body-s font-semibold text-white hover:opacity-80 duration-300 transition-opacity"
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
        <Flex className="flex-1 items-center justify-center bg-white border border-neutral-200 rounded-lg">
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
