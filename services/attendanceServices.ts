import api from "@/services/api";

export const getAttendance = async () => {
    const res = await api.get("/attendance");
    return res.data; // { days: [], result: [] }
};
