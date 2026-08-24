import {
  ApplicationDTO,
  CategoryDTO,
  DivisionDTO,
  IndustryDTO,
} from "@/interfaces/label.interface";
import { ProductDTO } from "@/interfaces/product.interface";
import { ResType } from "@/interfaces/res.interface";
import { axiosInstance } from "@/utils/axios";
import { errorResponse } from "@/utils/helper";

export const getDropdown = async (
  type: "categories" | "industries" | "applications" | "divisions" | "products",
): Promise<
  ResType<
    (CategoryDTO | IndustryDTO | ApplicationDTO | DivisionDTO | ProductDTO)[]
  >
> => {
  try {
    const response = await axiosInstance.get(`/dropdown?type=${type}`);

    return response.data;
  } catch (error) {
    throw errorResponse(error);
  }
};
