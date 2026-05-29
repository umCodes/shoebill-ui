import axios from "axios";
import { logger } from "../utils/logs";

export async function createQuiz(form: FormData) {
    
    try {
        console.log("hey");
        
        const response = await axios.post(String(import.meta.env.VITE_BASE_API_PATH) + '/api/quiz', form ,{withCredentials: true})
        const quiz = await response.data;    
        return quiz;
    } catch (error) {
        logger.error(JSON.stringify(error));
        throw error;
    }

}

export async function createClearUp(form: FormData) {
    
    try {
        const response = await axios.post(String(import.meta.env.VITE_BASE_API_PATH) + '/api/clearup', form ,{withCredentials: true})
        const quiz = await response.data;    
        return quiz;
    } catch (error) {
        logger.error(JSON.stringify(error));
        throw error;
    }

}



export async function getQuizes(page=0) {
    
    try {
        const response = await axios.get(String(import.meta.env.VITE_BASE_API_PATH) + '/api/quizzes', {withCredentials: true, params: {
            page
        }})
        const quizes = await response.data;    
        return quizes;
    } catch (error) {
        logger.error(JSON.stringify(error));
        throw error;
    }

}
export async function getTotalQuizes() {
    
    try {
        const response = await axios.get(String(import.meta.env.VITE_BASE_API_PATH) + '/api/quizzes-total', {withCredentials: true})
        const total = await response.data;    
        return total.totalQuizzes;
    } catch (error) {
        logger.error(JSON.stringify(error));
        throw error;
    }

}

export async function getQuiz(id: string) {
    
    try {
        const response = await axios.get(String(import.meta.env.VITE_BASE_API_PATH) + '/api/quiz', {withCredentials: true, params: {
            id
        }})
        const quiz = await response.data;    
        return quiz;
    } catch (error) {
        logger.error(JSON.stringify(error));
        throw error;

    }

}


export async function deleteQuiz(id: string) {
    
    
    try {
        const response = await axios.delete(String(import.meta.env.VITE_BASE_API_PATH) + '/api/quiz', {withCredentials: true, params: {
            id
        }})
        const quiz = await response.data;    
        return quiz;
    } catch (error) {
        logger.error(JSON.stringify(error));
        throw error;

    }

}

export async function checkAnswer(question: string, answer: string, explanation: string) {
    
    try {
        const response = await axios.post(String(import.meta.env.VITE_BASE_API_PATH) + '/api/check', {question, answer, explanation}, {withCredentials: true})
        const validation = await response.data;    

        return validation;
    } catch (error) {
        logger.error(JSON.stringify(error));
        throw error;

    }

}

