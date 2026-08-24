import {
  CMSDropdown,
  CMSFormContainer,
  CMSTextInput,
  Flex,
} from "@/components/shared";
import useLabelController from "@/controllers/label.controller";
import { labelFilter } from "@/utils/constant";
import { Controller, useForm } from "react-hook-form";

const CMSCreateLabel = () => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      labelName: "",
      labelType: undefined,
    },
  });

  const { createLabelService } = useLabelController();

  return (
    <CMSFormContainer
      title="Create Label"
      onSubmit={handleSubmit((data) => createLabelService(data))}
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
              />
            )}
          />
        </Flex>
      </Flex>
    </CMSFormContainer>
  );
};

export default CMSCreateLabel;
