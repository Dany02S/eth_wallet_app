import { axiosPost, axiosGet } from "./fetchMethods";

const url = "http://localhost:3001/api";

// * POST request to /api/login
export const loginUser = async (email, password) => {
  const data = {
    "email": email,
    "password": password
  }
  try {
    const response = await axiosPost(url + "/login", data);
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
  const data = {
    "first_name": firstName,
    "last_name": lastName,
    "email": email,
    "password": password
  }
  try {
    const response = await axiosPost(url + "/register", data);
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

// * GET request to /api/user
export const getUser = async () => {
  try {
    const response = await axiosGet(url + "/user");
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

// * POST request to /api/address
export const saveAccountToDB = async (address, name) => {
  const data = {
    address: address,
    name: name
  }
  try {
    const response = await axiosPost(url + "/account", data);
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

// * POST request to /api/transaction

export const postTransaction = async (transaction_hash, amount, sender_address, receiver_address) => {
  try {
    const data = {
      transaction_hash: transaction_hash,
      amount: amount,
      sender_address: sender_address,
      receiver_address: receiver_address
    }
    const response = await axiosPost(url + "/transaction", data);
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
  
