import {
  ProductDetailDTO,
  ProductDTO,
  ProductInput,
} from "@/interfaces/product.interface";
import { MetaResType, ResType } from "@/interfaces/res.interface";
import { axiosInstance } from "@/utils/axios";
import { errorResponse } from "@/utils/helper";

export const createProduct = async (body: ProductInput): Promise<ResType> => {
  try {
    const formData = new FormData();

    formData.append("code", body.code);
    formData.append("itemName", body.itemName);
    formData.append("division", body.division!.value);
    formData.append("industry", body.industry!.value);
    formData.append("category", body.category!.value);
    formData.append("application", body.application!.value);
    formData.append("thumbnail", body.thumbnail!);

    body.galleries.map((gallery) => {
      formData.append("galleries", gallery);
    });

    body.documents.map((doc) => {
      formData.append(
        "documents",
        doc instanceof File ? doc : JSON.stringify(doc),
      );
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

export const getProducts = async (
  page: number,
): Promise<MetaResType<ProductDTO[]>> => {
  try {
    const response = await axiosInstance.get(`/product?page=${page}`);

    return response.data;
  } catch (error) {
    throw errorResponse(error);
  }
};

export const getProductById = async (
  id: number,
): Promise<ResType<ProductDetailDTO>> => {
  try {
    const response = await axiosInstance.get(`/product/detail/${id}`);

    return response.data;
  } catch (error) {
    throw errorResponse(error);
  }
};

export const updateProduct = async (
  id: number,
  body: ProductInput,
): Promise<ResType> => {
  try {
    const formData = new FormData();

    formData.append("code", body.code);
    formData.append("itemName", body.itemName);
    formData.append("division", body.division!.value);
    formData.append("industry", body.industry!.value);
    formData.append("category", body.category!.value);
    formData.append("application", body.application!.value);
    formData.append("thumbnail", body.thumbnail!);

    body.galleries.map((gallery) => {
      formData.append("galleries", gallery);
    });

    body.documents.map((doc) => {
      formData.append("documents", doc);
    });

    formData.append("descriptions", JSON.stringify(body.descriptions));

    const response = await axiosInstance.put(`/product/edit/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw errorResponse(error);
  }
};

export const updaterProductStatus = async (id: number): Promise<ResType> => {
  try {
    const response = await axiosInstance.put(`/product/status/${id}`, {});

    return response.data;
  } catch (error) {
    throw errorResponse(error);
  }
};

export const deleteProduct = async (id: number): Promise<ResType> => {
  try {
    const response = await axiosInstance.delete(`/product/delete/${id}`);

    return response.data;
  } catch (error) {
    throw errorResponse(error);
  }
};
