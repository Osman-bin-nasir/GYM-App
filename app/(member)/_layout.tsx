// app/(member)/_layout.tsx
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function MemberLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="my-qr-code"
        options={{
          title: 'My QR',
          tabBarIcon: ({ color }) => <FontAwesome name="qrcode" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="scan-gym-qr"
        options={{
          title: 'Scan Gym QR',
          tabBarIcon: ({ color }) => <FontAwesome name="camera" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
