import axios from "axios";

export const api = axios.create({
    baseURL:
        process.env.NEXT_PUBLIC_API_URL?.trim() ||
        "http://localhost:8080/uv-api/v1",

    timeout: 10000,

    // withCredentials: true,

    headers: {
        "Content-Type": "application/json",
    },
});