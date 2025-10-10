import { View, Text, Image, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
import { useAuth, type MemberProfile } from "../../context/AuthContext";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import api from "../../services/api";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";

export default function Profile() {
    const { profile: authProfile, logout, token, role } = useAuth();
    const router = useRouter();
    const [photoUri, setPhotoUri] = useState<string | null>(null);
    const [memberProfile, setMemberProfile] = useState<MemberProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    if (role !== "member" || !authProfile) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-gray-100">
                <Text className="text-red-500">Profile not available</Text>
            </SafeAreaView>
        );
    }

    useEffect(() => {
        if (token && role === "member") fetchFullProfile();
    }, [token, role]);

    const fetchFullProfile = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        try {
            const res = await api.get("/member/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMemberProfile(res.data);
        } catch (err: any) {
            console.error("Error fetching profile:", err);
            Toast.show({ type: "error", text1: "Error loading full profile" });
            setMemberProfile(authProfile as MemberProfile);
        } finally {
            setLoading(false);
            if (isRefresh) setRefreshing(false);
        }
    };

    const formatDate = (date?: string) =>
        date
            ? new Date(date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            })
            : "N/A";

    const onRefresh = () => fetchFullProfile(true);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Toast.show({ type: "error", text1: "Permission denied for photo library" });
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setPhotoUri(uri);
        }
    };

    const handleLogout = async () => {
        await logout();
        router.replace("/member-login/login");
    };

    if (loading && !memberProfile) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-gray-100">
                <Text className="text-gray-600">Loading profile...</Text>
            </SafeAreaView>
        );
    }

    if (!memberProfile) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-gray-100">
                <Text className="text-red-500">Profile details not available</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView edges={['top']} className="flex-1 bg-[#f0f2f5]">
        {/*/!* Header *!/*/}
            <View className="  px-4 py-3 flex-row items-center">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="#3b82f6" />
                </TouchableOpacity>
                <Text className="text-blue-500 text-xl font-semibold">Profile</Text>
            </View>

            <ScrollView
                className="flex-1"
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#007AFF"
                    />
                }
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Picture Section */}
                <View className="bg-white">
                    <View className="items-center py-6">
                        <TouchableOpacity onPress={pickImage} className="relative">
                            <Image
                                source={{
                                    uri:
                                        photoUri ||
                                        "https://images.unsplash.com/photo-1759520054142-c723a30f7716?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                                }}
                                className="w-36 h-36 rounded-full"
                            />
                            <View className="absolute bottom-2 right-2 bg-[#007AFF] p-3 rounded-full shadow-lg">
                                <Feather name="camera" size={20} color="white" />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Name Section */}
                <View className="bg-white mt-3">
                    <TouchableOpacity className="flex-row items-center px-6 py-4">
                        <Ionicons name="person-outline" size={24} color="#6b7280" />
                        <View className="flex-1 ml-6">
                            <Text className="text-gray-500 text-xs mb-1">Name</Text>
                            <Text className="text-gray-900 text-base">{memberProfile.name || "N/A"}</Text>
                            <Text className="text-gray-500 text-xs mt-2">
                                This is not your username or pin. This name will be visible to your gym admins.
                            </Text>
                        </View>
                        <MaterialIcons name="edit" size={20} color="#6b7280" />
                    </TouchableOpacity>
                </View>

                {/* About Section */}
                <View className="bg-white mt-3">
                    <TouchableOpacity className="flex-row items-center px-6 py-4">
                        <Ionicons name="information-circle-outline" size={24} color="#6b7280" />
                        <View className="flex-1 ml-6">
                            <Text className="text-gray-500 text-xs mb-1">About</Text>
                            <Text className="text-gray-900 text-base">
                                {memberProfile.notes || "Hey there! I am using this gym app"}
                            </Text>
                        </View>
                        <MaterialIcons name="edit" size={20} color="#6b7280" />
                    </TouchableOpacity>
                </View>

                {/* Contact Info Section */}
                <View className="bg-white mt-3">
                    <View className="px-6 py-4">
                        <View className="flex-row items-center">
                            <Ionicons name="call-outline" size={24} color="#6b7280" />
                            <View className="flex-1 ml-6">
                                <Text className="text-gray-500 text-xs mb-1">Phone</Text>
                                <Text className="text-gray-900 text-base">{memberProfile.phone || "N/A"}</Text>
                            </View>
                        </View>
                    </View>
                    <View className="border-t border-gray-100 mx-6" />
                    <View className="px-6 py-4">
                        <View className="flex-row items-center">
                            <Ionicons name="mail-outline" size={24} color="#6b7280" />
                            <View className="flex-1 ml-6">
                                <Text className="text-gray-500 text-xs mb-1">Email</Text>
                                <Text className="text-gray-900 text-base">{memberProfile.email || "N/A"}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Membership Details Section */}
                <View className="bg-white mt-3">
                    <View className="px-6 py-3 border-b border-gray-100">
                        <Text className="text-[#007AFF] text-sm font-semibold">Membership Details</Text>
                    </View>

                    <ProfileItem icon="card-outline" label="Plan" value={memberProfile.plan} iconColor="#6b7280" />
                    <Divider />

                    <ProfileItem
                        icon="checkmark-circle-outline"
                        label="Status"
                        value={memberProfile.status}
                        iconColor={memberProfile.status === "active" ? "#007AFF" : "#ef4444"}
                    />
                    <Divider />

                    <ProfileItem icon="calendar-outline" label="Join Date" value={formatDate(memberProfile.joinDate)} />
                    <Divider />

                    <ProfileItem icon="refresh-outline" label="Renewal Date" value={formatDate(memberProfile.renewalDate)} />
                    <Divider />

                    <ProfileItem icon="time-outline" label="Expiry Date" value={formatDate(memberProfile.expiryDate)} />
                </View>

                {/* Actions Section */}
                <View className="bg-white mt-3 mb-3">
                    <TouchableOpacity className="flex-row items-center px-6 py-4" onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={24} color="#ef4444" />
                        <Text className="text-red-500 text-base ml-6 font-medium">Logout</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <Toast />
        </SafeAreaView>
    );
}

function ProfileItem({
                         icon,
                         label,
                         value,
                         iconColor = "#6b7280",
                     }: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value?: string;
    iconColor?: string;
}) {
    return (
        <View className="px-6 py-4">
            <View className="flex-row items-center">
                <Ionicons name={icon} size={24} color={iconColor} />
                <View className="flex-1 ml-6">
                    <Text className="text-gray-500 text-xs mb-1">{label}</Text>
                    <Text className="text-gray-900 text-base">{value || "N/A"}</Text>
                </View>
            </View>
        </View>
    );
}

function Divider() {
    return <View className="border-t border-gray-100 ml-16 mr-6" />;
}
