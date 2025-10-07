// app/my-qr-code.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useAuth } from '../../context/AuthContext';
import { getMemberQRCode } from '../../services/qrService';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MyQRCode() {
    const [qrCode, setQrCode] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const { profile } = useAuth();

    useEffect(() => {
        loadQRCode();
    }, []);

    const loadQRCode = async () => {
        try {
            const code = await getMemberQRCode();
            setQrCode(code);
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to load QR code');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <ScrollView className="flex-1 bg-gray-100">
                <View className="p-6">
                    <Text className="text-2xl font-bold mb-2 text-center">My QR Code</Text>
                    <Text className="text-gray-600 text-center mb-6">
                        Show this to the admin for attendance
                    </Text>

                    {loading ? (
                        <View className="items-center py-10">
                            <Text className="text-lg">Loading QR code...</Text>
                        </View>
                    ) : qrCode ? (
                        <View className="items-center">
                            <View className="bg-white p-6 rounded-2xl shadow-lg mb-4">
                                <QRCode value={qrCode} size={250} />
                            </View>

                            <View className="bg-white p-4 rounded-lg w-full mb-4">
                                <Text className="text-center font-bold text-lg">{profile?.name}</Text>
                                <Text className="text-center text-gray-600">Member ID: {profile?.id?.slice(-8)}</Text>
                                <Text className="text-center text-gray-600 mt-1">{profile?.email}</Text>
                            </View>
                        </View>
                    ) : (
                        <View className="items-center py-10">
                            <Text className="text-lg text-red-500">Failed to load QR code</Text>
                            <TouchableOpacity
                                className="bg-blue-500 px-4 py-2 rounded-lg mt-4"
                                onPress={loadQRCode}
                            >
                                <Text className="text-white">Try Again</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <View className="bg-green-100 p-4 rounded-lg mt-4">
                        <Text className="text-green-800 font-semibold">How to use:</Text>
                        <Text className="text-green-700 mt-1">
                            • Show this QR code to the gym admin
                        </Text>
                        <Text className="text-green-700 mt-1">
                            • Admin will scan it to mark your attendance
                        </Text>
                        <Text className="text-green-700 mt-1">
                            • You can also scan the gym's QR code yourself
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}