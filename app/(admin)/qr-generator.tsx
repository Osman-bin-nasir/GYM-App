// app/qr-generator.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useAuth } from '../../context/AuthContext';
import { generateQRCode } from '../../services/qrService';

export default function QRGenerator() {
    const [qrData, setQrData] = useState<string>('');
    const [expiry, setExpiry] = useState<Date | null>(null);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const { profile } = useAuth();

    const generateNewQR = async () => {
        try {
            setLoading(true);
            const { qrData: newQrData, expiry: newExpiry } = await generateQRCode();
            setQrData(newQrData);
            setExpiry(newExpiry);
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to generate QR code');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        generateNewQR();
    }, []);

    useEffect(() => {
        if (!expiry) return;

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const expiryTime = new Date(expiry).getTime();
            const remaining = Math.max(0, expiryTime - now);

            setTimeLeft(Math.floor(remaining / 1000));

            if (remaining <= 0) {
                generateNewQR();
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [expiry]);

    return (
        <ScrollView className="flex-1 bg-gray-100">
            <View className="p-6">
                <Text className="text-2xl font-bold mb-4 text-center">Attendance QR Code</Text>
                <Text className="text-gray-600 text-center mb-6">
                    Members can scan this code to mark their attendance
                </Text>

                {qrData ? (
                    <View className="items-center mb-6">
                        <View className="bg-white p-6 rounded-2xl shadow-lg mb-4">
                            <QRCode value={qrData} size={250} />
                        </View>

                        <View className="bg-blue-100 p-4 rounded-lg mb-4 w-full">
                            <Text className="text-blue-800 text-center font-semibold">
                                Time remaining: {timeLeft} seconds
                            </Text>
                        </View>

                        {timeLeft < 10 && (
                            <Text className="text-red-500 text-center mb-4">
                                QR code expiring soon! Generate a new one.
                            </Text>
                        )}
                    </View>
                ) : (
                    <View className="items-center py-10">
                        <Text className="text-lg">Generating QR code...</Text>
                    </View>
                )}

                <TouchableOpacity
                    className="bg-blue-500 px-6 py-4 rounded-xl shadow-sm mb-4"
                    onPress={generateNewQR}
                    disabled={loading}
                >
                    <Text className="text-white font-bold text-center text-lg">
                        {loading ? 'Generating...' : 'Generate New QR Code'}
                    </Text>
                </TouchableOpacity>

                <View className="bg-yellow-100 p-4 rounded-lg mt-4">
                    <Text className="text-yellow-800 font-semibold">Instructions:</Text>
                    <Text className="text-yellow-700 mt-1">
                        • This QR code expires every 60 seconds for security
                    </Text>
                    <Text className="text-yellow-700 mt-1">
                        • Members should open their app and scan this code
                    </Text>
                    <Text className="text-yellow-700 mt-1">
                        • You can also scan member QR codes from the home screen
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}