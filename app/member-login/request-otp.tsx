// app/member-login/request-otp.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, TouchableWithoutFeedback, Keyboard } from "react-native";
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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="flex-1 justify-center p-6 bg-white">
                <View className="w-full max-w-sm mx-auto">
                    <Text className="text-3xl font-bold mb-2 text-center text-blue-600">Fitzone</Text>
                    <Text className="text-lg mb-6 text-center text-gray-600">Request OTP to set password</Text>
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
                        placeholder="Gym Identifier"
                        placeholderTextColor="gray"
                        value={gym}
                        onChangeText={setGym}
                    />
                    <TouchableOpacity className="bg-blue-500 py-3 rounded-lg" onPress={handleRequest}>
                        <Text className="text-white font-bold text-center">Request OTP</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}