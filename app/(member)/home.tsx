// app/home-member.tsx
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import api from "../../services/api";

type AttendanceToday = {
    status: "Present" | "Absent" | "Not Marked";
    checkInTime?: string;
};

export default function HomeMember() {
    const { profile, logout } = useAuth();
    const router = useRouter();
    const [attendance, setAttendance] = useState<AttendanceToday | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        setLoading(true);
        try {
            // You may need to adjust endpoint if backend changes
            const res = await api.get("/member/attendance/today");
            setAttendance(res.data);
        } catch (err: any) {
            console.log("No attendance record for today");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        router.replace("/member-login/login");
    };

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <View className="p-4">
                {/* Header */}
                <View className="bg-white rounded-xl p-6 shadow-sm mb-4">
                    <Text className="text-2xl font-bold text-gray-800">
                        Welcome, {profile?.name}
                    </Text>
                    <Text className="text-gray-600 mt-1">{profile?.email}</Text>
                </View>

                {/*/!* Membership Info *!/*/}
                {/*<View className="bg-purple-500 rounded-xl p-4 mb-4 shadow-sm">*/}
                {/*    <Text className="text-white text-lg font-semibold">Plan</Text>*/}
                {/*    <Text className="text-white text-2xl font-bold mt-1">{profile?.plan || "N/A"}</Text>*/}
                {/*    {profile?.expiryDate && (*/}
                {/*        <Text className="text-white mt-1">Expires: {new Date(profile.expiryDate).toLocaleDateString()}</Text>*/}
                {/*    )}*/}
                {/*</View>*/}

                {/* Attendance */}
                <View className="bg-white rounded-xl p-6 shadow-sm mb-4">
                    <Text className="text-xl font-bold text-gray-800 mb-3">Today's Attendance</Text>
                    {loading ? (
                        <ActivityIndicator />
                    ) : attendance ? (
                        <View>
                            <Text className="text-gray-700">Status: {attendance.status}</Text>
                            {attendance.checkInTime && (
                                <Text className="text-gray-700">Check-in: {attendance.checkInTime}</Text>
                            )}
                        </View>
                    ) : (
                        <Text className="text-gray-500">No record found for today</Text>
                    )}
                </View>

                {/* QR Code Actions */}
                <View className="bg-white rounded-xl p-6 shadow-sm mb-4">
                    <Text className="text-xl font-bold text-gray-800 mb-4">Quick Actions</Text>

                    <TouchableOpacity
                        className="bg-blue-500 p-4 rounded-xl shadow-sm mb-4"
                        onPress={() => router.push("/scan-gym-qr")}
                    >
                        <Text className="text-white font-bold text-center text-lg">Scan Gym QR Code</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="bg-green-500 p-4 rounded-xl shadow-sm"
                        onPress={() => router.push("/(member)/my-qr-code")}
                    >
                        <Text className="text-white font-bold text-center text-lg">My QR Code</Text>
                    </TouchableOpacity>
                </View>

                {/* Logout */}
                <TouchableOpacity
                    className="bg-red-500 p-4 rounded-xl shadow-sm"
                    onPress={handleLogout}
                >
                    <Text className="text-white font-bold text-center">Logout</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}