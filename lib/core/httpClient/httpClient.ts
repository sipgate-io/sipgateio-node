import axios from 'axios';
import btoa from 'btoa';
import pjson from 'pjson';
import { validateEmail, validatePassword } from '../validator';

import {
  HttpClientModule,
  HttpRequestConfig,
  HttpResponse,
} from './httpClient.module';

export const createHttpClient = (
  username: string,
  password: string,
): HttpClientModule => {
  validateEmail(username);
  validatePassword(password);

  const basicAuth = btoa(`${username}:${password}`);
  const client = axios.create({
    baseURL: 'https://api.sipgate.com/v2',
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'X-Sipgate-Client': 'lib-node',
      'X-Sipgate-Version': pjson.version,
    },
  });

  return {
    delete(url: string, config?: HttpRequestConfig): Promise<HttpResponse> {
      return client.delete(url, config);
    },

    get(url: string, config?: HttpRequestConfig): Promise<HttpResponse> {
      return client.get(url, config);
    },

    patch(
      url: string,
      data?: any,
      config?: HttpRequestConfig,
    ): Promise<HttpResponse> {
      return client.patch(url, data, config);
    },

    post(
      url: string,
      data?: any,
      config?: HttpRequestConfig,
    ): Promise<HttpResponse> {
      return client.post(url, data, config);
    },

    put(
      url: string,
      data?: any,
      config?: HttpRequestConfig,
    ): Promise<HttpResponse> {
      return client.put(url, data, config);
    },
  };
};
