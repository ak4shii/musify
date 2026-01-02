import axios from "axios";

const apiClient = axios.create({
    withCredentials: true,
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }

        // const unsafe = /^(post|put|patch|delete)$/i.test(config.method);
        // const isAuthEndpoint =
        //     config.url?.includes('/auth/login') ||
        //     config.url?.includes('/auth/register');

        // if (unsafe && !isAuthEndpoint) {
        //     const csrf = Cookies.get('XSRF-TOKEN');
        //     if (csrf) {
        //         config.headers['X-CSRF-TOKEN'] = csrf;
        //     }
        // }

        return config;
    },
    (error) => Promise.reject(error)
);


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

export const resolveMediaUrl = (maybeRelative) => {
    if (!maybeRelative) return null;
    try {
        new URL(maybeRelative);
        return maybeRelative;
    } catch {
        const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
        let cleanPath = String(maybeRelative).replace(/^\/+/, '');
        if (!cleanPath.startsWith('static/')) {
            cleanPath = 'static/' + cleanPath;
        }
        try {
            const finalUrl = new URL(cleanPath, baseURL + '/');
            return finalUrl.toString();
        } catch {
            const encodedParts = cleanPath.split('/').map(part => encodeURIComponent(part));
            return `${baseURL}/${encodedParts.join('/')}`;
        }
    }
};

export default apiClient;