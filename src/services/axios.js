import axios from "axios";
import { dataStore as store } from "../store/index"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': "application/json"
    }
});

api.interceptors.request.use((config) => {
    const token = store.getState().token;  // Get token from Redux store
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response.data.action === "logout") {
            // Handle unauthorized access
            store.dispatch({ type: 'logout' });  // Dispatch logout action
            // You might want to redirect to login page here
        }
        return Promise.reject(error);
    }
);

export default api;