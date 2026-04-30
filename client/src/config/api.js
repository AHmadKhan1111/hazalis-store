import axios from "axios";

const api = axios.create({
    baseURL: (import.meta.env.VITE_API_URL || "").replace(/\/api$/, "") + "/api",
    withCredentials: true,
    headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    },
});

export default api;
