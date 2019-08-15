import { AxiosRequestConfig, AxiosResponse } from 'axios';

export type HttpRequestConfig = AxiosRequestConfig;
export type HttpResponse = AxiosResponse;

export interface HttpClientModule {
  get: (url: string, config?: HttpRequestConfig) => Promise<HttpResponse>;
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
