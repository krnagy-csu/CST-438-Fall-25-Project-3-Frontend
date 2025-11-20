// import axios from 'axios';
// import * as SecureStore from 'expo-secure-store';

// const API_BASE_URL = 'https://cst438-p3-backend.herokuapp.com';

// const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // 🔥 AUTO ADD JWT ON ALL REQUESTS
// apiClient.interceptors.request.use(async (config) => {
//   const token = await SecureStore.getItemAsync("jwt");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default apiClient;

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