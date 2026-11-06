import {
  CMSDescriptionInput,
  CMSDocumentInput,
  CMSDropdown,
  CMSFormContainer,
  CMSGalleryInput,
  CMSTextInput,
  Flex,
} from "@/components/shared";
import useProductController from "@/controllers/product.controller";
import { ProductInput } from "@/interfaces/product.interface";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Ring2 } from "ldrs/react";
import "ldrs/react/Ring2.css";

const CMSEditProduct = () => {
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

  const fieldArray = useFieldArray({
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
      productData.descriptions.forEach((item) => fieldArray.append(item));
    }
  }, [productLoading]);

  return (
    <CMSFormContainer
      title="Edit Product"
      fetchLoading={productLoading}
      onSubmit={handleSubmit((data) =>
        updateProductService({ id: Number(id), body: data }),
      )}
    >
      <Flex className="min-w-0 rounded-2xl border border-neutral-200 bg-white shadow-[0_6px_24px_-20px_var(--primary-900)]">
        <Flex className="border-b border-neutral-100 px-5 py-5 md:px-7">
          <h5 className="text-body-s font-extrabold tracking-tight text-primary-700">Item Details</h5>
        </Flex>

        <Flex
          className={`grid! min-w-0 gap-5 px-5 py-6 md:grid-cols-2 md:px-7 ${dropdownLoading ? "items-center" : ""}`}
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

      <Flex className="min-w-0 rounded-2xl border border-neutral-200 bg-white shadow-[0_6px_24px_-20px_var(--primary-900)]">
        <Flex className="border-b border-neutral-100 px-5 py-5 md:px-7">
          <h5 className="text-body-s font-extrabold tracking-tight text-primary-700">Gallery</h5>
        </Flex>

        <CMSGalleryInput control={control} />
      </Flex>

      <Flex className="min-w-0 rounded-2xl border border-neutral-200 bg-white shadow-[0_6px_24px_-20px_var(--primary-900)]">
        <Flex className="border-b border-neutral-100 px-5 py-5 md:px-7">
          <h5 className="text-body-s font-extrabold tracking-tight text-primary-700">Document</h5>
        </Flex>

        <CMSDocumentInput control={control} />
      </Flex>

      <Flex className="min-w-0 rounded-2xl border border-neutral-200 bg-white shadow-[0_6px_24px_-20px_var(--primary-900)]">
        <Flex className="border-b border-neutral-100 px-5 py-5 md:px-7">
          <h5 className="text-body-s font-extrabold tracking-tight text-primary-700">Description</h5>
        </Flex>

        <CMSDescriptionInput
          control={control}
          fields={fieldArray.fields}
          onRemove={(index) => fieldArray.remove(index)}
          onAppend={() =>
            fieldArray.append({
              title: "",
              description: "",
            })
          }
        />
      </Flex>
    </CMSFormContainer>
  );
};

export default CMSEditProduct;
