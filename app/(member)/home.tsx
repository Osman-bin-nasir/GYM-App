// app/home-member.tsx
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    FlatList,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import api from "../../services/api"; // make sure this is your axios wrapper

export default function HomeMember() {
    const { profile, logout, token } = useAuth();
    const router = useRouter();
    const [attendance, setAttendance] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (token) {
            fetchAttendance();
        }
    }, [token]);

    const fetchAttendance = async () => {
        setLoading(true);
        try {
            const res = await api.get("/member/attendance", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAttendance(res.data);
        } catch (err: any) {
            console.log("Error loading attendance:", err.response?.data || err.message);
            Alert.alert("Error", "Failed to load attendance history.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        router.replace("/member-login/login");
    };

    const renderHeader = () => (
        <View>
            <View className="bg-white rounded-xl p-6 shadow-sm mb-4">
                <Text className="text-2xl font-bold text-gray-800">
                    Welcome, {profile?.name}
                </Text>
                <Text className="text-gray-600 mt-1">{profile?.email}</Text>
            </View>

            <View className="bg-white rounded-xl p-6 shadow-sm mb-4">
                <Text className="text-xl font-bold text-gray-800 mb-3">
                    My Attendance History
                </Text>
            </View>
        </View>
    );

    const renderFooter = () => (
        <View>
            <View className="bg-white rounded-xl p-6 shadow-sm my-4">
                <Text className="text-xl font-bold text-gray-800 mb-4">
                    Quick Actions
                </Text>

                <TouchableOpacity
                    className="bg-blue-500 p-4 rounded-xl shadow-sm mb-4"
                    onPress={() => router.push("/scan-gym-qr")}
                >
                    <Text className="text-white font-bold text-center text-lg">
                        Scan Gym QR Code
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-green-500 p-4 rounded-xl shadow-sm"
                    onPress={() => router.push("/(member)/my-qr-code")}
                >
                    <Text className="text-white font-bold text-center text-lg">
                        My QR Code
                    </Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                className="bg-red-500 p-4 rounded-xl shadow-sm"
                onPress={handleLogout}
            >
                <Text className="text-white font-bold text-center">Logout</Text>
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50">
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View className="flex-1 p-4 bg-gray-50">
            <FlatList
                data={attendance}
                keyExtractor={(item) => item._id}
                ListHeaderComponent={renderHeader}
                ListFooterComponent={renderFooter}
                renderItem={({ item }) => (
                    <View className="flex-row justify-between items-center p-4 mx-4 my-1 bg-gray-100 rounded-lg">
                        <Text className="text-base font-bold flex-1">
                            {new Date(item.date).toLocaleDateString()}
                        </Text>
                        <Text
                            className={`text-base font-bold text-green-500`}
                        >
                            Present
                        </Text>
                    </View>
                )}
                ListEmptyComponent={
                    <Text className="text-center mt-4 text-base text-gray-500">
                        No attendance records found
                    </Text>
                }
            />
        </View>
    );
}
