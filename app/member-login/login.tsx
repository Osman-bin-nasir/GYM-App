import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, Alert, ActivityIndicator, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { Ionicons } from "@expo/vector-icons";

export default function MemberLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [gym, setGym] = useState("");
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const router = useRouter();
    const handleLogin = async () => {
        if (!email || !password || !gym) {
            Alert.alert("Error", "All fields are required");
            return;
        }

        console.log("🔹 Starting login request...");
        console.log("📧 Email:", email);
        console.log("🏋️‍♂️ Gym Identifier:", gym);

        setLoading(true);
        try {
            console.log("➡️ Sending POST request to /member-auth/login...");
            const res = await api.post("/member-auth/login", {
                email,
                password,
                gymIdentifier: gym,
            });

            console.log("✅ Response received from API:", res.status);
            console.log("📦 Response data:", res.data);

            const { token, member } = res.data;
            console.log("🪪 Token:", token);
            console.log("👤 Member:", member);

            await signIn(token, "member", {
                id: member.id,
                name: member.name,
                email: member.email,
                phone: member.phone,
                plan: member.plan,
                expiryDate: member.expiryDate,
            });

            console.log("🎉 Login successful — redirecting to /home");
            router.replace("/(member)/home");

        } catch (err: any) {
            console.error("❌ Login failed:", err);
            console.error("🧾 Error details:", err.response?.data || err.message);

            Alert.alert(
                "Login failed",
                err.response?.data?.msg || err.message || "Something went wrong"
            );
        } finally {
            console.log("🔚 Login process finished");
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
                    <Text className="text-lg mb-6 text-center text-gray-600">Sign in to your account</Text>
                    <TextInput
                        className="h-12 border border-gray-300 rounded-lg px-4 mb-4 bg-white"
                        placeholder="Email"
                        placeholderTextColor="gray"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                    />
                    <View className="flex-row items-center border border-gray-300 rounded-lg px-4 mb-4 bg-white">
                        <TextInput
                            className="h-12 flex-1"
                            placeholder="Password"
                            placeholderTextColor="gray"
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="gray" />
                        </TouchableOpacity>
                    </View>
                    <TextInput
                        className="h-12 border border-gray-300 rounded-lg px-4 mb-4 bg-white"
                        placeholder="Gym Identifier"
                        placeholderTextColor="gray"
                        value={gym}
                        onChangeText={setGym}
                    />
                    <TouchableOpacity
                        className="bg-blue-500 py-3 rounded-lg mt-2"
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white font-bold text-center">Sign In</Text>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="bg-transparent mt-4"
                        onPress={() => router.push("/member-login/request-otp")}
                    >
                        <Text className="text-blue-500 font-semibold text-center">
                            Don’t have a password? Set one up
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}