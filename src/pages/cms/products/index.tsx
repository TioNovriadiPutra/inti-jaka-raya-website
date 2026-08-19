import { CMSContainer, EmptyState, Flex } from "@/components/shared";
import { productFilter } from "@/utils/constant";
import {
  AddCircle,
  ArrowLeft2,
  ArrowRight2,
  More,
  SearchNormal1,
} from "iconsax-reactjs";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/router";
import { useProductFilter } from "@/stores/page.store";
import useProductController from "@/controllers/product.controller";
import { Ring2 } from "ldrs/react";
import "ldrs/react/Ring2.css";

const CMSProducts = () => {
  const [page, setPage] = useState(1);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const openMenuRef = useRef<HTMLDivElement>(null);

  const filter = useProductFilter();

  const route = useRouter();

  const { control } = useForm({
    defaultValues: {
      search: "",
    },
  });

  const { useGetProductsService } = useProductController();

  const { finalData, isLoading } = useGetProductsService(page, () =>
    setOpenMenu(null),
  );

  useEffect(() => {
    if (openMenu === null) return;

    const handleClickOutside = (event: PointerEvent) => {
      if (
        openMenuRef.current &&
        !openMenuRef.current.contains(event.target as Node)
      ) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [openMenu]);

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
              className={`flex flex-col w-24.75 h-7.75 items-center justify-center py-1.5 rounded-sm text-body-xs font-bold z-20 ${filter.filter.value === item.value ? "text-neutral-900" : "text-neutral-500"}`}
              onClick={() => filter.setFilter(item)}
            >
              {item.label}
            </button>
          ))}

          <motion.div
            initial={{
              x: 0,
            }}
            animate={{
              x: `${productFilter.findIndex((item) => item.value === filter.filter.value) * 100}%`,
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

      <Flex className="bg-white border border-neutral-200 rounded-lg grow basis-0">
        <Flex className="p-6 gap-1.5">
          <h5 className="font-bold text-neutral-900">Products</h5>

          <p className="text-body-xs text-neutral-500">
            Manage your items description
          </p>
        </Flex>

        {isLoading ? (
          <Flex className="flex-1 px-6 pb-6">
            <Flex className="flex-1 border border-neutral-200 rounded-lg">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-b-neutral-200">
                    <th className="px-4 text-body-xs font-semibold text-neutral-500 text-left">
                      Code
                    </th>

                    <th className="px-4 text-body-xs font-semibold text-neutral-500 text-left">
                      Item
                    </th>

                    <th className="px-4 text-body-xs font-semibold text-neutral-500 text-left">
                      Status
                    </th>

                    <th className="w-25 h-12" />
                  </tr>
                </thead>
              </table>

              <Flex className="flex-1 items-center justify-center">
                <Ring2
                  size="30"
                  stroke="3"
                  strokeLength="0.25"
                  bgOpacity="0.1"
                  speed="0.8"
                  color="var(--neutral-900)"
                />
              </Flex>
            </Flex>
          </Flex>
        ) : (
          <Flex className="grow basis-0 px-6 pb-6">
            <Flex className="border border-neutral-200 rounded-lg">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-b-neutral-200">
                    <th className="px-4 text-body-xs font-semibold text-neutral-500 text-left">
                      Code
                    </th>

                    <th className="px-4 text-body-xs font-semibold text-neutral-500 text-left">
                      Item
                    </th>

                    <th className="px-4 text-body-xs font-semibold text-neutral-500 text-center">
                      Status
                    </th>

                    <th className="w-25 h-12" />
                  </tr>
                </thead>

                <tbody>
                  {finalData.data.map((item, index) => (
                    <tr
                      key={index.toString()}
                      className={`${index < finalData.data.length - 1 ? "border-b border-b-neutral-200" : ""}`}
                    >
                      {item.row.map((item2, index2) => (
                        <td
                          key={index2.toString()}
                          className="px-4 py-[18.5px] text-body-xs text-neutral-900"
                        >
                          {index2 === 2 ? (
                            <Flex className="items-center">
                              <Flex
                                className={`px-2.5 py-0.5 border ${item2 === "Hidden" ? "bg-red-50 border-red-400" : "bg-green-50 border-green-400"} rounded-full`}
                              >
                                <p
                                  className={`text-body-xs font-bold ${item2 === "Hidden" ? "text-red-400" : "text-green-400"}`}
                                >
                                  {item2}
                                </p>
                              </Flex>
                            </Flex>
                          ) : (
                            item2
                          )}
                        </td>
                      ))}

                      {item.actions && (
                        <td className="w-25 min-h-12">
                          <Flex className="h-full items-center justify-center">
                            <Flex
                              ref={openMenu === index ? openMenuRef : null}
                              className="relative"
                            >
                              <button
                                type="button"
                                className="flex size-9 items-center justify-center rounded-lg hover:bg-neutral-100 duration-300 transition-colors"
                                onClick={() => {
                                  if (openMenu === index) {
                                    setOpenMenu(null);
                                  } else {
                                    setOpenMenu(index);
                                  }
                                }}
                              >
                                <More size={16} color="var(--neutral-900)" />
                              </button>

                              <AnimatePresence>
                                {openMenu === index && (
                                  <motion.div
                                    initial={{
                                      scale: 0,
                                      opacity: 0,
                                    }}
                                    animate={{
                                      opacity: 1,
                                      scale: 1,
                                    }}
                                    exit={{
                                      scale: 0,
                                      opacity: 0,
                                    }}
                                    className="flex flex-col absolute z-50 top-[110%] right-0 p-2 bg-white rounded-[14px] shadow-[1px_1px_24px_rgba(0,0,0,0.1)] min-w-29 origin-top-right"
                                  >
                                    {item.actions.map((action, idxAction) => (
                                      <button
                                        key={idxAction.toString()}
                                        type="button"
                                        className="flex px-2.5 py-3 rounded-lg hover:bg-neutral-100 duration-300 transition-colors text-body-s text-neutral-700 items-center justify-between"
                                        onClick={action.onClick}
                                      >
                                        {action.label}

                                        {action.isLoading && (
                                          <Ring2
                                            size="14"
                                            stroke="2"
                                            strokeLength="0.25"
                                            bgOpacity="0.1"
                                            speed="0.8"
                                            color="var(--neutral-900)"
                                          />
                                        )}
                                      </button>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </Flex>
                          </Flex>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>

              {finalData.data.length === 0 && (
                <EmptyState
                  title="Product data is empty"
                  description="There are no products to display. Create a new item to add your first product."
                />
              )}
            </Flex>
          </Flex>
        )}

        <Flex className="flex-row! items-center justify-between px-6 py-4 bg-neutral-50">
          <p className="text-body-xs text-neutral-500">
            Showing{" "}
            <span className="font-bold">
              {finalData.metaData.count === 0
                ? 0
                : finalData.metaData.page * 10 - 9}
              -
              {finalData.metaData.page * 10 >= finalData.metaData.count
                ? finalData.metaData.count
                : finalData.metaData.page * 10}
            </span>{" "}
            of <span className="font-bold">{finalData.metaData.count}</span>
          </p>

          <Flex className="flex-row! gap-1">
            <button
              type="button"
              disabled={page === 1}
              className={`flex size-6 border border-neutral-200 rounded-lg items-center justify-center ${page == 1 ? "cursor-not-allowed! bg-neutral-200 opacity-80" : "bg-white hover:bg-neutral-200 duration-300 transition-colors"}`}
              onClick={() => setPage((prev) => prev - 1)}
            >
              <ArrowLeft2 size={14} color="var(--neutral-900)" />
            </button>

            <button
              type="button"
              disabled={
                finalData.metaData.page * 10 >= finalData.metaData.count
              }
              className={`flex size-6 border border-neutral-200 rounded-lg items-center justify-center ${finalData.metaData.page * 10 >= finalData.metaData.count ? "cursor-not-allowed! bg-neutral-200 opacity-80" : "bg-white hover:bg-neutral-200 duration-300 transition-colors"}`}
              onClick={() => setPage((prev) => prev + 1)}
            >
              <ArrowRight2 size={14} color="var(--neutral-900)" />
            </button>
          </Flex>
        </Flex>
      </Flex>
    </CMSContainer>
  );
};

export default CMSProducts;
