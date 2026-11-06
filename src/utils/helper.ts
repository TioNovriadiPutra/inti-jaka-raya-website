import { ResType } from "@/interfaces/res.interface";
import axios from "axios";

export const errorResponse = (error: unknown): ResType => {
  if (axios.isAxiosError(error)) {
    return error.response?.data ?? {
      success: false,
      message: error.message || "Unable to connect to the server.",
      data: {},
    };
  }

  return {
    success: false,
    message: "Internal server error!",
    data: error,
  };
};
