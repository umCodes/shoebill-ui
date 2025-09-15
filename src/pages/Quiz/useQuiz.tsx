import { useEffect, useState, type ChangeEvent } from "react"
import { useParams } from "react-router"
import type { ClearUp, FIB, MCQ, Quiz, SAQ, TF } from "../../types/quiz.types";
// import type { Choice } from "./Option";
import { getQuiz } from "../../services/quiz.services";
import type { Choice } from "./Options";

const useQuiz = () => {
    const {id} = useParams();
    
    const [points, setPoints] = useState(0);
    const [quiz, setQuiz] = useState<Quiz | ClearUp>();
    const [question, setQuestion] = useState<MCQ | TF | SAQ | FIB | null>(null)
    const [answered, setAnswered] = useState<number[]>([])
    const [index, setIndex] = useState(0)
    const [opted, setOpted] = useState(false);
    const [answer, setAnswer] = useState('');

    function handleNext(){
        
        if(!quiz)return;

        if(index === quiz.questions.length - 1){
            setAnswered([])
            setPoints(0)
            setIndex(0);
            return
        }

        setIndex(prev => prev + 1 < quiz.questions.length ? prev + 1 : prev);
        setOpted(false);

    }

    function handleBack(){
        setIndex(prev => prev > 0 ? prev - 1 : prev)
        setOpted(false);                    
    }
    function handleAnswer(e: ChangeEvent<HTMLTextAreaElement>){
        setAnswer(e.target.value)
        setOpted(false);                    
    }


    // async function check(question: string, explanation: string){

    //     if(!question || !answer) return //sendMessage('please provide your input', "failure")
    //     try {
    //         setAnswer('')
    //         const request = await checkAnswer(question, answer, explanation);    
    //         setAnswered(prev => [...prev, index])       
    //         setOpted(prev => !prev)
    //         if(request.correct && !answered.includes(index)){
    //             // sendMessage('Correct Answer', 'success')
    //             setPoints(prev => prev + 1)
    //             setTimeout(() =>{ 
    //                 setIndex(prev => prev + 1)
    //                 setOpted(false);                
    //             }, 2000)
                    


    //         }
    //         else {return "";} // sendMessage('Wrong Answer', 'failure')

    //     } catch (error) {
    //         // sendMessage('A problem occured checking your answer, please try again', 'failure')
    //         console.log(error);
            

    //     }                   
    // }
    
    function handleOpted(opt: Choice){
        setOpted(prev => !prev)
        setAnswered(prev => [...prev, index])
        if(!answered.includes(index) && opt.correct) {
            setPoints(prev => prev + 1)   
            setTimeout(() =>{ 
                    handleNext()
                    setOpted(false);                
                }, 2000)
            }
    }

    useEffect(() =>{
        if(quiz) setQuestion(quiz.questions[index])
    }, [index, quiz])

    useEffect(() =>{
        async function handleQuiz(){
            if(!id) return;
            
            try {
                const response = await getQuiz(id);
                setQuiz(response)
                return;
            } catch (error) {
                console.error(error);
                return;
            }
        }
        handleQuiz();
    },[id]);

    return {
        quiz,
        points,
        question,
        index,
        answer,
        setIndex,
        opted,
        setOpted,
        setPoints,
        answered, 
        setAnswered,
        // check,
        handleAnswer,
        handleNext,
        handleBack,
        handleOpted
    }

}

export default useQuiz