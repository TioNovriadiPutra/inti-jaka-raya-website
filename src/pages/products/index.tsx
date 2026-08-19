import { Breadcrumb, DropdownModal, Flex } from "@/components/shared";
import { Controller, useForm, useWatch } from "react-hook-form";
import { ArrowDown, SearchIcon } from "../../../public";
import { dummyData, filterData } from "@/utils/constant";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

type FormValues = {
  search: string;
  searchCategory: string;
  searchIndustry: string;
  searchApplication: string;
  searchDivision: string;
};

const filterSearchFields: Record<string, keyof FormValues> = {
  category: "searchCategory",
  industry: "searchIndustry",
  application: "searchApplication",
  division: "searchDivision",
};

const Products = () => {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [isContentTypeOpen, setIsContentTypeOpen] = useState(false);
  const contentTypeDropdownRef = useRef<HTMLDivElement>(null);
  const [contentType, setContentType] = useState<"Products" | "Case Studies">(
    "Products",
  );
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string>
  >({});

  const activeFilter = openDropdown === null ? null : filterData[openDropdown];
  const activeFilterKey = activeFilter?.title.toLowerCase();
  const activeFilterSearchField = activeFilterKey
    ? filterSearchFields[activeFilterKey]
    : "searchCategory";

  const router = useRouter();

  const { control } = useForm<FormValues>({
    defaultValues: {
      search: "",
      searchCategory: "",
      searchIndustry: "",
      searchApplication: "",
      searchDivision: "",
    },
  });

  const activeFilterSearch = useWatch({
    control,
    name: activeFilterSearchField,
  });
  const visibleFilterOptions = activeFilter
    ? activeFilter.data.filter((option) =>
        option.toLowerCase().includes(activeFilterSearch.toLowerCase()),
      )
    : [];

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

  const updateSelectedFilter = (key: string, value: string) => {
    setSelectedFilters((currentFilters) => {
      const nextFilters = { ...currentFilters };

      if (value) {
        nextFilters[key] = value;
      } else {
        delete nextFilters[key];
      }

      return nextFilters;
    });
  };

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
            <Flex className="flex-row! gap-3.5 overflow-x-auto overflow-y-visible lg:flex-1">
              {filterData.map((filter, index) => {
                const isOpen = openDropdown === index;

                return (
                  <Flex key={filter.title} className="shrink-0">
                    <button
                      type="button"
                      className="flex shrink-0 items-center px-4.5 py-3 border border-neutral-200 rounded-3xl gap-2"
                      aria-expanded={isOpen}
                      onClick={() => {
                        setIsContentTypeOpen(false);
                        setOpenDropdown((currentDropdown) =>
                          currentDropdown === index ? null : index,
                        );
                      }}
                    >
                      <p className="text-body-s font-semibold text-neutral-800">
                        {filter.title}
                      </p>

                      <span
                        className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                      >
                        <ArrowDown />
                      </span>
                    </button>
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
                    setOpenDropdown(null);
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
                          setContentType(option);
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
            {dummyData.map((item, index) => (
              <button
                type="button"
                key={index.toString()}
                className="flex flex-col"
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

          <button
            type="button"
            className="px-4.5 py-3 border border-neutral-200 rounded-3xl text-body-s font-semibold text-neutral-600 shadow-lg self-center"
          >
            Show More
          </button>
        </Flex>
      </Flex>

      <DropdownModal
        control={control}
        name={activeFilterSearchField}
        isOpen={activeFilter !== null}
        onClose={() => setOpenDropdown(null)}
        placeholder={
          activeFilter
            ? `Search ${activeFilter.title.toLowerCase()}...`
            : "Search here..."
        }
      >
        {visibleFilterOptions.map((option) => {
          const isSelected =
            activeFilterKey !== undefined &&
            selectedFilters[activeFilterKey] === option;

          return (
            <button
              key={option}
              type="button"
              className={`flex px-2.5 py-3 text-left text-body-s rounded-lg ${
                isSelected ? "bg-accent-50 text-accent-600" : "text-neutral-600"
              }`}
              onClick={() => {
                if (!activeFilterKey) return;

                updateSelectedFilter(activeFilterKey, isSelected ? "" : option);
                setOpenDropdown(null);
              }}
            >
              {option}
            </button>
          );
        })}

        {activeFilter && visibleFilterOptions.length === 0 && (
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
