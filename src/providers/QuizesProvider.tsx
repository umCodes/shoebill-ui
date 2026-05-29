import { useContext, useEffect, useState, type ReactNode } from "react"
import { QuizesContext } from "../contexts/QuizesContext"
import type { Quiz } from "../types/quiz.types"
import { getTotalQuizes, getQuizes, deleteQuiz } from "../services/quiz.services";
import { AuthContext } from "../contexts/AuthContext";
import { logger } from "../utils/logs";

const QuizesProvider = ({children}: {children: ReactNode}) => {
    const [quizes, setQuizes] = useState<(Quiz)[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [quizesTotalLength, setQuizesTotalLength] = useState(0);
    const {user} = useContext(AuthContext);


    
    useEffect(() => {

        async function renderTotalLength() {
            try {
                const response = await getTotalQuizes();
                setQuizesTotalLength(Number(response));
                logger.raw(Number(response));
                
            } catch (error) {
                logger.error(error);
                
            }
        }
        renderTotalLength()
    }, [user])
    
    useEffect(() => {

        async function renderQuizes() {
            try {
                setIsLoading(true)
                const response = await getQuizes();
                logger.raw(response);
                
                setQuizes(response.quizes);
                setQuizes(prev =>{
                    if(prev && prev.length + response.quizes.length > response.length) return prev;
                    return prev && [...prev, ...response.quizes]
                });
                setIsLoading(false)

            } catch (error) {
                logger.error(error);
                setIsLoading(false)
                
            }
        }
        renderQuizes()
    }, [page, user])


    async function handleDeleteQuiz(id: string){
        try {
            await deleteQuiz(id);
            const response = await getQuizes();
            setQuizes(response.quizes)
            
        } catch (error) {
            logger.error(error);
            
        }
        
    }

    

    return (
    <QuizesContext.Provider value={{
        quizes,
        setQuizes,
        isLoading,
        setIsLoading,
        page,
        setPage,
        handleDeleteQuiz,
        quizesTotalLength
    }}>
        {children}
    </QuizesContext.Provider>
  )
}

export default QuizesProvider