import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

// ✅ Define each profile type clearly
export type AdminProfile = {
    id: string;
    name: string;
    email: string;
};

export type MemberProfile = {
    id: string;
    name: string;
    email: string;
    phone?: string;
    plan?: string;
    gender?: string;
    dob?: string;
    joinDate?: string;
    renewalDate?: string;
    expiryDate?: string;
    status?: string;
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
};

// ✅ Context type with unioned discriminated role
type AuthContextType =
    | {
    token: string;
    role: "admin";
    profile: AdminProfile;
    loading: boolean;
    tempToken: string | null;
    setTempToken: (token: string) => void;
    clearTempToken: () => void;
    signIn: (
        token: string,
        role: "admin",
        profile: AdminProfile
    ) => Promise<void>;
    logout: () => Promise<void>;
}
    | {
    token: string;
    role: "member";
    profile: MemberProfile;
    loading: boolean;
    tempToken: string | null;
    setTempToken: (token: string) => void;
    clearTempToken: () => void;
    signIn: (
        token: string,
        role: "member",
        profile: MemberProfile
    ) => Promise<void>;
    logout: () => Promise<void>;
}
    | {
    token: null;
    role: null;
    profile: null;
    loading: boolean;
    tempToken: string | null;
    setTempToken: (token: string) => void;
    clearTempToken: () => void;
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
    const [profile, setProfile] = useState<AdminProfile | MemberProfile | null>(
        null
    );
    const [loading, setLoading] = useState(true);
    const [tempToken, setTempToken] = useState<string | null>(null);

    const signIn = async (
        newToken: string,
        newRole: "admin" | "member",
        newProfile: AdminProfile | MemberProfile
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
        setTempToken(null);
        await SecureStore.deleteItemAsync("authToken");
        await SecureStore.deleteItemAsync("authRole");
        await SecureStore.deleteItemAsync("authProfile");
    };

    const clearTempToken = () => setTempToken(null);

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
            } catch (err) {
                console.error("Failed restoring session:", err);
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
            value={{
                token,
                role,
                profile,
                loading,
                tempToken,
                setTempToken,
                clearTempToken,
                signIn,
                logout,
            } as AuthContextType}
        >
            {children}
        </AuthContext.Provider>
    );
}