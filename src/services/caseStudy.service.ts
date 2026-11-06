import {
  CaseStudyCarouselDTO,
  CaseStudyDetailDTO,
  CaseStudyDTO,
  CaseStudyInput,
  CaseStudyPublicDetailDTO,
} from "@/interfaces/caseStudy.interface";
import { MetaResType, ResType } from "@/interfaces/res.interface";
import { axiosInstance } from "@/utils/axios";
import { errorResponse } from "@/utils/helper";

export const createCaseStudy = async (
  body: CaseStudyInput,
): Promise<ResType> => {
  try {
    const formData = new FormData();

    formData.append("title", body.title);
    formData.append("problem", body.problem);
    formData.append("product", body.product!.value);
    formData.append("division", body.division!.value);
    formData.append("industry", body.industry!.value);
    formData.append("category", body.category!.value);
    formData.append("application", body.application!.value);
    formData.append("thumbnail", body.thumbnail!);

    body.galleries.forEach((gallery) => {
      formData.append("galleries", gallery);
    });

    body.documents.forEach((doc) => {
      formData.append("documents", doc);
    });

    formData.append("descriptions", JSON.stringify(body.descriptions));

    const response = await axiosInstance.post("/case-study/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw errorResponse(error);
  }
};

export const getCaseStudies = async (
  page: number,
  type: string,
): Promise<MetaResType<CaseStudyDTO[]>> => {
  try {
    const response = await axiosInstance.get(
      `/case-study?page=${page}&type=${type}`,
    );

    return response.data;
  } catch (error) {
    throw errorResponse(error);
  }
};

export const getCaseStudyById = async (
  id: number,
): Promise<ResType<CaseStudyDetailDTO>> => {
  try {
    const response = await axiosInstance.get(`/case-study/detail/${id}`);

    return response.data;
  } catch (error) {
    throw errorResponse(error);
  }
};

export const getPublicCaseStudyById = async (
  id: number,
): Promise<ResType<CaseStudyPublicDetailDTO>> => {
  try {
    const response = await axiosInstance.get(`/case-study/${id}`);
    return response.data;
  } catch (error) {
    throw errorResponse(error);
  }
};

export const getCaseStudyCarousel = async (): Promise<
  ResType<CaseStudyCarouselDTO[]>
> => {
  try {
    const response = await axiosInstance.get("/carousel");

    return response.data;
  } catch (error) {
    throw errorResponse(error);
  }
};

export const updateCaseStudy = async (
  id: number,
  body: CaseStudyInput,
): Promise<ResType> => {
  try {
    const formData = new FormData();

    formData.append("title", body.title);
    formData.append("problem", body.problem);
    formData.append("product", body.product!.value);
    formData.append("division", body.division!.value);
    formData.append("industry", body.industry!.value);
    formData.append("category", body.category!.value);
    formData.append("application", body.application!.value);
    formData.append("thumbnail", body.thumbnail!);

    body.galleries.forEach((gallery) => {
      formData.append("galleries", gallery);
    });

    body.documents.forEach((doc) => {
      formData.append("documents", doc);
    });

    formData.append("descriptions", JSON.stringify(body.descriptions));

    const response = await axiosInstance.put(
      `/case-study/edit/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  } catch (error) {
    throw errorResponse(error);
  }
};

export const deleteCaseStudy = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`/case-study/delete/${id}`);

    return response.data;
  } catch (error) {
    throw errorResponse(error);
  }
};

export const updateCaseStudyStatus = async (id: number): Promise<ResType> => {
  try {
    const response = await axiosInstance.put(`/case-study/status/${id}`, {});

    return response.data;
  } catch (error) {
    throw errorResponse(error);
  }
};
