// app/(admin)/_layout.tsx
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function AdminLayout() {
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
        name="members"
        options={{
          title: 'Members',
          tabBarIcon: ({ color }) => <FontAwesome name="users" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="attendance"
        options={{
          title: 'Attendance',
          tabBarIcon: ({ color }) => <FontAwesome name="list-alt" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="scan-member-qr"
        options={{
          title: 'Scan QR',
          tabBarIcon: ({ color }) => <FontAwesome name="qrcode" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="qr-generator"
        options={{
          title: 'Generate QR',
          tabBarIcon: ({ color }) => <FontAwesome name="cogs" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
