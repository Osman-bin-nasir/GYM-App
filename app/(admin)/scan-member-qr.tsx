// app/scan-member-qr.tsx
import React from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { scanMemberQR } from '../../services/qrService';
import QRScanner from '../../components/QRScanner';

export default function ScanMemberQR() {
    const router = useRouter();

    const handleScan = async (memberQRData: string) => {
        try {
            const result = await scanMemberQR(memberQRData);
            Alert.alert('Success', `Attendance marked for ${result.memberName}`);
            router.back();
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to mark attendance');
        }
    };

    return (
        <QRScanner
            onScan={handleScan}
            scanType="member"
            title="Scan Member QR Code"
        />
    );
}