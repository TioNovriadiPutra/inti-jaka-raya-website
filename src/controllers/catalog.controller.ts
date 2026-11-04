import useHelper from "@/hooks/useHelper";
import { CatalogCardType } from "@/interfaces/page.interface";
import { getCatalogs } from "@/services/catalog.service";
import { useQuery } from "@tanstack/react-query";

const useCatalogController = () => {
  const { onError } = useHelper();

  const useGetCatalogsService = (
    page: number,
    type: string,
    search: string,
    filters: Record<string, string[]>,
  ) => {
    const { data, isLoading, isError, error } = useQuery({
      queryKey: ["getCatalogs", page, type, search, filters],
      queryFn: () => getCatalogs(page, type, search, filters),
    });

    let finalData: CatalogCardType[] = [];

    if (!isLoading) {
      if (isError) {
        onError(error.message);
      } else if (data) {
        finalData = data.data.data.map((item) => ({
          id: item.id,
          title: item.title,
          tag: item.product_code || "",
          image: item.thumbnail[0]?.image_url || "/images/products.png",
          width: item.thumbnail[0]?.ori_width || 500,
          height: item.thumbnail[0]?.ori_height || 333,
        }));
      }
    }

    return {
      finalData,
      isLoading,
    };
  };

  return {
    useGetCatalogsService,
  };
};

export default useCatalogController;
