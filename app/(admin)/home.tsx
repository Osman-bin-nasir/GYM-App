// app/home-admin.tsx
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";

export default function HomeAdmin() {
    const { profile, logout } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState({
        totalMembers: 0,
        todayAttendance: 0,
        activeMembers: 0,
        monthlyRevenue: 0,
    });

    useEffect(() => {
        // TODO: Replace with real API calls
        setStats({
            totalMembers: 150,
            todayAttendance: 45,
            activeMembers: 120,
            monthlyRevenue: 4250,
        });
    }, []);

    const handleLogout = async () => {
        await logout();
        router.replace("/login-admin");
    };

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <View className="p-4">
                {/* Header */}
                <View className="bg-white rounded-xl p-6 shadow-sm mb-4">
                    <Text className="text-2xl font-bold text-gray-800">Welcome back!</Text>
                    <Text className="text-gray-600 mt-1">
                        {profile?.name || "Admin"} • {new Date().toLocaleDateString()}
                    </Text>
                </View>

                {/* Stats Grid */}
                <View className="flex-row flex-wrap justify-between mb-6">
                    <View className="bg-blue-500 rounded-xl p-4 w-[48%] mb-4 shadow-sm">
                        <Text className="text-white text-lg font-semibold">Total Members</Text>
                        <Text className="text-white text-3xl font-bold mt-2">{stats.totalMembers}</Text>
                    </View>

                    <View className="bg-green-500 rounded-xl p-4 w-[48%] mb-4 shadow-sm">
                        <Text className="text-white text-lg font-semibold">Today's Attendance</Text>
                        <Text className="text-white text-3xl font-bold mt-2">{stats.todayAttendance}</Text>
                    </View>

                    <View className="bg-purple-500 rounded-xl p-4 w-[48%] shadow-sm mb-4">
                        <Text className="text-white text-lg font-semibold">Active Members</Text>
                        <Text className="text-white text-3xl font-bold mt-2">{stats.activeMembers}</Text>
                    </View>

                    <View className="bg-orange-500 rounded-xl p-4 w-[48%] shadow-sm mb-4">
                        <Text className="text-white text-lg font-semibold">Monthly Revenue</Text>
                        <Text className="text-white text-3xl font-bold mt-2">${stats.monthlyRevenue}</Text>
                    </View>
                </View>

                {/* Quick Actions */}
                <View className="bg-white rounded-xl p-6 shadow-sm mb-4">
                    <Text className="text-xl font-bold text-gray-800 mb-4">Quick Actions</Text>

                    <TouchableOpacity
                        className="bg-blue-100 p-4 rounded-lg flex-row items-center mb-3"
                        onPress={() => router.push("/attendance")}
                    >
                        <Text className="text-blue-500 font-bold mr-3">📊</Text>
                        <Text className="font-semibold text-gray-800">Mark Attendance</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="bg-green-100 p-4 rounded-lg flex-row items-center mb-3"
                        onPress={() => router.push("/members")}
                    >
                        <Text className="text-green-500 font-bold mr-3">👥</Text>
                        <Text className="font-semibold text-gray-800">Manage Members</Text>
                    </TouchableOpacity>

                    {/* QR Code Actions */}
                    <TouchableOpacity
                        className="bg-purple-100 p-4 rounded-lg flex-row items-center mb-3"
                        onPress={() => router.push("/(admin)/qr-generator")}
                    >
                        <Text className="text-purple-500 font-bold mr-3">📱</Text>
                        <Text className="font-semibold text-gray-800">Generate QR Code</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="bg-orange-100 p-4 rounded-lg flex-row items-center"
                        onPress={() => router.push("/(admin)/scan-member-qr")}
                    >
                        <Text className="text-orange-500 font-bold mr-3">🔍</Text>
                        <Text className="font-semibold text-gray-800">Scan Member QR</Text>
                    </TouchableOpacity>
                </View>

                {/* Logout */}
                <TouchableOpacity
                    className="bg-red-500 p-4 rounded-xl mt-6 shadow-sm"
                    onPress={handleLogout}
                >
                    <Text className="text-white font-bold text-center">Logout</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}