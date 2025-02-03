import axios from 'axios';

const api = axios.create({
    baseURL: 'http://your-backend-url',
});

export const verifyUser = (phoneNumber, token) => {
    return api.post('/auth/verify', { phoneNumber, token });
};

export const generateSecret = (phoneNumber) => {
    return api.post('/auth/generate', { phoneNumber });
};