import React, { useState } from "react";
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet } from "react-native";
import { login } from "../services/authService";
import { useFetch } from "../services/useFetch";
import { getMember } from "../services/memberServices";

export default function Index() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);

    // only fetch members if logged in
    const { data: members, loading, error } = useFetch(
        () => (loggedIn ? getMember() : Promise.resolve([])),
        [loggedIn]
    );

    const handleLogin = async () => {
        try {
            await login(email, password);
            setLoggedIn(true);
        } catch (err) {
            console.error("Login failed", err);
        }
    };

    if (!loggedIn) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Login</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <Button title="Login" onPress={handleLogin} />
            </View>
        );
    }

    if (loading) return <ActivityIndicator style={styles.container} />;
    if (error) return <Text style={styles.container}>Error: {error}</Text>;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Members</Text>
            {members?.map((m: any) => (
                <Text key={m._id}>{m.name}</Text>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 16 },
    input: { borderWidth: 1, padding: 8, width: "80%", marginVertical: 8, borderRadius: 4 },
    title: { fontSize: 24, marginBottom: 16 },
});
