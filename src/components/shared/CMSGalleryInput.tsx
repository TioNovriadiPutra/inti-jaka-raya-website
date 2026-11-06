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
      <Flex className="min-w-0 flex-col! gap-5 px-5 pb-6 pt-5 md:flex-row! md:px-7">
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
                className={`relative flex flex-col h-32 w-40 border-2 border-dashed ${error ? "border-red-500" : "border-neutral-200"} rounded-xl bg-neutral-50 hover:bg-primary-50/30 focus-visible:outline-2 focus-visible:outline-accent-600 items-center justify-center gap-3 overflow-hidden shrink-0`}
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
                      className="absolute right-2 top-2 z-20 flex size-8 items-center justify-center rounded-lg border border-neutral-200 bg-white shadow-sm transition-colors hover:bg-red-50 motion-reduce:transition-none"
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

                    <p className="text-small font-semibold text-neutral-500">
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

        <Flex className="hidden w-px shrink-0 self-stretch bg-neutral-200 md:block" />

        <Controller
          control={control}
          name="galleries"
          render={({ field }) => (
            <>
              <Flex className="min-w-0 flex-1 flex-row! gap-3 overflow-x-auto pb-2">
                {field.value.map((val: File | string, index: number) => (
                  <Flex
                    key={index.toString()}
                    className="relative h-32 w-40 shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50"
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
                      className="absolute right-2 top-2 z-20 flex size-8 items-center justify-center rounded-lg border border-neutral-200 bg-white shadow-sm transition-colors hover:bg-red-50 motion-reduce:transition-none"
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

      <Flex className="items-center border-t border-neutral-100 px-5 py-4 md:px-7">
        <button
          type="button"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-primary-50 bg-primary-50/30 px-4 py-2 text-primary-600 transition-colors hover:border-primary-100 hover:bg-primary-50/60 motion-reduce:transition-none"
          onClick={() => {
            galleryRef.current?.click();
          }}
        >
          <AddCircle size={16} color="var(--neutral-900)" />

          <p className="text-small font-bold text-primary-600">Add Image</p>
        </button>
      </Flex>
    </>
  );
};

export default CMSGalleryInput;
