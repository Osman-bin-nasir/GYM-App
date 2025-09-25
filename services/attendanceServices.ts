// services/attendanceServices.ts
import api from './api';

export const getAttendance = async (date: string) => {
    const response = await api.get(`/attendance?date=${date}`);
    return response.data;
};

export const markAttendance = async (memberId: string, date: string, present: boolean) => {
    const response = await api.post('/attendance', {
        memberId,
        date,
        present
    });
    return response.data;
};