// app/scan-gym-qr.tsx
import React from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { scanGymQR } from '../../services/qrService';
import QRScanner from '../../components/QRScanner';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ScanGymQR() {
    const router = useRouter();
    const { profile } = useAuth();

    const handleScan = async (qrData: string) => {
        try {
            await scanGymQR(qrData);
            Alert.alert('Success', 'Attendance marked successfully!');
            router.back();
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to mark attendance');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-black">
            <QRScanner
                onScan={handleScan}
                scanType="gym"
                title="Scan Gym QR Code for Attendance"
            />
        </SafeAreaView>
    );
}