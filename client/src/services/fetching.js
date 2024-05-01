import { axiosPost } from "./fetchMethods";

// * POST request to /api/login
export const loginUser = async (email, password) => {
  const url = "http://localhost:3001/api/login";
  const data = {
    "email": email,
    "password": password
  }
  try {
    const response = await axiosPost(url, data);
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else if (error.request) {
      throw new Error("No response received from the server");
    } else {
      throw new Error("Error setting up the request");
    }
  }
};

// * POST request to /api/register
export const registerUser = async (firstName, lastName, email, password) => {
  const url = "http://localhost:3001/api/register";
  const data = {
    "first_name": firstName,
    "last_name": lastName,
    "email": email,
    "password": password
  }
  try {
    const response = await axiosPost(url, data);
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else if (error.request) {
      throw new Error("No response received from the server");
    } else {
      throw new Error("Error setting up the request");
    }
  }
}