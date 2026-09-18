import { CatalogDTO } from "@/interfaces/catalog.interface";
import { MetaResType } from "@/interfaces/res.interface";
import { axiosInstance } from "@/utils/axios";
import { errorResponse } from "@/utils/helper";

export const getCatalogs = async (
  page: number,
  type: string,
  search: string,
  filters: Record<string, string[]>,
): Promise<MetaResType<CatalogDTO[]>> => {
  try {
    const params = new URLSearchParams({
      page: String(page),
      type,
      search,
    });

    Object.entries(filters).forEach(([key, ids]) => {
      ids.forEach((id) => params.append(key.toLowerCase(), id));
    });

    const response = await axiosInstance.get("/catalog", {
      params,
    });

    return response.data;
  } catch (error) {
    throw errorResponse(error);
  }
};
