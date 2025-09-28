// app/member-login/verify-otp.tsx
import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { verifyOtp as verifyOtpService } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

export default function VerifyOtp() {
    const [otp, setOtp] = useState("");
    const router = useRouter();
    const { email, gym } = useLocalSearchParams<{ email: string; gym: string }>();
    const { setTempToken } = useAuth(); // Use AuthContext to store token

    const handleVerify = async () => {
        try {
            const res = await verifyOtpService(email, gym, otp);

            const { token } = res;
            setTempToken(token); // Store token in AuthContext

            router.push("/member-login/set-password"); // Navigate without params
        } catch (err: any) {
            Alert.alert("Error", err.response?.data?.msg || err.message);
        }
    };

    return (
        <View className="flex-1 justify-center p-4 bg-gray-100">
            <Text className="text-2xl font-bold mb-6 text-center">Enter OTP</Text>
            <TextInput
                className="h-12 border border-gray-400 rounded px-3 mb-4 bg-white text-lg"
                placeholder="6-digit OTP"
                placeholderTextColor="gray"
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
            />
            <TouchableOpacity
                className="bg-blue-500 p-4 rounded-lg mt-2"
                onPress={handleVerify}
            >
                <Text className="text-white font-bold text-center text-lg">Verify OTP</Text>
            </TouchableOpacity>
        </View>
    );
}