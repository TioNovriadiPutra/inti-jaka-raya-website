import { ProductInput } from "@/interfaces/product.interface";
import { ResType } from "@/interfaces/res.interface";
import { axiosInstance } from "@/utils/axios";
import { errorResponse } from "@/utils/helper";

export const createProduct = async (body: ProductInput): Promise<ResType> => {
  try {
    const formData = new FormData();

    formData.append("code", body.code);
    formData.append("itemName", body.itemName);
    formData.append("division", body.division?.value ?? "");
    formData.append("industry", body.industry?.value ?? "");
    formData.append("category", body.category?.value ?? "");
    formData.append("application", body.application?.value ?? "");

    body.galleries.map((gallery) => {
      formData.append("galleries", gallery);
    });

    body.documents.map((doc) => {
      formData.append("documents", doc);
    });

    formData.append("descriptions", JSON.stringify(body.descriptions));

    const response = await axiosInstance.post("/product/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw errorResponse(error);
  }
};
