import useHelper from "@/hooks/useHelper";
import { DropdownType } from "@/interfaces/form.interface";
import {
  ApplicationDTO,
  CategoryDTO,
  DivisionDTO,
  IndustryDTO,
} from "@/interfaces/label.interface";
import { ProductInput } from "@/interfaces/product.interface";
import { getLabelDropdown } from "@/services/label.service";
import { createProduct } from "@/services/product.service";
import { useMutation, useQueries } from "@tanstack/react-query";
import { useRouter } from "next/router";

const useProductController = () => {
  const route = useRouter();

  const { queryClient, onMutate, onSettled, onSuccess, onError } = useHelper();

  const useGetCreateProductDropdown = () => {
    const responses = useQueries({
      queries: [
        {
          queryKey: ["getCategoriesDropdown"],
          queryFn: () => getLabelDropdown("categories"),
        },
        {
          queryKey: ["getIndustriesDropdown"],
          queryFn: () => getLabelDropdown("industries"),
        },
        {
          queryKey: ["getApplicationsDropdown"],
          queryFn: () => getLabelDropdown("applications"),
        },
        {
          queryKey: ["getDivisionsDropdown"],
          queryFn: () => getLabelDropdown("divisions"),
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
    } = {
      categoryData: [],
      industryData: [],
      applicationData: [],
      divisionData: [],
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
        };
      }
    }

    return {
      finalData,
      isLoading,
    };
  };

  const createProductMutation = useMutation({
    mutationKey: ["createProduct"],
    mutationFn: (body: ProductInput) => createProduct(body),
    onMutate,
    onSettled,
    onSuccess: async (response) => {
      route.push("/cms/products");
      await queryClient.invalidateQueries({
        queryKey: ["getProducts"],
      });
      onSuccess(response.message);
    },
    onError: (error) => onError(error.message),
  });

  return {
    useGetCreateProductDropdown,
    createProductService: (body: any) => createProductMutation.mutate(body),
  };
};

export default useProductController;
