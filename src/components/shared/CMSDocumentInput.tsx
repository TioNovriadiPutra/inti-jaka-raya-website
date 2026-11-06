import { Controller } from "react-hook-form";
import Flex from "./Flex";
import { CloseWhiteIcon } from "../../../public";
import { useRef } from "react";
import { AddCircle } from "iconsax-reactjs";

type Props = {
  control: any;
};

const CMSDocumentInput = ({ control }: Props) => {
  const documentRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Controller
        control={control}
        name="documents"
        render={({ field }) => (
          <>
            <Flex className="min-w-0 gap-5 border-b border-neutral-100 px-5 pb-6 pt-5 md:px-7">
              {field.value.map((val: File | string, index: number) => (
                <Flex
                  key={index.toString()}
                  className="min-w-0 flex-row! items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-neutral-50/40 px-4 py-3"
                >
                  <p className="min-w-0 text-small text-neutral-700 wrap-anywhere">
                    {val instanceof File ? val.name : val.split("|")[1]}
                  </p>

                  <button
                    type="button"
                    className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-neutral-400 transition-colors hover:bg-red-500 motion-reduce:transition-none"
                    onClick={() => {
                      const newVal = field.value.filter(
                        (_: File | string, i: number) => i !== index,
                      );

                      field.onChange(newVal);
                    }}
                  >
                    <CloseWhiteIcon />
                  </button>
                </Flex>
              ))}
            </Flex>

            <input
              ref={documentRef}
              type="file"
              accept="application/pdf"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []);
                field.onChange(files);
              }}
            />
          </>
        )}
      />

      <Flex className="items-center px-5 py-4 md:px-7">
        <button
          type="button"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-primary-50 bg-primary-50/30 px-4 py-2 text-primary-600 transition-colors hover:border-primary-100 hover:bg-primary-50/60 motion-reduce:transition-none"
          onClick={() => {
            documentRef.current?.click();
          }}
        >
          <AddCircle size={16} color="var(--neutral-900)" />

          <p className="text-small font-bold text-primary-600">
            Add Document
          </p>
        </button>
      </Flex>
    </>
  );
};

export default CMSDocumentInput;
