export interface Anime {
  id: number;
  name: string;
  img: string;
  cropped_img: string;
  home_img: string;
  home_cropped_img: string;
  images: AnimeImage[];
  content_rating: string;
  is_adult: boolean;
  genres: string[];
  medium: string;
  distributed_air_time: string | null;
  is_laftel_only: boolean;
  is_uncensored: boolean;
  is_dubbed: boolean;
  is_avod: boolean;
  avod_status: string;
  is_viewing: boolean;
  latest_episode_created: string | null;
  latest_published_datetime: string | null;
  is_episode_existed: boolean;
  is_expired: boolean;
  rating: number;
  highlight_video: string | null;
}

export interface AnimeImage {
  crop_ratio: string;
  img_url: string;
  option_name: string;
}
