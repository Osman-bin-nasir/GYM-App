// app/login-admin.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "expo-router";
import api from "../services/api";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const router = useRouter();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please enter email and password");
            return;
        }

        setLoading(true);
        try {
            const res = await api.post("/auth/login", { email, password });
            const { token, admin } = res.data;
            await signIn(token, "admin", { id: admin.id, name: admin.name, email: admin.email });
            router.replace("/home-admin");
        } catch (err: any) {
            Alert.alert("Login failed", err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 justify-center p-4 bg-gray-100">
            <Text className="text-2xl font-bold mb-6 text-center">Admin Login</Text>
            <TextInput
                className="h-12 border border-gray-400 rounded px-3 mb-4 bg-white"
                placeholder="Email"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
            />
            <TextInput
                className="h-12 border border-gray-400 rounded px-3 mb-4 bg-white"
                placeholder="Password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <TouchableOpacity
                className="bg-blue-500 p-4 rounded-lg mt-2"
                onPress={handleLogin}
                disabled={loading}
            >
                {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-center">Login</Text>}
            </TouchableOpacity>
        </View>
    );
}
