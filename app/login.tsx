import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "expo-router";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { setUser } = useAuth();
    const router = useRouter();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please enter both email and password");
            return;
        }

        setLoading(true);
        try {
            console.log("Attempting login with:", email);
            const user = await login(email, password);
            console.log("Login successful:", user);
            setUser(user);
            router.replace("/home");
        } catch (error: any) {
            console.error("Login error:", error);
            Alert.alert("Login Failed", error.response?.data?.msg || error.message || "Invalid email or password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 justify-center p-4 bg-gray-100">
            <Text className="text-2xl font-bold mb-6 text-center">Login</Text>

            <TextInput
                className="h-12 border border-gray-400 rounded px-3 mb-4 bg-white"
                placeholder="Email"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
            />

            <TextInput
                className="h-12 border border-gray-400 rounded px-3 mb-4 bg-white"
                placeholder="Password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
            />

            <TouchableOpacity
                className="bg-blue-500 p-4 rounded-lg mt-2"
                onPress={handleLogin}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text className="text-white font-bold text-center">Login</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}