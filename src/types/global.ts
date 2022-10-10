export interface AnyObject {
  [key: string]: unknown;
}

export interface Options {
  value: unknown;
  label: string;
}

export interface NodeOptions extends Options {
  children?: NodeOptions[];
}

export interface GetParams {
  body: null;
  type: string;
  url: string;
}

export interface PostData {
  body: string;
  type: string;
  url: string;
}

export interface Pagination {
  current: number;
  pageSize: number;
  total?: number;
}

export type TimeRanger = [string, string];

export interface GeneralChart {
  xAxis: string[];
  data: Array<{ name: string; value: number[] }>;
}

export interface WeatherNow {
  cloud: string;
  dew: string;
  feelsLike: string;
  humidity: string;
  icon: string;
  obsTime: string;
  precip: string;
  pressure: string;
  temp: string;
  text: string;
  vis: string;
  wind360: string;
  windDir: string;
  windScale: string;
  windSpeed: string;
}
