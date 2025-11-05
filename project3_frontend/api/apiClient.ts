import axios from 'axios';

const API_BASE_URL = 'https://cst438-p3-backend-de9dd99b3c9a.herokuapp.com'; 



const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});


export default apiClient;