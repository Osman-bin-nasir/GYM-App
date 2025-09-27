// context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

type AdminProfile = {
    id: string;
    name: string;
    email: string;
};

type MemberProfile = {
    id: string;
    name: string;
    email: string;
    phone?: string;
    plan?: string;
    expiryDate?: string;
};

type AuthContextType = {
    token: string | null;
    role: "admin" | "member" | null;
    profile: AdminProfile | MemberProfile | null;
    loading: boolean;
    tempToken: string | null; // Add tempToken for OTP flow
    setTempToken: (token: string) => void; // Method to set tempToken
    clearTempToken: () => void; // Method to clear tempToken
    signIn: (
        token: string,
        role: "admin" | "member",
        profile: AdminProfile | MemberProfile
    ) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [role, setRole] = useState<"admin" | "member" | null>(null);
    const [profile, setProfile] = useState<AdminProfile | MemberProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [tempToken, setTempToken] = useState<string | null>(null); // Initialize tempToken

    const signIn = async (
        newToken: string,
        newRole: "admin" | "member",
        newProfile: any
    ) => {
        setToken(newToken);
        setRole(newRole);
        setProfile(newProfile);

        await SecureStore.setItemAsync("authToken", newToken);
        await SecureStore.setItemAsync("authRole", newRole);
        await SecureStore.setItemAsync("authProfile", JSON.stringify(newProfile));
    };

    const logout = async () => {
        setToken(null);
        setRole(null);
        setProfile(null);
        setTempToken(null); // Clear tempToken on logout

        await SecureStore.deleteItemAsync("authToken");
        await SecureStore.deleteItemAsync("authRole");
        await SecureStore.deleteItemAsync("authProfile");
    };

    const clearTempToken = () => {
        setTempToken(null); // Clear tempToken
    };

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                const storedToken = await SecureStore.getItemAsync("authToken");
                const storedRole = await SecureStore.getItemAsync("authRole");
                const storedProfile = await SecureStore.getItemAsync("authProfile");

                if (mounted && storedToken && storedRole) {
                    setToken(storedToken);
                    setRole(storedRole as "admin" | "member");
                    setProfile(storedProfile ? JSON.parse(storedProfile) : null);
                }
            } catch (e) {
                console.error("Failed restoring session:", e);
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    return (
        <AuthContext.Provider
            value={{ token, role, profile, loading, tempToken, setTempToken, clearTempToken, signIn, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}