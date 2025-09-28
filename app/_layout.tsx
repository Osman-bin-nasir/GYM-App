// app/_layout.tsx
import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../context/AuthContext";
import './globals.css';

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <AuthProvider>
                <Slot />
            </AuthProvider>
        </SafeAreaProvider>
    );
}