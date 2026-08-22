import '@/services/api/interceptors';
import axios from 'axios';

export const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    'http://localhost:8080/uv-api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});
