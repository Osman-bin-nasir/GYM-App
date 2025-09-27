// app/choose-role.tsx
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function ChooseRole() {
    const router = useRouter();

    return (
        <View className="flex-1 justify-center items-center bg-gray-100 p-6">
            <Text className="text-2xl font-bold mb-8 text-center">Login As</Text>

            <TouchableOpacity
                className="bg-blue-500 px-6 py-4 rounded-lg mb-4 w-full"
                onPress={() => router.replace("/login-admin")}
            >
                <Text className="text-white font-bold text-center text-lg">Admin</Text>
            </TouchableOpacity>

            <TouchableOpacity
                className="bg-green-500 px-6 py-4 rounded-lg w-full"
                onPress={() => router.replace("/member-login/login")}
            >
                <Text className="text-white font-bold text-center text-lg">Member</Text>
            </TouchableOpacity>
        </View>
    );
}
