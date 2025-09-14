import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API_BASE = "https://joseph-trials-shelf-oh.trycloudflare.com/api";

const api = axios.create({
    baseURL: API_BASE,
    headers: {
        "Content-Type": "application/json",
    },
});

// 🔑 keeps the user logged in even when they close and reopen app
api.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync("authToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
