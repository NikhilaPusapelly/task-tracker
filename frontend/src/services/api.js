import axios from "axios";

const api = axios.create({
    baseURL: "https://task-tracker-backend-i26w.onrender.com/api"
});

export default api;