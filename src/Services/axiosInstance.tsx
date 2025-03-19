import axios from "axios";

const BASE_URLS: Record<number, string> = {
  3004: import.meta.env.VITE_REACT_APP_TICKETS,
  3001:import.meta.env.VITE_REACT_APP_LEADS,
  5001: import.meta.env.VITE_REACT_APP_FRAMEWORK
};

const createInstance = (
  port: number,
  contentType: string,
  useAuth: boolean
) => {
  const baseURL = BASE_URLS[port];
  let headers: Record<string, string> = {
    "Content-Type": contentType,
    Accept: "application/json",
  };



  if (useAuth) {
    const authToken: string | null = sessionStorage.getItem("authToken");
    if (authToken) {
      headers = { ...headers, Authorization: `${authToken}`};
    }
  }
// console.log(headers,"headers");

  return axios.create({
    baseURL,
    headers,
  });
};

const baseInstance = (port: number) =>
  createInstance(port, "application/json", false);

const authInstance = (port: number) =>
  createInstance(port, "application/json", true);

const MauthInstance = (port: number) =>
  createInstance(port, "multipart/form-data", true);

export default { baseInstance, authInstance, MauthInstance };
