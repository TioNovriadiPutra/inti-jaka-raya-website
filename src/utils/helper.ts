import { ResType } from "@/interfaces/res.interface";
import axios from "axios";

export const errorResponse = (error: unknown): ResType => {
  if (axios.isAxiosError(error)) {
    return error.response?.data;
  } else {
    return {
      success: false,
      message: "Internal server error!",
      data: error,
    };
  }
};
