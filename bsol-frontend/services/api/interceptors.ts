import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

export const attachInterceptors = (objApi: AxiosInstance) => {
  objApi.interceptors.request.use((objConfig: InternalAxiosRequestConfig) => {
    console.log(
      `[API] ${objConfig.method?.toUpperCase()} ${objConfig.url}`,
    );
    return objConfig;
  });

  objApi.interceptors.response.use(
    (objResponse) => objResponse,
    (objError) => {
      if (objError.response?.status === 401) {
        console.log('Unauthorized');
      }
      return Promise.reject(objError);
    },
  );
};
