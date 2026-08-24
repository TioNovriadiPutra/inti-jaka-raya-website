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
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Ring2 } from "ldrs/react";
import "ldrs/react/Ring2.css";
import { ProductInput } from "@/interfaces/product.interface";

const CMSCreateProduct = () => {
  const { control, handleSubmit } = useForm<ProductInput>({
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

  const { useGetCreateProductDropdown, createProductService } =
    useProductController();

  const { finalData, isLoading: dropdownLoading } =
    useGetCreateProductDropdown();

  return (
    <CMSFormContainer
      title="Create Product"
      onSubmit={handleSubmit((data) => createProductService(data))}
    >
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
                    items={finalData.divisionData}
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
                    items={finalData.industryData}
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
                    items={finalData.categoryData}
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
                    items={finalData.applicationData}
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

        <CMSGalleryInput control={control} />
      </Flex>

      <Flex className="bg-white border border-neutral-200 rounded-lg mb-6">
        <Flex className="p-6">
          <h5 className="font-bold text-neutral-900">Document</h5>
        </Flex>

        <CMSDocumentInput control={control} />
      </Flex>

      <Flex className="bg-white border border-neutral-200 rounded-lg mb-6">
        <Flex className="p-6">
          <h5 className="font-bold text-neutral-900">Description</h5>
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

export default CMSCreateProduct;
