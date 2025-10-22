import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
});

export const getImageUrl = (imagePath) => {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    return imagePath ? `${baseURL}/${imagePath}` : null;
};

export default apiClient;