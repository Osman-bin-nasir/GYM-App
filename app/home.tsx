// app/home.tsx
import { View, Text, Pressable } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "expo-router";

export default function Home() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.replace("/login");
    };


    return (
        <View className="flex-1 justify-center items-center p-4">
            <Text className="text-2xl font-bold mb-4">Welcome to Gym App!</Text>
            <Text className="text-base mb-8">
                You are logged in as: {user?.name || user?.email || "Admin"}
            </Text>

            <View className="w-48 my-2">
                <Pressable
                    className="bg-blue-500 p-3 rounded-xl"
    // @ts-ignore
                    onPress={() => router.push("/attendance")}
                >
                    <Text className="text-white text-center font-semibold">
                        View Attendance
                    </Text>
                </Pressable>
            </View>

            <View className="w-48 my-2">
                <Pressable
                    className="bg-green-500 p-3 rounded-xl"
                    // @ts-ignore
                    onPress={() => router.push("/members")}
                >
                    <Text className="text-white text-center font-semibold">
                        Manage Members
                    </Text>
                </Pressable>
            </View>

            <View className="w-48 my-2">
                <Pressable
                    className="bg-red-500 p-3 rounded-xl"
                    onPress={handleLogout}
                >
                    <Text className="text-white text-center font-semibold">Logout</Text>
                </Pressable>
            </View>
        </View>
    );
}
