import { AddCircle, Trash } from "iconsax-reactjs";
import Flex from "./Flex";
import { Controller } from "react-hook-form";
import CMSTextInput from "./CMSTextInput";
import CMSTextArea from "./CMSTextArea";

type Props = {
  control: any;
  fields: (any &
    Record<"id", string> & {
      disabled?: boolean;
    })[];
  onRemove: (index: number) => void;
  onAppend: () => void;
};

const CMSDescriptionInput = ({
  control,
  fields,
  onRemove,
  onAppend,
}: Props) => {
  return (
    <>
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
                    onRemove(iField);
                  }}
                >
                  <Trash size={24} color="var(--neutral-500)" />
                </button>
              )}
            </Flex>

            <Controller
              control={control}
              rules={{
                required: "Title must be filled!",
                minLength: {
                  value: 1,
                  message: "Title must be filled!",
                },
              }}
              name={`descriptions.${iField}.title`}
              render={({ field, fieldState: { error } }) => (
                <CMSTextInput field={field} label="Title" error={error} />
              )}
            />

            <Controller
              control={control}
              rules={{
                required: "Description must be filled!",
                minLength: {
                  value: 1,
                  message: "Description must be filled!",
                },
              }}
              name={`descriptions.${iField}.description`}
              render={({ field, fieldState: { error } }) => (
                <CMSTextArea field={field} label="Description" error={error} />
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
            onAppend();
          }}
        >
          <AddCircle size={16} color="var(--neutral-900)" />

          <p className="text-body-xs font-bold text-neutral-900">Add Section</p>
        </button>
      </Flex>
    </>
  );
};

export default CMSDescriptionInput;
