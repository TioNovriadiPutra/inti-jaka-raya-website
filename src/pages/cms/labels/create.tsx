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
      <Flex className="min-w-0 rounded-2xl border border-neutral-200 bg-white shadow-[0_6px_24px_-20px_var(--primary-900)]">
        <Flex className="border-b border-neutral-100 px-5 py-5 md:px-7">
          <h5 className="text-body-s font-extrabold tracking-tight text-primary-700">Label Details</h5>
        </Flex>

        <Flex className="gap-5 px-5 py-6 md:px-7">
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
