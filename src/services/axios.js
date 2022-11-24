import axios from "axios";
const BASE_URL = "http://192.168.211.103:3000/api/";

const authService = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        // "Content-type": "application/json",
        Accept: "application/json",
    }
});

export default authService;