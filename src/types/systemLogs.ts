export interface ILogger {
  id: number;
  levelName: string;
  levelCode: number;
  message: string;
  type?: string | null;
  status?: number | null;
  stack?: string | null;
  contexts?: string[] | [];
  pid: number;
  time: number;
  hostname: string;
  keep: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type LoggerUpdate = Pick<ILogger, 'keep'>;

export interface IPagesInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IPaginatedResponse {
  info: IPagesInfo;
  results: ILogger[];
}

export type OrderDirection = 'ASC' | 'DESC';

export interface IPagesOptions {
  searchField?: string;
  search?: unknown;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: OrderDirection;
}

export interface IActionResponse {
  message: string;
  results: ILogger;
}
