// app/member-login/set-password.tsx
import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, Alert } from "react-native";
import { useRouter } from "expo-router";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function SetPassword() {
    const [password, setPassword] = useState("");
    const router = useRouter();
    const { tempToken, clearTempToken } = useAuth(); // Retrieve tempToken from AuthContext

    const handleSet = async () => {
        try {
            if (!tempToken) {
                Alert.alert("Error", "Missing token. Please restart login flow.");
                return;
            }

            await api.post(
                "/member-auth/set-password",
                { password },
                { headers: { Authorization: `Bearer ${tempToken}` } }
            );

            Alert.alert("Success", "Password set. Please login.");
            clearTempToken(); // Clear tempToken after success
            router.replace("/member-login/login");
        } catch (err: any) {
            Alert.alert("Error", err.response?.data?.msg || err.message);
        }
    };

    return (
        <View className="flex-1 justify-center p-4 bg-gray-100">
            <Text className="text-2xl font-bold mb-6 text-center">Set Password</Text>
            <TextInput
                className="h-12 border border-gray-400 rounded px-3 mb-4 bg-white text-lg"
                placeholder="New Password"
                placeholderTextColor="gray"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity
                className="bg-blue-500 p-4 rounded-lg mt-2"
                onPress={handleSet}
            >
                <Text className="text-white font-bold text-center text-lg">Set Password</Text>
            </TouchableOpacity>
        </View>
    );
}