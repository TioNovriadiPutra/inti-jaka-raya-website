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
      <Flex className="min-w-0 gap-5 border-b border-neutral-100 px-5 pb-6 pt-5 md:px-7">
        {fields.map((field, iField) => (
          <Flex key={field.id} className="min-w-0 gap-5 rounded-xl border border-neutral-200 bg-neutral-50/40 p-4 md:p-5">
            <Flex className="flex-row! items-center justify-between border-b border-neutral-200 pb-4 [&_button]:flex [&_button]:size-10 [&_button]:items-center [&_button]:justify-center [&_button]:rounded-lg [&_button:hover]:bg-red-50">
              <p className="text-caption font-extrabold uppercase tracking-wider text-primary-600">
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

      <Flex className="items-center px-5 py-4 md:px-7">
        <button
          type="button"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-primary-50 bg-primary-50/30 px-4 py-2 text-primary-600 transition-colors hover:border-primary-100 hover:bg-primary-50/60 motion-reduce:transition-none"
          onClick={() => {
            onAppend();
          }}
        >
          <AddCircle size={16} color="var(--neutral-900)" />

          <p className="text-small font-bold text-primary-600">Add Section</p>
        </button>
      </Flex>
    </>
  );
};

export default CMSDescriptionInput;
