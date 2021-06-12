import axios from "axios";
import env from "react-dotenv";

const url = env.API_URL
const App_url = env.APP_URL

export default axios.create({
    baseURL: url,
    responseType: 'json',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': App_url,
        'Access-Control-Allow-Credentials': 'true',
    }
})