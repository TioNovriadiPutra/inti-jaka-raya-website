import useHelper from "@/hooks/useHelper";
import { DropdownType } from "@/interfaces/form.interface";
import {
  ApplicationDTO,
  CategoryDTO,
  DivisionDTO,
  IndustryDTO,
} from "@/interfaces/label.interface";
import { TableType } from "@/interfaces/page.interface";
import { ProductInput } from "@/interfaces/product.interface";
import { getLabelDropdown } from "@/services/label.service";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
  updaterProductStatus,
} from "@/services/product.service";
import { useDeleteModal, useLoading } from "@/stores/page.store";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

const useProductController = () => {
  const isLoading = useLoading((state) => state.isLoading);
  const setDeleteModal = useDeleteModal((state) => state.setShowModal);

  const route = useRouter();

  const { queryClient, onMutate, onSettled, onSuccess, onError } = useHelper();

  const useGetCreateProductDropdown = () => {
    const responses = useQueries({
      queries: [
        {
          queryKey: ["getCategoriesDropdown"],
          queryFn: () => getLabelDropdown("categories"),
          refetchOnMount: "always",
        },
        {
          queryKey: ["getIndustriesDropdown"],
          queryFn: () => getLabelDropdown("industries"),
          refetchOnMount: "always",
        },
        {
          queryKey: ["getApplicationsDropdown"],
          queryFn: () => getLabelDropdown("applications"),
          refetchOnMount: "always",
        },
        {
          queryKey: ["getDivisionsDropdown"],
          queryFn: () => getLabelDropdown("divisions"),
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

  const updateProductStatusMutation = useMutation({
    mutationKey: ["updateProductStatus"],
    mutationFn: (data: { id: number; closeMenu: () => void }) =>
      updaterProductStatus(data.id),
    onMutate,
    onSettled: (data, error, variables) => {
      variables.closeMenu();
      onSettled();
    },
    onSuccess: async (response) => {
      await queryClient
        .invalidateQueries({
          queryKey: ["getProducts"],
        })
        .then(() => onSuccess(response.message));
    },
    onError: (error) => onError(error.message),
  });

  const deleteProductMutation = useMutation({
    mutationKey: ["deleteProduct"],
    mutationFn: (id: number) => deleteProduct(id),
    onMutate,
    onSettled,
    onSuccess: async (response) => {
      setDeleteModal(false, "", undefined);
      await queryClient.invalidateQueries({
        queryKey: ["getProducts"],
      });
      onSuccess(response.message);
    },
    onError: (error) => onError(error.message),
  });

  const useGetProductsService = (page: number, onClose: () => void) => {
    const {
      data,
      isLoading: loadingQuery,
      isError,
      error,
    } = useQuery({
      queryKey: ["getProducts", page],
      queryFn: () => getProducts(page),
    });

    let finalData: TableType = {
      data: [],
      metaData: {
        count: 0,
        page: 0,
        total: 0,
      },
    };

    if (!loadingQuery) {
      if (isError) {
        onError(error!.message);
      } else if (data) {
        finalData = {
          data: data.data.data.map((item) => ({
            row: [
              item.product_code,
              item.product_name,
              item.is_showing ? "Showing" : "Hidden",
            ],
            actions: [
              {
                label: "Edit",
                onClick: () => {
                  onClose();
                  route.push(`/cms/products/edit/${item.id}`);
                },
              },
              {
                label: item.is_showing ? "Hide" : "Show",
                onClick: () =>
                  updateProductStatusMutation.mutate({
                    id: item.id,
                    closeMenu: onClose,
                  }),
                isLoading,
              },
              {
                label: "Delete",
                onClick: () => {
                  onClose();
                  setDeleteModal(true, item.product_name, () =>
                    deleteProductMutation.mutate(item.id),
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
      isLoading: loadingQuery,
    };
  };

  const useGetProductByIdService = (id: number) => {
    const { data, isLoading, isError, error } = useQuery({
      queryKey: ["getProductById", id],
      queryFn: () => getProductById(id),
      refetchOnMount: "always",
    });

    let finalData: ProductInput = {
      code: "",
      itemName: "",
      category: undefined,
      industry: undefined,
      application: undefined,
      division: undefined,
      thumbnail: undefined,
      galleries: [],
      documents: [],
      descriptions: [],
    };

    if (!isLoading) {
      if (isError) {
        onError(error!.message);
      } else if (data) {
        const thumbnail = data.data.galleries.find((item) => item.is_thumbnail);

        finalData = {
          code: data.data.product_code,
          itemName: data.data.product_name,
          category: {
            label: data.data.categories.category_name,
            value: String(data.data.categories.id),
          },
          industry: {
            label: data.data.industries.industry_name,
            value: String(data.data.industries.id),
          },
          application: {
            label: data.data.applications.application_name,
            value: String(data.data.applications.id),
          },
          division: {
            label: data.data.divisions.division_name,
            value: String(data.data.divisions.id),
          },
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

  const updateProductMutation = useMutation({
    mutationKey: ["updateProduct"],
    mutationFn: (data: { id: number; body: ProductInput }) =>
      updateProduct(data.id, data.body),
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
    useGetProductsService,
    useGetProductByIdService,
    updateProductService: (data: { id: number; body: any }) =>
      updateProductMutation.mutate(data),
  };
};

export default useProductController;
