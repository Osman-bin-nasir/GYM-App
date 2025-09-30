// services/attendanceServices.ts
import api from "./api";

// Fetch a member's attendance history
export const getMemberAttendanceHistory = async (memberId: string) => {
    const res = await api.get(`/attendance/${memberId}`);
    return res.data;
};
