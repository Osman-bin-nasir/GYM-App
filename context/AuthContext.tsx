// context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

type AuthContextType = {
    user: any;
    setUser: (u: any) => void;
    loading: boolean;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const logout = async () => {
        try {
            await SecureStore.deleteItemAsync("authToken");
            setUser(null);
        } catch (e) {
            console.error("Logout failed:", e);
        }
    };

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                const token = await SecureStore.getItemAsync("authToken");
                if (mounted && token) {
                    // Optional: verify token against API before setting
                    setUser({ token });
                }
            } catch (e) {
                console.error("Failed reading token:", e);
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
