import axios from "axios";
const BASE_URL = "http://localhost:3000/api/";

const authService = axios.create({
    baseURL: BASE_URL,
    // withCredentials: true,
    headers: {
        // "Content-type": "application/json",
        Accept: "application/json",
    }
});


export default authService;