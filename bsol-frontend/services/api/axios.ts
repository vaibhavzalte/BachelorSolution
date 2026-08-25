import axios from 'axios';
import { attachInterceptors } from '@/services/api/interceptors';

export const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    'http://localhost:8080/uv-api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

attachInterceptors(api);
