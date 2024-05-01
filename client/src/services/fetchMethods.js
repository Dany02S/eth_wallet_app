import axios from 'axios';

const axiosFetch = async ({ method, url, data }, contentType = 'application/json') => {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': contentType,
    'Authorization': `Bearer ${token}`,
  };

  const axiosOptions = {
    method,
    url,
    headers,
    data,
  };

  try {
    const response = await axios(axiosOptions);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const axiosGet = (url) =>
  axiosFetch({ method: 'GET', url });

export const axiosPost = (url, data) =>
  axiosFetch({ method: 'POST', url, data });

export const axiosPut = (url, data) =>
  axiosFetch({ method: 'PUT', url, data });

export const axiosDelete = (url, data) =>
  axiosFetch({ method: 'DELETE', url, data });

export const axiosPatch = (url, data) =>
  axiosFetch({ method: 'PATCH', url, data });
