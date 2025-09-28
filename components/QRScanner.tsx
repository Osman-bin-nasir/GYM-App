// components/QRScanner.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { useRouter } from 'expo-router';

interface QRScannerProps {
    onScan: (data: string) => void;
    scanType: 'gym' | 'member';
    title?: string;
}

export default function QRScanner({ onScan, scanType, title }: QRScannerProps) {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);
    const router = useRouter();

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ data }: { data: string }) => {
        setScanned(true);
        onScan(data);

        // Auto reset after 2 seconds
        setTimeout(() => setScanned(false), 2000);
    };

    if (hasPermission === null) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text>Requesting camera permission...</Text>
            </View>
        );
    }

    if (hasPermission === false) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text>No access to camera</Text>
                <Text className="text-center mt-2">Please enable camera permissions in settings</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-black">
            <CameraView
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ['qr'],
                }}
                style={{ flex: 1 }}
            >
                <View className="flex-1 bg-transparent justify-center items-center">
                    <View className="w-64 h-64 border-4 border-white rounded-lg opacity-80" />
                    <Text className="text-white text-lg mt-4 font-semibold">
                        {title || (scanType === 'gym' ? 'Scan Gym QR Code' : 'Scan Member QR Code')}
                    </Text>
                    <Text className="text-white text-center mt-2 opacity-80">
                        Position the QR code within the frame
                    </Text>
                </View>
            </CameraView>

            {scanned && (
                <View className="absolute top-20 left-0 right-0 bg-green-500 p-4 mx-4 rounded-lg">
                    <Text className="text-white text-center font-bold">QR Code Scanned Successfully!</Text>
                </View>
            )}

            <TouchableOpacity
                className="absolute top-10 left-4 bg-red-500 px-4 py-2 rounded-lg"
                onPress={() => router.back()}
            >
                <Text className="text-white font-bold">Close</Text>
            </TouchableOpacity>
        </View>
    );
}