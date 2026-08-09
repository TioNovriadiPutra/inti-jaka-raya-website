import { CMSFormContainer, Flex } from "@/components/shared";
import { ArrowLeft2 } from "iconsax-reactjs";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

const CMSCreateProduct = () => {
  const route = useRouter();

  const { control } = useForm({
    defaultValues: {
      code: "",
      itemName: "",
      division: undefined,
      industry: undefined,
      category: undefined,
      application: undefined,
    },
  });

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

          <h5 className="font-bold text-black">Create Item</h5>
        </Flex>

        <Flex className="flex-row! items-center gap-2">
          <button
            type="button"
            className="flex px-4 py-2.25 rounded-md border border-neutral-200 bg-white text-body-s font-semibold text-neutral-900 hover:bg-red-500 hover:text-white duration-300 transition-colors"
          >
            Discard
          </button>

          <button
            type="button"
            className="flex px-4 py-2.25 rounded-md border border-neutral-200 bg-primary-500 text-body-s font-semibold text-white hover:opacity-80 duration-300 transition-opacity"
          >
            Create Item
          </button>
        </Flex>
      </Flex>

      <Flex className="bg-white border border-neutral-200 rounded-lg">
        <Flex className="p-6">
          <h5 className="font-bold text-neutral-900">Item Details</h5>
        </Flex>

        <Flex className="px-6 pb-6"></Flex>
      </Flex>
    </CMSFormContainer>
  );
};

export default CMSCreateProduct;
