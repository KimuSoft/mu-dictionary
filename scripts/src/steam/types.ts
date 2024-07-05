export interface SteamGameListResponse {
  applist: {
    apps: SteamGameItem[];
  };
}

export interface SteamGameItem {
  appid: string;
  name: string;
}

export type NoDetailSteamGameCacheItem = SteamGameItem & {
  url: string;
  detail: false;
};

export type SteamGameCacheItem = {
  appid: string;
  originalName: string;
  url: string;
  detail: true;
} & GameDetails;

export type GameDetailResponse = Record<
  string,
  { success: boolean; data: GameDetails }
>;

interface GameDetails {
  type: string;
  name: string;
  steam_appid: number;
  required_age: number;
  is_free: boolean;
  detailed_description: string;
  about_the_game: string;
  short_description: string;
  supported_languages: string;
  header_image: string;
  capsule_image: string;
  capsule_imagev5: string;
  website: string | null;
  pc_requirements: {
    minimum: string;
    recommended?: string; // Optional, if provided in API
  };
  mac_requirements: {
    minimum: string;
    recommended?: string; // Optional, if provided in API
  };
  linux_requirements: {
    minimum: string;
    recommended?: string; // Optional, if provided in API
  };
  developers: string[];
  publishers: string[];
  price_overview: {
    currency: string;
    initial: number;
    final: number;
    discount_percent: number;
    initial_formatted: string;
    final_formatted: string;
  };
  packages: number[];
  package_groups: {
    name: string;
    title: string;
    description: string;
    selection_text: string;
    save_text: string;
    display_type: number;
    is_recurring_subscription: string;
    subs: {
      packageid: number;
      percent_savings_text: string;
      percent_savings: number;
      option_text: string;
      option_description: string;
      can_get_free_license: string;
      is_free_license: boolean;
      price_in_cents_with_discount: number;
    }[];
  }[];
  platforms: {
    windows: boolean;
    mac: boolean;
    linux: boolean;
  };
  metacritic: {
    score: number;
    url: string;
  };
  categories: {
    id: number;
    description: string;
  }[];
  genres?: {
    id: string;
    description: string;
  }[];
  screenshots: {
    id: number;
    path_thumbnail: string;
    path_full: string;
  }[];
  recommendations: {
    total: number;
  };
  release_date: {
    coming_soon: boolean;
    date: string; // Date string (e.g., "2000년 11월 1일")
  };
  support_info: {
    url: string;
    email: string;
  };
  background: string;
  background_raw: string;
  content_descriptors: {
    ids: number[];
    notes: string;
  };
  ratings: {
    usk: {
      rating: string; // Rating string (e.g., "16")
    };
  };
}

export type SteamGameCache = Record<
  string,
  SteamGameCacheItem | NoDetailSteamGameCacheItem
>;
