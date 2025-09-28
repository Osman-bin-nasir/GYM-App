// app/member-login/set-password.tsx
import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, Alert } from "react-native";
import { useRouter } from "expo-router";
import { setPassword as setPasswordService } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

export default function SetPassword() {
    const [password, setPassword] = useState("");
    const router = useRouter();
    const { tempToken, clearTempToken } = useAuth(); // Get the temporary token

    const handleSet = async () => {
        try {
            if (!tempToken) {
                Alert.alert("Error", "No session token. Please restart the process.");
                return;
            }

            // Use the dedicated service, passing the temporary token
            const res = await setPasswordService(password, tempToken);

            Alert.alert("Success", res.msg || "Password set successfully. Please login.");
            clearTempToken(); // Clear the temporary token after use
            router.replace("/member-login/login");
        } catch (err: any) {
            console.error("Set password error:", err.response?.data || err.message);
            Alert.alert("Error", err.response?.data?.msg || "Something went wrong");
        }
    };

    return (
        <View className="flex-1 justify-center p-4 bg-gray-100">
            <Text className="text-2xl font-bold mb-6 text-center">Set New Password</Text>
            <TextInput
                className="h-12 border border-gray-400 rounded px-3 mb-4 bg-white text-lg"
                placeholder="Enter New Password"
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
