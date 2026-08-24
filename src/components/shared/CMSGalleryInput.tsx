import { Controller } from "react-hook-form";
import Flex from "./Flex";
import { useRef } from "react";
import Image from "next/image";
import { CloseIcon } from "../../../public";
import { AddCircle, PictureFrame } from "iconsax-reactjs";

type Props = {
  control: any;
};

const CMSGalleryInput = ({ control }: Props) => {
  const galleryRef = useRef<HTMLInputElement>(null);
  const thumbnailRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Flex className="flex-row! px-6 pb-6 gap-4">
        <Controller
          control={control}
          rules={{
            required: "Thumbnail must be filled!",
          }}
          name="thumbnail"
          render={({ field, fieldState: { error } }) => (
            <>
              <button
                type="button"
                className={`relative flex flex-col w-33.25 h-25 border ${error ? "border-red-500" : "border-neutral-200"} rounded-lg bg-neutral-100 items-center justify-center gap-3 overflow-hidden shrink-0`}
                onClick={() => {
                  thumbnailRef.current?.click();
                }}
              >
                {field.value ? (
                  <>
                    <Image
                      src={
                        typeof field.value === "string"
                          ? field.value
                          : URL.createObjectURL(field.value)
                      }
                      alt="preview-thumbnail"
                      width={133}
                      height={100}
                      className="w-full h-full object-cover"
                    />

                    <button
                      type="button"
                      className="flex size-4.5 rounded-full bg-white items-center justify-center shadow-[0_1px_5px_rgba(0,0,0,0.25)] absolute z-20 top-1.25 right-1.25"
                      onClick={(e) => {
                        e.stopPropagation();
                        field.onChange(undefined);
                      }}
                    >
                      <CloseIcon />
                    </button>
                  </>
                ) : (
                  <>
                    <PictureFrame size="32" color="var(--neutral-400)" />

                    <p className="text-body-xs font-semibold text-neutral-400">
                      Thumbnail
                    </p>
                  </>
                )}
              </button>

              <input
                ref={thumbnailRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  field.onChange(e.target.files?.[0] ?? null);
                }}
              />
            </>
          )}
        />

        <Flex className="h-full w-px bg-neutral-200" />

        <Controller
          control={control}
          name="galleries"
          render={({ field }) => (
            <>
              <Flex className="flex-row! overflow-x-auto gap-4">
                {field.value.map((val: File | string, index: number) => (
                  <Flex
                    key={index.toString()}
                    className="relative w-33.25 h-25 rounded-lg overflow-hidden border border-neutral-200 shrink-0"
                  >
                    <Image
                      src={
                        typeof val === "string"
                          ? val.split("|")[1]
                          : URL.createObjectURL(val)
                      }
                      alt={`preview-${index}`}
                      width={133}
                      height={100}
                      className="w-full h-full object-cover"
                    />

                    <button
                      type="button"
                      className="flex size-4.5 rounded-full bg-white items-center justify-center shadow-[0_1px_5px_rgba(0,0,0,0.25)] absolute z-20 top-1.25 right-1.25"
                      onClick={() => {
                        const newVal = field.value.filter(
                          (_: File | string, i: number) => i !== index,
                        );

                        field.onChange(newVal);
                      }}
                    >
                      <CloseIcon />
                    </button>
                  </Flex>
                ))}
              </Flex>

              <input
                ref={galleryRef}
                type="file"
                accept="image/*"
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
      </Flex>

      <Flex className="py-[14.5px] items-center border-t border-t-neutral-200">
        <button
          type="button"
          className="flex items-center px-4 py-2 gap-1"
          onClick={() => {
            galleryRef.current?.click();
          }}
        >
          <AddCircle size={16} color="var(--neutral-900)" />

          <p className="text-body-xs font-bold text-neutral-900">Add Image</p>
        </button>
      </Flex>
    </>
  );
};

export default CMSGalleryInput;
