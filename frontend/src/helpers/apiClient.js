import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getImageUrl = (imagePath) => {
    if (!imagePath || typeof imagePath !== 'string' || imagePath.trim() === '') {
        return null;
    }
    try {
        new URL(imagePath);
        return imagePath;
    } catch {
        const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
        let cleanPath = imagePath.replace(/^\/+/, '');
        if (!cleanPath.startsWith('static/')) {
            cleanPath = 'static/' + cleanPath;
        }
        try {
            const finalUrl = new URL(cleanPath, baseURL + '/');
            return finalUrl.toString();
        } catch {
            const urlParts = cleanPath.split('/').map(part => encodeURIComponent(part));
            return `${baseURL}/${urlParts.join('/')}`;
        }
    }
};

export default apiClient;