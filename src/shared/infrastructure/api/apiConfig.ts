import axios from 'axios';

const baseURL = 'http://10.0.2.2:8000/api/v1';

const axiosInstance = axios.create({
  baseURL,
});

export {axiosInstance};
