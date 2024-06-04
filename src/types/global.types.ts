export type ResponseType<T> = {
  message: string;
  data: T;
  pagination?: ResponsePaginationType;
};

export type ResponsePaginationType = {
  current: number;
  next?: number;
  prev?: number;
  totalCount: number;
  totalPages: number;
  limit: number;
};
