// app/member-login/request-otp.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import api from "../../services/api";

export default function RequestOtp() {
    const [email, setEmail] = useState("");
    const [gym, setGym] = useState("");
    const router = useRouter();

    const handleRequest = async () => {
        try {
            await api.post("/member-auth/request-otp", { email, gymIdentifier: gym });
            Alert.alert("OTP sent", "Check your email for the code");
            router.push({
                pathname: "/member-login/verify-otp",
                params: { email, gym },
            });
        } catch (err: any) {
            Alert.alert("Error", err.response?.data?.message || err.message);
        }
    };

    return (
        <View className="flex-1 justify-center p-4 bg-gray-100">
            <Text className="text-2xl font-bold mb-6 text-center">Member Login</Text>
            <TextInput
                className="h-12 border border-gray-400 rounded px-3 mb-4 bg-white"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
            />
            <TextInput
                className="h-12 border border-gray-400 rounded px-3 mb-4 bg-white"
                placeholder="Gym Identifier"
                value={gym}
                onChangeText={setGym}
            />
            <TouchableOpacity className="bg-blue-500 p-4 rounded-lg" onPress={handleRequest}>
                <Text className="text-white font-bold text-center">Request OTP</Text>
            </TouchableOpacity>
        </View>
    );
}
