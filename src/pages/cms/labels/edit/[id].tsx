import {
  CMSDropdown,
  CMSFormContainer,
  CMSTextInput,
  Flex,
} from "@/components/shared";
import { useRouter } from "next/router";
import useLabelController from "@/controllers/label.controller";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { LabelInput } from "@/interfaces/label.interface";
import { labelFilter } from "@/utils/constant";

const CMSEditLabel = () => {
  const route = useRouter();

  const { control, handleSubmit, setValues } = useForm<LabelInput>({
    defaultValues: {
      labelName: "",
      labelType: undefined,
    },
  });

  const { id, type } = route.query;

  const { useGetLabelByIdService, updateLabelService } = useLabelController();

  const { finalData, isLoading: labelLoading } = useGetLabelByIdService(
    Number(id),
    type as string,
  );

  useEffect(() => {
    if (!labelLoading) {
      setValues({
        labelName: finalData.labelName,
        labelType: finalData.labelType,
      });
    }
  }, [labelLoading]);

  return (
    <CMSFormContainer
      title="Edit Label"
      fetchLoading={labelLoading}
      onSubmit={handleSubmit((data) =>
        updateLabelService({ id: Number(id), body: data }),
      )}
    >
      <Flex className="bg-white border border-neutral-200 rounded-lg">
        <Flex className="p-6">
          <h5 className="font-bold text-neutral-900">Label Details</h5>
        </Flex>

        <Flex className="px-6 pb-6 gap-4.5">
          <Controller
            control={control}
            name="labelName"
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
            name="labelType"
            rules={{
              required: "Type must be filled!",
            }}
            render={({ field, fieldState: { error } }) => (
              <CMSDropdown
                field={field}
                label="Type"
                items={labelFilter}
                error={error}
                disabled
              />
            )}
          />
        </Flex>
      </Flex>
    </CMSFormContainer>
  );
};

export default CMSEditLabel;
