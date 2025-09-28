// app/members.tsx
import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { getMembers } from "../../services/memberServices";

export default function Members() {
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        loadMembers();
    }, []);

    const loadMembers = async () => {
        try {
            const data = await getMembers();
            setMembers(data);
        } catch (error) {
            Alert.alert("Error", "Failed to load members");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 p-4 bg-gray-100">
            <Text className="text-2xl font-bold mb-5 text-center">
                Member Management
            </Text>

            {loading ? (
                <Text>Loading members...</Text>
            ) : (
                <FlatList
                    data={members}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View className="p-4 my-1 bg-white rounded-lg shadow">
                            <Text className="text-lg font-bold">{item.name}</Text>
                            <Text className="text-sm text-gray-600">{item.email}</Text>
                            <Text className="text-sm text-gray-600">{item.phone}</Text>
                        </View>
                    )}
                    ListEmptyComponent={
                        <Text className="text-center mt-12 text-base text-gray-500">
                            No members found
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
