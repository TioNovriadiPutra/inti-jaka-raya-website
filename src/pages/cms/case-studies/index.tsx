import { CMSContainer, EmptyState, Flex } from "@/components/shared";
import { caseStudyFilter } from "@/utils/constant";
import {
  AddCircle,
  ArrowLeft2,
  ArrowRight2,
  More,
  SearchNormal1,
} from "iconsax-reactjs";
import { Controller, useForm } from "react-hook-form";
import { AnimatePresence, motion } from "motion/react";
import { useCaseStudyFilter } from "@/stores/page.store";
import { useRouter } from "next/router";
import useCaseStudyController from "@/controllers/caseStudy.controller";
import { useEffect, useRef, useState } from "react";
import { Ring2 } from "ldrs/react";
import "ldrs/react/Ring2.css";

const CMSCaseStudies = () => {
  const [page, setPage] = useState(1);
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const filter = useCaseStudyFilter();

  const openMenuRef = useRef<HTMLDivElement>(null);

  const route = useRouter();

  const { control } = useForm({
    defaultValues: {
      search: "",
    },
  });

  const { useGetCaseStudiesService } = useCaseStudyController();

  const { finalData, isLoading } = useGetCaseStudiesService(page, () =>
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
      <Flex className="gap-2 border-b border-neutral-200 pb-6">
        <h1 className="text-h5-mobile font-extrabold tracking-tight text-primary-700 md:text-h4-desktop">Case Studies</h1>

        <p className="text-small leading-relaxed text-neutral-500">
          Manage your case study description
        </p>
      </Flex>
      <Flex className="w-full min-w-0 flex-row! items-center gap-3 self-end rounded-xl border border-neutral-200 bg-white px-4 py-3 transition-colors focus-within:border-primary-300 focus-within:ring-3 focus-within:ring-primary-50 sm:max-w-84">
        <SearchNormal1 size={20} color="var(--neutral-400)" />

        <Controller
          control={control}
          name="search"
          render={({ field }) => (
            <input
              {...field}
              placeholder="Search..."
              className="min-w-0 w-full flex-1 bg-transparent text-small text-neutral-700 outline-none placeholder:text-neutral-400"
            />
          )}
        />
      </Flex>

      <Flex className="min-w-0 flex-col! items-stretch justify-between gap-4 lg:flex-row! lg:items-center">
        <Flex className="relative isolate max-w-full self-start flex-row! rounded-xl border border-neutral-200 bg-white p-1.25 max-sm:overflow-x-auto">
          {caseStudyFilter.map((item, index) => (
            <button
              key={index.toString()}
              type="button"
              className={`relative z-20 flex h-10 w-22 shrink-0 items-center justify-center whitespace-nowrap rounded-lg py-2 text-small font-bold transition-colors motion-reduce:transition-none sm:w-24.75 ${filter.filter.value === item.value ? "text-white" : "text-neutral-500"}`}
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
              x: `${caseStudyFilter.findIndex((item) => item.value === filter.filter.value) * 100}%`,
            }}
            transition={{
              ease: "easeOut",
            }}
            className="absolute z-10 h-10 w-22 rounded-lg bg-primary-600 shadow-sm sm:w-24.75"
          />
        </Flex>

        <button
          type="button"
          className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-primary-600 bg-primary-600 px-5 py-3 text-white shadow-[0_6px_16px_-10px_var(--primary-900)] transition-colors hover:bg-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600 motion-reduce:transition-none"
          onClick={() => route.push("/cms/case-studies/create")}
        >
          <AddCircle size={14} color="white" />

          <p className="whitespace-nowrap text-small font-bold text-white">Create Item</p>
        </button>
      </Flex>

      <Flex className="min-w-0 rounded-2xl border border-neutral-200 bg-white shadow-[0_8px_30px_-24px_var(--primary-900)]">

        {isLoading ? (
          <Flex className="min-w-0 flex-1 px-3 pt-3 md:px-5 md:pt-5">
            <Flex className="min-h-80 min-w-0 flex-1 rounded-xl border border-neutral-200 max-lg:overflow-x-auto">
              <table className="w-full min-w-140 border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50/80">
                    <th className="px-4 py-4 text-left text-caption font-extrabold uppercase tracking-wider text-neutral-500">
                      Title
                    </th>

                    <th className="px-4 py-4 text-left text-caption font-extrabold uppercase tracking-wider text-neutral-500">
                      Industry
                    </th>

                    <th className="px-4 py-4 text-left text-caption font-extrabold uppercase tracking-wider text-neutral-500">
                      Status
                    </th>

                    <th className="h-13 w-16 bg-neutral-50/80" />
                  </tr>
                </thead>
              </table>

              <Flex className="min-h-64 flex-1 items-center justify-center">
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
          <Flex className="min-w-0 px-3 pt-3 md:px-5 md:pt-5">
            <Flex className="min-w-0 rounded-xl border border-neutral-200 max-lg:overflow-x-auto max-lg:pb-40">
              <table className="w-full min-w-140 border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50/80">
                    <th className="px-4 py-4 text-left text-caption font-extrabold uppercase tracking-wider text-neutral-500">
                      Title
                    </th>

                    <th className="px-4 py-4 text-left text-caption font-extrabold uppercase tracking-wider text-neutral-500">
                      Industry
                    </th>

                    <th className="px-4 py-4 text-center text-caption font-extrabold uppercase tracking-wider text-neutral-500">
                      Status
                    </th>

                    <th className="h-13 w-16 bg-neutral-50/80" />
                  </tr>
                </thead>

                <tbody>
                  {finalData.data.map((item, index) => (
                    <tr
                      key={index.toString()}
                      className={`transition-colors hover:bg-neutral-50/70 motion-reduce:transition-none ${index < finalData.data.length - 1 ? "border-b border-neutral-100" : ""}`}
                    >
                      {item.row.map((item2, index2) => (
                        <td
                          key={index2.toString()}
                          className="max-w-96 px-4 py-5 text-small leading-relaxed text-neutral-700 wrap-anywhere"
                        >
                          {index2 === 2 ? (
                            <Flex className="items-center">
                              <Flex
                                className={`inline-flex min-h-7 items-center justify-center whitespace-nowrap border px-3 py-1 ${item2 === "Hidden" ? "bg-neutral-50 border-neutral-200" : "bg-accent-50 border-accent-100"} rounded-full`}
                              >
                                <p
                                  className={`text-caption font-bold ${item2 === "Hidden" ? "text-neutral-500" : "text-accent-800"}`}
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
                        <td className="w-16 min-h-12 px-2">
                          <Flex className="h-full items-center justify-center">
                            <Flex
                              ref={openMenu === index ? openMenuRef : null}
                              className="relative"
                            >
                              <button
                                type="button"
                                className="flex size-10 items-center justify-center rounded-xl border border-transparent text-neutral-500 transition-colors hover:border-neutral-200 hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-accent-600 motion-reduce:transition-none"
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
                                    className="absolute right-0 top-[calc(100%+8px)] z-50 flex min-w-40 origin-top-right flex-col rounded-xl border border-neutral-200 bg-white p-1.5 shadow-xl shadow-primary-900/10"
                                  >
                                    {item.actions.map((action, idxAction) => (
                                      <button
                                        key={idxAction.toString()}
                                        type="button"
                                        className="flex min-h-11 items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-left text-small font-semibold text-neutral-600 transition-colors hover:bg-primary-50/40 hover:text-primary-600 motion-reduce:transition-none"
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
                  title="Case study data is empty"
                  description="There are no case studies to display. Create a new case to add your first case study."
                />
              )}
            </Flex>
          </Flex>
        )}

        <Flex className="mt-5 flex-row! flex-wrap items-center justify-between gap-4 rounded-b-2xl border-t border-neutral-100 bg-neutral-50/50 px-5 py-4">
          <p className="text-small leading-relaxed text-neutral-500">
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

          <Flex className="flex-row! gap-2">
            <button
              type="button"
              disabled={page === 1}
              className={`flex size-10 items-center justify-center rounded-xl border border-neutral-200 transition-colors motion-reduce:transition-none ${page == 1 ? "cursor-not-allowed! bg-neutral-100 opacity-50" : "bg-white hover:border-primary-100 hover:bg-primary-50/40"}`}
              onClick={() => setPage((prev) => prev - 1)}
            >
              <ArrowLeft2 size={14} color="var(--neutral-900)" />
            </button>

            <button
              type="button"
              disabled={
                finalData.metaData.page * 10 >= finalData.metaData.count
              }
              className={`flex size-10 items-center justify-center rounded-xl border border-neutral-200 transition-colors motion-reduce:transition-none ${finalData.metaData.page * 10 >= finalData.metaData.count ? "cursor-not-allowed! bg-neutral-100 opacity-50" : "bg-white hover:border-primary-100 hover:bg-primary-50/40"}`}
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

export default CMSCaseStudies;
