import useTranslation from "@/hooks/useTranslation";
import Reveal from "@/components/shared/Reveal";
import { catalogStyles as styles } from "@/styles/ui";
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
  const { t } = useTranslation();
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
    <div className={styles.filterActions}>
      <button
        type="button"
        className={styles.cancelButton}
        onClick={closeFilter}
      >{t("Cancel")}</button>
      <button
        type="button"
        className={styles.applyButton}
        onClick={applyFilters}
      >{t("Apply")}</button>
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
    <main className={styles.page}>
      {/* Section 1 */}
      <Flex className={styles.breadcrumb}>
        <Breadcrumb pages={["Home", "Products"]} color="dark" />
      </Flex>

      {/* Section 2 */}
      <Flex className={styles.container}>
        <Reveal as="header" className={styles.header}>
          <p className={styles.eyebrow}><span />{t("Catalog")}</p>
          <h1 className={styles.heading}>{t("Discover the Perfect")}{" "}<br className="hidden md:flex" />
          <span className={styles.headingAccent}>{t("Solution for Your Needs.")}</span>
        </h1>
          <p className={styles.intro}>{t("Explore repair materials, protective coatings and industrial case studies.")}</p>
        </Reveal>

        <Flex className={styles.catalog}>
          <Flex className={styles.search}>
            <Controller
              control={control}
              name="search"
              render={({ field }) => (
                <input
                  {...field}
                  aria-label={t("Search")} placeholder={t("Search here...")}
                  className={styles.searchInput}
                />
              )}
            />

            <span className={styles.searchIcon} aria-hidden="true">
              <SearchIcon />
            </span>
          </Flex>

          <Flex className={styles.toolbar}>
            <Flex className={styles.filters}>
              {filterData.map((filter, index) => {
                const isOpen = openDropdown === index;

                return (
                  <Flex
                    key={filter.title}
                    className={styles.filter}
                  >
                    <button
                      type="button"
                      className={styles.filterButton}
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
                        <p className={styles.filterLabel}>
                          {t(filter.title)}
                        </p>
                      )}

                      <Flex className="flex-row! items-center">
                        {selectedFilters[filter.title].length > 0 && (
                          <span>
                            <Flex className={styles.filterCount}>
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
                        <motion.div className={"hidden lg:flex " + styles.popover} initial={{ opacity: 0, y: 8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 4, scale: 0.98 }} transition={{ duration: 0.18, ease: "easeOut" }}>
                          <Flex className={styles.popoverSearch}>
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
                                      ? `${t("Search")} ${t(activeFilter.title).toLowerCase()}...`
                                      : t("Search here...")
                                  }
                                  className={styles.popoverInput}
                                />
                              )}
                            />
                          </Flex>

                          <Flex className={styles.options}>
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
                                  className={styles.option}
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
                                    <Flex className={styles.checkbox} />
                                  )}

                                  {option.label}
                                </button>
                              );
                            })}

                            {activeFilter && filteredData.length === 0 && (
                              <p className="px-2.5 py-3 text-body-xs text-neutral-400">
                                {activeFilter.data.length === 0
                                  ? t("No options available")
                                  : t("No matching options")}
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

            <Flex className={styles.resultsTools}>
              <Flex className={styles.resultCount}>
                <p className="text-body-xs text-neutral-400">{t("Showing")}</p>

                <p className="text-body-xs font-semibold text-neutral-800">{catalogLoading ? "—" : catalogData.length} {t("Items")}</p>
              </Flex>

              <Flex className={styles.toolDivider} />

              <Flex ref={contentTypeDropdownRef} className={styles.contentType}>
                <button
                  type="button"
                  className={styles.filterButton}
                  aria-expanded={isContentTypeOpen}
                  onClick={() => {
                    closeFilter();
                    setIsContentTypeOpen((currentState) => !currentState);
                  }}
                >
                  <p className={styles.filterLabel}>
                    {t(contentType)}
                  </p>

                  <span
                    className={`transition-transform ${isContentTypeOpen ? "rotate-180" : ""}`}
                  >
                    <ArrowDown />
                  </span>
                </button>

                {isContentTypeOpen && (
                  <Flex className={styles.typeMenu}>
                    {(["Products", "Case Studies"] as const).map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`${styles.typeOption} ${
                          contentType === option
                            ? styles.selectedType
                            : styles.unselectedType
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
                        {t(option)}
                      </button>
                    ))}
                  </Flex>
                )}
              </Flex>
            </Flex>
          </Flex>

          <Flex className={styles.divider} />

          <div className={styles.grid}>
            {!catalogLoading && catalogData.length === 0 && (
              <div
                role="status"
                className={styles.empty}
              >
                <p className="text-body-s font-semibold text-neutral-600">{t(`No ${contentType.toLowerCase()} found`)}</p>
                <p className="text-body-xs text-neutral-400">{t("There are no items to display at the moment.")}</p>
              </div>
            )}

            {catalogLoading
              ? Array.from({ length: 10 }).map((_, index) => (
                  <div
                    key={index.toString()}
                    className={styles.card}
                  >
                    <div className={styles.skeletonMedia} />
                    <div className={styles.skeletonContent}><span /><span /></div>
                  </div>
                ))
              : catalogData.map((item, index) => (
                  <Reveal as="article" key={index.toString()} className={styles.cardReveal} delay={(index % 3) * 0.06}>
                  <button
                    type="button"
                    key={index.toString()}
                    className={styles.card}
                    onClick={() => {
                      router.push(
                        contentType === "Products"
                          ? `/products/${item.id}`
                          : `/products/article/${item.id}`,
                      );
                    }}
                  >
                    <div className={styles.cardMedia} data-type={contentType}>
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={item.width}
                      height={item.height}
                      className={styles.image}
                    />
                    </div>

                    <Flex className={styles.cardContent}>
                      <p className={styles.tag}>
                        {item.tag}
                      </p>

                      <p className={styles.cardTitle}>
                        {item.title}
                      </p>
                    <span className={styles.cardFooter}>{t("View details")}<span aria-hidden="true">↗</span></span>
                    </Flex>
                  </button>
                  </Reveal>
                ))}
          </div>

          {!catalogLoading && catalogData.length > 10 && (
            <button
              type="button"
              className={styles.showMore}
              onClick={() => setCurrPage((prev) => prev + 1)}
            >{t("Show More")}</button>
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
            ? `${t("Search")} ${t(activeFilter.title).toLowerCase()}...`
            : t("Search here...")
        }
        className={"lg:hidden " + styles.mobileModal}
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
              className={styles.option}
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
                <Flex className={styles.checkbox} />
              )}

              {option.label}
            </button>
          );
        })}

        {activeFilter && filteredData.length === 0 && (
          <p className="px-2.5 py-3 text-body-xs text-neutral-400">
            {activeFilter.data.length === 0
              ? t("No options available")
              : t("No matching options")}
          </p>
        )}
      </DropdownModal>
    </main>
  );
};

export default Products;
