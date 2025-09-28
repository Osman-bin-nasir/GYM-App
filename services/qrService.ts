// services/qrService.ts
import api from './api';

export interface QRData {
    adminId: string;
    timestamp: number;
    expiry: number;
}

export const generateQRCode = async (): Promise<{ qrData: string; expiry: Date }> => {
    const res = await api.post('/qr/generate');
    return res.data;
};

export const scanGymQR = async (qrData: string) => {
    const res = await api.post('/qr/scan-gym', { qrData });
    return res.data;
};

export const getMemberQRCode = async (): Promise<string> => {
    const res = await api.get('/qr/member-code');
    return res.data.qrCode;
};

export const scanMemberQR = async (memberQRData: string) => {
    const res = await api.post('/qr/member-scan', { memberQRData });
    return res.data;
};