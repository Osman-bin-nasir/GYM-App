// // app/attendance.tsx
// import React, { useState, useEffect } from "react";
// import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
// import { useRouter, useLocalSearchParams } from "expo-router";
// import { useAuth } from "../../context/AuthContext";
// import { getAttendanceByMemberId } from "../../services/attendanceServices";
//
// export default function Attendance() {
//     const [attendance, setAttendance] = useState<any[]>([]);
//     const [loading, setLoading] = useState(true);
//     const { user } = useAuth();
//     const router = useRouter();
//     const { memberId } = useLocalSearchParams();
//
//     useEffect(() => {
//         if (memberId) {
//             loadAttendance();
//         }
//     }, [memberId]);
//
//     const loadAttendance = async () => {
//         try {
//             setLoading(true);
//             const data = await getAttendanceByMemberId(memberId as string);
//             setAttendance(data);
//         } catch (error) {
//             Alert.alert("Error", "Failed to load attendance");
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     return (
//         <View className="flex-1 p-4 bg-gray-100">
//             <Text className="text-2xl font-bold mb-5 text-center">
//                 Attendance History
//             </Text>
//
//             {loading ? (
//                 <Text>Loading attendance...</Text>
//             ) : (
//                 <FlatList
//                     data={attendance}
//                     keyExtractor={(item) => item._id}
//                     renderItem={({ item }) => (
//                         <View className="flex-row justify-between items-center p-4 my-1 bg-white rounded-lg shadow">
//                             <Text className="text-base font-bold flex-1">
//                                 {new Date(item.date).toLocaleDateString()}
//                             </Text>
//                             <Text className={`text-base font-bold ${item.present ? 'text-green-500' : 'text-red-500'}`}>
//                                 {item.present ? 'Present' : 'Absent'}
//                             </Text>
//                         </View>
//                     )}
//                     ListEmptyComponent={
//                         <Text className="text-center mt-12 text-base text-gray-500">
//                             No attendance records found
//                         </Text>
//                     }
//                 />
//             )}
//
//             <TouchableOpacity
//                 className="mt-5 p-4 bg-blue-500 rounded-lg items-center"
//                 onPress={() => router.back()}
//             >
//                 <Text className="text-white font-bold text-base">Back</Text>
//             </TouchableOpacity>
//         </View>
//     );
// }