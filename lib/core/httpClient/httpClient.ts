/* eslint  @typescript-eslint/no-explicit-any: 0 */
import axios from "axios";
import btoa from "btoa";
import { detect as detectPlatform } from "detect-browser";
import packageJson from "../../../package.json";
import { validateEmail, validatePassword } from "../validator";

import { HttpClientModule, HttpRequestConfig, HttpResponse } from "./httpClient.module";

export const createHttpClient = (
  username: string,
  password: string
): HttpClientModule => {
  const emailValidationResult = validateEmail(username);

  if (!emailValidationResult.isValid) {
    throw emailValidationResult.cause;
  }

  const passwordValidationResult = validatePassword(password);

  if (!passwordValidationResult.isValid) {
    throw passwordValidationResult.cause;
  }

  const platformInfo = detectPlatform();

  const basicAuth = btoa(`${username}:${password}`);
  const client = axios.create({
    baseURL: "https://api.sipgate.com/v2",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "X-Sipgate-Client": JSON.stringify(platformInfo),
      "X-Sipgate-Version": packageJson.version
    }
  });

  return {
    delete<T = any, R = HttpResponse<T>>(
      url: string,
      config?: HttpRequestConfig
    ): Promise<R> {
      return client.delete(url, config);
    },

    get<T = any, R = HttpResponse<T>>(
      url: string,
      config?: HttpRequestConfig
    ): Promise<R> {
      return client.get(url, config);
    },

    patch<T = any, R = HttpResponse<T>>(
      url: string,
      data?: any,
      config?: HttpRequestConfig
    ): Promise<R> {
      return client.patch(url, data, config);
    },

    post<T = any, R = HttpResponse<T>>(
      url: string,
      data?: any,
      config?: HttpRequestConfig
    ): Promise<R> {
      return client.post(url, data, config);
    },

    put<T = any, R = HttpResponse<T>>(
      url: string,
      data?: any,
      config?: HttpRequestConfig
    ): Promise<R> {
      return client.put(url, data, config);
    }
  };
};
