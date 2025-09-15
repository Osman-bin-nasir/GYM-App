import React from "react";
import { View, Text, ActivityIndicator, FlatList } from "react-native";
import { useFetch } from "../services/useFetch";
import { getAttendance } from "../services/attendanceServices";

export default function Index() {
    const { data: attendance, loading, error } = useFetch(getAttendance, []);

    if (loading) return <ActivityIndicator className="flex-1 justify-center items-center" />;
    if (error) return <Text className="flex-1 text-red-500">{error}</Text>;

    return (
        <View className="flex-1 bg-gray-100 p-4">
            <Text className="text-2xl font-bold mb-4">Attendance</Text>

            <FlatList
                data={attendance?.result || []}
                keyExtractor={(item) => item.memberId}
                renderItem={({ item }) => (
                    <View className="bg-white rounded-xl p-4 mb-3 shadow">
                        <Text className="text-lg font-semibold">{item.name}</Text>
                        <Text className="text-gray-600">
                            ✅ Present Days: {Object.values(item).filter((d) => d === 1).length}
                        </Text>
                        <Text className="text-gray-600">
                            ❌ Absent Days: {Object.values(item).filter((d) => d === 0).length}
                        </Text>
                    </View>
                )}
            />
        </View>
    );
}
