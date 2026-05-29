import axios from "axios";
import { logger } from "../utils/logs";




export async function getPages(file: File) {
    
    if(!file) return;

    

    const form = new FormData()
    form.append('file', file);
    
    
    try {
        const response = await axios.post(String(import.meta.env.VITE_BASE_API_PATH) + '/api/pages', form ,{withCredentials: true})
        const pages = await response.data;    
        return pages;
    } catch (error) {
        logger.error(JSON.stringify(error));
        throw error;

    }

}
