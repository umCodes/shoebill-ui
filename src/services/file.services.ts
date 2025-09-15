import axios from "axios";




export async function getPages(file: File) {
    
    if(!file) return;

    

    const form = new FormData()
    form.append('file', file);
    
    
    try {
        const response = await axios.post(String(import.meta.env.VITE_BASE_API_PATH) + '/api/pages', form ,{withCredentials: true})
        const pages = await response.data;    
        return pages;
    } catch (error) {
        console.error(error);
        throw error;

    }

}
