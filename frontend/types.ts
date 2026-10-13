export type TCrudDate = {
  created_at: string;
  updated_at: string;
};
export type TCompany = {
  id: number;
  name: string;
  location: string;

  description?: string;
} & TCrudDate;

export type TMeta = {
  current_page: number;
  per_page: number;
  total_count: number;
  total_pages: number;
};

export type TFish = {
  id: number;
  name: string;
  image_url?: string;
};

export type TLake = {
  id: number;
  name: string;
  latitude: string;
  longitude: string;

  area?: string;
  width?: string;
  length?: string;
  shoreline_length?: string;
};

export type TCatch = {
  id: number;
  fish_id: number;
  lake_id: number;
  user_id: number;
  caught_by: string;
  fish_name: string;

  caught_at: string;

  weight?: string;
  length?: string;
  image_url?: string;
  lure?: string;
  description?: string;
  weather?: {
    temperature: number | null;
    wind_speed: number | null;
    wind_direction: number | null;
    pressure: number | null;
  } | null;
} & TCrudDate;

export type TWeatherStatistics = {
  total_catches: number;
  best_temperature: {
    min: number;
    max: number;
    catch_count: number;
  } | null;
  best_wind_speed: {
    min: number;
    max: number;
    catch_count: number;
  } | null;
  best_wind_direction: {
    direction: string;
    catch_count: number;
  } | null;
  best_pressure: {
    min: number;
    max: number;
    catch_count: number;
  } | null;
};
export type TFishingTripWeather = {
  temperature: number | null;
  wind_speed: number | null;
  description: string | null;
};

export type TFishingTripCatch = {
  id: number;
  fish_name: string;
  caught_at: string | null;
  weight: number | null;
  length: number | null;
  weather: TFishingTripWeather | null;
};

export type TFishingTrip = {
  id: number;
  lake_name: string;
  started_at: string;
  ended_at: string | null;
  status: "in_progress" | "completed";
  catches: TFishingTripCatch[];
};

export type TFishingTripStatistics = {
  total_trips: number;
  completed_trips: number;
  in_progress_trips: number;
  total_catches: number;
  total_weight: number;
  average_catches_per_trip: number;
};

export type TSpot = {
  id: number;
  lake_id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
};
export class ApiError extends Error {
  data: any;
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, data?: any, status?: number) {
    super(message);
    this.name = "ApiError";
    this.data = data;
    this.status = status || 500;
    this.errors = data?.errors;
  }
}
