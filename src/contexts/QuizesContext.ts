import { createContext, type Dispatch, type SetStateAction } from "react";
import type { Quiz } from "../types/quiz.types";


type QuizesContextType = {
    quizes: Quiz[] | null;
    setQuizes: Dispatch<SetStateAction<Quiz[] | null>>;
    isLoading:boolean;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
    page: number;
    setPage: Dispatch<SetStateAction<number>>;
    quizesTotalLength: number;
    handleDeleteQuiz: (id: string) => void;
}
export const QuizesContext = createContext<QuizesContextType>({
    quizes: [],
    setQuizes: () => {},
    isLoading: false,
    setIsLoading: () => {},        
    page: 0,
    setPage: () => {},
    quizesTotalLength: 0,
    handleDeleteQuiz: () => {}
})