import api from "@/services/api";

export const getMember = async (token: string) => {
    const res = await api.get("/members");
}