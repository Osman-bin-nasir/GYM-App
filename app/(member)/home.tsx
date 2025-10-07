import { View, Text, TouchableOpacity, ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Calendar } from 'react-native-calendars';
import { FontAwesome } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import Animated, { FadeIn } from 'react-native-reanimated'; // For animations
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Dashboard() {
    const { profile, logout, token } = useAuth();
    const router = useRouter();
    const [attendance, setAttendance] = useState<any[]>([]);
    const [markedDates, setMarkedDates] = useState({});
    const [streak, setStreak] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (token) fetchAttendance();
    }, [token]);

    const fetchAttendance = async () => {
        setLoading(true);
        try {
            const res = await api.get('/member/attendance', { headers: { Authorization: `Bearer ${token}` } });
            setAttendance(res.data);
            setStreak(calculateStreak(res.data));
            setMarkedDates(markAttendanceDates(res.data));
        } catch (err) {
            Toast.show({ type: 'error', text1: 'Error loading data' });
        } finally {
            setLoading(false);
        }
    };

    const calculateStreak = (data: any[]) => {
        if (data.length === 0) return 0;

        // Normalize dates to midnight timestamps and get unique sorted ascending
        const dateTimestamps = [...new Set(
            data.map(item => {
                const date = new Date(item.date);
                date.setHours(0, 0, 0, 0);
                return date.getTime();
            })
        )].sort((a, b) => a - b);

        let streak = 1;
        let current = dateTimestamps[dateTimestamps.length - 1];

        for (let i = dateTimestamps.length - 2; i >= 0; i--) {
            const prev = dateTimestamps[i];
            if (current - prev === 86400000) { // Exactly one day difference
                streak++;
                current = prev;
            } else {
                break;
            }
        }

        return streak;
    };

    const markAttendanceDates = (data: any[]) => {
        const marks: any = {};
        data.forEach(item => {
            const localDate = new Date(item.date);
            // Use local timezone date in YYYY-MM-DD format
            const date = localDate.toLocaleDateString('en-CA');
            marks[date] = { selected: true, selectedColor: '#3b82f6' };
        });
        return marks;
    };

    const handleLogout = async () => {
        await logout();
        router.replace('/member-login/login');
    };

    if (loading) return <ActivityIndicator size="large" color="#3b82f6" className="flex-1 justify-center bg-gray-100" />;

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <FlatList
                data={attendance}
                keyExtractor={(item) => item._id}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchAttendance} tintColor="#3b82f6" />}
                ListHeaderComponent={() => (
                    <Animated.View entering={FadeIn.duration(500)} className="p-4">
                        <View className="flex-row justify-between items-center mb-6 bg-white rounded-2xl p-6 shadow-md">
                            <View>
                                <Text className="text-3xl font-extrabold text-gray-900">Welcome, {profile?.name}</Text>
                                <Text className="text-xl font-semibold text-blue-500 mt-1">Streak: {streak} days 🔥</Text>
                            </View>

                        </View>
                        <View className="flex-row justify-around mb-6">
                            <TouchableOpacity
                                className="flex-1 mr-2 p-6 rounded-2xl shadow-md bg-blue-500 active:opacity-80"
                                onPress={() => router.push('/(member)/scan-gym-qr')}
                            >
                                <FontAwesome name="camera" size={28} color="white" className="self-center mb-3" />
                                <Text className="text-white font-bold text-center text-lg">Scan Gym QR</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="flex-1 ml-2 p-6 rounded-2xl shadow-md bg-blue-500 active:opacity-80"
                                onPress={() => router.push('/(member)/my-qr-code')}
                            >
                                <FontAwesome name="qrcode" size={28} color="white" className="self-center mb-3" />
                                <Text className="text-white font-bold text-center text-lg">My QR Card</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="mb-6 bg-white rounded-2xl p-6 shadow-md">
                            <Text className="text-2xl font-extrabold mb-4 text-gray-900">Attendance Calendar</Text>
                            <Calendar
                                markedDates={markedDates}
                                theme={{
                                    calendarBackground: '#ffffff',
                                    textDayFontSize: 16,
                                    selectedDayBackgroundColor: '#3b82f6',
                                    todayTextColor: '#3b82f6',
                                    arrowColor: '#3b82f6'
                                }}
                            />
                        </View>
                        <Text className="text-2xl font-extrabold mb-4 text-gray-900">Recent Check-Ins</Text>
                    </Animated.View>
                )}
                renderItem={({ item }) => {
                    const localDate = new Date(item.date).toLocaleDateString();
                    return (
                        <Animated.View entering={FadeIn.duration(300)} className="flex-row justify-between items-center p-4 m-2 rounded-2xl shadow bg-white">
                            <Text className="text-gray-800 text-base font-medium">{localDate}</Text>
                            <View className="bg-green-100 px-4 py-2 rounded-full">
                                <Text className="text-blue-500 font-bold">Checked In</Text>
                            </View>
                        </Animated.View>
                    );
                }}
                ListFooterComponent={() => (
                    <TouchableOpacity
                        className="p-5 m-4 rounded-2xl shadow-md bg-red-500 active:opacity-80"
                        onPress={handleLogout}
                    >
                        <Text className="text-white font-bold text-center text-lg">Logout</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text className="text-center mt-6 text-lg text-gray-600">Start your journey – check in today!</Text>}
            />
            <Toast />
        </SafeAreaView>
    );
}