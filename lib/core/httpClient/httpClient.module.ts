import { AxiosRequestConfig, AxiosResponse } from 'axios';

export type HttpRequestConfig = AxiosRequestConfig;
export type HttpResponse<T = any> = AxiosResponse<T>;

export interface HttpClientModule {
  get: <T = any, R = HttpResponse<T>>(
    url: string,
    config?: HttpRequestConfig,
  ) => Promise<R>;
  post: (
    url: string,
    data?: any,
    config?: HttpRequestConfig,
  ) => Promise<HttpResponse>;
  put: (
    url: string,
    data?: any,
    config?: HttpRequestConfig,
  ) => Promise<HttpResponse>;
  delete: (url: string, config?: HttpRequestConfig) => Promise<HttpResponse>;
  patch: (
    url: string,
    data?: any,
    config?: HttpRequestConfig,
  ) => Promise<HttpResponse>;
}
