import { ApiError } from "@/types";
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const responseData = error?.response?.data;
    const message =
      responseData?.message || error?.message || "An error occurred";
    const status = error?.response?.status;
    return Promise.reject(new ApiError(message, responseData, status));
  },
);
