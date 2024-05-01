import { axiosPost } from "./fetchMethods";

// * POST request to /api/login

export const loginUser = async (email, password) => {
  const url = "/api/login";
  const data = { email, password };
  return axiosPost(url, data);
};