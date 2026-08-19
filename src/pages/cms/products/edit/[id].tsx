import {
  CMSDropdown,
  CMSFormContainer,
  CMSTextArea,
  CMSTextInput,
  Flex,
} from "@/components/shared";
import useProductController from "@/controllers/product.controller";
import { ProductInput } from "@/interfaces/product.interface";
import { useLoading } from "@/stores/page.store";
import { AddCircle, ArrowLeft2, PictureFrame, Trash } from "iconsax-reactjs";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Ring2 } from "ldrs/react";
import "ldrs/react/Ring2.css";
import Image from "next/image";
import { CloseIcon, CloseWhiteIcon } from "../../../../../public";

const CMSEditProduct = () => {
  const isLoading = useLoading((state) => state.isLoading);

  const galleryRef = useRef<HTMLInputElement>(null);
  const documentRef = useRef<HTMLInputElement>(null);
  const thumbnailRef = useRef<HTMLInputElement>(null);

  const route = useRouter();

  const { id } = route.query;

  const { control, handleSubmit, setValues, setValue } = useForm<ProductInput>({
    defaultValues: {
      code: "",
      itemName: "",
      division: undefined,
      industry: undefined,
      category: undefined,
      application: undefined,
      thumbnail: undefined,
      galleries: [],
      documents: [],
      descriptions: [
        {
          title: "",
          description: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "descriptions",
  });

  const {
    useGetCreateProductDropdown,
    useGetProductByIdService,
    updateProductService,
  } = useProductController();

  const { finalData: dropdownData, isLoading: dropdownLoading } =
    useGetCreateProductDropdown();

  const { finalData: productData, isLoading: productLoading } =
    useGetProductByIdService(Number(id));

  useEffect(() => {
    if (!productLoading) {
      setValues(productData);
      setValue("descriptions", []);
      productData.descriptions.forEach((item) => append(item));
    }
  }, [productLoading]);

  return (
    <CMSFormContainer>
      <Flex className="flex-row! items-center justify-between">
        <Flex className="flex-row! items-center gap-4">
          <button
            type="button"
            className="flex size-7 bg-white rounded-md border border-neutral-200 items-center justify-center hover:bg-neutral-200 duration-300 transition-colors"
            onClick={() => route.back()}
          >
            <ArrowLeft2 size={16} color="var(--neutral-900)" />
          </button>

          <h5 className="font-bold text-black">Edit Product</h5>
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
            onClick={handleSubmit((data) =>
              updateProductService({ id: Number(id), body: data }),
            )}
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
              "Edit Product"
            )}
          </button>
        </Flex>
      </Flex>

      {productLoading ? (
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
        <>
          <Flex className="bg-white border border-neutral-200 rounded-lg mb-6">
            <Flex className="p-6">
              <h5 className="font-bold text-neutral-900">Item Details</h5>
            </Flex>

            <Flex
              className={`px-6 pb-6 gap-3.5 ${dropdownLoading ? "items-center" : ""}`}
            >
              {dropdownLoading ? (
                <Ring2
                  size="30"
                  stroke="3"
                  strokeLength="0.25"
                  bgOpacity="0.1"
                  speed="0.8"
                  color="var(--neutral-900)"
                />
              ) : (
                <>
                  <Controller
                    control={control}
                    name="code"
                    rules={{
                      required: "Code must be filled!",
                      minLength: {
                        value: 1,
                        message: "Code must be filled!",
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <CMSTextInput field={field} label="Code" error={error} />
                    )}
                  />

                  <Controller
                    control={control}
                    name="itemName"
                    rules={{
                      required: "Item must be filled!",
                      minLength: {
                        value: 1,
                        message: "Item must be filled!",
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <CMSTextInput field={field} label="Item" error={error} />
                    )}
                  />

                  <Controller
                    control={control}
                    name="division"
                    rules={{
                      required: "Division must be filled!",
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <CMSDropdown
                        field={field}
                        items={dropdownData.divisionData}
                        label="Division"
                        error={error}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="industry"
                    rules={{
                      required: "Industry must be filled!",
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <CMSDropdown
                        field={field}
                        items={dropdownData.industryData}
                        label="Industry"
                        error={error}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="category"
                    rules={{
                      required: "Category must be filled!",
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <CMSDropdown
                        field={field}
                        items={dropdownData.categoryData}
                        label="Category"
                        error={error}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="application"
                    rules={{
                      required: "Application must be filled!",
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <CMSDropdown
                        field={field}
                        items={dropdownData.applicationData}
                        label="Application"
                        error={error}
                      />
                    )}
                  />
                </>
              )}
            </Flex>
          </Flex>

          <Flex className="bg-white border border-neutral-200 rounded-lg mb-6">
            <Flex className="p-6">
              <h5 className="font-bold text-neutral-900">Gallery</h5>
            </Flex>

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
                      {field.value.map((val, index) => (
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
                                (_, i) => i !== index,
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
                        field.onChange([...field.value, ...files]);
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

                <p className="text-body-xs font-bold text-neutral-900">
                  Add Image
                </p>
              </button>
            </Flex>
          </Flex>

          <Flex className="bg-white border border-neutral-200 rounded-lg mb-6">
            <Flex className="p-6">
              <h5 className="font-bold text-neutral-900">Document</h5>
            </Flex>

            <Controller
              control={control}
              name="documents"
              render={({ field }) => (
                <>
                  <Flex className="px-6 pb-6 border-b border-b-neutral-200 gap-4">
                    {field.value.map((val, index) => (
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
                              (_, i) => i !== index,
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
                      field.onChange([...field.value, ...files]);
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
          </Flex>

          <Flex className="bg-white border border-neutral-200 rounded-lg mb-6">
            <Flex className="p-6">
              <h5 className="font-bold text-neutral-900">Description</h5>
            </Flex>

            <Flex className="px-6 pb-6 border-b border-b-neutral-200 gap-4">
              {fields.map((field, iField) => (
                <Flex key={field.id} className="gap-4">
                  <Flex className="flex-row! items-center justify-between py-3 border-b border-b-neutral-200">
                    <p className="text-body-xs font-semibold text-neutral-500">
                      Section {iField + 1}
                    </p>

                    {iField > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          remove(iField);
                        }}
                      >
                        <Trash size={24} color="var(--neutral-500)" />
                      </button>
                    )}
                  </Flex>

                  <Controller
                    control={control}
                    name={`descriptions.${iField}.title`}
                    render={({ field, fieldState: { error } }) => (
                      <CMSTextInput field={field} label="Title" error={error} />
                    )}
                  />

                  <Controller
                    control={control}
                    name={`descriptions.${iField}.description`}
                    render={({ field, fieldState: { error } }) => (
                      <CMSTextArea
                        field={field}
                        label="Description"
                        error={error}
                      />
                    )}
                  />
                </Flex>
              ))}
            </Flex>

            <Flex className="py-[14.5px] items-center">
              <button
                type="button"
                className="flex items-center px-4 py-2 gap-1"
                onClick={() => {
                  append({
                    title: "",
                    description: "",
                  });
                }}
              >
                <AddCircle size={16} color="var(--neutral-900)" />

                <p className="text-body-xs font-bold text-neutral-900">
                  Add Section
                </p>
              </button>
            </Flex>
          </Flex>
        </>
      )}
    </CMSFormContainer>
  );
};

export default CMSEditProduct;
