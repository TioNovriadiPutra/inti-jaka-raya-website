import {
  CategoryDTO,
  IndustryDTO,
  LabelInput,
} from "@/interfaces/label.interface";
import { MetaResType, ResType } from "@/interfaces/res.interface";
import { axiosInstance } from "@/utils/axios";
import { errorResponse } from "@/utils/helper";

export const createLabel = async (body: LabelInput): Promise<ResType> => {
  try {
    const response = await axiosInstance.post("/label/create", {
      ...body,
      labelType: body.labelType ? body.labelType.value : "",
    });

    return response.data;
  } catch (error) {
    throw errorResponse(error);
  }
};

export const getLabels = async (
  page: number,
  type: string,
): Promise<MetaResType<(CategoryDTO | IndustryDTO)[]>> => {
  try {
    const response = await axiosInstance.get(
      `/label?page=${page}&type=${type}`,
    );

    return response.data;
  } catch (error) {
    throw errorResponse(error);
  }
};
