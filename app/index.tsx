// app/index.tsx
import { useEffect } from "react";
import { useRouter, useRootNavigationState } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { ActivityIndicator, View, InteractionManager } from "react-native";

export default function Index() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const rootNavigationState = useRootNavigationState();

    useEffect(() => {
        if (loading || !rootNavigationState?.key) return;

        const task = InteractionManager.runAfterInteractions(() => {
            if (user) {
                // Redirect to home screen instead of root
                router.replace("/home");
            } else {
                router.replace("/login");
            }
        });

        return () => {
            task.cancel?.();
        };
    }, [user, loading, rootNavigationState, router]);

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" />
        </View>
    );
}