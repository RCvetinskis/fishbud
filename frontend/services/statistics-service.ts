import { api } from "@/handlers/api-handler";
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
