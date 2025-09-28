// app/login-admin/_layout.tsx
import { Stack } from 'expo-router';

export default function AdminLoginLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
