import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export const commonAPI = async (
  httpRequest: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  reqBody?: any,
  reqHeader?: Record<string, string>
): Promise<AxiosResponse<any>> => {
  const reqConfig: AxiosRequestConfig = {
    method: httpRequest,
    url,
    data: reqBody,
    headers: reqHeader ? reqHeader : { "Content-Type": "application/json" },
  };

  try {
    const result = await axios(reqConfig);
    return result;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('Axios error:', err.response?.data);
    } else {
      console.error('Unexpected error:', err);
    }
    return Promise.reject(err);
  }
};