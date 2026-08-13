import {
  CMSDropdown,
  CMSFormContainer,
  CMSTextInput,
  Flex,
} from "@/components/shared";
import { ArrowLeft2 } from "iconsax-reactjs";
import { useRouter } from "next/router";
import { Ring2 } from "ldrs/react";
import "ldrs/react/Ring2.css";
import { useLoading } from "@/stores/page.store";
import useLabelController from "@/controllers/label.controller";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { LabelInput } from "@/interfaces/label.interface";
import { labelFilter } from "@/utils/constant";

const CMSEditLabel = () => {
  const isLoading = useLoading((state) => state.isLoading);

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

          <h5 className="font-bold text-black">Edit Label</h5>
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
            type="submit"
            disabled={isLoading}
            className="flex px-4 py-2.25 rounded-md border border-neutral-200 bg-primary-500 text-body-s font-semibold text-white hover:opacity-80 duration-300 transition-opacity"
            onClick={handleSubmit((data) =>
              updateLabelService({ id: Number(id), body: data }),
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
              "Edit Label"
            )}
          </button>
        </Flex>
      </Flex>

      {labelLoading ? (
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
      )}
    </CMSFormContainer>
  );
};

export default CMSEditLabel;
