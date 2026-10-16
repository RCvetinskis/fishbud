import { api } from "@/handlers/api-handler";
import { TLure, TLureType, TRailsResponse } from "@/types";

export const getLureTypes = async (): Promise<TLureType[]> => {
  try {
    const response = await api.get("lures/lure_types");

    return response.data.data;
  } catch (error) {
    return [];
  }
};
export const getLures = async (): Promise<TLure[]> => {
  try {
    const response = await api.get("lures");

    return response.data.data;
  } catch (error) {
    return [];
  }
};
type TLureBody = {
  lure: {
    name: string;
    lure_type: string;
    description?: string;
  };
};

export const createLure = async (
  body: TLureBody,
): Promise<TRailsResponse<TLure>> => {
  const response = await api.post<TRailsResponse<TLure>>("lures", body);

  return response.data;
};
