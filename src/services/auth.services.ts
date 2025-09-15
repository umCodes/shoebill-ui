import axios from "axios";





type SignupForm = {
        name: string;
        email: string;
        password: string;
        confirmPass: string;
}
export async function signup(form: SignupForm) {

    try {        
        const response = await axios.post(String(import.meta.env.VITE_BASE_API_PATH) + "/auth/signup", form, {withCredentials: true})
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


type LoginForm = {
        email: string;
        password: string;
}
export async function login(form: LoginForm) {
    console.log('response');

    console.warn(String(import.meta.env.VITE_BASE_API_PATH))
        
    try {        
        const response = await axios.post(String(import.meta.env.VITE_BASE_API_PATH) + "/auth/login", form, {withCredentials: true})
        
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function logout() {

    try {        
        const response = await axios.delete(String(import.meta.env.VITE_BASE_API_PATH) + "/auth/logout",  {withCredentials: true})
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
export async function getUser() {

    try {        
        const response = await axios.get(String(import.meta.env.VITE_BASE_API_PATH) + "/user",  {withCredentials: true})
        console.log(response);
        
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}