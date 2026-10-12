import axios from "axios";

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (typeof data?.error === "string") {
      return data.error;
    }

    if (typeof data?.message === "string") {
      return data.message;
    }

    if (Array.isArray(data?.errors)) {
      return data.errors.join(", ");
    }
  }

  return "Something went wrong. Please try again.";
};
