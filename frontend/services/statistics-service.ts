import { TSortParams } from "@/app/(authorized)/statistics/_components/statistics-page-shell";
import { api } from "@/handlers/api-handler";
import { Period } from "@/stores/statistics-store";
import {
  TCatch,
  TCrudDate,
  TLure,
  TMeta,
  TPaginatedResponse,
  TWeatherStatistics,
} from "@/types";
import axios from "axios";
import { cookies } from "next/headers";
export type TScope = "all" | "mine";
const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
export const getWeatherStatistics = async (
  period: Period = "7d",
  scope: TScope,
  fish_id: string = "all",
): Promise<TWeatherStatistics | null> => {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await axios.get(`${baseUrl}/api/statistics/weather`, {
      params: { period, scope, fish_id },
      headers: {
        Cookie: cookieHeader,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to fetch weather statistics:", error);
    return null;
  }
};

export type FishingTripStatistics = {
  fishing_trips: {}[];
  fishing_trips_by_lake: {};
  fishing_trips_by_weather: {};
};
export type CatchesStatistics = {
  average_temperature: string | null;
  catches_by_date: {
    date: string;
    count: number;
  }[];
  catches_by_lake: {
    lake: string;
    count: number;
  }[];
  catches_by_weather: {
    temperature: string | null;
    wind_direction: number | null;
    pressure: string | null;
    count: number;
  }[];
  top_lake: {
    lake: string;
    count: number;
  } | null;
  top_fish: {
    fish_name: string;
    count: number;
  } | null;
  top_angler: {
    user_id: number;
    username: string;
    count: number;
  } | null;
  total_catches: number;
};

export const getLakeCatchStatistics = async (
  period: Period = "7d",
  scope: TScope,
  fish_id: string = "all",
): Promise<CatchesStatistics | null> => {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const response = await axios.get(`${baseUrl}/api/statistics/catches`, {
      params: { period, scope, fish_id },
      headers: {
        Cookie: cookieHeader,
      },
    });

    return response.data.data;
  } catch (error) {
    return null;
  }
};

export type TTopCatch = {
  data: string;
  fish: string;
  id: number;
  lake_id: number;
  lake_name: string;
  username: string;
  weight?: string;
  date?: string;
  length?: string;
  image_url?: string;
};

export const getTopCatchesStatistics = async (
  period: Period = "7d",
  scope: TScope,
  fish_id: string = "all",
  page = 1,
): Promise<TPaginatedResponse<TTopCatch[]>> => {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const response = await axios.get(
      `${baseUrl}/api/statistics/catches/top_catches`,
      {
        params: { period, scope, fish_id, page: String(page) },
        headers: {
          Cookie: cookieHeader,
        },
      },
    );

    const { items, meta } = response.data.data;

    return {
      data: items ?? [],
      meta,
    };
  } catch (error) {
    return {
      meta: null,
      data: [],
    };
  }
};

export type TTopFishingTripStatistic = {
  id: number;
  lake_id: number;
  user_id: number;
  catches_count: number;
  total_weight: number;
  lake_name: string;
  status: string;
  started_at: string;
  ended_at: string;

  notes?: string;
} & TCrudDate;

export const getTopFishingTripsStatistics = async (
  period: Period = "7d",
  scope: TScope,
  page = 1,
): Promise<TPaginatedResponse<TTopFishingTripStatistic[]>> => {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await axios.get(
      `${baseUrl}/api/statistics/catches/top_fishing_trips`,
      {
        params: {
          period,
          scope,
          page: String(page),
        },
        headers: { Cookie: cookieHeader },
      },
    );

    const { items, meta } = response.data.data;

    return {
      data: items ?? [],
      meta,
    };
  } catch (error) {
    return {
      data: [],
      meta: null,
    };
  }
};

export type TLureStatistic = {
  lure: string;
  catches_count: number;
  fish_name: string;
  lure_id: number;
};
export type TLureStatisticsSummary = {
  recorded_catches: number;
  unique_lures: number;
  unique_fish: number;
};
type TLureStatisticsResponse = TPaginatedResponse<TLureStatistic[]> & {
  summary: TLureStatisticsSummary | null;
};
export const getLureStatistics = async (
  period: Period = "7d",
  scope: TScope,
  fish_id: string = "all",
  lure_id: string = "all",
  page: number = 1,
  sortParams?: TSortParams,
): Promise<TLureStatisticsResponse> => {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await axios.get(`${baseUrl}/api/statistics/lures`, {
      params: {
        period,
        scope,
        fish_id,
        lure_id,
        page: String(page),
        sort_params: sortParams,
      },
      headers: { Cookie: cookieHeader },
    });

    const { items, meta, summary } = response.data.data;

    return {
      data: items ?? [],
      meta,
      summary,
    };
  } catch (error) {
    console.error("Failed to fetch lure statistics:", error);
    return {
      data: [],
      meta: null,
      summary: null,
    };
  }
};

export type TLureStatsInsight = {
  id: number;
  name: string;
  total_catches: number;
  description?: string;
  most_common_fish: {
    id: number;
    name: string;
    catches_count: number;
  } | null;
  most_common_weather: {
    temperature_min: string | number;
    temperature_max: string | number;
    pressure_min: string | number;
    pressure_max: string | number;
    wind_direction: string;
    catches_count: number;
  } | null;
};

export const getLureStatisticById = async (
  id: number | string,
): Promise<TLureStatsInsight | null> => {
  try {
    console.log("id", id);
    const response = await api.get(`statistics/lures/${id}`);

    return response.data.data;
  } catch (error) {
    return null;
  }
};
