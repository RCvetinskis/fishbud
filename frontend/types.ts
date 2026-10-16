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

export type TPaginatedResponse<T> = {
  data: T;
  meta: TMeta | null;
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
  lure?: TLure;
  description?: string;
  weather?: TWeather;
} & TCrudDate;

export type TWeatherStatistics = {
  total_catches: number;
  best_temperatures: {
    min: number;
    max: number;
    catch_count: number;
  }[];
  best_wind_speeds: {
    min: number;
    max: number;
    catch_count: number;
  }[];
  best_wind_directions: {
    direction: string;
    catch_count: number;
  }[];
  best_pressures: {
    min: number;
    max: number;
    catch_count: number;
  }[];
};
export type TWeather = {
  temperature: number | null;
  wind_speed: number | null;
  pressure: string | null;
  wind_direction: string | null;
};

export type TFishingTripCatch = {
  id: number;
  fish_name: string;
  lure: TLure | null;
  caught_at: string | null;
  weight: number | null;
  length: number | null;
  weather: TWeather | null;
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

export type TLureType = "natural" | "artificial";

export type TLure = {
  id: number;
  name: string;
  lure_type: TLureType;
  description?: string;
} & TCrudDate;

export type TRailsSuccessResponse<T> = {
  data: T;
  error: false;
  message: string;
};

export type TRailsErrorResponse = {
  data: null;
  error: true;
  message: string;
};

export type TRailsResponse<T> = TRailsSuccessResponse<T> | TRailsErrorResponse;

export type TSelectItem = { label: string; value: string | number };
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
