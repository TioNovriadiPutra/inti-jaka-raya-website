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
            <Flex className="px-6 pb-6 border-b border-b-neutral-200 gap-4">
              {field.value.map((val: File | string, index: number) => (
                <Flex
                  key={index.toString()}
                  className="px-3.5 py-2 border border-neutral-200 rounded-md flex-row! items-center justify-between"
                >
                  <p className="text-body-xs text-neutral-900">
                    {val instanceof File ? val.name : val.split("|")[1]}
                  </p>

                  <button
                    type="button"
                    className="flex size-4.5 rounded-full bg-neutral-400 items-center justify-center"
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

      <Flex className="py-[14.5px] items-center">
        <button
          type="button"
          className="flex items-center px-4 py-2 gap-1"
          onClick={() => {
            documentRef.current?.click();
          }}
        >
          <AddCircle size={16} color="var(--neutral-900)" />

          <p className="text-body-xs font-bold text-neutral-900">
            Add Document
          </p>
        </button>
      </Flex>
    </>
  );
};

export default CMSDocumentInput;
