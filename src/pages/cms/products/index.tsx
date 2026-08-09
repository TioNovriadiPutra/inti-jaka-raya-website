import { CMSContainer, Flex } from "@/components/shared";
import { productFilter } from "@/utils/constant";
import { AddCircle, SearchNormal1 } from "iconsax-reactjs";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { motion } from "motion/react";
import { useRouter } from "next/router";

const CMSProducts = () => {
  const [filterValue, setFilterValue] = useState(productFilter[0].value);

  const route = useRouter();

  const { control } = useForm({
    defaultValues: {
      search: "",
    },
  });

  return (
    <CMSContainer>
      <Flex className="flex-row! items-center w-84 px-3 py-2 gap-2 bg-white border border-neutral-200 rounded-md self-end">
        <SearchNormal1 size={20} color="var(--neutral-400)" />

        <Controller
          control={control}
          name="search"
          render={({ field }) => (
            <input
              {...field}
              placeholder="Search..."
              className="flex-1 text-body-xs text-neutral-900 outline-none"
            />
          )}
        />
      </Flex>

      <Flex className="flex-row! items-center justify-between">
        <Flex className="relative flex-row! p-1.25 bg-neutral-100 rounded-md">
          {productFilter.map((item, index) => (
            <button
              key={index.toString()}
              type="button"
              className={`flex flex-col w-24.75 h-7.75 items-center justify-center py-1.5 rounded-sm text-body-xs font-bold z-20 ${filterValue === item.value ? "text-neutral-900" : "text-neutral-500"}`}
              onClick={() => setFilterValue(item.value)}
            >
              {item.label}
            </button>
          ))}

          <motion.div
            initial={{
              x: 0,
            }}
            animate={{
              x: `${productFilter.findIndex((item) => item.value === filterValue) * 100}%`,
            }}
            transition={{
              ease: "easeOut",
            }}
            className="absolute z-10 w-24.75 h-7.75 rounded-sm bg-white"
          />
        </Flex>

        <button
          type="button"
          className="flex items-center justify-center gap-1 py-[6.5px] px-3 bg-primary-500 rounded-md hover:opacity-80 duration-300 transition-opacity"
          onClick={() => route.push("/cms/products/create")}
        >
          <AddCircle size={14} color="white" />

          <p className="text-body-xs font-bold text-white">Create Item</p>
        </button>
      </Flex>
    </CMSContainer>
  );
};

export default CMSProducts;
