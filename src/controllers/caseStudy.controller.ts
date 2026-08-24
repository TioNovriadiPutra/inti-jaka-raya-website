import useHelper from "@/hooks/useHelper";
import { CaseStudyInput } from "@/interfaces/caseStudy.interface";
import { DropdownType } from "@/interfaces/form.interface";
import {
  ApplicationDTO,
  CategoryDTO,
  DivisionDTO,
  IndustryDTO,
} from "@/interfaces/label.interface";
import { TableType } from "@/interfaces/page.interface";
import { ProductDTO } from "@/interfaces/product.interface";
import {
  createCaseStudy,
  getCaseStudies,
  getCaseStudyById,
} from "@/services/caseStudy.service";
import { getDropdown } from "@/services/util.service";
import { useCaseStudyFilter } from "@/stores/page.store";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

const useCaseStudyController = () => {
  const caseStudyFilter = useCaseStudyFilter((state) => state.filter);

  const route = useRouter();

  const { queryClient, onMutate, onSettled, onError, onSuccess } = useHelper();

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

  const useGetCaseStudiesService = (page: number, onClose: () => void) => {
    const { data, isLoading, isError, error } = useQuery({
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

    if (!isLoading) {
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
                  route.push(`/cms/case-studies/edit/${item.id}`);
                },
              },
              {
                label: item.is_showing ? "Hide" : "Show",
                onClick: () => console.log("edit"),
                isLoading,
              },
              {
                label: "Delete",
                onClick: () => {
                  onClose();
                  console.log("delete");
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
      isLoading,
    };
  };

  const useGetCaseStudyByIdService = (id: number) => {
    const { data, isLoading, isError, error } = useQuery({
      queryKey: ["getCaseStudyById", id],
      queryFn: () => getCaseStudyById(id),
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
    };
  };

  return {
    useGetCreateCaseStudyDropdownService,
    createCaseStudyService: (body: any) => createCaseStudyMutation.mutate(body),
    useGetCaseStudiesService,
    useGetCaseStudyByIdService,
  };
};

export default useCaseStudyController;
