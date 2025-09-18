import { useContext, useEffect, useState, type ReactNode } from "react"
import { QuizesContext } from "../contexts/QuizesContext"
import type { Quiz } from "../types/quiz.types"
import { getTotalQuizes, getQuizes, deleteQuiz } from "../services/quiz.services";
import { AuthContext } from "../contexts/AuthContext";

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
                console.log(Number(response));
                
            } catch (error) {
                console.log(error);
                
            }
        }
        renderTotalLength()
    }, [user])
    
    useEffect(() => {

        async function renderQuizes() {
            try {
                setIsLoading(true)
                const response = await getQuizes();
                setQuizes(response.quizes);
                // setQuizes(prev =>{
                //     // console.log("prev length", prev.length);
                //     // console.log("quizes length", response.quizes.length);
                //     // console.log("Total length", response.length);
                //     if(prev.length + response.quizes.length > response.length) return prev;
                //     // console.log([...prev, ...response.quizes]);
                    
                //     return [...prev, ...response.quizes]
                // });
                setIsLoading(false)

            } catch (error) {
                console.log(error);
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
            console.error(error);
            
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