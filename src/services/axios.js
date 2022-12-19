import axios from "axios";
const BASE_URL = "https://curious-teal-suit.cyclic.app/api/";
// const BASE_URL = "http://192.168.131.103:3000/api/";


const authService = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        // "Content-type": "application/json",
        Accept: "application/json",
    }
});

export { BASE_URL };
export default authService;