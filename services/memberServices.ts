// services/memberServices.ts
import api from './api';

export const getMembers = async () => {
    const response = await api.get('/members');
    return response.data;
};