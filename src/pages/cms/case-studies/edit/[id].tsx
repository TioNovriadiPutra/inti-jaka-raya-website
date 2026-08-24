import {
  CMSDescriptionInput,
  CMSDocumentInput,
  CMSDropdown,
  CMSFormContainer,
  CMSGalleryInput,
  CMSTextArea,
  CMSTextInput,
  Flex,
} from "@/components/shared";
import useCaseStudyController from "@/controllers/caseStudy.controller";
import { CaseStudyInput } from "@/interfaces/caseStudy.interface";
import { Ring2 } from "ldrs/react";
import "ldrs/react/Ring2.css";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

const CMSEditCaseStudy = () => {
  const route = useRouter();

  const { id } = route.query;

  const { control, handleSubmit, setValue, setValues } =
    useForm<CaseStudyInput>({
      defaultValues: {
        title: "",
        product: undefined,
        category: undefined,
        industry: undefined,
        application: undefined,
        division: undefined,
        problem: "",
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

  const { useGetCreateCaseStudyDropdownService, useGetCaseStudyByIdService } =
    useCaseStudyController();

  const { finalData: dropdownData, isLoading: dropdownLoading } =
    useGetCreateCaseStudyDropdownService();

  const { finalData: caseStudyData, isLoading: caseStudyLoading } =
    useGetCaseStudyByIdService(Number(id));

  useEffect(() => {
    if (!caseStudyLoading) {
      setValues(caseStudyData);
      setValue("descriptions", []);
      caseStudyData.descriptions.forEach((item) => fieldArray.append(item));
    }
  }, [caseStudyLoading]);

  return (
    <CMSFormContainer
      title="Edit Case Study"
      fetchLoading={caseStudyLoading}
      onSubmit={handleSubmit((data) => console.log(data))}
    >
      <Flex className="bg-white border border-neutral-200 rounded-lg mb-2">
        <Flex className="p-6">
          <h5 className="font-bold text-neutral-900">Case Details</h5>
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
                name="title"
                rules={{
                  required: "Title must be filled!",
                  minLength: {
                    value: 1,
                    message: "Title must be filled!",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <CMSTextInput field={field} label="Title" error={error} />
                )}
              />

              <Controller
                control={control}
                name="product"
                rules={{
                  required: "Item must be filled!",
                }}
                render={({ field, fieldState: { error } }) => (
                  <CMSDropdown
                    field={field}
                    items={dropdownData.productData}
                    label="Item"
                    error={error}
                  />
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

              <Controller
                control={control}
                name="problem"
                rules={{
                  required: "Problem must be filled!",
                }}
                render={({ field, fieldState: { error } }) => (
                  <CMSTextArea field={field} label="Problem" error={error} />
                )}
              />
            </>
          )}
        </Flex>
      </Flex>

      <Flex className="bg-white border border-neutral-200 rounded-lg mb-2">
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

export default CMSEditCaseStudy;
