// app/_layout.tsx
import { Slot } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AuthProvider } from "../context/AuthContext";
import './globals.css';

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <AuthProvider>
                <SafeAreaView style={{ flex: 1 }}>
                    <Slot />
                </SafeAreaView>
            </AuthProvider>
        </SafeAreaProvider>
    );
}