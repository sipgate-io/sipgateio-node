import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import btoa from 'btoa';
import pjson from 'pjson';

export const BASE_URL = 'https://api.sipgate.com/v2';

export class HttpClient {
  private client: AxiosInstance;

  constructor(username: string, password: string, baseUrl?: string) {
    const basicAuth = btoa(`${username}:${password}`);
    this.client = axios.create({
      baseURL: baseUrl || BASE_URL,
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'X-Sipgate-Client': 'lib-node',
        'X-Sipgate-Version': pjson.version,
      },
    });
  }

  public get(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.client.get(url, config);
  }

  public post(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse> {
    return this.client.post(url, data, config);
  }

  public put(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse> {
    return this.client.put(url, data, config);
  }

  public delete(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse> {
    return this.client.delete(url, config);
  }

  public patch(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse> {
    return this.client.put(url, data, config);
  }
}
