import { axiosPost, axiosGet } from "./fetchMethods";

const url = import.meta.env.VITE_BACKEND_URL

// * GET request for the live price of Ethereum
export const getEthereumPrice = async () => {
  try {
    const response = await axiosGet("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD,EUR,CNY,JPY,GBP");
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

// * GET request for the latest Ethereum news
export const getEthereumNews = async () => {
  try {
    const date = new Date();
    const currentDate = date.getTime();
    const twoHours = 7200000;
    const lastFetch = localStorage.getItem("lastFetch");
    if (!lastFetch || currentDate - lastFetch > twoHours) {
      const response = await axiosGet(`https://newsdata.io/api/1/latest?apikey=${import.meta.env.VITE_ETH_NEWS_API_KEY}&q=ethereum`);
      localStorage.setItem("news", JSON.stringify(response));
      localStorage.setItem("lastFetch", currentDate);
      return response;
    } else {
      const response = JSON.parse(localStorage.getItem("news"));
      return response;
    }
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

// * POST request to /api/aiAnswer
export const getAIAnswer = async (message, history) => {
  const data = {
    "message": message,
    "history": history
  }
  try {
    const response = await axiosPost(url + "/aiAnswer", data);
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

// * POST request to /api/verify
export const verifyUser = async (user_id, verificationCode) => {
  const data = {
    "user_id": user_id,
    "verification_code": verificationCode
  }
  try {
    const response = await axiosPost(url + "/verify", data);
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

// * POST request to /api/register
export const registerUser = async (firstName, lastName, email, password, twoFactor) => {
  const data = {
    "first_name": firstName,
    "last_name": lastName,
    "email": email,
    "password": password,
    "two_factor_enabled": twoFactor
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

// * POST request to /api/2fa
export const getingQRCode = async (user_id) => {
  const data = {
    "user_id": user_id
  }
  try {
    const response = await axiosPost(url + "/qrcode", data);
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

// * POST request to /api/change2fa
export const change2FA = async (twoFactor) => {
  const data = {
    "two_factor_enabled": twoFactor
  }
  try {
    const response = await axiosPost(url + "/change2fa", data);
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
export const saveAccountToDB = async (address, name, password) => {
  const data = {
    address: address,
    name: name,
    password: password
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

// * POST request to /api/restoreAccount
export const restoreAccount = async (password, address) => {
  const data = {
    password: password,
    address: address
  }
  try {
    const response = await axiosPost(url + "/restoreAccount", data);
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

// * POST request to /api/checkPassword

export const checkPassword = async (password) => {
  try {
    const data = {
      password: password
    }
    const response = await axiosPost(url + "/checkPassword", data);
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

