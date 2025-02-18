import BASE_URL from "./BaseURL";
import { commonAPI } from "./commonAPI";


export const login = async (email: string, password: string) => {
    return await commonAPI('POST', `${BASE_URL}/login`, { email, password });
}