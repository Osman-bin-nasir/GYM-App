// app/attendance.tsx
import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { getAttendance, markAttendance } from "../services/attendanceServices";

export default function Attendance() {
    const [attendance, setAttendance] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        loadAttendance();
    }, [selectedDate]);

    const loadAttendance = async () => {
        try {
            setLoading(true);
            const data = await getAttendance(selectedDate);
            setAttendance(data);
        } catch (error) {
            Alert.alert("Error", "Failed to load attendance");
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAttendance = async (memberId: string, present: boolean) => {
        try {
            await markAttendance(memberId, selectedDate, present);
            loadAttendance();
            Alert.alert(
                "Success",
                `Attendance ${present ? "marked" : "unmarked"} successfully`
            );
        } catch (error) {
            Alert.alert("Error", "Failed to mark attendance");
        }
    };

    return (
        <View className="flex-1 p-4 bg-gray-100">
            <Text className="text-2xl font-bold mb-5 text-center">
                Attendance Management
            </Text>

            {/* Date Selector */}
            <View className="flex-row justify-between items-center mb-5 p-3 bg-white rounded-lg">
                <Text className="text-base font-bold">Select Date:</Text>
                <Text className="text-base">{selectedDate}</Text>
            </View>

            {loading ? (
                <Text>Loading attendance...</Text>
            ) : (
                <FlatList
                    data={attendance}
                    keyExtractor={(item) => item._id || item.memberId}
                    renderItem={({ item }) => (
                        <View className="flex-row justify-between items-center p-4 my-1 bg-white rounded-lg shadow">
                            <Text className="text-base font-bold flex-1">
                                {item.memberName || `Member ${item.memberId}`}
                            </Text>
                            <View className="flex-row space-x-2">
                                <TouchableOpacity
                                    className={`px-4 py-2 rounded border ${
                                        item.present
                                            ? "bg-green-500 border-green-500"
                                            : "bg-gray-300 border-gray-300"
                                    }`}
                                    onPress={() => handleMarkAttendance(item.memberId, true)}
                                >
                                    <Text className="text-white font-bold">Present</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className={`px-4 py-2 rounded border ${
                                        !item.present
                                            ? "bg-red-500 border-red-500"
                                            : "bg-gray-300 border-gray-300"
                                    }`}
                                    onPress={() => handleMarkAttendance(item.memberId, false)}
                                >
                                    <Text className="text-white font-bold">Absent</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    ListEmptyComponent={
                        <Text className="text-center mt-12 text-base text-gray-500">
                            No attendance records found
                        </Text>
                    }
                />
            )}

            <TouchableOpacity
                className="mt-5 p-4 bg-blue-500 rounded-lg items-center"
                onPress={() => router.back()}
            >
                <Text className="text-white font-bold text-base">Back to Home</Text>
            </TouchableOpacity>
        </View>
    );
}
