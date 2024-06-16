import axios from 'axios';

const axiosFetch = async ({ method, url, data }, contentType = 'application/json') => {
  const token = localStorage.getItem('token');

  try {
    const response = await axios({
      method,
      url,
      headers: {
        'Content-Type': contentType,
        'Authorization': `Bearer ${token}`,
      },
      data,
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response ? error.response.data.message :
                          error.request ? "No response received from the server" :
                          "Error setting up the request";
    return Promise.reject(new Error(errorMessage));
  }
};

const axiosGet = (url) => axiosFetch({ method: 'GET', url });
const axiosPost = (url, data) => axiosFetch({ method: 'POST', url, data });

const url = import.meta.env.VITE_BACKEND_URL;

export const getEthereumPrice = async () => {
  return axiosGet("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD,EUR,CNY,JPY,GBP");
}

export const getEthereumNews = async () => {
  const date = new Date().getTime();
  const lastFetch = localStorage.getItem("lastFetch");
  const twoHours = 7200000;

  if (!lastFetch || date - lastFetch > twoHours) {
    const response = await axiosGet(`https://newsdata.io/api/1/latest?apikey=${import.meta.env.VITE_ETH_NEWS_API_KEY}&q=ethereum`);
    localStorage.setItem("news", JSON.stringify(response));
    localStorage.setItem("lastFetch", date);
    return response;
  } else {
    return JSON.parse(localStorage.getItem("news"));
  }
}

export const getAIAnswer = (message, history) => {
  return axiosPost(`${url}/aiAnswer`, { message, history });
}

export const loginUser = (email, password) => {
  return axiosPost(`${url}/login`, { email, password });
}

export const verifyUser = (user_id, verificationCode) => {
  return axiosPost(`${url}/verify`, { user_id, verification_code: verificationCode });
}

export const registerUser = (firstName, lastName, email, password, twoFactor) => {
  return axiosPost(`${url}/register`, { first_name: firstName, last_name: lastName, email, password, two_factor_enabled: twoFactor });
}

export const getingQRCode = (user_id) => {
  return axiosPost(`${url}/qrcode`, { user_id });
}

export const change2FA = (twoFactor) => {
  return axiosPost(`${url}/change2fa`, { two_factor_enabled: twoFactor });
}

export const getUser = () => {
  return axiosGet(`${url}/user`);
}

export const saveAccountToDB = (address, name, password) => {
  return axiosPost(`${url}/account`, { address, name, password });
}

export const restoreAccount = (password, address) => {
  return axiosPost(`${url}/restoreAccount`, { password, address });
}

export const postTransaction = (transaction_hash, amount, sender_address, receiver_address) => {
  return axiosPost(`${url}/transaction`, { transaction_hash, amount, sender_address, receiver_address });
}

export const checkPassword = (password) => {
  return axiosPost(`${url}/checkPassword`, { password });
}
