// services/api.ts
import axios from "axios";
import * as SecureStore from "expo-secure-store";

// Use your actual backend URL - replace with your correct URL
const API_URL = process.env.EXPO_PUBLIC_API_URL ; // Use your computer's IP

console.log("API URL configured as:", API_URL);

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

api.interceptors.request.use(async (config) => {
    // Only set the token if one is not already present
    if (!config.headers.Authorization) {
        const token = await SecureStore.getItemAsync("authToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }

    console.log("Making API request to:", config.url);
    return config;
});

api.interceptors.response.use(
    (response) => {
        console.log("API response success:", response.status);
        return response;
    },
    (error) => {
        console.error("API Error details:", {
            url: error.config?.url,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        return Promise.reject(error);
    }
);

export default api;