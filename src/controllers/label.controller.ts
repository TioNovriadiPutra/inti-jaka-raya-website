import useHelper from "@/hooks/useHelper";
import { LabelInput } from "@/interfaces/label.interface";
import { TableType } from "@/interfaces/page.interface";
import { createLabel, getLabels } from "@/services/label.service";
import { useLabelFilter } from "@/stores/page.store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

const useLabelController = () => {
  const filter = useLabelFilter();

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
                onClick: () => console.log("Edit"),
              },
              {
                label: "Delete",
                onClick: () => console.log("Delete"),
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

  return {
    createLabelService: (body: any) => createLabelMutation.mutate(body),
    useGetLabelsService,
  };
};

export default useLabelController;
