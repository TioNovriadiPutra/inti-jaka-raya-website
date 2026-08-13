import useHelper from "@/hooks/useHelper";
import { LabelInput } from "@/interfaces/label.interface";
import { TableType } from "@/interfaces/page.interface";
import {
  createLabel,
  deleteLabel,
  getLabelById,
  getLabels,
  updateLabel,
} from "@/services/label.service";
import { useDeleteModal, useLabelFilter } from "@/stores/page.store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

const useLabelController = () => {
  const filter = useLabelFilter();
  const setDeleteModal = useDeleteModal((state) => state.setShowModal);

  const route = useRouter();

  const { queryClient, onMutate, onSettled, onSuccess, onError } = useHelper();

  const createLabelMutation = useMutation({
    mutationKey: ["createLabel"],
    mutationFn: (body: LabelInput) => createLabel(body),
    onMutate,
    onSettled,
    onSuccess: async (response, variables) => {
      route.push("/cms/labels");
      filter.setFilter(variables.labelType!);
      await queryClient.invalidateQueries({
        queryKey: ["getLabels", filter.filter.value],
      });
      onSuccess(response.message);
    },
    onError: (error) => onError(error.message),
  });

  const deleteLabelMutation = useMutation({
    mutationKey: ["deleteLabel"],
    mutationFn: (data: { id: number; type: string }) =>
      deleteLabel(data.id, data.type),
    onMutate,
    onSettled,
    onSuccess: (response) => {
      setDeleteModal(false, "", undefined);
      queryClient.invalidateQueries({ queryKey: ["getLabels"] });
      onSuccess(response.message);
    },
    onError: (error) => onError(error.message),
  });

  const useGetLabelsService = (page: number) => {
    const { data, isLoading, isError, error } = useQuery({
      queryKey: ["getLabels", filter.filter.value, page],
      queryFn: () => getLabels(page, filter.filter.value),
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
              "category_name" in item ? item.category_name : item.industry_name,
            ],
            actions: [
              {
                label: "Edit",
                onClick: () =>
                  route.push(
                    `/cms/labels/edit/${item.id}?type=${"category_name" in item ? "category" : "industry"}`,
                  ),
              },
              {
                label: "Delete",
                onClick: () => {
                  setDeleteModal(
                    true,
                    "category_name" in item
                      ? item.category_name
                      : item.industry_name,
                    () =>
                      deleteLabelMutation.mutate({
                        id: item.id,
                        type: "category_name" in item ? "category" : "industry",
                      }),
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
      isLoading,
      finalData,
    };
  };

  const useGetLabelByIdService = (id: number, type: string) => {
    const { data, isLoading, isError, error } = useQuery({
      queryKey: ["getLabelById", id, type],
      queryFn: () => getLabelById(id, type),
    });

    let finalData: LabelInput = {
      labelName: "",
      labelType: undefined,
    };

    if (!isLoading) {
      if (isError) {
        onError(error.message);
      } else if (data) {
        finalData = {
          labelName:
            "category_name" in data.data
              ? data.data.category_name
              : data.data.industry_name,
          labelType: {
            label: type === "category" ? "Category" : "Industry",
            value: type,
          },
        };
      }
    }

    return {
      finalData,
      isLoading,
    };
  };

  const updateLabelMutation = useMutation({
    mutationKey: ["updateLabel"],
    mutationFn: (data: { id: number; body: LabelInput }) =>
      updateLabel(data.id, data.body),
    onMutate,
    onSettled,
    onSuccess: async (response, variables) => {
      route.push("/cms/labels");
      filter.setFilter(variables.body.labelType!);
      await queryClient.invalidateQueries({
        queryKey: ["getLabels", filter.filter.value],
      });
      onSuccess(response.message);
    },
    onError: (error) => onError(error.message),
  });

  return {
    createLabelService: (body: any) => createLabelMutation.mutate(body),
    useGetLabelsService,
    useGetLabelByIdService,
    updateLabelService: (data: { id: number; body: LabelInput }) =>
      updateLabelMutation.mutate(data),
  };
};

export default useLabelController;
