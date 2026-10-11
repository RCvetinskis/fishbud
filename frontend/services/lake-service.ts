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

export type CatchSearchParams = {
  date_from?: string;
  date_to?: string;
  sort_by?: string;
  page?: string;
};
export const getLakeCatches = async (
  id: string,
  params?: CatchSearchParams,
): Promise<TCatchResult> => {
  try {
    const response = await api.get(`/lakes/${id}/catches`, {
      params,
    });

    return response.data.data;
  } catch {
    return {
      result: [],
      meta: null,
    };
  }
};

export type TLakeStatistics = {
  most_catches: {
    catch_date: string;
    catches_count: number;
  } | null;
  heaviest_fish: {
    catch_date: string;
    heaviest_weight: number;
  } | null;
  longest_fish: {
    catch_date: string;
    longest_length: number;
  } | null;
  highest_total_weight: {
    catch_date: string;
    total_weight: number;
  } | null;
  most_common_fish?: {
    fish_id: number;
    fish_name: string;
    catches_count: number;
  } | null;
};

export const getLakeStatistics = async (
  lakeId: string,
): Promise<TLakeStatistics | null> => {
  try {
    const response = await api.get(`/lakes/${lakeId}/lake_statistics`);

    return response.data.data;
  } catch {
    return null;
  }
};
