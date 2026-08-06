import { LoginInput } from "@/interfaces/auth.interface";
import { ResType } from "@/interfaces/res.interface";
import { axiosInstance } from "@/utils/axios";
import { errorResponse } from "@/utils/helper";
import { User } from "@supabase/supabase-js";

export const login = async (body: LoginInput): Promise<ResType<User>> => {
  try {
    const response = await axiosInstance.post("/auth/login", body);

    return response.data;
  } catch (error) {
    throw errorResponse(error);
  }
};

export const checkIsLoggedIn = async () => {
  try {
    const response = await axiosInstance.get("/auth/me");

    return response.data;
  } catch (error) {
    throw errorResponse(error);
  }
};
