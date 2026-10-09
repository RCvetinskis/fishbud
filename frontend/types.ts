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

  lure?: string;
  description?: string;
} & TCrudDate;
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
