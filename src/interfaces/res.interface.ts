// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ResType<T = any> {
  success: boolean;
  message: string;
  data: T;
}
