// app/login-admin.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "expo-router";
import api from "../../services/api";
import {Ionicons} from "@expo/vector-icons";

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
            router.replace("..//(admin)/home");
        } catch (err: any) {
            Alert.alert("Login failed", err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="flex-1 justify-center p-6 bg-white">
                <View className="w-full max-w-sm mx-auto">
                    <TouchableOpacity
                        className="absolute top-4 left-4 z-50"
                        onPress={() => router.back()}
                        style={{ zIndex: 999 }}
                    >
                        <Ionicons name="arrow-back" size={24} color="#2563EB" />
                    </TouchableOpacity>
                    <Text className="text-3xl font-bold mb-2 text-center text-blue-600">Fitzone</Text>
                    <Text className="text-lg mb-6 text-center text-gray-600">Sign in to your admin account</Text>
                    <TextInput
                        className="h-12 border border-gray-300 rounded-lg px-4 mb-4 bg-white"
                        placeholder="Email"
                        placeholderTextColor="gray"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                    />
                    <TextInput
                        className="h-12 border border-gray-300 rounded-lg px-4 mb-4 bg-white"
                        placeholder="Password"
                        placeholderTextColor="gray"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity
                        className="bg-blue-500 py-3 rounded-lg mt-2"
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-center">Sign In</Text>}
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}