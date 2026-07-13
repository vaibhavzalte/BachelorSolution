import { api } from "./axios";

api.interceptors.request.use((config) => {

    console.log(
        `[API] ${config.method?.toUpperCase()} ${config.url}`
    );

    return config;
});


api.interceptors.response.use(

    (response) => response,

    (error) => {

        if (error.response?.status === 401) {

            console.log("Unauthorized");

        }

        return Promise.reject(error);

    }

);