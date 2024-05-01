import { axiosPost } from "./fetchMethods";

// * POST request to /api/login
export const loginUser = async (email, password) => {
  // Get the URL from the .env file
  const url = "http://localhost:3001/api/login";
  const data = { email, password };
  console.log(axiosPost(url, data));
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
  console.log(axiosPost(url, data));
}