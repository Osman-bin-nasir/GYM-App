// app/member-login/login.tsx
import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

export default function MemberLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [gym, setGym] = useState("");
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const router = useRouter();

    const handleLogin = async () => {
        if (!email || !password || !gym) {
            Alert.alert("Error", "All fields are required");
            return;
        }

        setLoading(true);
        try {
            const res = await api.post("/member-auth/login", {
                email,
                password,
                gymIdentifier: gym,
            });
            const { token, member } = res.data;
            await signIn(token, "member", {
                id: member.id,
                name: member.name,
                email: member.email,
                phone: member.phone,
                plan: member.plan,
                expiryDate: member.expiryDate,
            });
            router.replace("/(member)/home");
        } catch (err: any) {
            Alert.alert("Login failed", err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 justify-center p-4 bg-gray-100">
            <Text className="text-2xl font-bold mb-6 text-center">Member Login</Text>
            <TextInput
                className="h-12 border border-gray-400 rounded px-3 mb-4 bg-white"
                placeholder="Email"
                placeholderTextColor="gray"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
            />
            <TextInput
                className="h-12 border border-gray-400 rounded px-3 mb-4 bg-white"
                placeholder="Password"
                placeholderTextColor="gray"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TextInput
                className="h-12 border border-gray-400 rounded px-3 mb-4 bg-white"
                placeholder="Gym Identifier"
                placeholderTextColor="gray"
                value={gym}
                onChangeText={setGym}
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
            <TouchableOpacity
                className="bg-gray-200 p-4 rounded-lg mt-4"
                onPress={() => router.push("/member-login/request-otp")}
            >
                <Text className="text-gray-800 font-semibold text-center">
                    Don’t have a password? Set it up
                </Text>
            </TouchableOpacity>
        </View>
    );
}
