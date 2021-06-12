import axios from "axios";
import env from "react-dotenv";
import Cookies from 'universal-cookie';
const cookies = new Cookies();
const authCookie = cookies.get('authCookie');

const url = env.API_URL
const App_url = env.APP_URL

export default axios.create({
    baseURL: url,
    responseType: 'json',
    // withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': App_url,
        'Access-Control-Allow-Credentials': 'true',
        'Authorization': `Bearer ${authCookie}`
    }
})