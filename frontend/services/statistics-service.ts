import { api } from "@/handlers/api-handler";
import { Period } from "@/stores/statistics-store";
import { TWeatherStatistics } from "@/types";
import axios from "axios";
import { cookies } from "next/headers";

export const getWeatherStatistics =
  async (): Promise<TWeatherStatistics | null> => {
    try {
      const response = await api.get("/statistics/weather");
      return response.data;
    } catch {
      return null;
    }
  };

export const getCurrentUserWeatherStatistics =
  async (): Promise<TWeatherStatistics | null> => {
    try {
      const cookieStore = await cookies();
      const cookieHeader = cookieStore.toString();

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

      const response = await axios.get(
        `${baseUrl}/api/statistics/weather/current_user_statistics`,
        {
          headers: {
            Cookie: cookieHeader,
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error("Failed to fetch personal weather statistics:", error);
      return null;
    }
  };

export type BiggestCatch = {
  id: number;
  fish: string | null;
  username: string | null;
  length: number | null;
  weight: number | null;
  lake_name: string;
  lake_id: number;
  date: string | null;
};
export type LakeCatchStatistics = {
  data: {
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
      count: number;
    }[];
    top_lake: {
      lake: string;
      count: number;
    } | null;
    top_weather: {
      temperature: string | null;
      wind_direction: number | null;
      count: number;
    } | null;
    total_catches: number;
    biggest_catches: BiggestCatch[];
  };
};
export const getLakeCatchStatistics = async (
  period: Period = "7d",
): Promise<LakeCatchStatistics | null> => {
  try {
    const response = await api.get("/statistics/lake_catches", {
      params: { period },
    });

    return response.data;
  } catch (error) {
    return null;
  }
};
