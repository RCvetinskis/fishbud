import { api } from "@/handlers/api-handler";
import { TCatch, TLake, TMeta } from "@/types";

export const getLakeById = async (id: string): Promise<TLake | null> => {
  try {
    const response = await api.get(`/lakes/${id}`);
    return response.data.data;
  } catch (error) {
    return null;
  }
};

type TCatchResult = {
  result: TCatch[];
  meta: TMeta | null;
};
export const getLakeCatches = async (id: string): Promise<TCatchResult> => {
  try {
    const response = await api.get(`/lakes/${id}/catches`);
    return response.data.data;
  } catch (error) {
    return {
      result: [],
      meta: null,
    };
  }
};
