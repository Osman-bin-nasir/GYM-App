import api from "@/services/api";
import * as SecureStore from "expo-secure-store";

export const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", {email, password});

    if(res.data?.token) {
        await SecureStore.setItemAsync("authToken", res.data.token)
    }
    return res.data;
}

export const signup = async (email: string, password: string) => {
    const res = await api.post("/auth/signup", {email, password});

    if(res.data?.token) {
        await SecureStore.setItemAsync("authToken", res.data.token)
    }
    return res.data;
}

export const logout = async (token: string) => {
    await SecureStore.deleteItemAsync("authToken");
}