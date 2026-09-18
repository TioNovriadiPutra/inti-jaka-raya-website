import { Breadcrumb, DropdownModal, Flex } from "@/components/shared";
import { Controller, useForm, useWatch } from "react-hook-form";
import { ArrowDown, SearchIcon } from "../../../public";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import useProductController from "@/controllers/product.controller";
import { DropdownType } from "@/interfaces/form.interface";
import { TickSquare } from "iconsax-reactjs";
import { AnimatePresence, motion } from "motion/react";
import { Ring2 } from "ldrs/react";
import "ldrs/react/Ring2.css";
import useCatalogController from "@/controllers/catalog.controller";

type FormValues = {
  search: string;
  searchFilter: string;
};

const Products = () => {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [isContentTypeOpen, setIsContentTypeOpen] = useState(false);
  const contentTypeDropdownRef = useRef<HTMLDivElement>(null);
  const [contentType, setContentType] = useState<"Products" | "Case Studies">(
    "Products",
  );
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({
    Category: [],
    Industry: [],
    Application: [],
    Division: [],
  });
  const [currPage, setCurrPage] = useState<number>(1);
  const [draftFilters, setDraftFilters] = useState(selectedFilters);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { control, setValue, reset } = useForm<FormValues>({
    defaultValues: {
      search: "",
      searchFilter: "",
    },
  });

  const search = useWatch({ control, name: "search" });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setCurrPage(1);
    }, 400);
    searchTimeoutRef.current = timeout;

    return () => clearTimeout(timeout);
  }, [search]);

  const { useGetProductFilterDropdown } = useProductController();
  const { useGetCatalogsService } = useCatalogController();

  const { finalData: filterData, isLoading: filterLoading } =
    useGetProductFilterDropdown();
  const { finalData: catalogData, isLoading: catalogLoading } =
    useGetCatalogsService(
      currPage,
      contentType.toLowerCase().trim().replace(/\s+/g, "_"),
      debouncedSearch,
      selectedFilters,
    );

  const activeFilter: { title: string; data: DropdownType[] } | null =
    openDropdown === null ? null : filterData[openDropdown];

  const router = useRouter();

  const closeFilter = () => {
    setOpenDropdown(null);
    setDraftFilters(selectedFilters);
    setValue("searchFilter", "");
  };

  const applyFilters = () => {
    setSelectedFilters(draftFilters);
    setCurrPage(1);
    setOpenDropdown(null);
    setValue("searchFilter", "");
  };

  const filterActions = (
    <div className="flex shrink-0 gap-2 border-t border-neutral-200 p-2">
      <button
        type="button"
        className="flex-1 rounded-3xl border border-neutral-200 px-4 py-3 text-body-s font-semibold text-neutral-600"
        onClick={closeFilter}
      >
        Cancel
      </button>
      <button
        type="button"
        className="flex-1 rounded-3xl bg-accent-600 px-4 py-3 text-body-s font-semibold text-white"
        onClick={applyFilters}
      >
        Apply
      </button>
    </div>
  );

  const searchFilter = useWatch({
    control,
    name: "searchFilter",
  });

  const filteredData = useMemo(() => {
    const keyword = searchFilter.trim().toLowerCase();

    if (!activeFilter) return [];
    if (!keyword) return activeFilter.data;

    return activeFilter.data.filter((item) =>
      item.label.toLowerCase().includes(keyword),
    );
  }, [activeFilter, searchFilter]);

  useEffect(() => {
    if (!isContentTypeOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        contentTypeDropdownRef.current &&
        !contentTypeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsContentTypeOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isContentTypeOpen]);

  return (
    <Flex className="grow basis-0 bg-white">
      {/* Section 1 */}
      <Flex className="px-3.5 md:px-15 py-6">
        <Breadcrumb pages={["Home", "Products"]} color="dark" />
      </Flex>

      {/* Section 2 */}
      <Flex className="px-3.5 md:px-15 pt-3.5 pb-16 gap-10">
        <h3 className="font-medium text-neutral-800 text-center">
          Discover the Perfect <br className="hidden md:flex" />
          <span className="font-bold text-neutral-400">
            Solution for Your Needs.
          </span>
        </h3>

        <Flex className="gap-6">
          <Flex className="flex-row! items-center px-6 py-3 border border-neutral-200 rounded-3xl md:w-109 md:self-center lg:mb-10">
            <Controller
              control={control}
              name="search"
              render={({ field }) => (
                <input
                  {...field}
                  placeholder="Search here..."
                  className="flex-1 text-body-xs text-neutral-600 outline-none"
                />
              )}
            />

            <button type="button">
              <SearchIcon />
            </button>
          </Flex>

          <Flex className="gap-3.5 md:gap-6 lg:flex-row!">
            <Flex className="flex-row! gap-3.5 overflow-x-auto lg:overflow-x-visible overflow-y-visible lg:flex-1">
              {filterData.map((filter, index) => {
                const isOpen = openDropdown === index;

                return (
                  <Flex
                    key={filter.title}
                    className="relative shrink-0 overflow-x-visible"
                  >
                    <button
                      type="button"
                      className="flex shrink-0 items-center px-4.5 py-3 border border-neutral-200 rounded-3xl gap-2"
                      disabled={filterLoading}
                      aria-expanded={isOpen}
                      onClick={() => {
                        setIsContentTypeOpen(false);
                        setDraftFilters(selectedFilters);
                        setValue("searchFilter", "");

                        setOpenDropdown((currentDropdown) =>
                          currentDropdown === index ? null : index,
                        );
                      }}
                    >
                      {filterLoading ? (
                        <Ring2
                          size="22"
                          stroke="3"
                          strokeLength="0.25"
                          bgOpacity="0.1"
                          speed="0.8"
                          color="var(--neutral-900)"
                        />
                      ) : (
                        <p className="text-body-s font-semibold text-neutral-800">
                          {filter.title}
                        </p>
                      )}

                      <Flex className="flex-row! items-center">
                        {selectedFilters[filter.title].length > 0 && (
                          <span>
                            <Flex className="bg-accent-400 size-6 rounded-full items-center justify-center">
                              <p className="text-body-xs text-white">
                                {selectedFilters[filter.title].length}
                              </p>
                            </Flex>
                          </span>
                        )}

                        <span
                          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                        >
                          <ArrowDown />
                        </span>
                      </Flex>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div className="hidden lg:flex flex-col absolute z-999 min-w-64 max-w-90 max-h-112.5 bg-white p-2 rounded-[14px] border border-neutral-200 top-[calc(100%+14px)]">
                          <Flex className="flex-row! items-center px-2.5 py-3.25 border-b border-b-neutral-200 gap-4">
                            <SearchIcon />

                            <Controller
                              control={control}
                              name="searchFilter"
                              render={({ field }) => (
                                <input
                                  {...field}
                                  type="search"
                                  placeholder={
                                    activeFilter
                                      ? `Search ${activeFilter.title.toLowerCase()}...`
                                      : "Search here..."
                                  }
                                  className="min-w-0 flex-1 text-body-s text-neutral-600 outline-none"
                                />
                              )}
                            />
                          </Flex>

                          <Flex className="overflow-y-auto">
                            {filteredData.map((option, index) => {
                              const isSelected = activeFilter
                                ? draftFilters[activeFilter.title].some(
                                    (item) => option.value === item,
                                  )
                                : false;

                              return (
                                <button
                                  key={index.toString()}
                                  type="button"
                                  className="flex px-2.5 py-3 text-left text-body-s gap-2.5 items-center"
                                  onClick={() => {
                                    setDraftFilters((prev) => {
                                      if (isSelected) {
                                        return {
                                          ...prev,
                                          [activeFilter!.title]: prev[
                                            activeFilter!.title
                                          ].filter(
                                            (itm) => itm != option.value,
                                          ),
                                        };
                                      }

                                      return {
                                        ...prev,
                                        [activeFilter!.title]: [
                                          ...prev[activeFilter!.title],
                                          option.value,
                                        ],
                                      };
                                    });
                                  }}
                                >
                                  {isSelected ? (
                                    <TickSquare
                                      size={24}
                                      color="var(--accent-600)"
                                      variant="Bold"
                                    />
                                  ) : (
                                    <Flex className="size-6 bg-neutral-200 rounded-lg" />
                                  )}

                                  {option.label}
                                </button>
                              );
                            })}

                            {activeFilter && filteredData.length === 0 && (
                              <p className="px-2.5 py-3 text-body-xs text-neutral-400">
                                {activeFilter.data.length === 0
                                  ? "No options available"
                                  : "No matching options"}
                              </p>
                            )}
                          </Flex>
                          {filterActions}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Flex>
                );
              })}
            </Flex>

            <Flex className="flex-row! items-center justify-end gap-3.5">
              <Flex className="items-end">
                <p className="text-body-xs text-neutral-400">Showing</p>

                <p className="text-body-xs font-semibold text-neutral-800">
                  120 Items
                </p>
              </Flex>

              <Flex className="w-px h-full bg-neutral-200" />

              <Flex ref={contentTypeDropdownRef} className="relative shrink-0">
                <button
                  type="button"
                  className="flex shrink-0 items-center px-4.5 py-3 border border-neutral-200 rounded-3xl gap-2"
                  aria-expanded={isContentTypeOpen}
                  onClick={() => {
                    closeFilter();
                    setIsContentTypeOpen((currentState) => !currentState);
                  }}
                >
                  <p className="text-body-s font-semibold text-neutral-800">
                    {contentType}
                  </p>

                  <span
                    className={`transition-transform ${isContentTypeOpen ? "rotate-180" : ""}`}
                  >
                    <ArrowDown />
                  </span>
                </button>

                {isContentTypeOpen && (
                  <Flex className="absolute z-50 top-full right-0 mt-2 min-w-44 p-2 bg-white border border-neutral-200 rounded-[14px] shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                    {(["Products", "Case Studies"] as const).map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`flex px-2.5 py-3 text-left text-body-s rounded-lg ${
                          contentType === option
                            ? "bg-accent-50 text-accent-600"
                            : "text-neutral-600"
                        }`}
                        onClick={() => {
                          if (option !== contentType) {
                            if (searchTimeoutRef.current !== null) {
                              clearTimeout(searchTimeoutRef.current);
                              searchTimeoutRef.current = null;
                            }

                            const emptyFilters = Object.fromEntries(
                              Object.keys(selectedFilters).map((key) => [key, []]),
                            );

                            setSelectedFilters(emptyFilters);
                            setDraftFilters(emptyFilters);
                            reset({ search: "", searchFilter: "" });
                            setDebouncedSearch("");
                            setCurrPage(1);
                            setOpenDropdown(null);
                            setContentType(option);
                          }
                          setIsContentTypeOpen(false);
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </Flex>
                )}
              </Flex>
            </Flex>
          </Flex>

          <Flex className="h-px bg-neutral-200" />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {!catalogLoading && catalogData.length === 0 && (
              <div
                role="status"
                className="col-span-full flex flex-col items-center justify-center gap-2 rounded-lg bg-neutral-50 px-6 py-16 text-center"
              >
                <p className="text-body-s font-semibold text-neutral-600">
                  No {contentType.toLowerCase()} found
                </p>
                <p className="text-body-xs text-neutral-400">
                  There are no items to display at the moment.
                </p>
              </div>
            )}

            {catalogLoading
              ? Array.from({ length: 10 }).map((_, index) => (
                  <div
                    key={index.toString()}
                    className="flex flex-col border border-neutral-200 rounded-lg"
                  >
                    <div className="w-full h-62.25 rounded-t-lg bg-neutral-100 animate-pulse motion-reduce:animate-none" />
                  </div>
                ))
              : catalogData.map((item, index) => (
                  <button
                    type="button"
                    key={index.toString()}
                    className="flex flex-col border border-neutral-200 rounded-lg"
                    onClick={() => {
                      router.push(`/products/article/${index + 1}`);
                    }}
                  >
                    <Image
                      src={item.image}
                      alt={`Product ${index + 1}`}
                      width={item.width}
                      height={item.height}
                      className="w-full h-62.25 object-cover object-center rounded-lg"
                    />

                    <Flex className="p-3.5 gap-0.5 w-full items-start">
                      <p className="text-body-xs font-semibold text-accent-600">
                        {item.tag}
                      </p>

                      <p className="text-body-xs font-semibold text-neutral-700">
                        {item.title}
                      </p>
                    </Flex>
                  </button>
                ))}
          </div>

          {!catalogLoading && catalogData.length > 10 && (
            <button
              type="button"
              className="px-4.5 py-3 border border-neutral-200 rounded-3xl text-body-s font-semibold text-neutral-600 shadow-lg self-center"
              onClick={() => setCurrPage((prev) => prev + 1)}
            >
              Show More
            </button>
          )}
        </Flex>
      </Flex>

      <DropdownModal
        control={control}
        name={"searchFilter"}
        isOpen={activeFilter !== null}
        onClose={closeFilter}
        footer={filterActions}
        placeholder={
          activeFilter
            ? `Search ${activeFilter.title.toLowerCase()}...`
            : "Search here..."
        }
        className="lg:hidden"
      >
        {filteredData.map((option, index) => {
          const isSelected = activeFilter
            ? draftFilters[activeFilter.title].some(
                (item) => option.value === item,
              )
            : false;

          return (
            <button
              key={index.toString()}
              type="button"
              className="flex px-2.5 py-3 text-left text-body-s gap-2.5 items-center"
              onClick={() => {
                setDraftFilters((prev) => {
                  if (isSelected) {
                    return {
                      ...prev,
                      [activeFilter!.title]: prev[activeFilter!.title].filter(
                        (itm) => itm != option.value,
                      ),
                    };
                  }

                  return {
                    ...prev,
                    [activeFilter!.title]: [
                      ...prev[activeFilter!.title],
                      option.value,
                    ],
                  };
                });
              }}
            >
              {isSelected ? (
                <TickSquare
                  size={24}
                  color="var(--accent-600)"
                  variant="Bold"
                />
              ) : (
                <Flex className="size-6 bg-neutral-200 rounded-lg" />
              )}

              {option.label}
            </button>
          );
        })}

        {activeFilter && filteredData.length === 0 && (
          <p className="px-2.5 py-3 text-body-xs text-neutral-400">
            {activeFilter.data.length === 0
              ? "No options available"
              : "No matching options"}
          </p>
        )}
      </DropdownModal>
    </Flex>
  );
};

export default Products;
