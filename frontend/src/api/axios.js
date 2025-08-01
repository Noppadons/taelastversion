// frontend/src/api/axios.js

import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api', // URL หลักของ Backend API ของเรา
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;