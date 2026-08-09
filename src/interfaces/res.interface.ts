export interface ResType<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface MetaType {
  count: number;
  page: number;
  limit: number;
  total: number;
}

export interface MetaResType<T = any> {
  success: boolean;
  message: string;
  data: {
    data: T;
    meta: MetaType;
  };
}
