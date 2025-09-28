// app/member-login/_layout.tsx
import { Stack } from 'expo-router';

export default function MemberLoginLayout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="request-otp" options={{ title: 'Request OTP' }} />
      <Stack.Screen name="verify-otp" options={{ title: 'Verify OTP' }} />
      <Stack.Screen name="set-password" options={{ title: 'Set Password' }} />
    </Stack>
  );
}
