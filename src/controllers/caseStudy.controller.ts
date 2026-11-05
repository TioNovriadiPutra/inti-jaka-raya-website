import useHelper from "@/hooks/useHelper";
import { CaseStudyDetailPageType, CaseStudyInput } from "@/interfaces/caseStudy.interface";
import { DropdownType } from "@/interfaces/form.interface";
import {
  ApplicationDTO,
  CategoryDTO,
  DivisionDTO,
  IndustryDTO,
} from "@/interfaces/label.interface";
import { CaseStudyCarouselCardType, TableType } from "@/interfaces/page.interface";
import { ProductDTO } from "@/interfaces/product.interface";
import {
  createCaseStudy,
  deleteCaseStudy,
  getCaseStudies,
  getCaseStudyById,
  getCaseStudyCarousel,
  getPublicCaseStudyById,
  updateCaseStudy,
  updateCaseStudyStatus,
} from "@/services/caseStudy.service";
import { getDropdown } from "@/services/util.service";
import {
  useCaseStudyFilter,
  useDeleteModal,
  useLoading,
} from "@/stores/page.store";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useMemo } from "react";

const useCaseStudyController = () => {
  const isLoading = useLoading((state) => state.isLoading);
  const setDeleteModal = useDeleteModal((state) => state.setShowModal);
  const caseStudyFilter = useCaseStudyFilter((state) => state.filter);

  const route = useRouter();

  const { queryClient, onMutate, onSettled, onError, onSuccess } = useHelper();

  const useGetPublicCaseStudyByIdService = (id: number) => {
    const { data, isLoading, isError, refetch } = useQuery({
      queryKey: ["getPublicCaseStudyById", id],
      queryFn: () => getPublicCaseStudyById(id),
      enabled: Number.isSafeInteger(id) && id > 0,
    });

    let finalData: CaseStudyDetailPageType | null = null;
    if (data) {
      const study = data.data;
      finalData = {
        id: study.id,
        title: study.title,
        problem: study.problem,
        product: study.product?.is_showing ? study.product : null,
        labels: [
          { name: "Industry", value: study.industry?.industry_name ?? "" },
          { name: "Application", value: study.application?.application_name ?? "" },
          { name: "Division", value: study.division?.division_name ?? "" },
          { name: "Category", value: study.category?.category_name ?? "" },
        ].filter((label) => label.value),
        thumbnail: study.galleries.find((image) => image.is_thumbnail),
        galleries: study.galleries.filter((image) => !image.is_thumbnail),
        documents: study.documents,
        descriptions: study.descriptions,
      };
    }

    return { finalData, isLoading, isError, refetch };
  };

  const useGetCaseStudyCarouselService = () => {
    const { data, isLoading, isError, error, refetch } = useQuery({
      queryKey: ["getCaseStudyCarousel"],
      queryFn: () => getCaseStudyCarousel(),
    });

    const finalData = useMemo<CaseStudyCarouselCardType[]>(
      () =>
        (data?.data ?? []).map((item) => {
          const thumbnail = item.thumbnail[0];

          return {
            id: item.id,
            subTitle: item.category?.category_name ?? "",
            title: item.title,
            description: item.problem,
            image: thumbnail?.image_url || "/images/carousel.jpg",
            width: thumbnail?.ori_width > 0 ? thumbnail.ori_width : 742,
            height: thumbnail?.ori_height > 0 ? thumbnail.ori_height : 928,
          };
        }),
      [data],
    );

    return { finalData, isLoading, isError, error, refetch };
  };

  const useGetCreateCaseStudyDropdownService = () => {
    const responses = useQueries({
      queries: [
        {
          queryKey: ["getCSCategoryDropdown"],
          queryFn: () => getDropdown("categories"),
          refetchOnMount: "always",
        },
        {
          queryKey: ["getCSIndustryDropdown"],
          queryFn: () => getDropdown("industries"),
          refetchOnMount: "always",
        },
        {
          queryKey: ["getCSApplicationDropdown"],
          queryFn: () => getDropdown("applications"),
          refetchOnMount: "always",
        },
        {
          queryKey: ["getCSDivisionDropdown"],
          queryFn: () => getDropdown("divisions"),
          refetchOnMount: "always",
        },
        {
          queryKey: ["getCSProductDropdown"],
          queryFn: () => getDropdown("products"),
          refetchOnMount: "always",
        },
      ],
    });

    const isLoading = responses.some((res) => res.isLoading);
    const isError = responses.some((res) => res.isError);
    const error = responses.find((res) => res.error !== undefined);

    let finalData: {
      categoryData: DropdownType[];
      industryData: DropdownType[];
      applicationData: DropdownType[];
      divisionData: DropdownType[];
      productData: DropdownType[];
    } = {
      categoryData: [],
      industryData: [],
      applicationData: [],
      divisionData: [],
      productData: [],
    };

    if (!isLoading) {
      if (isError && error) {
        onError(error.error!.message);
      } else {
        finalData = {
          categoryData: (responses[0].data!.data as CategoryDTO[]).map(
            (item) => ({
              label: item.category_name,
              value: String(item.id),
            }),
          ),
          industryData: (responses[1].data!.data as IndustryDTO[]).map(
            (item) => ({
              label: item.industry_name,
              value: String(item.id),
            }),
          ),
          applicationData: (responses[2].data!.data as ApplicationDTO[]).map(
            (item) => ({
              label: item.application_name,
              value: String(item.id),
            }),
          ),
          divisionData: (responses[3].data!.data as DivisionDTO[]).map(
            (item) => ({
              label: item.division_name,
              value: String(item.id),
            }),
          ),
          productData: (responses[4].data!.data as ProductDTO[]).map(
            (item) => ({
              label: item.product_name,
              value: String(item.id),
            }),
          ),
        };
      }
    }

    return {
      finalData,
      isLoading,
    };
  };

  const createCaseStudyMutation = useMutation({
    mutationKey: ["createCaseStudy"],
    mutationFn: (body: CaseStudyInput) => createCaseStudy(body),
    onMutate,
    onSettled,
    onSuccess: async (response) => {
      route.push("/cms/case-studies");
      await queryClient.invalidateQueries({
        queryKey: ["getCaseStudies"],
      });
      onSuccess(response.message);
    },
    onError: (error) => onError(error.message),
  });

  const deleteCaseStudyMutation = useMutation({
    mutationKey: ["deleteCaseStudy"],
    mutationFn: (id: number) => deleteCaseStudy(id),
    onMutate,
    onSettled,
    onSuccess: async (response) => {
      setDeleteModal(false, "", undefined);
      await queryClient.invalidateQueries({
        queryKey: ["getCaseStudies"],
      });
      onSuccess(response.message);
    },
    onError: (error) => onError(error.message),
  });

  const updateCaseStudyStatusMutation = useMutation({
    mutationKey: ["updateCaseStudyStatus"],
    mutationFn: (data: { id: number; closeMenu: () => void }) =>
      updateCaseStudyStatus(data.id),
    onMutate,
    onSettled: (_data, _error, variables) => {
      variables.closeMenu();
      onSettled();
    },
    onSuccess: async (response) => {
      await queryClient
        .invalidateQueries({
          queryKey: ["getCaseStudies"],
        })
        .then(() => onSuccess(response.message));
    },
    onError: (error) => onError(error.message),
  });

  const useGetCaseStudiesService = (page: number, onClose: () => void) => {
    const {
      data,
      isLoading: isLoadingQuery,
      isError,
      error,
    } = useQuery({
      queryKey: ["getCaseStudies", page, caseStudyFilter.value],
      queryFn: () => getCaseStudies(page, caseStudyFilter.value),
    });

    let finalData: TableType = {
      data: [],
      metaData: {
        count: 0,
        page: 0,
        total: 0,
      },
    };

    if (!isLoadingQuery) {
      if (isError) {
        onError(error.message);
      } else if (data) {
        finalData = {
          data: data.data.data.map((item) => ({
            row: [
              item.title,
              item.industry.industry_name,
              item.is_showing ? "Showing" : "Hidden",
            ],
            actions: [
              {
                label: "Edit",
                onClick: () => {
                  onClose();
                  queryClient.invalidateQueries({
                    queryKey: ["getCaseStudyById", item.id],
                  });
                  route.push(`/cms/case-studies/edit/${item.id}`);
                },
              },
              {
                label: item.is_showing ? "Hide" : "Show",
                onClick: () =>
                  updateCaseStudyStatusMutation.mutate({
                    id: item.id,
                    closeMenu: onClose,
                  }),
                isLoading,
              },
              {
                label: "Delete",
                onClick: () => {
                  onClose();
                  setDeleteModal(true, item.title, () =>
                    deleteCaseStudyMutation.mutate(item.id),
                  );
                },
              },
            ],
          })),
          metaData: {
            count: data.data.meta.count,
            page: data.data.meta.page,
            total: data.data.meta.total,
          },
        };
      }
    }

    return {
      finalData,
      isLoading: isLoadingQuery,
    };
  };

  const useGetCaseStudyByIdService = (id: number) => {
    const { data, isLoading, isRefetching, isError, error } = useQuery({
      queryKey: ["getCaseStudyById", id],
      queryFn: () => getCaseStudyById(id),
      refetchOnWindowFocus: "always",
    });

    let finalData: CaseStudyInput = {
      title: "",
      product: undefined,
      category: undefined,
      industry: undefined,
      application: undefined,
      division: undefined,
      problem: "",
      thumbnail: undefined,
      galleries: [],
      documents: [],
      descriptions: [
        {
          title: "",
          description: "",
        },
      ],
    };

    if (!isLoading) {
      if (isError) {
        onError(error.message);
      } else if (data) {
        const thumbnail = data.data.galleries.find((item) => item.is_thumbnail);

        finalData = {
          title: data.data.title,
          product: {
            label: data.data.product.product_name,
            value: String(data.data.product.id),
          },
          category: {
            label: data.data.category.category_name,
            value: String(data.data.category.id),
          },
          industry: {
            label: data.data.industry.industry_name,
            value: String(data.data.industry.id),
          },
          application: {
            label: data.data.application.application_name,
            value: String(data.data.application.id),
          },
          division: {
            label: data.data.division.division_name,
            value: String(data.data.division.id),
          },
          problem: data.data.problem,
          thumbnail: thumbnail?.image_url,
          galleries: data.data.galleries
            .filter((item) => !item.is_thumbnail)
            .map((item) => `${item.id}|${item.image_url}`),
          documents: data.data.documents.map(
            (item) => `${item.id}|${item.doc_name}`,
          ),
          descriptions: data.data.descriptions.map((item) => ({
            title: item.title,
            description: item.description,
            id: item.id,
          })),
        };
      }
    }

    return {
      finalData,
      isLoading,
      isRefetching,
    };
  };

  const updateCaseStudyMutation = useMutation({
    mutationKey: ["updateCaseStudy"],
    mutationFn: (data: { id: number; body: CaseStudyInput }) =>
      updateCaseStudy(data.id, data.body),
    onMutate,
    onSettled,
    onSuccess: async (response) => {
      route.push("/cms/case-studies");
      await queryClient.invalidateQueries({
        queryKey: ["getCaseStudies"],
      });
      onSuccess(response.message);
    },
    onError: (error) => onError(error.message),
  });

  return {
    useGetPublicCaseStudyByIdService,
    useGetCaseStudyCarouselService,
    useGetCreateCaseStudyDropdownService,
    createCaseStudyService: (body: any) => createCaseStudyMutation.mutate(body),
    useGetCaseStudiesService,
    useGetCaseStudyByIdService,
    updateCaseStudyService: (data: { id: number; body: any }) =>
      updateCaseStudyMutation.mutate(data),
  };
};

export default useCaseStudyController;
