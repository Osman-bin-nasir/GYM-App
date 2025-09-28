// app/choose-role.tsx
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChooseRole() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header Section */}
            <View className="flex-1 justify-center items-center px-6">
                <View className="mb-10">
                    <Text className="text-4xl font-extrabold text-gray-900 text-center mb-2">
                        Welcome Back
                    </Text>
                    <Text className="text-base text-gray-600 text-center px-4">
                        Select your role to access tailored features and continue
                    </Text>
                </View>

                {/* Role Selection Cards */}
                <View className="w-full max-w-md">
                    {/* Admin Card */}
                    <TouchableOpacity
                        className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 active:scale-95 transition-transform duration-200 mb-6"
                        onPress={() => router.push("/login-admin")}
                        activeOpacity={0.7}
                    >
                        <View className="items-center mb-4">
                            <View className="bg-indigo-100 w-20 h-20 rounded-full items-center justify-center mb-4 shadow-md">
                                <Text className="text-3xl">👨‍💼</Text>
                            </View>
                            <Text className="text-2xl font-bold text-gray-900 mb-1">
                                Admin
                            </Text>
                            <Text className="text-gray-500 text-center text-sm px-2">
                                Manage users, settings, and oversee system operations
                            </Text>
                        </View>
                        <View className="bg-indigo-600 py-3 rounded-xl shadow-md">
                            <Text className="text-white font-semibold text-center text-base">
                                Login as Admin
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {/* Member Card */}
                    <TouchableOpacity
                        className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 active:scale-95 transition-transform duration-200"
                        onPress={() => router.push("/member-login/login")}
                        activeOpacity={0.7}
                    >
                        <View className="items-center mb-4">
                            <View className="bg-emerald-100 w-20 h-20 rounded-full items-center justify-center mb-4 shadow-md">
                                <Text className="text-3xl">👤</Text>
                            </View>
                            <Text className="text-2xl font-bold text-gray-900 mb-1">
                                Member
                            </Text>
                            <Text className="text-gray-500 text-center text-sm px-2">
                                View your profile, access resources, and engage with the community
                            </Text>
                        </View>
                        <View className="bg-emerald-600 py-3 rounded-xl shadow-md">
                            <Text className="text-white font-semibold text-center text-base">
                                Login as Member
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Footer */}
            <TouchableOpacity className="pb-6 px-6" onPress={() => {}}>
                <Text className="text-gray-500 text-center text-sm underline">
                    Need help? Contact support
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
