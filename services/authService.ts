// services/authService.ts
import api from './api';
import * as SecureStore from 'expo-secure-store';

export const login = async (email: string, password: string) => {
    try {
        console.log("Login attempt with email:", email);

        // Try different possible endpoints - adjust based on your backend
        const endpoints = [
            '/auth/login',
            '/api/auth/login',
            '/admin/login',
            '/login'
        ];

        let response;
        let lastError;

        for (const endpoint of endpoints) {
            try {
                console.log("Trying endpoint:", endpoint);
                response = await api.post(endpoint, {
                    email: email.trim().toLowerCase(),
                    password
                });
                console.log("Success with endpoint:", endpoint);
                break;
            } catch (error: any) {
                lastError = error;
                console.log("Failed with endpoint:", endpoint, error.response?.status);
                continue;
            }
        }

        if (!response) {
            throw lastError || new Error("All endpoints failed");
        }

        console.log("Login response data:", response.data);

        const { token, admin, user } = response.data;
        const userData = admin || user || response.data;

        if (!token) {
            throw new Error("No token received from server");
        }

        // Store the token securely
        await SecureStore.setItemAsync('authToken', token);

        return {
            token,
            ...userData,
            email: userData.email || email
        };
    } catch (error: any) {
        console.error("Auth service error details:", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        throw error;
    }
};

export const logout = async () => {
    await SecureStore.deleteItemAsync('authToken');
};

export const setPassword = async (password: string, tempToken: string) => {
    const response = await api.post('/member-auth/set-password', { password }, {
        headers: { Authorization: `Bearer ${tempToken}` },
    });
    return response.data;
};

export const requestOtp = async (email: string, gymIdentifier: string) => {
    const response = await api.post('/member-auth/request-otp', { email, gymIdentifier });
    return response.data;
};

export const verifyOtp = async (email: string, gymIdentifier: string, otp: string) => {
    const response = await api.post('/member-auth/verify-otp', { email, gymIdentifier, otp });
    return response.data;
};

export const memberLogin = async (email: string, password: string) => {
    const response = await api.post('/member-auth/login', { email, password });
    const { token } = response.data;
    await SecureStore.setItemAsync('authToken', token);
    return response.data;
};